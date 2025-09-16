// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_server)/api/generate/route.ts
/**
 * Streaming endpoint for Step 8 section generation (AI SDK v4).
 * Returns a Data Stream response that the v4 client hooks can consume incrementally.
 *
 * Body: { system: string, prompt: string, model?: string }
 */

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Optional: extend streaming time on Vercel
export const maxDuration = 300;

export async function POST(req: Request) {
  const { system, prompt, model } = (await req.json()) as {
    system: string;
    prompt: string;
    model?: string;
  };

  const result = streamText({
    model: openai(model ?? "gpt-4.1-mini"),
    system,
    prompt,
    temperature: 0.5,
    maxTokens: 30000,
  });

  // AI SDK v4: use Data Stream helper
  return result.toDataStreamResponse();
}
