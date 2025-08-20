// @/app/api/api-chat/route.ts

import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  smoothStream,
  streamText,
  generateText,
  DataStreamWriter,
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
 * Enhanced system prompt for API chat with structured responses
 */
const API_SYSTEM_PROMPT = `
Продолжай легко и уверену беседа с клиентом, рекомендуй блюда и напитки на основании ранее полученные инструкции
`;

// Interface definitions for custom parts
interface ProductPart {
  type: "data-product";
  id: string;
  data: {
    product_id: string;
  };
}

interface SuggestionPart {
  type: "data-suggestion";
  id: string;
  data: {
    suggestion_id: string;
  };
}

/**
 * Utility function for safe error logging with TypeScript
 * @param error - Error of unknown type
 * @param context - Additional context for debugging
 */
function logError(error: unknown, context: string = ""): void {
  console.error(`❌ ===== ${context.toUpperCase()} ОШИБКА =====`);

  if (error instanceof Error) {
    console.error("💥 Тип ошибки:", error.constructor.name);
    console.error("📝 Сообщение ошибки:", error.message);
    console.error("🔍 Stack trace:", error.stack);
  } else if (typeof error === "string") {
    console.error("📝 Строковая ошибка:", error);
  } else {
    console.error("❓ Неизвестная ошибка:", error);
  }

  console.error(`❌ ===== КОНЕЦ ${context.toUpperCase()} ОШИБКИ =====`);
}

/**
 * Analyze text response to determine if product recommendations are needed
 * @param textContent - The assistant's text response
 * @param systemInstruction - Full system instruction containing menu data
 * @param conversationHistory - Recent conversation for context
 * @returns Promise with analysis result
 */
async function analyzeForProducts(
  textContent: string,
  systemInstruction: string,
  conversationHistory: string = ""
): Promise<{
  recommend_products: boolean;
  category?: string;
  confidence?: number;
  product_ids?: string[];
}> {
  try {
    console.log("🔍 ===== НАЧАЛО АНАЛИЗА ПРОДУКТОВ =====");
    console.log("📝 Анализируемый текст ассистента:", textContent);
    console.log(
      "💬 История разговора:",
      conversationHistory.slice(0, 500) + "..."
    );
    console.log("📋 Длина системной инструкции:", systemInstruction.length);

    const analysisPrompt = `
СИСТЕМНАЯ ИНСТРУКЦИЯ С МЕНЮ:
${systemInstruction}

ИСТОРИЯ РАЗГОВОРА:
${conversationHistory}

ОТВЕТ АССИСТЕНТА ДЛЯ АНАЛИЗА:
"${textContent}"

ЗАДАЧА:
1. Проанализируй ответ ассистента и определи, рекомендует ли он конкретные блюда или напитки
2. Найди в СИСТЕМНОЙ ИНСТРУКЦИИ точные идентификаторы (ID) продуктов, которые упоминает ассистент
3. Сопоставь названия блюд/напитков из ответа с записями в меню

ПРАВИЛА АНАЛИЗА:
- Если ассистент упоминает конкретные названия блюд/напитков - это рекомендация
- Если только общие фразы ("что-то вкусное", "наши блюда") - это НЕ рекомендация
- Ищи ТОЧНОЕ совпадение названий или близкие варианты
- Извлеки ID продуктов из системной инструкции

ФОРМАТ ОТВЕТА (только JSON):
Если есть рекомендации:
{
  "recommend_products": true,
  "category": "найденная категория",
  "confidence": 0.8,
  "product_ids": ["id1", "id2"],
  "found_products": ["Название продукта 1", "Название продукта 2"],
  "reasoning": "почему эти продукты подходят"
}

Если рекомендаций нет:
{
  "recommend_products": false,
  "confidence": 0.2,
  "reasoning": "почему рекомендаций нет"
}

Отвечай ТОЛЬКО JSON без дополнительного текста.
`;

    console.log("🤖 Отправляем промпт для анализа продуктов...");
    console.log("📤 Длина промпта:", analysisPrompt.length);

    const result = await generateText({
      model: myProvider.languageModel("api-chat-support"),
      prompt: analysisPrompt,
      temperature: 0.1,
    });

    console.log("📥 Сырой ответ анализа:", result.text);

    let analysis;
    try {
      analysis = JSON.parse(result.text);
      console.log("✅ Успешно распарсен JSON анализа:", analysis);
    } catch (parseError: unknown) {
      console.error("❌ Ошибка парсинга JSON анализа:");
      logError(parseError, "ПАРСИНГ JSON АНАЛИЗА");
      console.error("🔍 Проблемный текст:", result.text);
      return { recommend_products: false, confidence: 0 };
    }

    // Дополнительная валидация результата
    if (analysis.recommend_products && analysis.product_ids) {
      console.log("🎯 Найденные продукты:", analysis.found_products);
      console.log("🆔 ID продуктов:", analysis.product_ids);
      console.log("📊 Уровень уверенности:", analysis.confidence);
      console.log("💭 Обоснование:", analysis.reasoning);
    } else {
      console.log("❌ Продукты не найдены или не рекомендуются");
      console.log("💭 Обоснование:", analysis.reasoning);
    }

    console.log("🔍 ===== КОНЕЦ АНАЛИЗА ПРОДУКТОВ =====");
    return analysis;
  } catch (error: unknown) {
    logError(error, "КРИТИЧЕСКАЯ ОШИБКА В АНАЛИЗЕ ПРОДУКТОВ");
    console.error("📊 Контекст - длина текста:", textContent.length);
    console.error(
      "📋 Контекст - длина системной инструкции:",
      systemInstruction.length
    );
    return { recommend_products: false, confidence: 0 };
  }
}

