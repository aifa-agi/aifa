// @/app/api/api-chat/route.ts

import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  smoothStream,
  streamText,
} from "ai";
import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import {
  type RequestHints,
  systemPrompt,
} from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/prompts";
import { getTrailingMessageId } from "@/lib/utils";
import { isProductionEnvironment } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_constants)/constants";
import { myProvider } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/providers";
import { entitlementsByUserType } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/entitlements";
import { postRequestBodySchema, type PostRequestBody } from "../chat/schema";
import { geolocation } from "@vercel/functions";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Message, Prisma } from "@prisma/client";
import { generateCuid } from "@/lib/utils/generateCuid";
import { extractSubFromJWT } from "@/lib/utils/extract-sub-from-jwt";

export const maxDuration = 60;

/**
 * Логирование использования токенов с расчетом стоимости для GPT-4 Mini
 * @param prefix - Префикс для идентификации источника
 * @param usage - Объект с информацией об использовании токенов
 * @param chatId - ID чата для контекста
 * @param userId - ID пользователя для контекста
 */
function logTokenUsage(
  prefix: string,
  usage: any,
  chatId?: string,
  userId?: string
) {
  if (!usage) {
    console.log(`${prefix} - Данные об использовании токенов недоступны`);
    return;
  }

  const { promptTokens, completionTokens, totalTokens } = usage;

  console.log(`\n🔢 ===== ${prefix.toUpperCase()} ИСПОЛЬЗОВАНИЕ ТОКЕНОВ =====`);
  console.log(`📊 ID чата: ${chatId || "неизвестно"}`);
  console.log(`👤 ID пользователя: ${userId || "неизвестно"}`);
  console.log(`📥 Входящие токены (Промпт): ${promptTokens ?? "неизвестно"}`);
  console.log(
    `📤 Исходящие токены (Ответ): ${completionTokens ?? "неизвестно"}`
  );
  console.log(`🔄 Всего токенов: ${totalTokens ?? "неизвестно"}`);

  // Расчет стоимости GPT-4 Mini: Вход $0.15/1М, Выход $0.60/1М
  if (promptTokens && completionTokens) {
    const inputCost = (promptTokens / 1000000) * 0.15;
    const outputCost = (completionTokens / 1000000) * 0.6;
    const totalCost = inputCost + outputCost;

    console.log(
      `💰 Стоимость GPT-4 Mini: $${totalCost.toFixed(8)} (Вход: $${inputCost.toFixed(8)}, Выход: $${outputCost.toFixed(8)})`
    );

    const totalCostCents = totalCost * 100;
    console.log(`💸 Стоимость в центах: ${totalCostCents.toFixed(6)}¢`);
  }

  console.log(`⏰ Время логирования: ${new Date().toISOString()}`);
  console.log(`🔢 ===== КОНЕЦ ИСПОЛЬЗОВАНИЯ ТОКЕНОВ =====\n`);
}

/**
 * Обработка POST запросов для создания или добавления сообщений в чаты
 * и стриминг AI-генерированных ответов (упрощенная версия для API)
 */
