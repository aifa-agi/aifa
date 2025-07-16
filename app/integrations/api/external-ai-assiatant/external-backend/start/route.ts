// @/app/integrations/api/external-ai-assiatant/external-backend/start/route.ts

import { NextRequest } from "next/server";
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";
import { Redis } from "@upstash/redis";
import { StartSessionSchema } from "../../_types/session";
import { apiResponse } from "@/app/integrations/lib/api/response";
import { createId } from "@paralleldrive/cuid2"; // Для генерации CUID2
import { extractSubFromJWT } from "@/lib/utils/extract-sub-from-jwt";

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

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    // Валидация через zod
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

    if (auth_secret !== process.env.NEXTAUTH_SECRET) {
      return apiResponse({
        success: false,
        error: "Unauthorized: invalid auth_secret",
        status: 401,
      });
    }

    const chatId = createId();
    const messageId = createId();

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

    const availableItemsArray = parseAvailableItems(available_items);

    const systemMessage = `ты ассистент искусственного интеллекта в ресторане который должен будет помогать пользователю по имени ${name || "Гость"}. Когда в следующий раз к тебе обратиться пользователь приветствуй его по этому имени.`;

    const chatRequestBody = {
      id: chatId,
      message: {
        id: messageId,
        createdAt: new Date().toISOString(),
        role: "assistant",
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

    // 6. Сохраняем сессию в Redis
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
    };

    await redis.set(`session:${sub}`, sessionData, {
      ex: SESSION_TTL_SECONDS,
    });

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
    return apiResponse({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      status: 500,
      message: "Internal Server Error",
    });
  }
}