/**
 * Generate contextual suggestions based on assistant's response
 * @param textContent - The assistant's text response
 * @returns Promise with array of suggestions
 */
async function generateSuggestions(textContent: string): Promise<string[]> {
  try {
    console.log("💡 ===== ГЕНЕРАЦИЯ ПРЕДЛОЖЕНИЙ =====");
    console.log("📝 Текст для анализа:", textContent);

    const suggestionPrompt = `
На основе ответа ассистента кафе создай 2-4 варианта продолжения разговора для пользователя.

Ответ ассистента: "${textContent}"

Генерируй произвольные но релевантные предложения для мягкого, аккуратного вовлечения пользователя. Предложение может содержать от 1 до 6 слов. Вот примеры которые следует использовать только в качестве идеи, добавляя или изменяя их.
- Если говорили о еде: "Хочу заказать", "Что еще посоветуете?", "А что с напитками?"
- Если о напитках: "Буду брать", "Покрепче есть?", "А десерт к этому?"
- Общие: "Спасибо", "Расскажите подробнее", "Нет, спасибо"

Верни JSON массив из 2-4 коротких фраз:
["Вариант 1", "Вариант 2", "Вариант 3"]

Отвечай только JSON массив без дополнительного текста.
`;

    const result = await generateText({
      model: myProvider.languageModel("api-chat-support"),
      prompt: suggestionPrompt,
      temperature: 0.3,
    });

    console.log("📥 Сырой ответ для предложений:", result.text);

    let suggestions;
    try {
      suggestions = JSON.parse(result.text);
      console.log("✅ Сгенерированные предложения:", suggestions);
    } catch (parseError: unknown) {
      console.error("❌ Ошибка парсинга предложений:");
      logError(parseError, "ПАРСИНГ ПРЕДЛОЖЕНИЙ");
      suggestions = ["Спасибо", "Расскажите подробнее", "Нет, спасибо"];
    }

    console.log("💡 ===== КОНЕЦ ГЕНЕРАЦИИ ПРЕДЛОЖЕНИЙ =====");
    return Array.isArray(suggestions) ? suggestions : [];
  } catch (error: unknown) {
    logError(error, "ГЕНЕРАЦИЯ ПРЕДЛОЖЕНИЙ");
    return ["Спасибо", "Расскажите подробнее", "Нет, спасибо"];
  }
}

/**
 * Send product part to data stream
 * @param dataStream - Data stream writer
 * @param productId - Product ID to recommend
 */
function sendProductPart(
  dataStream: DataStreamWriter,
  productId: string
): void {
  const productPart: ProductPart = {
    type: "data-product",
    id: `product-${generateCuid()}`,
    data: {
      product_id: productId,
    },
  };

  console.log("📦 Отправка части продукта:", productPart);

  dataStream.writeData({
    type: "data",
    content: JSON.stringify(productPart),
  });
}

/**
 * Send suggestion parts to data stream
 * @param dataStream - Data stream writer
 * @param suggestions - Array of suggestion strings
 */
function sendSuggestionParts(
  dataStream: DataStreamWriter,
  suggestions: string[]
): void {
  console.log("💬 Отправка предложений:", suggestions);

  suggestions.forEach((suggestion, index) => {
    const suggestionPart: SuggestionPart = {
      type: "data-suggestion",
      id: `suggestion-${generateCuid()}`,
      data: {
        suggestion_id: suggestion,
      },
    };

    console.log(`💬 Отправка предложения ${index + 1}:`, suggestionPart);

    dataStream.writeData({
      type: "data",
      content: JSON.stringify(suggestionPart),
    });
  });
}