export async function POST(request: Request) {
  let requestBody: PostRequestBody;
  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (e) {
    return new Response("Неверное тело запроса", { status: 400 });
  }

  try {
    const {
      id: chatId,
      message,
      selectedChatModel,
      selectedVisibilityType,
    } = requestBody;

    let session = await auth();

    // Обработка API токена если нет сессии
    let token = request.headers.get("authorization");
    const expires = new Date(Date.now() + 60 * 60 * 4000).toISOString();

    if (!session && token) {
      const sub = extractSubFromJWT(token);
      session = {
        user: {
          id: sub || "",
          type: "apiUser",
        },
        expires,
      };
    }

    if (!session || session.user.id === "") {
      return new Response("Неавторизован", { status: 401 });
    }

    const userId = session.user.id;
    const userType = session.user.type;

    // Проверка лимита сообщений за 24 часа
    const messageCount = await prisma.message.count({
      where: {
        role: "user",
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        Chat: {
          userId,
        },
      },
    });

    if (messageCount >= entitlementsByUserType[userType].maxMessagesPerDay) {
      return NextResponse.json(
        {
          error:
            "Вы достигли дневного лимита. Зарегистрируйтесь для получения в 5 раз больше сообщений в день!",
          redirectTo: "/register",
          delay: 3000,
        },
        { status: 429 }
      );
    }

    // Проверка существования чата
    let chat = await prisma.chat.findUnique({ where: { id: chatId } });

    if (!chat) {
      // Создание нового чата с заголовком, сгенерированным из первого сообщения
      const title = "Api Chat";
      chat = await prisma.chat.create({
        data: {
          id: chatId,
          userId: userId ? userId : "12345qwert",
          title,
          visibility: selectedVisibilityType,
          createdAt: new Date(),
        },
      });
    } else {
      // Предотвращение доступа к чужим чатам
      if (chat.userId !== userId) {
        return new Response("Запрещено", { status: 403 });
      }
    }

    // Получение предыдущих сообщений упорядоченных по времени создания
    const previousMessages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    // Маппинг модели БД в формат для обработки AI
    const previousUImessages = previousMessages.map(
      ({ id, role, parts, attachments, createdAt }: Message) => ({
        id,
        role,
        parts,
        experimental_attachments: attachments,
        createdAt,
      })
    );

    // Добавление нового пользовательского сообщения в список для AI
    const messages = appendClientMessage({
      // @ts-expect-error: todo добавить преобразование типов из DBMessage[] в UIMessage[]
      messages: previousUImessages,
      message,
    });

    // Получение геолокации из запроса для подсказок
    const { longitude, latitude, city, country } = geolocation(request);
    const requestHints: RequestHints = { longitude, latitude, city, country };

    // Сохранение нового сообщения пользователя в БД
    await prisma.message.create({
      data: {
        id: message.id,
        chatId,
        role: "user",
        parts: message.parts,
        attachments: message.experimental_attachments ?? [],
        createdAt: new Date(),
      },
    });

    // Создание потока данных с упрощенной генерацией текста AI (без инструментов)
    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel("api-chat-support"),
          system: message.content,
          messages: [],
          maxSteps: 3, // Ограничиваем до 1 шага для простоты
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateCuid,
          // Убираем все инструменты для упрощенной версии
          tools: {},
          onFinish: async ({ response, usage }) => {
            if (!session.user?.id) return;

            // Логирование использования токенов
            logTokenUsage("API Chat Response", usage, chatId, userId);

            try {
              const assistantId = getTrailingMessageId({
                messages: response.messages.filter(
                  (m) => m.role === "assistant"
                ),
              });

              if (!assistantId)
                throw new Error("Сообщение ассистента не найдено!");

              const [, assistantMessage] = appendResponseMessages({
                messages: [message],
                responseMessages: response.messages,
              });

              await prisma.message.create({
                data: {
                  id: assistantId,
                  chatId,
                  role: assistantMessage.role,
                  parts: assistantMessage.parts
                    ? JSON.parse(JSON.stringify(assistantMessage.parts))
                    : undefined,
                  attachments: (assistantMessage.experimental_attachments ??
                    []) as unknown as Prisma.InputJsonValue,
                  createdAt: new Date(),
                },
              });

              console.log(
                `✅ Сообщение ассистента успешно сохранено для чата ${chatId}`
              );
            } catch (error) {
              console.error(
                "Не удалось сохранить сообщение ассистента:",
                error
              );
              console.error(
                `❌ Контекст ошибки - ID чата: ${chatId}, ID пользователя: ${userId}`
              );
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "api-stream-text",
          },
        });

        result.consumeStream();
        result.mergeIntoDataStream(dataStream);
      },
      onError: () => "Упс, произошла ошибка!",
    });

    return new Response(stream);
  } catch (error) {
    console.error("POST /api-chat ошибка:", error);
    return new Response("Произошла ошибка при обработке вашего запроса!", {
      status: 500,
    });
  }
}
