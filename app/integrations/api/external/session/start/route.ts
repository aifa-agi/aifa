// @/app/integrations/api/external/session/start/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { nanoid } from "nanoid";

// Явная инициализация клиента с правильными переменными для HTTP REST API
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SESSION_TTL_SECONDS = 60 * 60 * 4; // 4 часа

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    const {
      user_id,
      name,
      city,
      purchase_history,
      available_products,
      authSecret,
    } = body;

    // Проверка секретного ключа
    if (authSecret !== process.env.AUTH_SECRET) {
      console.warn("Unauthorized access attempt with authSecret:", authSecret);
      return NextResponse.json(
        { error: "Unauthorized: invalid authSecret" },
        { status: 401 }
      );
    }

    // Генерируем уникальный session_id
    const session_id = nanoid();
    console.log("Generated session_id:", session_id);

    // Формируем объект для хранения в Redis
    const sessionData = {
      user_id,
      name,
      city,
      purchase_history,
      available_products,
      createdAt: new Date().toISOString(),
    };
    console.log("Saving sessionData to Redis:", sessionData);

    // Сохраняем сессию в Redis с TTL
    await redis.set(`session:${session_id}`, sessionData, {
      ex: SESSION_TTL_SECONDS,
    });

    console.log("Session successfully saved:", session_id);

    // Возвращаем session_id
    return NextResponse.json({ session_id });
  } catch (error) {
    console.error("Error in /api/external/session/start:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
