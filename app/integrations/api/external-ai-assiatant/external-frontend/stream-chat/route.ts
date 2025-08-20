// @/app/integrations/api/external-ai-assiatant/external-frontend/stream-chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";
import { generateCuid } from "@/lib/utils/generateCuid";

interface ExternalChatRequest {
  chat_id: string;
  text: string;
}

interface InternalChatRequest {
  id: string;
  message: {
    id: string;
    createdAt: string;
    role: "user";
    content: string;
    parts: Array<{
      type: "text";
      text: string;
    }>;
  };
  selectedChatModel: string;
  selectedVisibilityType: string;
}

type CustomDataPart =
  | {
      type: "data-product";
      id: string;
      data: {
        product_id: string;
      };
    }
  | {
      type: "data-suggestion";
      id: string;
      data: {
        suggestion_id: string;
      };
    };

interface StreamingMessage {
  type: "append-message" | "update-message";
  message: {
    id: string;
    role: "assistant";
    createdAt: string;
    parts: Array<
      | {
          type: "text";
          text: string;
        }
      | CustomDataPart
    >;
  };
}

function addStreamingCorsHeaders(response: Response): Response {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

function createStreamingResponse(stream: ReadableStream): Response {
  const response = new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked",
    },
  });

  return addStreamingCorsHeaders(response);
}

function parseInternalChunk(line: string): {
  text?: string;
  messageId?: string;
  isComplete?: boolean;
  customData?: CustomDataPart;
} {
  try {
    // Парсинг обычного текста
    const numberedMatch = line.match(/^(\d+):"(.*)"/);
    if (numberedMatch) {
      const text = numberedMatch[2]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\\\/g, "\\");
      return { text };
    }

    // Парсинг кастомных данных из dataStream
    const dataMatch = line.match(/^2:\[{"type":"data","content":"(.*)"}]/);
    if (dataMatch) {
      try {
        const jsonContent = dataMatch[1]
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");

        const parsedData = JSON.parse(jsonContent);

        if (parsedData.type === "data-product") {
          console.log("🎯 Найден кастомный data-product:", parsedData);
          return { customData: parsedData as CustomDataPart };
        }
      } catch (parseError) {
        console.log("❌ Ошибка парсинга кастомных данных:", parseError);
      }
    }

    // Парсинг метаданных
    const metadataMatch = line.match(/^[a-z]:\{.*\}$/);
    if (metadataMatch) {
      const jsonStr = line.substring(line.indexOf(":") + 1);
      const data = JSON.parse(jsonStr);
      return { messageId: data.messageId };
    }

    // Проверка завершения стрима
    if (line.includes("finishReason") || line.includes('"usage"')) {
      return { isComplete: true };
    }

    return {};
  } catch (error) {
    return {};
  }
}

function createSSEMessage(data: StreamingMessage): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

function generateCustomDataParts(): CustomDataPart[] {
  return [
    {
      type: "data-suggestion",
      id: "suggestion-1",
      data: {
        suggestion_id: "Сладкое",
      },
    },
    {
      type: "data-suggestion",
      id: "suggestion-2",
      data: {
        suggestion_id: "Соленое",
      },
    },
    {
      type: "data-suggestion",
      id: "suggestion-3",
      data: {
        suggestion_id: "Нет спасибо",
      },
    },
  ];
}

