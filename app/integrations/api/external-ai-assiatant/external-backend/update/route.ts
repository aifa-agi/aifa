// @/app/integrations/api/external/session/update/route.ts

import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { apiResponse } from "@/app/integrations/lib/api/response";
import { UpdateSessionSchema } from "../../_types/session";
import { prisma } from "@/lib/db";
import { createId } from "@paralleldrive/cuid2";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SESSION_TTL_SECONDS = 60 * 60 * 4;

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    // Добавляем отладочное логирование
    console.log("Received request body:", JSON.stringify(json, null, 2));

    // Валидация через zod
    const parse = UpdateSessionSchema.safeParse(json);

    if (!parse.success) {
      // Детальное логирование ошибок валидации
      console.error("Validation failed:", {
        errors: parse.error.issues,
        receivedData: json,
      });

      return apiResponse({
        success: false,
        error: parse.error.issues,
        message: "Request validation failed",
        status: 400,
      });
    }

    const { session_id, auth_secret, events } = parse.data;

    // Проверка авторизации
    if (auth_secret !== process.env.NEXTAUTH_SECRET) {
      return apiResponse({
        success: false,
        error: "Unauthorized: invalid auth_secret",
        status: 401,
      });
    }

    // Получение существующей сессии
    const sessionKey = `session:${session_id}`;
    const existing = await redis.get(sessionKey);

    if (!existing) {
      return apiResponse({
        success: false,
        error: "Session not found",
        status: 404,
      });
    }

    // Парсинг данных сессии
    const sessionObj =
      typeof existing === "string" ? JSON.parse(existing) : existing;

    // Извлечение chatId из данных сессии
    const chatId = sessionObj.chatId;

    if (!chatId) {
      return apiResponse({
        success: false,
        error: "ChatId not found in session",
        status: 400,
      });
    }

    // Создание обновленного объекта сессии
    const merged = { ...sessionObj };

    // Обработка событий и создание сообщения
    let messageCreated = false;
    if (events && events.length > 0) {
      // Обновляем события в сессии
      merged.events = events;

      // Формируем текст событий
      const eventsText = events
        .map((event, index) => `${index + 1}. ${event.text}`)
        .join("\n");

      // Проверяем существование чата
      const chatExists = await prisma.chat.findUnique({
        where: { id: chatId },
        select: { id: true },
      });

      if (!chatExists) {
        return apiResponse({
          success: false,
          error: "Chat not found",
          status: 404,
        });
      }

      // Создаем новое сообщение в базе данных
      const messageId = createId();
      await prisma.message.create({
        data: {
          id: messageId,
          chatId,
          role: "user",
          parts: [
            {
              text: `Прими к сведению ещё одну важную информацию: ${eventsText}`,
              type: "text",
            },
          ],
          attachments: [],
          createdAt: new Date(),
        },
      });

      messageCreated = true;

      // Обновляем аналитику в сессии
      if (merged.analysis) {
        merged.analysis.hasEvents = true;
        merged.analysis.analyzedAt = new Date().toISOString();
      }
    }

    // Сохраняем обновленную сессию в Redis
    await redis.set(sessionKey, merged, { ex: SESSION_TTL_SECONDS });

    // Логируем успешное выполнение для отладки
    console.log(
      `Session updated successfully. MessageCreated: ${messageCreated}, EventsProcessed: ${events?.length || 0}`
    );

    // ОБНОВЛЕННЫЙ ОТВЕТ: соответствует документации
    return apiResponse({
      success: true,
      status: 200,
      message: "Session updated",
    });
  } catch (error) {
    console.error("Error in /integrations/api/external/session/update:", error);

    return apiResponse({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      status: 500,
      message: "Internal Server Error",
    });
  }
}
