// @/app/integrations/api/external/session/start/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/db"; // путь к вашему prisma клиенту

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SESSION_TTL_SECONDS = 60 * 60 * 4; // 4 часа

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id,
      name,
      city,
      user_info,
      purchase_history,
      available_products,
      authSecret,
    } = body;

    // Проверка секретного ключа
    if (authSecret !== process.env.AUTH_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized: invalid authSecret" },
        { status: 401 }
      );
    }

    // Проверяем/создаём пользователя в базе (только нужные поля)
    let user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: user_id,
          name,
          type: "apiUser",
        },
      });
    }

    // В Redis сохраняем все необходимые для сессии поля (включая город, покупки и т.д.)
    const session_id = nanoid();
    const sessionData = {
      user_id,
      name,
      city,
      user_info,
      purchase_history,
      available_products,
      createdAt: new Date().toISOString(),
    };

    await redis.set(`session:${session_id}`, sessionData, {
      ex: SESSION_TTL_SECONDS,
    });

    return NextResponse.json({ session_id });
  } catch (error) {
    console.error("Error in /api/external/session/start:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
