// @/app/@left/(chat)/api/chat/route.ts

import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  smoothStream,
  streamText,
  tool,
} from "ai";
import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import {
  type RequestHints,
  systemPrompt,
} from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/prompts";
import { getTrailingMessageId } from "@/lib/utils";
import { generateTitleFromUserMessage } from "../../../(_service)/(_actions)/actions";
import { createDocument } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/tools/create-document";
import { updateDocument } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/tools/update-document";
import { requestSuggestions } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/tools/request-suggestions";
import { getWeather } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/tools/get-weather";
import { fileSearchVectorStore } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/tools/file-search-vector-store";
import { isProductionEnvironment } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_constants)/constants";
import { myProvider } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/providers";
import { entitlementsByUserType } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/entitlements";
import { postRequestBodySchema, type PostRequestBody } from "./schema";
import { geolocation } from "@vercel/functions";
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream";
import { after, NextResponse } from "next/server";
import { differenceInSeconds } from "date-fns";
import { prisma } from "@/lib/db";

import { Chat, Message, Prisma, UserType } from "@prisma/client";
import { generateCuid } from "@/lib/utils/generateCuid";
import { extractSubFromJWT } from "@/lib/utils/extract-sub-from-jwt";

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

/**
 * Logs token usage with detailed information and correct GPT-4 Mini pricing
 * @param prefix - Prefix for source identification
 * @param usage - Object with token usage information
 * @param chatId - Chat ID for context
 * @param userId - User ID for context
 */
function logTokenUsage(
  prefix: string,
  usage: any,
  chatId?: string,
  userId?: string
) {
  if (!usage) {
    console.log(`${prefix} - Token usage data not available`);
    return;
  }

  const { promptTokens, completionTokens, totalTokens } = usage;

  console.log(`\n🔢 ===== ${prefix.toUpperCase()} TOKEN USAGE =====`);
  console.log(`📊 Chat ID: ${chatId || "unknown"}`);
  console.log(`👤 User ID: ${userId || "unknown"}`);
  console.log(`📥 Input tokens (Prompt): ${promptTokens ?? "unknown"}`);
  console.log(
    `📤 Output tokens (Completion): ${completionTokens ?? "unknown"}`
  );
  console.log(`🔄 Total tokens: ${totalTokens ?? "unknown"}`);

  // GPT-4 Mini pricing calculation: Input $0.15/1M, Output $0.60/1M
  if (promptTokens && completionTokens) {
    const inputCost = (promptTokens / 1000000) * 0.15; // $0.15 per 1M tokens
    const outputCost = (completionTokens / 1000000) * 0.6; // $0.60 per 1M tokens
    const totalCost = inputCost + outputCost;

    console.log(
      `💰 GPT-4 Mini cost: $${totalCost.toFixed(8)} (Input: $${inputCost.toFixed(8)}, Output: $${outputCost.toFixed(8)})`
    );

    // Additionally show cost in cents for clarity
    const totalCostCents = totalCost * 100;
    console.log(`💸 Cost in cents: ${totalCostCents.toFixed(6)}¢`);
  }

  console.log(`⏰ Logged at: ${new Date().toISOString()}`);
  console.log(`🔢 ===== END TOKEN USAGE =====\n`);
}

/**
 * Get or create a global resumable stream context for data streaming.
 */
function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({ waitUntil: after });
    } catch (error: any) {
      if (error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL"
        );
      } else {
        console.error(error);
      }
    }
  }
  return globalStreamContext;
}

