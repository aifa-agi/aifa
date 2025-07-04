// @/app/integrations/api/external/session/end/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Инициализация клиента Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { session_id, authSecret } = await req.json();

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

    // Удаляем сессию из Redis
    await redis.del(`session:${session_id}`);

    return NextResponse.json({ success: true, message: "Session deleted" });
  } catch (error) {
    console.error("Error in /integrations/api/external/session/end:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
