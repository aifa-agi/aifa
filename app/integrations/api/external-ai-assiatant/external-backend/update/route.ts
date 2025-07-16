// @/app/integrations/api/external/session/update/route.ts

import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { apiResponse } from "@/app/integrations/lib/api/response";
import { UpdateSessionSchema } from "../../_types/session";

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
    const parse = UpdateSessionSchema.safeParse(json);
    if (!parse.success) {
      return apiResponse({
        success: false,
        error: parse.error.issues,
        message: "Validation error",
        status: 400,
      });
    }
    const {
      session_id,
      auth_secret,
      city,
      user_info,
      purchase_history,
      available_products,
      available_items,
      events,
    } = parse.data;

    if (auth_secret !== process.env.NEXTAUTH_SECRET) {
      return apiResponse({
        success: false,
        error: "Unauthorized: invalid auth_secret",
        status: 401,
      });
    }

    const sessionKey = `session:${session_id}`;
    const existing = await redis.get(sessionKey);
    if (!existing) {
      return apiResponse({
        success: false,
        error: "Session not found",
        status: 404,
      });
    }

    const sessionObj =
      typeof existing === "string" ? JSON.parse(existing) : existing;
    const merged = { ...sessionObj };

    // Логика и логирование изменений
    if (city !== undefined && city !== sessionObj.city) {
      merged.city = city;
      console.log(`city was updated, new city is ${city}`);
    }
    if (
      user_info !== undefined &&
      JSON.stringify(user_info) !== JSON.stringify(sessionObj.user_info)
    ) {
      merged.user_info = user_info;
      console.log(
        `user_info was updated, new user_info is ${JSON.stringify(user_info)}`
      );
    }
    if (
      purchase_history !== undefined &&
      JSON.stringify(purchase_history) !==
        JSON.stringify(sessionObj.purchase_history)
    ) {
      merged.purchase_history = purchase_history;
      console.log(
        `purchase_history was updated, new purchase_history is ${JSON.stringify(purchase_history)}`
      );
    }
    if (available_items !== undefined) {
      const parsedItems = parseAvailableItems(available_items);
      if (
        JSON.stringify(parsedItems) !==
        JSON.stringify(sessionObj.available_items)
      ) {
        merged.available_items = parsedItems;
        console.log(
          `available_items was updated, new available_items is ${JSON.stringify(parsedItems)}`
        );
      }
    }
    if (
      events !== undefined &&
      JSON.stringify(events) !== JSON.stringify(sessionObj.events)
    ) {
      merged.events = events;
      console.log(
        `events was updated, new events is ${JSON.stringify(events)}`
      );
    }

    await redis.set(sessionKey, merged, { ex: SESSION_TTL_SECONDS });

    return apiResponse({
      success: true,
      data: merged,
      message: "Session updated",
      status: 200,
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
