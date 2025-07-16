// @/app/@left/(_public)/(_CHAT)/(chat)/(_server)/api/vote/route.ts

import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import { prisma } from "@/lib/db";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new Response("chatId is required", { status: 400 });
  }

  const session = await auth();

  if (!session?.user?.email || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (!chat) {
    return new Response("Chat not found", { status: 404 });
  }

  if (chat.userId !== session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Получаем все голоса для заданного chatId
  const votes = await prisma.vote.findMany({
    where: { chatId },
  });

  return new Response(JSON.stringify(votes), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { chatId, messageId, type } = body as {
    chatId: string;
    messageId: string;
    type: "up" | "down";
  };
  console.log(
    " // @/app/(chat)/api/vote/route.ts function PATCH chatId",
    chatId
  );
  console.log(
    "// @/app/(chat)/api/vote/route.ts function PATCH messageId ",
    messageId
  );
  console.log("// @/app/(chat)/api/vote/route.ts function PATCH type ", type);
  if (!chatId || !messageId || !type) {
    return new Response("chatId, messageId and type are required", {
      status: 400,
    });
  }

  const session = await auth();

  if (!session?.user?.email || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (!chat) {
    return new Response("Chat not found", { status: 404 });
  }

  if (chat.userId !== session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const isUpvoted = type === "up";

  console.log(" isUpvoted", isUpvoted);
  // Upsert голосования: обновляем, если есть, иначе создаём
  await prisma.vote.upsert({
    where: {
      chatId_messageId: {
        chatId,
        messageId,
      },
    },
    update: {
      isUpvoted,
    },
    create: {
      chatId,
      messageId,
      isUpvoted,
    },
  });

  return new Response("Message voted", { status: 200 });
}
