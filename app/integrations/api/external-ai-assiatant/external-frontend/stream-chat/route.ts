// @/app/integrations/api/external-ai-assiatant/external-frontend/stream-chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";
import { generateCuid } from "@/lib/utils/generateCuid";
import {
  parseAccumulatedText,
  removeAllJsonFragments,
  type CustomDataPart,
} from "@/app/integrations/lib/api/adapters/ai-response-parser";

/**
 * External partner request format
 */
interface ExternalChatRequest {
  chat_id: string;
  text: string;
}

/**
 * Internal chat API format
 */
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

/**
 * AI SDK v5 compatible streaming message format with custom parts
 */
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

/**
 * Add CORS headers for streaming response
 */
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

/**
 * Create a streaming response with proper headers
 */
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

/**
 * Parse internal streaming chunk to extract text content
 */
function parseInternalChunk(line: string): {
  text?: string;
  messageId?: string;
  isComplete?: boolean;
} {
  try {
    // Handle numbered prefix format (0:"text", 1:"text", etc.)
    const numberedMatch = line.match(/^(\d+):"(.*)"/);
    if (numberedMatch) {
      const text = numberedMatch[2]
        .replace(/\\"/g, '"') // Unescape quotes
        .replace(/\\n/g, "\n") // Unescape newlines
        .replace(/\\t/g, "\t") // Unescape tabs
        .replace(/\\\\/g, "\\"); // Unescape backslashes

      console.log(
        `📝 Parsed text chunk: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`
      );
      return { text };
    }

    // Handle metadata prefix format (f:{"messageId":"..."})
    const metadataMatch = line.match(/^[a-z]:\{.*\}$/);
    if (metadataMatch) {
      const jsonStr = line.substring(line.indexOf(":") + 1);
      const data = JSON.parse(jsonStr);
      return { messageId: data.messageId };
    }

    // Handle completion signals
    if (line.includes("finishReason") || line.includes('"usage"')) {
      return { isComplete: true };
    }

    return {};
  } catch (error) {
    console.log("❌ Failed to parse internal chunk:", line.substring(0, 100));
    return {};
  }
}

/**
 * Create Server-Sent Event formatted message
 */
function createSSEMessage(data: StreamingMessage): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

/**
 * Handle OPTIONS preflight request
 */
export async function OPTIONS(req: NextRequest) {
  console.log("🔧 Stream API OPTIONS preflight request received");
  const response = new NextResponse(null, { status: 200 });
  return addStreamingCorsHeaders(response);
}

/**
 * Handle POST request with real-time streaming
 */
export async function POST(req: NextRequest) {
  console.log("🚀 POST request received to external stream chat API");

  // Authorization validation
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Missing or invalid Authorization header");
    const response = NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
    return addStreamingCorsHeaders(response);
  }
  const token = authHeader.replace("Bearer ", "").trim();

  // Token validation
  try {
    verify(token, process.env.NEXTAUTH_SECRET!);
    console.log("✅ Token validated successfully");
  } catch (e) {
    console.log("❌ Invalid or expired token:", e);
    const response = NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
    return addStreamingCorsHeaders(response);
  }

  // Parse external request body
  let externalBody: ExternalChatRequest;
  try {
    externalBody = await req.json();
    console.log("📥 External stream request body:", externalBody);
  } catch (e) {
    console.log("❌ Invalid JSON format:", e);
    const response = NextResponse.json(
      { error: "Invalid JSON format" },
      { status: 400 }
    );
    return addStreamingCorsHeaders(response);
  }

  // Validate required fields
  if (!externalBody.chat_id || !externalBody.text) {
    console.log("❌ Missing required fields");
    const response = NextResponse.json(
      { error: "Missing required fields: chat_id and text" },
      { status: 400 }
    );
    return addStreamingCorsHeaders(response);
  }

  // Transform external format to internal format
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

  console.log("🔄 Transformed internal body for streaming:", internalBody);

  try {
    // Make request to internal chat API
    const chatApiRes = await fetch(`${getNextAuthUrl()}/api/api-chat-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(internalBody),
    });

    console.log(
      "📡 Internal chat API streaming response status:",
      chatApiRes.status
    );

    // Handle error responses
    if (!chatApiRes.ok) {
      console.log("❌ Internal API returned error status:", chatApiRes.status);

      try {
        const errorData = await chatApiRes.json();
        console.log("❌ Internal chat API error data:", errorData);
        const response = NextResponse.json(errorData, {
          status: chatApiRes.status,
        });
        return addStreamingCorsHeaders(response);
      } catch (parseError) {
        console.error("❌ Failed to parse error response:", parseError);
        const response = NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
        return addStreamingCorsHeaders(response);
      }
    }

    // Check if response is streaming
    const contentType = chatApiRes.headers.get("content-type");
    console.log("🔍 Internal API Response Content-Type:", contentType);

    if (contentType?.includes("application/json")) {
      // Handle non-streaming JSON responses
      console.log("📦 Handling non-streaming JSON response");
      const data = await chatApiRes.json();

      if (data.message && data.message.parts) {
        // Convert JSON response to streaming format with custom parts
        let parts = [...data.message.parts];

        // Parse the text content for JSON fragments if it exists
        const textPart = parts.find((part) => part.type === "text");
        if (textPart) {
          console.log(
            "🔍 Parsing non-streaming text part for JSON fragments..."
          );
          const parseResult = parseAccumulatedText(textPart.text);

          console.log(`✨ Non-streaming parsing results:`, {
            originalTextLength: textPart.text.length,
            cleanTextLength: parseResult.cleanText.length,
            dataPartsFound: parseResult.dataParts.length,
            dataPartTypes: parseResult.dataParts.map((p) => p.type),
          });

          // Replace text part with clean text and add data parts
          parts = parts.filter((part) => part.type !== "text");

          if (parseResult.cleanText) {
            parts.unshift({
              type: "text",
              text: parseResult.cleanText,
            });
          }

          parts.push(...parseResult.dataParts);
        }

        const streamingMessage: StreamingMessage = {
          type: "append-message",
          message: {
            id: data.message.id || generateCuid(),
            role: "assistant",
            createdAt: data.message.createdAt || new Date().toISOString(),
            parts: parts,
          },
        };

        // Create a simple stream with single message
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(
              encoder.encode(createSSEMessage(streamingMessage))
            );
            controller.close();
          },
        });

        console.log(
          "✅ Non-streaming response processed and converted to stream"
        );
        return createStreamingResponse(stream);
      }
    }

    // Handle streaming response - create transform stream
    console.log("🌊 Processing streaming response with clean-text strategy...");

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
    let chunkCount = 0;
    let isStreamComplete = false;

    const transformStream = new ReadableStream({
      async start(controller) {
        console.log(
          "🔄 Starting streaming with clean-text strategy (JSON removed from intermediate chunks)..."
        );

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log(`🏁 Streaming completed after ${chunkCount} chunks`);
              console.log(
                `📊 Total accumulated text length: ${accumulatedText.length}`
              );

              // Send final message with complete parsing and data parts
              if (accumulatedText && !isStreamComplete) {
                console.log(
                  "🔍 Processing final accumulated text with complete parsing..."
                );
                const parseResult = parseAccumulatedText(accumulatedText);

                console.log(`✨ Final parsing results:`, {
                  originalTextLength: accumulatedText.length,
                  cleanTextLength: parseResult.cleanText.length,
                  dataPartsFound: parseResult.dataParts.length,
                  dataPartTypes: parseResult.dataParts.map((p) => p.type),
                  dataPartDetails: parseResult.dataParts.map((p) => ({
                    type: p.type,
                    id: p.id,
                    dataKeys: Object.keys(p.data),
                  })),
                });

                const parts: Array<
                  { type: "text"; text: string } | CustomDataPart
                > = [];

                // Add text part if there's clean text
                if (parseResult.cleanText) {
                  parts.push({
                    type: "text",
                    text: parseResult.cleanText,
                  });
                }

                // Add validated data parts
                parts.push(...parseResult.dataParts);

                const finalStreamingMessage: StreamingMessage = {
                  type: "update-message",
                  message: {
                    id: messageId,
                    role: "assistant",
                    createdAt: createdAt,
                    parts: parts,
                  },
                };

                const finalSSEMessage = createSSEMessage(finalStreamingMessage);
                controller.enqueue(encoder.encode(finalSSEMessage));

                console.log(
                  `✅ Final message sent with ${parseResult.dataParts.length} validated data parts`
                );
              }

              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            chunkCount++;

            // Parse each line in the chunk
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (!line.trim()) continue;

              const parsed = parseInternalChunk(line);

              // Handle text content
              if (parsed.text) {
                accumulatedText += parsed.text;

                // FOR INTERMEDIATE MESSAGES: Remove ALL JSON fragments (including incomplete)
                const cleanTextForStreaming =
                  removeAllJsonFragments(accumulatedText);

                // Create streaming message WITHOUT data parts during streaming
                // Send ONLY clean text, remove all JSON fragments (even incomplete)
                const streamingMessage: StreamingMessage = {
                  type: isFirstChunk ? "append-message" : "update-message",
                  message: {
                    id: messageId,
                    role: "assistant",
                    createdAt: createdAt,
                    parts: [
                      {
                        type: "text",
                        text: cleanTextForStreaming, // Clean text WITHOUT any JSON
                      },
                    ],
                  },
                };

                // Send chunk to client
                const sseMessage = createSSEMessage(streamingMessage);
                controller.enqueue(encoder.encode(sseMessage));

                if (isFirstChunk) {
                  isFirstChunk = false;
                  console.log(
                    "📤 Sent first streaming chunk with clean text (JSON fragments removed)"
                  );
                }

                // Log progress every 10 text chunks
                if (chunkCount % 10 === 0) {
                  console.log(
                    `📊 Streamed ${chunkCount} chunks, original: ${accumulatedText.length} chars, clean: ${cleanTextForStreaming.length} chars`
                  );
                }
              }

              // Handle metadata
              if (parsed.messageId) {
                messageId = parsed.messageId;
                console.log("🆔 Updated messageId:", messageId);
              }

              // Handle completion
              if (parsed.isComplete) {
                console.log(
                  "🏁 Stream completion detected, processing final parsing..."
                );
                console.log(
                  `📊 Total accumulated text length: ${accumulatedText.length}`
                );

                isStreamComplete = true;

                // Parse final accumulated text and send complete message with data parts
                const parseResult = parseAccumulatedText(accumulatedText);

                console.log(`✨ Completion parsing results:`, {
                  originalTextLength: accumulatedText.length,
                  cleanTextLength: parseResult.cleanText.length,
                  dataPartsFound: parseResult.dataParts.length,
                  dataPartTypes: parseResult.dataParts.map((p) => p.type),
                  dataPartDetails: parseResult.dataParts.map((p) => ({
                    type: p.type,
                    id: p.id,
                    dataKeys: Object.keys(p.data),
                  })),
                });

                const parts: Array<
                  { type: "text"; text: string } | CustomDataPart
                > = [];

                // Add text part if there's clean text
                if (parseResult.cleanText) {
                  parts.push({
                    type: "text",
                    text: parseResult.cleanText,
                  });
                }

                // Add validated data parts
                parts.push(...parseResult.dataParts);

                const finalStreamingMessage: StreamingMessage = {
                  type: "update-message",
                  message: {
                    id: messageId,
                    role: "assistant",
                    createdAt: createdAt,
                    parts: parts,
                  },
                };

                const finalSSEMessage = createSSEMessage(finalStreamingMessage);
                controller.enqueue(encoder.encode(finalSSEMessage));

                console.log(
                  `✅ Completion message sent with ${parseResult.dataParts.length} validated data parts`
                );

                break;
              }
            }
          }

          console.log(
            `📈 Final streaming result: ${accumulatedText.length} characters processed in ${chunkCount} chunks`
          );
          controller.close();
        } catch (error) {
          console.error("❌ Error during streaming transformation:", error);

          // Send error as SSE
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
          console.log("🔓 Stream reader released");
        }
      },
    });

    return createStreamingResponse(transformStream);
  } catch (error) {
    console.error("❌ Error in stream chat API:", error);

    // Return error as JSON for non-streaming errors
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