/**
 * Handle POST requests to create or append messages to chats,
 * and stream AI-generated responses.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");

  let requestBody: PostRequestBody;
  try {
    const json = await request.json();

    requestBody = postRequestBodySchema.parse(json);
  } catch (e) {
    return new Response("Invalid request body", { status: 400 });
  }

  try {
    const {
      id: chatId,
      message,
      selectedChatModel,
      selectedVisibilityType,
    } = requestBody;

    let session = await auth();

    let token = request.headers.get("authorization");
    const expires = new Date(Date.now() + 60 * 60 * 4000).toISOString();

    if (!session && token) {
      const sub = extractSubFromJWT(token);
      session = {
        user: {
          id: sub || "",
          type: "apiUser",
        },
        expires,
      };
    }

    if (!session || session.user.id === "") {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const userType = session.user.type;

    // Now session is always defined and can be safely used further

    // Count how many user messages they sent in last 24 hours
    const messageCount = await prisma.message.count({
      where: {
        role: "user",
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        Chat: {
          userId,
        },
      },
    });

    if (messageCount >= entitlementsByUserType[userType].maxMessagesPerDay) {
      return NextResponse.json(
        {
          error:
            "You've reached your daily limit. Sign up to get 5× more messages per day!",
          redirectTo: "/register",
          delay: 3000,
        },
        { status: 429 }
      );
    }

    // Check if chat exists
    let chat = await prisma.chat.findUnique({ where: { id: chatId } });
    console.log(
      "console: // @/app/@left/(chat)/api/chat/route.ts chat:  ",
      chat
    );
    console.log(
      "console: // @/app/@left/(chat)/api/chat/route.ts message:  ",
      message
    );
    if (!chat) {
      // Create new chat with title generated from first user message
      const title = await generateTitleFromUserMessage({ message });
      chat = await prisma.chat.create({
        data: {
          id: chatId,
          userId: userId ? userId : "12345qwert",
          title,
          visibility: selectedVisibilityType,
          createdAt: new Date(),
        },
      });
      console.log(
        "console: // @/app/@left/(chat)/api/chat/route.ts chat:  ",
        chat
      );
    } else {
      // Prevent users from accessing others' chats
      if (chat.userId !== userId) {
        return new Response("Forbidden", { status: 403 });
      }
    }

    // Fetch previous messages (Message_v2 model) ordered by creation time
    const previousMessages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    // Map DB model to UI-friendly message format for AI processing
    const previousUImessages = previousMessages.map(
      ({ id, role, parts, attachments, createdAt }: Message) => ({
        id,
        role,
        parts,
        experimental_attachments: attachments,
        createdAt,
      })
    );
    // Append new user message to list for AI input
    const messages = appendClientMessage({
      // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
      messages: previousUImessages,
      message,
    });

    // Obtain geolocation metadata from request for hints
    const { longitude, latitude, city, country } = geolocation(request);
    const requestHints: RequestHints = { longitude, latitude, city, country };

    // Save user's new message to DB
    await prisma.message.create({
      data: {
        id: message.id,
        chatId,
        role: "user",
        parts: message.parts,
        attachments: message.experimental_attachments ?? [],
        createdAt: new Date(),
      },
    });

    // Create a new stream ID and associate to chat
    const streamId = generateCuid();
    await prisma.stream.create({
      data: {
        id: streamId,
        chatId,
        createdAt: new Date(),
      },
    });

    // Compose data stream with AI text generation and tools usage
    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system:
            "Ты — общительный, тёплый, внимательный и вежливый ИИ-официант-девушка ресторана CHICKO. Если тебе известно имя встречай клиента по имени от лица ресторана CHICKO. Если информация неизвестна то значит это новый гость можешь уточнить как его зовут , и если он ответит то значит нужно запомнить его имя и в дальнейшем обращаться по этому имени. Используй наши девизы, ВАРИАНТЫ ПРИВЕТСТВИЙ и фирменные послания. Используя информацию о клиенте о времени его последнего посещения если оно существует о количестве дней с последнего заказа о любимом блюде и генерирует дружелюбные разнообразные неповторимые разговоры с призывом на вовлечение. ",
          messages,
          maxSteps: 5,

          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateCuid,
          tools: {},
          onFinish: async ({ response, usage }) => {
            if (!session.user?.id) return;

            // Log token usage with GPT-4 Mini pricing
            logTokenUsage("AI Response", usage, chatId, userId);

            try {
              const assistantId = getTrailingMessageId({
                messages: response.messages.filter(
                  (m) => m.role === "assistant"
                ),
              });
              if (!assistantId) throw new Error("No assistant message found!");

              const [, assistantMessage] = appendResponseMessages({
                messages: [message],
                responseMessages: response.messages,
              });

              await prisma.message.create({
                data: {
                  id: assistantId,
                  chatId,
                  role: assistantMessage.role,
                  parts: assistantMessage.parts
                    ? JSON.parse(JSON.stringify(assistantMessage.parts))
                    : undefined,
                  attachments: (assistantMessage.experimental_attachments ??
                    []) as unknown as Prisma.InputJsonValue,
                  createdAt: new Date(),
                },
              });

              // Additional logging for successful message saving
              console.log(
                `✅ Assistant message saved successfully for chat ${chatId}`
              );
            } catch (error) {
              console.error("Failed to save assistant message:", error);

              // Error logging with context
              console.error(
                `❌ Error context - Chat ID: ${chatId}, User ID: ${userId}`
              );
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        });

        result.consumeStream();
        result.mergeIntoDataStream(dataStream, { sendReasoning: true });
      },
      onError: () => "Oops, an error occurred!",
    });

    // Return streaming response (supports resumable streams if available)
    const streamContext = getStreamContext();
    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () => stream)
      );
    }

    return new Response(stream);
  } catch (error) {
    console.error("POST /chat error:", error);
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
}

/**
 * Handle GET requests to stream last AI response or resume
 * unfinished streams related to a chat.
 */
