// @/app/integrations/api/external/session/test/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { authSecret } = await req.json();

    if (authSecret !== process.env.AUTH_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized: invalid authSecret" },
        { status: 401 }
      );
    }

    // Получаем все ключи сессий
    const keys = await redis.keys("session:*");

    // Получаем значения всех сессий
    const sessions = await Promise.all(keys.map((key) => redis.get(key)));

    // Формируем объект с ключами и значениями
    const activeSessions = keys.reduce(
      (acc, key, idx) => {
        acc[key] = sessions[idx];
        return acc;
      },
      {} as Record<string, any>
    );

    console.log("Active sessions:", activeSessions);

    return NextResponse.json({ activeSessions });
  } catch (error) {
    console.error("Error in /integrations/api/external/session/test:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
