// @/app/integrations/api/external/session/update/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SESSION_TTL_SECONDS = 60 * 60 * 4; // TTL как при создании

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, authSecret, ...updateData } = body;

    if (authSecret !== process.env.AUTH_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized: invalid authSecret" },
        { status: 401 }
      );
    }

    if (!session_id) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 }
      );
    }

    const sessionKey = `session:${session_id}`;
    // Получаем существующую сессию
    const existing = await redis.get(sessionKey);
    if (!existing) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Парсим, мержим, сохраняем обратно
    const sessionObj =
      typeof existing === "string" ? JSON.parse(existing) : existing;
    const merged = { ...sessionObj, ...updateData };

    await redis.set(sessionKey, merged, { ex: SESSION_TTL_SECONDS });

    return NextResponse.json({
      success: true,
      session: merged,
    });
  } catch (error) {
    console.error("Error in /integrations/api/external/session/update:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