export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  return addStreamingCorsHeaders(response);
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const response = NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
    return addStreamingCorsHeaders(response);
  }
  const token = authHeader.replace("Bearer ", "").trim();

  try {
    verify(token, process.env.NEXTAUTH_SECRET!);
  } catch (e) {
    const response = NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
    return addStreamingCorsHeaders(response);
  }

  let externalBody: ExternalChatRequest;
  try {
    externalBody = await req.json();
  } catch (e) {
    const response = NextResponse.json(
      { error: "Invalid JSON format" },
      { status: 400 }
    );
    return addStreamingCorsHeaders(response);
  }

  if (!externalBody.chat_id || !externalBody.text) {
    const response = NextResponse.json(
      { error: "Missing required fields: chat_id and text" },
      { status: 400 }
    );
    return addStreamingCorsHeaders(response);
  }

  const internalBody: InternalChatRequest = {
    id: externalBody.chat_id,
    message: {
      id: generateCuid(),
      createdAt: new Date().toISOString(),
      role: "user",
      content: externalBody.text,
      parts: [
        {
          type: "text",
          text: externalBody.text,
        },
      ],
    },
    selectedChatModel: "api-chat-support",
    selectedVisibilityType: "private",
  };

  try {
    const chatApiRes = await fetch(`${getNextAuthUrl()}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(internalBody),
    });

    if (!chatApiRes.ok) {
      try {
        const errorData = await chatApiRes.json();
        const response = NextResponse.json(errorData, {
          status: chatApiRes.status,
        });
        return addStreamingCorsHeaders(response);
      } catch (parseError) {
        const response = NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
        return addStreamingCorsHeaders(response);
      }
    }

    const contentType = chatApiRes.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const data = await chatApiRes.json();

      if (data.message && data.message.parts) {
        const customParts = generateCustomDataParts();

        const streamingMessage: StreamingMessage = {
          type: "append-message",
          message: {
            id: data.message.id || generateCuid(),
            role: "assistant",
            createdAt: data.message.createdAt || new Date().toISOString(),
            parts: [...data.message.parts, ...customParts],
          },
        };

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(
              encoder.encode(createSSEMessage(streamingMessage))
            );
            controller.close();
          },
        });

        return createStreamingResponse(stream);
      }
    }

    const reader = chatApiRes.body?.getReader();
    if (!reader) {
      throw new Error("No readable stream available from internal API");
    }

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    let accumulatedText = "";
    let messageId = generateCuid();
    let createdAt = new Date().toISOString();
    let isFirstChunk = true;
    let isStreamComplete = false;
    let collectedCustomData: CustomDataPart[] = [];

    const transformStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              if (accumulatedText && !isStreamComplete) {
                const customParts = generateCustomDataParts();

                const finalStreamingMessage: StreamingMessage = {
                  type: "update-message",
                  message: {
                    id: messageId,
                    role: "assistant",
                    createdAt: createdAt,
                    parts: [
                      {
                        type: "text",
                        text: accumulatedText,
                      },
                      ...collectedCustomData,
                      ...customParts,
                    ],
                  },
                };

                const finalSSEMessage = createSSEMessage(finalStreamingMessage);
                controller.enqueue(encoder.encode(finalSSEMessage));
              }

              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (!line.trim()) continue;

              const parsed = parseInternalChunk(line);

              if (parsed.text) {
                accumulatedText += parsed.text;

                const streamingMessage: StreamingMessage = {
                  type: isFirstChunk ? "append-message" : "update-message",
                  message: {
                    id: messageId,
                    role: "assistant",
                    createdAt: createdAt,
                    parts: [
                      {
                        type: "text",
                        text: accumulatedText,
                      },
                      ...collectedCustomData,
                    ],
                  },
                };

                const sseMessage = createSSEMessage(streamingMessage);
                controller.enqueue(encoder.encode(sseMessage));

                if (isFirstChunk) {
                  isFirstChunk = false;
                }
              }

              if (parsed.customData) {
                collectedCustomData.push(parsed.customData);
                console.log(
                  "📋 Добавлен кастомный data-part:",
                  parsed.customData
                );
              }

              if (parsed.messageId) {
                messageId = parsed.messageId;
              }

              if (parsed.isComplete) {
                isStreamComplete = true;

                const customParts = generateCustomDataParts();

                const finalStreamingMessage: StreamingMessage = {
                  type: "update-message",
                  message: {
                    id: messageId,
                    role: "assistant",
                    createdAt: createdAt,
                    parts: [
                      {
                        type: "text",
                        text: accumulatedText,
                      },
                      ...collectedCustomData,
                      ...customParts,
                    ],
                  },
                };

                const finalSSEMessage = createSSEMessage(finalStreamingMessage);
                controller.enqueue(encoder.encode(finalSSEMessage));
                break;
              }
            }
          }

          controller.close();
        } catch (error) {
          const errorMessage = {
            type: "error",
            error: "Streaming error occurred",
            details: error instanceof Error ? error.message : "Unknown error",
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorMessage)}\n\n`)
          );
          controller.close();
        } finally {
          reader.releaseLock();
        }
      },
    });

    return createStreamingResponse(transformStream);
  } catch (error) {
    const response = NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
    return addStreamingCorsHeaders(response);
  }
}
