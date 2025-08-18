// @/app/integrations/api/external-ai-assiatant/external-backend/start/route.ts

import { NextRequest } from "next/server";
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";
import { Redis } from "@upstash/redis";
import { StartSessionSchema } from "../../_types/session";
import { apiResponse } from "@/app/integrations/lib/api/response";
import { createId } from "@paralleldrive/cuid2";
import { extractSubFromJWT } from "@/lib/utils/extract-sub-from-jwt";
import { analyzePurchasePreferences } from "../../utils/analyze-purchase-history";
import { analyzeTagPreferences } from "../../utils/analyze-tag-preferences";
import { buildAvailableMenu } from "../../utils/build-available-menu";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
const SESSION_TTL_SECONDS = 60 * 60 * 4;

function parseAvailableItems(
  available_items: string | null | undefined
): string[] | undefined {
  if (!available_items) return undefined;
  return available_items
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * Creates enhanced system message with personalized information
 * @param name - User's name
 * @param city - User's city (optional)
 * @param purchasePreferencesDoc - Markdown document with purchase history analysis
 * @param tagPreferencesDoc - Markdown document with tag preferences analysis
 * @param availableMenuDoc - Markdown document with current menu
 * @returns Enhanced system message string
 */
function createEnhancedSystemMessage(
  name: string | null,
  city: string | null,
  purchasePreferencesDoc: string,
  tagPreferencesDoc: string,
  availableMenuDoc: string
): string {
  const userName = name || "Гость";
  const userCity = city ? ` из города ${city}` : "";

  let systemMessage = `Ты AI-ассистент ресторана. Твоя основная задача - помогать пользователю выбирать блюда и отвечать на вопросы о меню.

ИНФОРМАЦИЯ О КЛИЕНТЕ:
- Имя: ${userName}${userCity}

`;

  // Add purchase preferences if available
  if (purchasePreferencesDoc.trim()) {
    systemMessage += `${purchasePreferencesDoc}\n`;
  }

  // Add tag preferences if available
  if (tagPreferencesDoc.trim()) {
    systemMessage += `${tagPreferencesDoc}\n`;
  }

  // Add current menu if available
  if (availableMenuDoc.trim()) {
    systemMessage += `${availableMenuDoc}\n`;
  }

  // Add instructions
  systemMessage += `ТВОИ ЗАДАЧИ:
- Рекомендуй блюда на основе предыдущих предпочтений клиента
- Помогай с выбором, объясняй особенности блюд и их состав
- Учитывай популярные характеристики продуктов при рекомендациях
- Отвечай дружелюбно и профессионально
- Если клиент спрашивает о блюдах, которых нет в меню - предложи альтернативы

ПРАВИЛА:
- Всегда обращайся к клиенту по имени (${userName})
- Рекомендуй только те блюда, которые есть в актуальном меню
- При рекомендациях указывай цену и основные характеристики
- Если у клиента есть предпочтения из истории покупок - учитывай их приоритетно
- В следующем сообщении порекомендуй до 3 блюда из того, что пользователь покупал раньше, если есть история покупок. Отправляй сообщения как рекомендации, успользуй suggestions тип сообщений.

Начни общение с приветствия по имени и предложи помочь с выбором блюд.`;

  return systemMessage;
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
      available_products,
      available_items,
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

    // НОВАЯ ЛОГИКА: Анализ данных пользователя и создание персонализированного промта
    const availableItemsArray = parseAvailableItems(available_items);

    console.log("Starting user data analysis...");

    // Parallel execution of analysis functions for better performance
    const [purchasePreferencesDoc, tagPreferencesDoc, availableMenuDoc] =
      await Promise.all([
        // Анализ истории покупок
        analyzePurchasePreferences(purchase_history, availableItemsArray).catch(
          (error) => {
            console.error("Purchase preferences analysis failed:", error);
            return "";
          }
        ),

        // Анализ предпочтений по тегам
        analyzeTagPreferences(purchase_history, availableItemsArray).catch(
          (error) => {
            console.error("Tag preferences analysis failed:", error);
            return "";
          }
        ),

        // Создание актуального меню
        buildAvailableMenu(available_items).catch((error) => {
          console.error("Menu building failed:", error);
          return "";
        }),
      ]);

    console.log("Analysis results:");
    console.log(
      "- Purchase preferences length:",
      purchasePreferencesDoc.length
    );
    console.log("- Tag preferences length:", tagPreferencesDoc.length);
    console.log("- Available menu length:", availableMenuDoc.length);

    // Создание улучшенного системного сообщения
    const systemMessage = createEnhancedSystemMessage(
      name ?? null,
      city ?? null,
      purchasePreferencesDoc,
      tagPreferencesDoc,
      availableMenuDoc
    );

    console.log(
      "Enhanced system message created, length:",
      systemMessage.length
    );

    // Создание запроса к чату (СТРУКТУРА НЕ ИЗМЕНЯЕТСЯ)
    const chatRequestBody = {
      id: chatId,
      message: {
        id: messageId,
        createdAt: new Date().toISOString(),
        role: "user",
        content: systemMessage,
        parts: [
          {
            text: systemMessage,
            type: "text",
          },
        ],
      },
      selectedChatModel: "chat-model",
      selectedVisibilityType: "public",
    };

    console.log("Sending request to chat API...");

    const chatApiRes = await fetch(`${getNextAuthUrl()}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(chatRequestBody),
    });

    let aiResponse: any = null;
    const contentType = chatApiRes.headers.get("content-type");

    if (!chatApiRes.ok) {
      // Если ошибка, пробуем получить текст ошибки
      const errorText = await chatApiRes.text();
      return apiResponse({
        success: false,
        error: errorText,
        message: "AI chat error",
        status: 500,
      });
    }

    if (contentType && contentType.includes("application/json")) {
      aiResponse = await chatApiRes.json();
    } else {
      // Если не JSON, просто берём текст
      aiResponse = await chatApiRes.text();
    }

    console.log("Chat API response received");

    // Сохранение сессии в Redis (РАСШИРЕННАЯ ИНФОРМАЦИЯ)
    const sessionData = {
      user_id,
      name,
      city,
      events,
      user_info,
      purchase_history,
      available_products,
      available_items: availableItemsArray,
      createdAt: new Date().toISOString(),
      chatId,

      // Новые поля для аналитики и отладки
      analysis: {
        hasPurchaseHistory: !!purchase_history && purchase_history.length > 0,
        hasTagPreferences: tagPreferencesDoc.length > 0,
        hasAvailableMenu: availableMenuDoc.length > 0,
        systemMessageLength: systemMessage.length,
        analyzedAt: new Date().toISOString(),
      },
    };

    await redis.set(`session:${sub}`, sessionData, {
      ex: SESSION_TTL_SECONDS,
    });

    console.log("Session saved to Redis with enhanced data");

    return apiResponse({
      success: true,
      data: {
        session_id: sub,
        jwt: token,
        chatId,
      },
      message: "Session created and initial chat started",
      status: 200,
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
