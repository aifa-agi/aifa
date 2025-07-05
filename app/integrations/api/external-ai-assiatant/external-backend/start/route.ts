// @/app/integrations/api/external-ai-assiatant/external-backend/start/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
const SESSION_TTL_SECONDS = 60 * 60 * 4;
// Вспомогательная функция для извлечения sub (user id) из JWT
function extractSubFromJWT(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8")
    );
    return decoded.sub || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id,
      name,
      city,
      events,
      user_info,
      purchase_history,
      available_products,
      auth_secret,
    } = body;

    if (auth_secret !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized: invalid authSecret" },
        { status: 401 }
      );
    }

    // Только авторизация и возврат JWT, запись в Redis теперь централизована в auth.ts
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
      return NextResponse.json(
        { error: "NextAuth error", details: error },
        { status: 500 }
      );
    }

    const { token } = await nextAuthRes.json();

    // Извлекаем sub (user id) из JWT
    const sub = extractSubFromJWT(token);
    if (!sub) {
      return NextResponse.json(
        { error: "Failed to extract user id from JWT" },
        { status: 500 }
      );
    }

    const sessionData = {
      user_id,
      name,
      city,
      events,
      user_info,
      purchase_history,
      available_products,
      createdAt: new Date().toISOString(),
    };

    await redis.set(`session:${sub}`, sessionData, {
      ex: SESSION_TTL_SECONDS,
    });

    return NextResponse.json({ success: true, session_id: sub, jwt: token });
  } catch (error) {
    console.error("Error in /external-backend/start:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
