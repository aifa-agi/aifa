// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/admin-pages/steps/step8/(_actions)/generate-section-mdx.ts
"use server";

/**
 * Step 8 - Server Action: generateSectionMDX
 * Generates MDX for a specific H2 section using AI SDK streamText (non-streaming return).
 *
 * Comments:
 * - Keep action self-contained (no project utils) to avoid dependency chains.
 * - Accept system/user built on the client side and return the full MDX at once.
 * - Uses temperature=0.5 and maxOutputTokens=30000 as requested.
 */

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export type GenerateSectionMDXInput = {
  pageId: string;
  sectionId: string;
  system: string;
  user: string;
  model?: string;
};

export type GenerateSectionMDXResult = {
  mdx: string;
  finishReason?:
    | "stop"
    | "length"
    | "content-filter"
    | "tool-calls"
    | "error"
    | "other"
    | "unknown";
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    reasoningTokens?: number;
    cachedInputTokens?: number;
  };
};

export async function generateSectionMDX(
  params: GenerateSectionMDXInput
): Promise<GenerateSectionMDXResult> {
  const { pageId, sectionId, system, user } = params ?? {};
  const modelName = params?.model ?? "gpt-4.1-mini";

  if (!pageId || !sectionId) {
    return { mdx: "", finishReason: "error" };
  }

  // Start the stream (we will still aggregate the final result for this action).
  const result = streamText({
    model: openai(modelName),
    system,
    prompt: user,
    temperature: 0.5,
    maxTokens: 30000,
  });

  // IMPORTANT: text/finishReason/usage are Promise properties, not functions.
  const [mdx, finishReason, usage] = await Promise.all([
    result.text,
    result.finishReason,
    result.usage,
  ]);

  return {
    mdx: (mdx ?? "").trim(),
    finishReason,
    usage,
  };
}
