// @/app/integrations/api/external-ai-assiatant/external-frontend/chat/route.ts

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
 * Standard response format for external API according to documentation
 */
interface StandardApiResponse {
  type: "append-message";
  message: {
    id: string;
    role: "assistant";
    createdAt: string;
    parts: Array<{
      type: "text";
      text: string;
    }>;
  };
}

/**
 * Add CORS headers to response
 */
function addCorsHeaders(response: NextResponse) {
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
 * Parse streaming chunk and extract text content
 */
function parseStreamingChunk(line: string): {
  text?: string;
  data?: any;
  messageId?: string;
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
      return { data, messageId: data.messageId };
    }

    // Handle Server-Sent Events format (data: {...})
    if (line.startsWith("data: ")) {
      const jsonStr = line.substring(6);
      if (jsonStr === "[DONE]") return {};
      const data = JSON.parse(jsonStr);
      return { data };
    }

    // Handle streaming format with type prefix (8:{"type":"text-delta","textDelta":"Hello"})
    if (line.includes(':{"')) {
      const colonIndex = line.indexOf(":");
      const jsonStr = line.substring(colonIndex + 1);
      const data = JSON.parse(jsonStr);

      if (data.type === "text-delta" && data.textDelta) {
        return { text: data.textDelta };
      }
      if (data.type === "text" && data.text) {
        return { text: data.text };
      }
      return { data };
    }

    // Handle plain JSON objects
    if (line.startsWith("{") && line.endsWith("}")) {
      const data = JSON.parse(line);

      // Extract text from various formats
      if (data.type === "text-delta" && data.textDelta) {
        return { text: data.textDelta };
      }
      if (data.type === "text" && data.text) {
        return { text: data.text };
      }
      if (data.type === "append-message" && data.message) {
        return { data };
      }
      if (data.role === "assistant" && data.parts) {
        return { data };
      }

      return { data };
    }

    return {};
  } catch (error) {
    console.log(
      "Failed to parse chunk:",
      line.substring(0, 100),
      "Error:",
      error
    );
    return {};
  }
}

/**
 * Extract AI response text and format according to documentation standard
 */
function extractAndFormatResponse(
  streamData: string
): StandardApiResponse | { error: string; rawData?: string } {
  console.log("Extracting and formatting AI response from stream data...");

  try {
    // Split stream data into lines and clean them
    const lines = streamData
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    console.log(`Processing ${lines.length} lines from stream`);

    let assistantText = "";
    let assistantId = "";
    let createdAt = "";
    let messageId = "";
    let foundParts: Array<{ type: "text"; text: string }> = [];

    // Process each line to extract content
    for (const line of lines) {
      const parsed = parseStreamingChunk(line);

      // Accumulate text chunks
      if (parsed.text) {
        assistantText += parsed.text;
        console.log("Added text chunk:", parsed.text.substring(0, 50));
      }

      // Extract message metadata
      if (parsed.messageId) {
        messageId = parsed.messageId;
        console.log("Found messageId:", messageId);
      }

      // Process structured data
      if (parsed.data) {
        const data = parsed.data;

        // Handle append-message format
        if (data.type === "append-message" && data.message) {
          let messageData = data.message;

          if (typeof messageData === "string") {
            messageData = JSON.parse(messageData);
          }

          if (messageData.role === "assistant") {
            assistantId = messageData.id || assistantId;
            createdAt = messageData.createdAt || createdAt;

            if (messageData.parts && Array.isArray(messageData.parts)) {
              const textParts = messageData.parts.filter(
                (part: any) => part.type === "text"
              );
              if (textParts.length > 0) {
                foundParts = textParts;
                // Don't override accumulated text unless it's empty
                if (!assistantText.trim()) {
                  assistantText = textParts
                    .map((part: any) => part.text)
                    .join("");
                }
                console.log("Found complete assistant message with parts");
              }
            }
          }
        }

        // Handle direct assistant message format
        if (data.role === "assistant") {
          assistantId = data.id || assistantId;
          createdAt = data.createdAt || createdAt;

          if (data.parts && Array.isArray(data.parts)) {
            const textParts = data.parts.filter(
              (part: any) => part.type === "text"
            );
            if (textParts.length > 0) {
              foundParts = textParts;
              if (!assistantText.trim()) {
                assistantText = textParts
                  .map((part: any) => part.text)
                  .join("");
              }
            }
          }
        }
      }
    }

    // Clean up accumulated text
    assistantText = assistantText.trim();

    console.log("Extraction results:", {
      textLength: assistantText.length,
      hasText: !!assistantText,
      partsCount: foundParts.length,
      hasId: !!assistantId,
      hasMessageId: !!messageId,
      hasTimestamp: !!createdAt,
    });

    // Check if we have any meaningful content
    if (assistantText || foundParts.length > 0) {
      // Create final parts array
      const finalParts =
        foundParts.length > 0
          ? foundParts
          : [{ type: "text" as const, text: assistantText }];

      // Use the best available ID
      const finalId = assistantId || messageId || generateCuid();

      const response: StandardApiResponse = {
        type: "append-message",
        message: {
          id: finalId,
          role: "assistant",
          createdAt: createdAt || new Date().toISOString(),
          parts: finalParts,
        },
      };

      console.log("Successfully created response:", {
        id: finalId,
        textLength: finalParts.reduce((sum, part) => sum + part.text.length, 0),
        partsCount: finalParts.length,
      });

      return response;
    }

    // If no meaningful content found, return detailed error
    console.log("No assistant content found in stream data");

    // Try to find any text patterns for debugging
    const debugInfo = lines
      .filter((line) => line.includes('"') || line.includes("text"))
      .slice(0, 5)
      .join(" | ");

    return {
      error: "No AI response text found in stream",
      rawData: debugInfo || streamData.substring(0, 500),
    };
  } catch (error) {
    console.error("Error extracting AI response:", error);
    return {
      error: `Failed to parse AI response: ${error instanceof Error ? error.message : "Unknown error"}`,
      rawData: streamData.substring(0, 500),
    };
  }
}

