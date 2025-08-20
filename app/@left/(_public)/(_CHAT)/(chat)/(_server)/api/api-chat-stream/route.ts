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
 * Analyze text response to determine if product recommendations are needed
 * @param textContent - The assistant's text response
 * @returns Promise with analysis result
 */
async function analyzeForProducts(textContent: string): Promise<{
  recommend_products: boolean;
  category?: string;
  confidence?: number;
}> {
  try {
    const analysisPrompt = `
Проанализируй ответ ассистента определи какой продукт он рекомендует: "${textContent}"



Изучи ранее загруженное меню и найди идентификатор для продукта которые предложил ассистент.

Если продукты не нужны:
{"recommend_products": false, "confidence": 0.2}

Отвечай только JSON без дополнительного текста.
`;

    const result = await generateText({
      model: myProvider.languageModel("api-chat-support"),
      prompt: analysisPrompt,
      temperature: 0.1,
    });

    const analysis = JSON.parse(result.text);
    console.log("🔍 Product analysis result:", analysis);
    return analysis;
  } catch (error) {
    console.error("❌ Error in product analysis:", error);
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
    const suggestionPrompt = `
На основе ответа ассистента кафе создай 2-4 варианта продолжения разговора для пользователя.

Ответ ассистента: "${textContent}"

Генерируй произвольные но релевантные предложения для  мягкого, аккуратного вовлечения пользователя. Предложение может содержать от 1 до 6 слов. Вот примеры которые следует использовать только в качестве идеи, добавляя или изменяя их.
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

    const suggestions = JSON.parse(result.text);
    console.log("💡 Generated suggestions:", suggestions);
    return Array.isArray(suggestions) ? suggestions : [];
  } catch (error) {
    console.error("❌ Error generating suggestions:", error);
    return ["Спасибо", "Расскажите подробнее", "Нет, спасибо"];
  }
}

/**
 * Get relevant product IDs based on category
 * @param category - Product category
 * @returns Array of product IDs
 */

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

  console.log("📦 Sending product part:", productPart);

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
  suggestions.forEach((suggestion, index) => {
    const suggestionPart: SuggestionPart = {
      type: "data-suggestion",
      id: `suggestion-${generateCuid()}`,
      data: {
        suggestion_id: suggestion,
      },
    };

    console.log(`💬 Sending suggestion ${index + 1}:`, suggestionPart);

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

    // Create data stream with three-stage custom parts generation
    const stream = createDataStream({
      execute: async (dataStream) => {
        console.log("🚀 Starting three-stage response generation...");

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
              console.log("📝 Generated text response:", text);

              // STAGE 2: Analyze for product recommendations
              console.log(
                "🔍 Stage 2: Analyzing for product recommendations..."
              );
              const productAnalysis = await analyzeForProducts(text);

              if (
                productAnalysis.recommend_products &&
                productAnalysis.category
              ) {
                console.log(
                  `📦 Recommending products for category: ${productAnalysis.category}`
                );
              }

              // STAGE 3: Generate contextual suggestions
              console.log("💡 Stage 3: Generating contextual suggestions...");
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
            } catch (error) {
              console.error("❌ Ошибка в трехступенчатой обработке:", error);
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
    console.error("POST /api-chat-stream ошибка:", error);
    return new Response("Произошла ошибка при обработке вашего запроса!", {
      status: 500,
    });
  }
}
