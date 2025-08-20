// @/app/integrations/api/external-ai-assiatant/external-frontend/stream-chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";
import { generateCuid } from "@/lib/utils/generateCuid";

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
 * Custom data part types for AI SDK v5 compatibility
 */
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
    console.log("Failed to parse internal chunk:", line.substring(0, 100));
    return {};
  }
}

/**
 * Extract JSON objects from text with proper nesting support
 */
function findJsonObjects(
  text: string,
  targetType: string
): Array<{ match: string; start: number; end: number }> {
  const results = [];
  const searchPattern = `"type":"${targetType}"`;
  let searchStart = 0;

  while (true) {
    const typeIndex = text.indexOf(searchPattern, searchStart);
    if (typeIndex === -1) break;

    // Найти начало JSON объекта (ищем { перед "type")
    let jsonStart = typeIndex;
    while (jsonStart > 0 && text[jsonStart] !== "{") {
      jsonStart--;
    }

    if (jsonStart === 0 && text[jsonStart] !== "{") {
      searchStart = typeIndex + searchPattern.length;
      continue;
    }

    // Найти конец JSON объекта с учетом вложенности
    let braceCount = 0;
    let jsonEnd = jsonStart;
    let inString = false;
    let escaped = false;

    for (let i = jsonStart; i < text.length; i++) {
      const char = text[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === "{") {
          braceCount++;
        } else if (char === "}") {
          braceCount--;
          if (braceCount === 0) {
            jsonEnd = i;
            break;
          }
        }
      }
    }

    if (braceCount === 0) {
      const jsonStr = text.substring(jsonStart, jsonEnd + 1);
      results.push({
        match: jsonStr,
        start: jsonStart,
        end: jsonEnd + 1,
      });
    }

    searchStart = jsonEnd + 1;
  }

  return results;
}

/**
 * Extract custom data parts from text and return cleaned text
 */
function extractCustomDataParts(text: string): {
  cleanText: string;
  products: CustomDataPart[];
  suggestions: CustomDataPart[];
} {
  const products: CustomDataPart[] = [];
  const suggestions: CustomDataPart[] = [];

  console.log(
    "🔍 Extracting from text (first 200 chars):",
    text.substring(0, 200)
  );

  // Найти все JSON объекты продуктов
  const productObjects = findJsonObjects(text, "data-product");
  console.log("📦 Found product objects:", productObjects.length);

  // Найти все JSON объекты предложений
  const suggestionObjects = findJsonObjects(text, "data-suggestion");
  console.log("💡 Found suggestion objects:", suggestionObjects.length);

  // Собрать все объекты для удаления
  const allObjects = [...productObjects, ...suggestionObjects].sort(
    (a, b) => b.start - a.start
  ); // Сортируем в обратном порядке для корректного удаления

  let cleanText = text;

  // Удалить все JSON объекты из текста
  for (const obj of allObjects) {
    cleanText =
      cleanText.substring(0, obj.start) + cleanText.substring(obj.end);
  }

  // Парсить продукты
  productObjects.forEach((obj, index) => {
    try {
      const parsed = JSON.parse(obj.match);
      products.push({
        type: "data-product",
        id: parsed.id || `product-${index + 1}`,
        data: {
          product_id: parsed.data?.product_id || "",
        },
      });
      console.log("✅ Parsed product:", parsed.data?.product_id);
    } catch (e) {
      console.log("❌ Failed to parse product JSON:", obj.match);
    }
  });

  // Парсить предложения
  suggestionObjects.forEach((obj, index) => {
    try {
      const parsed = JSON.parse(obj.match);
      suggestions.push({
        type: "data-suggestion",
        id: parsed.id || `suggestion-${index + 1}`,
        data: {
          suggestion_id: parsed.data?.suggestion_id || "",
        },
      });
      console.log("✅ Parsed suggestion:", parsed.data?.suggestion_id);
    } catch (e) {
      console.log("❌ Failed to parse suggestion JSON:", obj.match);
    }
  });

  // Очистка лишних пробелов
  cleanText = cleanText
    .replace(/\s+/g, " ")
    .replace(/\s+([.!?])/g, "$1")
    .trim();

  console.log("🧹 Clean text (first 200 chars):", cleanText.substring(0, 200));
  console.log("📊 Extraction results:", {
    products: products.length,
    suggestions: suggestions.length,
    originalLength: text.length,
    cleanLength: cleanText.length,
  });

  return { cleanText, products, suggestions };
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
  console.log("Stream API OPTIONS preflight request received");
  const response = new NextResponse(null, { status: 200 });
  return addStreamingCorsHeaders(response);
}

