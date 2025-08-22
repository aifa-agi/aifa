// @/app/integrations/api/external-ai-assiatant/external-backend/start/route.ts

import { NextRequest } from "next/server";
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";
import { Redis } from "@upstash/redis";
import { StartSessionSchema } from "../../_types/session";
import { apiResponse } from "@/app/integrations/lib/api/response";
import { createId } from "@paralleldrive/cuid2";
import { extractSubFromJWT } from "@/lib/utils/extract-sub-from-jwt";

// Import utility functions
import { analyzePurchasePreferences } from "../../utils/analyze-purchase-history";
import { buildAvailableMenu } from "../../utils/build-available-menu";
import {
  createSystemPrompt,
  type SystemPromptData,
} from "../../utils/create-system-prompt";
import { analyzeTagPreferences } from "../../utils/analyze-tag-preferences";
import { Message, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SESSION_TTL_SECONDS = 60 * 60 * 4;

// Функция для обработки events
function processEvents(events: any[] | null | undefined): string {
  if (!events || events.length === 0) return "";

  const eventsText = events
    .map((event, index) => `${index + 1}. ${event.text}`)
    .join("\n");

  return `Прими к сведению ещё одну важную информацию:\n${eventsText}\n\n`;
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    // Валидация через zod (НЕ ИЗМЕНЯЕТСЯ)
    const parse = StartSessionSchema.safeParse(json);
    if (!parse.success) {
      return apiResponse({
        success: false,
        error: parse.error.issues,
        message: "Validation error",
        status: 400,
      });
    }

    const {
      user_id,
      name,
      city,
      events,
      user_info,
      purchase_history,
      available_products, // Используем available_products как массив
      available_items, // Оставляем для совместимости
      auth_secret,
    } = parse.data;

    // Проверка авторизации (НЕ ИЗМЕНЯЕТСЯ)
    if (auth_secret !== process.env.NEXTAUTH_SECRET) {
      return apiResponse({
        success: false,
        error: "Unauthorized: invalid auth_secret",
        status: 401,
      });
    }

    const chatId = createId();
    const messageId = createId();

    // Создание токена через NextAuth (НЕ ИЗМЕНЯЕТСЯ)
    const nextAuthRes = await fetch(
      `${getNextAuthUrl()}/integrations/api/external-ai-assiatant/auth/signin/api`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, name }),
      }
    );

    if (!nextAuthRes.ok) {
      const error = await nextAuthRes.json();
      return apiResponse({
        success: false,
        error: error,
        message: "NextAuth error",
        status: 500,
      });
    }

    const { token } = await nextAuthRes.json();
    const sub = extractSubFromJWT(token);
    if (!sub) {
      return apiResponse({
        success: false,
        error: "Failed to extract user id from JWT",
        status: 500,
      });
    }

    // Параллельное выполнение функций анализа для лучшей производительности
    const [purchasePreferencesDoc, tagPreferencesDoc, availableMenuDoc] =
      await Promise.all([
        // Анализ истории покупок - передаем available_products
        analyzePurchasePreferences(purchase_history, available_products).catch(
          (error) => {
            console.error("Purchase preferences analysis failed:", error);
            return "";
          }
        ),

        // Анализ предпочтений по тегам - передаем available_products
        analyzeTagPreferences(purchase_history, available_products).catch(
          (error) => {
            console.error("Tag preferences analysis failed:", error);
            return "";
          }
        ),

        // Создание актуального меню - КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: передаем available_products
        buildAvailableMenu(available_products).catch((error) => {
          console.error("Menu building failed:", error);
          return "";
        }),
      ]);

    // Обработка events
    const eventsInfo = processEvents(events);

    // Создание улучшенного системного сообщения с использованием отдельного компонента
    const systemPromptData: SystemPromptData = {
      name: name ?? null,
      city: city ?? null,
      purchaseHistory: purchase_history,
      purchasePreferencesDoc,
      tagPreferencesDoc,
      availableMenuDoc,
      eventsInfo,
    };

    const systemMessage = createSystemPrompt(systemPromptData);

    let chat = await prisma.chat.findUnique({ where: { id: chatId } });

    chat = await prisma.chat.create({
      data: {
        id: chatId,
        userId: user_id,
        title: "Api Chat",
        visibility: "public",
        createdAt: new Date(),
      },
    });

    await prisma.message.create({
      data: {
        id: messageId,
        chatId,
        role: "user",
        parts: [
          {
            text: systemMessage,
            type: "text",
          },
        ],
        attachments: [],
        createdAt: new Date(),
      },
    });

    // Сохранение сессии в Redis (РАСШИРЕННАЯ ИНФОРМАЦИЯ)
    const sessionData = {
      user_id,
      name,
      city,
      events,
      user_info,
      purchase_history,
      available_products, // Сохраняем available_products как массив
      available_items, // Оставляем для совместимости
      createdAt: new Date().toISOString(),
      chatId,

      // Новые поля для аналитики и отладки
      analysis: {
        hasPurchaseHistory: !!purchase_history && purchase_history.length > 0,
        hasTagPreferences: tagPreferencesDoc.length > 0,
        hasAvailableMenu: availableMenuDoc.length > 0,
        hasEvents: !!events && events.length > 0,
        availableProductsCount: available_products?.length || 0, // Добавляем счетчик доступных продуктов
        systemMessageLength: systemMessage.length,
        analyzedAt: new Date().toISOString(),
      },
    };

    await redis.set(`session:${sub}`, sessionData, {
      ex: SESSION_TTL_SECONDS,
    });

    console.log("Session saved to Redis with enhanced data");

    // ИСПРАВЛЕННЫЙ ОТВЕТ: точно соответствует документации
    return apiResponse({
      success: true,
      status: 200,
      message: "Session created", // Изменено с "Session created and initial chat started"
      data: {
        session_id: sub, // Остается session_id как в документации
        jwt: token,
        chatId: chatId, // ИЗМЕНЕНО: было chatId, стало chat_id
      },
    });
  } catch (error) {
    console.error("Error in enhanced start endpoint:", error);

    return apiResponse({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      status: 500,
      message: "Internal Server Error",
    });
  }
}
