// File: /api/step5/generate-structure/route.ts
/**
 * Streaming endpoint for Step 5 content structure generation - AI SDK v4.
 * Returns a Data Stream response that the v4 client hooks can consume incrementally.
 * 
 * Body: { system: string, prompt: string, model?: string }
 */

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Optional: extend streaming time on Vercel
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { system, prompt, model } = await req.json() as {
      system: string;
      prompt: string;
      model?: string;
    };

    // Validation
    if (!system || typeof system !== "string") {
      return new Response(JSON.stringify({
        error: "System instruction is required and must be a string",
        received: { system: typeof system, length: system?.length },
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({
        error: "Prompt is required and must be a string", 
        received: { prompt: typeof prompt, length: prompt?.length },
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (system.length < 10) {
      return new Response(JSON.stringify({
        error: "System instruction is too short (minimum 10 characters)",
        length: system.length,
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Stream content structure generation
    const result = streamText({
      model: openai(model ?? "gpt-4.1-mini"),
      system,
      prompt,
      temperature: 0.2,
      maxTokens: 30000,
    });

    // AI SDK v4: use Data Stream helper
    return result.toDataStreamResponse();
    
  } catch (error: unknown) {
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
      errorMessage = String(errorObj.message) || "Object error";
      errorDetails = JSON.stringify(error);
    }

    return new Response(JSON.stringify({
      error: "Step5 API failed",
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