/**
 * Handle POST request with real-time streaming
 */
export async function POST(req: NextRequest) {
  console.log("POST request received to external stream chat API");

  // Authorization validation
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Missing or invalid Authorization header");
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
    console.log("Token validated successfully");
  } catch (e) {
    console.log("Invalid or expired token:", e);
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
    console.log("External stream request body:", externalBody);
  } catch (e) {
    console.log("Invalid JSON format:", e);
    const response = NextResponse.json(
      { error: "Invalid JSON format" },
      { status: 400 }
    );
    return addStreamingCorsHeaders(response);
  }

  // Validate required fields
  if (!externalBody.chat_id || !externalBody.text) {
    console.log("Missing required fields");
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

  console.log("Transformed internal body for streaming:", internalBody);

  try {
    // Make request to internal chat API
    const chatApiRes = await fetch(`${getNextAuthUrl()}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(internalBody),
    });

    console.log(
      "Internal chat API streaming response status:",
      chatApiRes.status
    );

    // Handle error responses
    if (!chatApiRes.ok) {
      console.log("Internal API returned error status:", chatApiRes.status);

      try {
        const errorData = await chatApiRes.json();
        console.log("Internal chat API error data:", errorData);
        const response = NextResponse.json(errorData, {
          status: chatApiRes.status,
        });
        return addStreamingCorsHeaders(response);
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
        const response = NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
        return addStreamingCorsHeaders(response);
      }
    }

    // Check if response is streaming
    const contentType = chatApiRes.headers.get("content-type");
    console.log("Internal API Response Content-Type:", contentType);

    if (contentType?.includes("application/json")) {
      // Handle non-streaming JSON responses
      console.log("Handling non-streaming JSON response");
      const data = await chatApiRes.json();

      if (data.message && data.message.parts) {
        // Extract custom parts from text content
        const textPart = data.message.parts.find(
          (part: any) => part.type === "text"
        );
        let customProducts: CustomDataPart[] = [];
        let customSuggestions: CustomDataPart[] = [];
        let cleanText = "";

        if (textPart?.text) {
          const extracted = extractCustomDataParts(textPart.text);
          customProducts = extracted.products;
          customSuggestions = extracted.suggestions;
          cleanText = extracted.cleanText;
        }

        // Convert JSON response to streaming format with extracted custom parts
        const streamingMessage: StreamingMessage = {
          type: "append-message",
          message: {
            id: data.message.id || generateCuid(),
            role: "assistant",
            createdAt: data.message.createdAt || new Date().toISOString(),
            parts: [
              {
                type: "text",
                text: cleanText,
              },
              ...customProducts,
              ...customSuggestions,
            ],
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

        return createStreamingResponse(stream);
      }
    }

    // Handle streaming response - create transform stream
    console.log("Processing streaming response from internal API...");

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

    // Накопители для custom data parts
    let allProducts: CustomDataPart[] = [];
    let allSuggestions: CustomDataPart[] = [];

    const transformStream = new ReadableStream({
      async start(controller) {
        console.log("Starting streaming transformation...");

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log(`Streaming completed after ${chunkCount} chunks`);

              // Send final message with all custom parts when stream is complete
              if (accumulatedText && !isStreamComplete) {
                // Extract any remaining data from final accumulated text
                const finalExtracted = extractCustomDataParts(accumulatedText);

                // Merge with accumulated parts (avoid duplicates by checking IDs)
                const existingProductIds = allProducts.map((p) => p.id);
                const existingSuggestionIds = allSuggestions.map((s) => s.id);

                finalExtracted.products.forEach((product) => {
                  if (!existingProductIds.includes(product.id)) {
                    allProducts.push(product);
                  }
                });

                finalExtracted.suggestions.forEach((suggestion) => {
                  if (!existingSuggestionIds.includes(suggestion.id)) {
                    allSuggestions.push(suggestion);
                  }
                });

                const finalStreamingMessage: StreamingMessage = {
                  type: "update-message",
                  message: {
                    id: messageId,
                    role: "assistant",
                    createdAt: createdAt,
                    parts: [
                      {
                        type: "text",
                        text: finalExtracted.cleanText,
                      },
                      ...allProducts,
                      ...allSuggestions, // Suggestions только в финальном сообщении
                    ],
                  },
                };

                const finalSSEMessage = createSSEMessage(finalStreamingMessage);
                controller.enqueue(encoder.encode(finalSSEMessage));
                console.log(
                  `✅ Sent final message with ${allProducts.length} products and ${allSuggestions.length} suggestions`
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

                // Extract custom data parts from current accumulated text
                const extracted = extractCustomDataParts(accumulatedText);

                // Update accumulated products (add new ones only)
                const existingProductIds = allProducts.map((p) => p.id);
                extracted.products.forEach((product) => {
                  if (!existingProductIds.includes(product.id)) {
                    allProducts.push(product);
                  }
                });

                // Accumulate suggestions for final message only
                const existingSuggestionIds = allSuggestions.map((s) => s.id);
                extracted.suggestions.forEach((suggestion) => {
                  if (!existingSuggestionIds.includes(suggestion.id)) {
                    allSuggestions.push(suggestion);
                  }
                });

                // Create streaming message with clean text and current products (NO suggestions during streaming)
                const streamingMessage: StreamingMessage = {
                  type: isFirstChunk ? "append-message" : "update-message",
                  message: {
                    id: messageId,
                    role: "assistant",
                    createdAt: createdAt,
                    parts: [
                      {
                        type: "text",
                        text: extracted.cleanText,
                      },
                      ...allProducts, // Продукты добавляем сразу
                    ],
                  },
                };

                // Send chunk to client
                const sseMessage = createSSEMessage(streamingMessage);
                controller.enqueue(encoder.encode(sseMessage));

                if (isFirstChunk) {
                  isFirstChunk = false;
                  console.log("✅ Sent first streaming chunk to client");
                }

                // Log progress every 10 text chunks
                if (chunkCount % 10 === 0) {
                  console.log(
                    `📊 Streamed ${chunkCount} chunks, clean text length: ${extracted.cleanText.length}, products: ${allProducts.length}, suggestions: ${allSuggestions.length}`
                  );
                }
              }

              // Handle metadata
              if (parsed.messageId) {
                messageId = parsed.messageId;
                console.log("Updated messageId:", messageId);
              }

              // Handle completion
              if (parsed.isComplete) {
                console.log("✅ Stream completion detected");
                isStreamComplete = true;

                // Extract final data parts from accumulated text
                const finalExtracted = extractCustomDataParts(accumulatedText);

                // Merge any remaining data
                const existingProductIds = allProducts.map((p) => p.id);
                const existingSuggestionIds = allSuggestions.map((s) => s.id);

                finalExtracted.products.forEach((product) => {
                  if (!existingProductIds.includes(product.id)) {
                    allProducts.push(product);
                  }
                });

                finalExtracted.suggestions.forEach((suggestion) => {
                  if (!existingSuggestionIds.includes(suggestion.id)) {
                    allSuggestions.push(suggestion);
                  }
                });

                // Send final message with ALL custom parts including suggestions
                const finalStreamingMessage: StreamingMessage = {
                  type: "update-message",
                  message: {
                    id: messageId,
                    role: "assistant",
                    createdAt: createdAt,
                    parts: [
                      {
                        type: "text",
                        text: finalExtracted.cleanText,
                      },
                      ...allProducts,
                      ...allSuggestions, // Suggestions только в финальном сообщении
                    ],
                  },
                };

                const finalSSEMessage = createSSEMessage(finalStreamingMessage);
                controller.enqueue(encoder.encode(finalSSEMessage));
                console.log(
                  `✅ Sent completion message with ${allProducts.length} products and ${allSuggestions.length} suggestions`
                );
                break;
              }
            }
          }

          console.log(
            `🎯 Final streaming result: clean text length: ${accumulatedText.length} characters sent in ${chunkCount} chunks with ${allProducts.length} products and ${allSuggestions.length} suggestions`
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