/**
 * Handle OPTIONS preflight request
 */
export async function OPTIONS(req: NextRequest) {
  console.log("OPTIONS preflight request received");
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}

/**
 * Handle POST request
 */
export async function POST(req: NextRequest) {
  console.log("POST request received to external chat API");

  // Authorization validation
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Missing or invalid Authorization header");
    const response = NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
    return addCorsHeaders(response);
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
    return addCorsHeaders(response);
  }

  // Parse external request body
  let externalBody: ExternalChatRequest;
  try {
    externalBody = await req.json();
    console.log("External request body:", externalBody);
  } catch (e) {
    console.log("Invalid JSON format:", e);
    const response = NextResponse.json(
      { error: "Invalid JSON format" },
      { status: 400 }
    );
    return addCorsHeaders(response);
  }

  // Validate required fields
  if (!externalBody.chat_id || !externalBody.text) {
    console.log("Missing required fields");
    const response = NextResponse.json(
      { error: "Missing required fields: chat_id and text" },
      { status: 400 }
    );
    return addCorsHeaders(response);
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

  console.log("Transformed internal body:", internalBody);

  // Proxy request to internal chat API with comprehensive streaming handling
  try {
    const chatApiRes = await fetch(`${getNextAuthUrl()}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(internalBody),
    });

    console.log("Internal chat API response status:", chatApiRes.status);

    // Handle error responses
    if (!chatApiRes.ok) {
      console.log("Internal API returned error status:", chatApiRes.status);

      try {
        const errorData = await chatApiRes.json();
        console.log("Internal chat API error data:", errorData);
        const response = NextResponse.json(errorData, {
          status: chatApiRes.status,
        });
        return addCorsHeaders(response);
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
        const response = NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
        return addCorsHeaders(response);
      }
    }

    const contentType = chatApiRes.headers.get("content-type");
    console.log("Response Content-Type:", contentType);

    // Handle JSON responses
    if (contentType?.includes("application/json")) {
      console.log("Handling JSON response");
      const data = await chatApiRes.json();
      console.log("Internal chat API JSON data:", data);

      if (data.message && data.message.parts) {
        const standardResponse: StandardApiResponse = {
          type: "append-message",
          message: {
            id: data.message.id || generateCuid(),
            role: "assistant",
            createdAt: data.message.createdAt || new Date().toISOString(),
            parts: data.message.parts,
          },
        };
        const response = NextResponse.json(standardResponse);
        return addCorsHeaders(response);
      }

      const response = NextResponse.json(data, { status: chatApiRes.status });
      return addCorsHeaders(response);
    }

    // Handle streaming responses
    console.log("Handling streaming response...");

    const reader = chatApiRes.body?.getReader();
    if (!reader) {
      throw new Error("No readable stream available from internal API");
    }

    const decoder = new TextDecoder();
    let fullResponse = "";
    let chunkCount = 0;

    try {
      console.log("Starting to read streaming chunks...");

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log(`Stream completed after ${chunkCount} chunks`);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        chunkCount++;

        // Log every 20th chunk to monitor progress
        if (chunkCount % 20 === 0) {
          console.log(
            `Received chunk ${chunkCount}, total length: ${fullResponse.length}`
          );
        }
      }

      console.log(`Full response collected: ${fullResponse.length} characters`);
      console.log("Sample from response:", fullResponse.substring(0, 200));

      // Extract and format the AI response
      const formattedResponse = extractAndFormatResponse(fullResponse);

      if ("error" in formattedResponse) {
        console.error(
          "Failed to extract AI response:",
          formattedResponse.error
        );

        // Provide more debugging information
        const lines = fullResponse.split("\n").slice(0, 10);
        console.log("First 10 lines for debugging:", lines);

        const response = NextResponse.json(
          {
            error: "Failed to extract AI response",
            details: formattedResponse.error,
            debug: formattedResponse.rawData,
            sampleLines: lines,
          },
          { status: 500 }
        );
        return addCorsHeaders(response);
      }

      console.log("Successfully formatted response");

      const response = NextResponse.json(formattedResponse);
      return addCorsHeaders(response);
    } finally {
      reader.releaseLock();
      console.log("Stream reader released");
    }
  } catch (error) {
    console.error("Error calling internal chat API:", error);

    const response = NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
