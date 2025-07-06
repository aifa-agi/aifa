// @/app/integrations/api/external-ai-assiatant/external-backend/start/route.ts

import { NextRequest } from "next/server";
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";
import { Redis } from "@upstash/redis";
import { StartSessionSchema } from "../../_types/session";
import { apiResponse } from "@/app/integrations/lib/api/response";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
const SESSION_TTL_SECONDS = 60 * 60 * 4;

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
    };

    await redis.set(`session:${sub}`, sessionData, {
      ex: SESSION_TTL_SECONDS,
    });

    return apiResponse({
      success: true,
      data: { session_id: sub, jwt: token },
      message: "Session created",
      status: 200,
    });
  } catch (error) {
    console.error("Error in /external-backend/start:", error);
    return apiResponse({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      status: 500,
      message: "Internal Server Error",
    });
  }
}