export async function GET(request: Request) {
  const streamContext = getStreamContext();
  const resumeRequestedAt = new Date();

  if (!streamContext) {
    return new Response(null, { status: 204 });
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new Response("id is required", { status: 400 });
  }

  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let chat: Chat | null = null;
  try {
    chat = await prisma.chat.findUnique({ where: { id: chatId } });
  } catch {
    return new Response("Not found", { status: 404 });
  }

  if (!chat) {
    return new Response("Not found", { status: 404 });
  }

  if (chat.visibility === "private" && chat.userId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  // Retrieve all stream IDs for chat ordered by creation ascending
  const streams = await prisma.stream.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (streams.length === 0) {
    return new Response("No streams found", { status: 404 });
  }

  const recentStreamId = streams.at(-1)?.id;
  if (!recentStreamId) {
    return new Response("No recent stream found", { status: 404 });
  }

  const emptyDataStream = createDataStream({ execute: () => {} });

  // Try to get resumable stream from stored context
  const stream = await streamContext.resumableStream(
    recentStreamId,
    () => emptyDataStream
  );

  if (!stream) {
    // Stream ended during SSR, restore last assistant message if very recent (<15s)
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    const mostRecentMessage = messages.at(-1);
    if (!mostRecentMessage || mostRecentMessage.role !== "assistant") {
      return new Response(emptyDataStream, { status: 200 });
    }

    const messageCreatedAt = new Date(mostRecentMessage.createdAt);
    if (differenceInSeconds(resumeRequestedAt, messageCreatedAt) > 15) {
      return new Response(emptyDataStream, { status: 200 });
    }

    const restoredStream = createDataStream({
      execute: (buffer) => {
        buffer.writeData({
          type: "append-message",
          message: JSON.stringify(mostRecentMessage),
        });
      },
    });

    return new Response(restoredStream, { status: 200 });
  }

  return new Response(stream, { status: 200 });
}

/**
 * Handle DELETE requests to delete a chat by its ID
 * with proper authorization.
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await prisma.chat.findUnique({ where: { id } });

    if (!chat) {
      return new Response("Not Found", { status: 404 });
    }

    if (chat.userId !== session.user.id) {
      return new Response("Forbidden", { status: 403 });
    }

    // Delete chat (cascading deletes of related entities depend on Prisma schema cascade settings)
    const deletedChat = await prisma.chat.delete({ where: { id } });

    return new Response(JSON.stringify(deletedChat), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE /chat error:", error);
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
}
