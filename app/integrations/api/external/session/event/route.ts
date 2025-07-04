// @/app/integrations/api/external/session/event/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { session_id, event, authSecret } = await req.json();

    if (authSecret !== process.env.AUTH_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized: invalid authSecret" },
        { status: 401 }
      );
    }

    if (!session_id || !event) {
      return NextResponse.json(
        { error: "session_id and event are required" },
        { status: 400 }
      );
    }

    // Для примера: логируем событие и сохраняем его в Redis (можно расширить под ваши нужды)
    const eventKey = `session:${session_id}:events`;
    const eventObj = {
      event,
      receivedAt: new Date().toISOString(),
    };

    // Добавляем событие в список событий сессии (можно использовать lpush для очереди)
    await redis.lpush(eventKey, JSON.stringify(eventObj));

    console.log(`Event received for session ${session_id}:`, event);

    // Здесь можно добавить вызов AI-логики или внутренней инструкции

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /integrations/api/external/session/event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
