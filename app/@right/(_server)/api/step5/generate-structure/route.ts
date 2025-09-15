// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_server)/api/generate/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    console.log("=== Step8 API Start ===");

    const body = await req.json();
    const { system, prompt, model } = body as {
      system: string;
      prompt: string;
      model?: string;
    };

    console.log("Request body keys:", Object.keys(body));
    console.log("System length:", system?.length || 0);
    console.log("Prompt length:", prompt?.length || 0);
    console.log("Model:", model || "gpt-4.1-mini");

    // Детальная валидация
    if (!system || typeof system !== "string") {
      console.error("❌ System instruction invalid:", {
        type: typeof system,
        length: system?.length,
      });
      return new Response(
        JSON.stringify({
          error: "System instruction is required and must be a string",
          received: { system: typeof system, length: system?.length },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!prompt || typeof prompt !== "string") {
      console.error("❌ Prompt invalid:", {
        type: typeof prompt,
        length: prompt?.length,
      });
      return new Response(
        JSON.stringify({
          error: "Prompt is required and must be a string",
          received: { prompt: typeof prompt, length: prompt?.length },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (system.length < 10) {
      console.error("❌ System instruction too short:", system.length);
      return new Response(
        JSON.stringify({
          error: "System instruction is too short (minimum 10 characters)",
          length: system.length,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("✅ Validation passed, starting OpenAI stream");

    // Используем enhanced error handling с правильной типизацией
    const result = streamText({
      model: openai(model ?? "gpt-4.1-mini"),
      system,
      prompt,
      temperature: 0.5,
      maxTokens: 30000,
    });

    console.log("✅ Streaming started, returning response");

    // AI SDK v4: используем toDataStreamResponse с обработкой ошибок
    return result.toDataStreamResponse({
      getErrorMessage: (error: unknown) => {
        console.error("❌ DataStream error:", error);

        // Правильная типизация error как unknown
        if (error instanceof Error) {
          return `Stream Error: ${error.message}`;
        } else if (typeof error === "string") {
          return `Stream Error: ${error}`;
        } else if (error && typeof error === "object" && "message" in error) {
          return `Stream Error: ${String((error as any).message)}`;
        } else {
          return "Unknown streaming error occurred";
        }
      },
    });
  } catch (error: unknown) {
    // Явно типизируем как unknown
    console.error("❌ Step8 API Critical Error:", error);

    // Правильная обработка unknown типа
    let errorMessage = "Unknown server error";
    let errorDetails = "No additional details available";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || error.toString();
    } else if (typeof error === "string") {
      errorMessage = error;
      errorDetails = error;
    } else if (error && typeof error === "object") {
      const errorObj = error as Record<string, unknown>;
      errorMessage = String(errorObj.message || "Object error");
      errorDetails = JSON.stringify(error);
    }

    return new Response(
      JSON.stringify({
        error: "Step8 API failed",
        message: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
