// @app/@left/(_public)/(_CHAT)/(chat)/(_server)/api/history/route.ts

import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import { NextRequest } from "next/server";
import { getChatsByUserId } from "../../../(_service)/(_db-queries)/chat/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = parseInt(searchParams.get("limit") || "10");
  const startingAfter = searchParams.get("starting_after");
  const endingBefore = searchParams.get("ending_before");

  if (startingAfter && endingBefore) {
    return Response.json(
      "Only one of starting_after or ending_before can be provided!",
      { status: 400 }
    );
  }

  const session = await auth();

  if (!session?.user?.id) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  try {
    const chats = await getChatsByUserId({
      id: session.user.id,
      limit,
      startingAfter,
      endingBefore,
    });

    return Response.json(chats);
  } catch (_) {
    return Response.json("Failed to fetch chats!", { status: 500 });
  }
}