/**
 * Token usage logging with cost calculation for GPT-4 Mini
 * @param prefix - Prefix for identifying source
 * @param usage - Token usage information object
 * @param chatId - Chat ID for context
 * @param userId - User ID for context
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

  // Cost calculation for GPT-4 Mini: Input $0.15/1M, Output $0.60/1M
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
 * Build conversation history for context
 * @param messages - Array of messages
 * @returns Formatted conversation string
 */
function buildConversationHistory(messages: any[]): string {
  return messages
    .slice(-6) // Последние 6 сообщений для контекста
    .map((msg) => {
      const content =
        msg.parts?.find((part: any) => part.type === "text")?.text || "";
      return `${msg.role}: ${content}`;
    })
    .join("\n");
}

/**
 * Handle POST requests for creating or adding messages to chats
 * and streaming AI-generated responses with custom parts (three-stage approach)
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

    // Handle API token if no session
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

    // Check 24-hour message limit
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

    // Check if chat exists
    let chat = await prisma.chat.findUnique({ where: { id: chatId } });

    if (!chat) {
      // Create new chat with title generated from first message
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
      // Prevent access to other users' chats
      if (chat.userId !== userId) {
        return new Response("Запрещено", { status: 403 });
      }
    }

    // Get previous messages ordered by creation time
    const previousMessages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    // Map DB model to AI processing format
    const previousUImessages = previousMessages.map(
      ({ id, role, parts, attachments, createdAt }: Message) => ({
        id,
        role,
        parts,
        experimental_attachments: attachments,
        createdAt,
      })
    );

    // Add new user message to list for AI
    const messages = appendClientMessage({
      // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
      messages: previousUImessages,
      message,
    });

    // Get geolocation from request for hints
    const { longitude, latitude, city, country } = geolocation(request);
    const requestHints: RequestHints = { longitude, latitude, city, country };

    // Save new user message to DB
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

    // Build conversation history for context
    const conversationHistory = buildConversationHistory(messages);
    console.log(
      "📚 Контекст разговора подготовлен, длина:",
      conversationHistory.length
    );

    // Create data stream with three-stage custom parts generation
    const stream = createDataStream({
      execute: async (dataStream) => {
        console.log("🚀 Начинаем трехэтапную генерацию ответа...");

        // STAGE 1: Generate basic text response
        const result = streamText({
          model: myProvider.languageModel("api-chat-support"),
          system: API_SYSTEM_PROMPT,
          messages,
          maxSteps: 1,
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateCuid,
          tools: {}, // No tools - using post-processing approach
          onFinish: async ({ response, usage, text }) => {
            if (!session.user?.id) return;

            // Log token usage for main response
            logTokenUsage("API Chat Main Response", usage, chatId, userId);

            try {
              console.log("📝 Сгенерированный текстовый ответ:", text);

              // STAGE 2: Analyze for product recommendations with enhanced debugging
              console.log(
                "🔍 Этап 2: Анализ рекомендаций продуктов с расширенной отладкой..."
              );

              const productAnalysis = await analyzeForProducts(
                text,
                API_SYSTEM_PROMPT, // Передаем системную инструкцию
                conversationHistory // Передаем историю разговора для контекста
              );

              if (
                productAnalysis.recommend_products &&
                productAnalysis.product_ids &&
                productAnalysis.product_ids.length > 0
              ) {
                console.log(
                  `📦 Рекомендуем продукты: ${productAnalysis.product_ids.join(", ")}`
                );

                // Send product parts for each found product
                productAnalysis.product_ids.forEach((productId) => {
                  sendProductPart(dataStream, productId);
                });
              } else {
                console.log(
                  "❌ Продукты не найдены или анализ не выявил рекомендаций"
                );
              }

              // STAGE 3: Generate contextual suggestions
              console.log("💡 Этап 3: Генерация контекстных предложений...");
              const suggestions = await generateSuggestions(text);

              if (suggestions.length > 0) {
                sendSuggestionParts(dataStream, suggestions);
              }

              // Save assistant message to database
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
                `✅ Трехступенчатый ответ успешно сгенерирован и сохранен для чата ${chatId}`
              );
            } catch (error: unknown) {
              logError(error, "ТРЕХСТУПЕНЧАТАЯ ОБРАБОТКА");
              console.error(
                `📊 Контекст ошибки - ID чата: ${chatId}, ID пользователя: ${userId}`
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
  } catch (error: unknown) {
    logError(error, "POST /API-CHAT-STREAM");
    return new Response("Произошла ошибка при обработке вашего запроса!", {
      status: 500,
    });
  }
}
