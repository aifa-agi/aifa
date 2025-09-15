// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/admin-pages/steps/step8/(_actions)/regenerate-all-drafts.ts
"use server";

/**
 * Step 8 - Server Action: regenerateAllDrafts
 * Mass-regenerates MDX for H2 sections sequentially with style-coherent chain.
 *
 * Understanding of the task (step-by-step):
 * 1) Input roots are the ordered H2 sections (RootContentStructure[]) representing the page's sections.
 * 2) We compute the unlocked index from existing sections (non-empty tempMDXContent).
 * 3) We start regeneration from `regenerateFromIndex` (defaults to unlocked index) and go sequentially to the end.
 * 4) For each section i, the system prompt includes: selfPrompt, optional writingStyle/contentFormat,
 *    the advisory word count policy, the style coherence hint, and MDX chain of previously saved/generated sections [0..i-1].
 * 5) We use OpenAI via AI SDK streamText and aggregate the full MDX (non-stream return in this action).
 * 6) No persistence here. The caller should optimistically save to PageData.sections[].tempMDXContent and handle rollback.
 *
 * Notes:
 * - UI strings and comments are in English (US).
 * - Model defaults: gpt-4.1-mini, temperature=0.5, maxTokens=30000.
 * - We keep this action self-contained (no client hooks), mirroring the client-side prompt policy.
 */

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import type {
  RootContentStructure,
  SectionInfo,
} from "@/app/@right/(_service)/(_types)/page-types";

export type RegenerateAllDraftsInput = {
  pageId: string;
  roots: RootContentStructure[];
  existingSections?: SectionInfo[]; // to read saved tempMDXContent
  regenerateFromIndex?: number; // default: unlockedIndex (count of non-empty saved MDX)
  model?: string; // default: "gpt-4.1-mini"
  stopOnEmpty?: boolean; // default: true -> stop batch if a generation returns empty
};

export type RegenerateAllDraftsSectionResult = {
  sectionId: string;
  index: number;
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

export type RegenerateAllDraftsError = {
  sectionId: string;
  index: number;
  message: string;
};

export type RegenerateAllDraftsResult = {
  pageId: string;
  results: RegenerateAllDraftsSectionResult[];
  errors: RegenerateAllDraftsError[];
  meta: {
    model: string;
    startedFromIndex: number;
    totalCount: number;
    completedCount: number;
    coverageAfter?: number;
  };
};

// Helpers

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readOptionalStyleFields(section: RootContentStructure): {
  writingStyle?: string;
  contentFormat?: string;
} {
  const anySec = section as unknown as {
    writingStyle?: string;
    contentFormat?: string;
  };
  return {
    writingStyle: anySec?.writingStyle,
    contentFormat: anySec?.contentFormat,
  };
}

function indexSections(
  sections: SectionInfo[] | undefined
): Map<string, SectionInfo> {
  const map = new Map<string, SectionInfo>();
  (sections ?? []).forEach((s) => {
    if (s?.id) map.set(s.id, s);
  });
  return map;
}

/** Count how many leading sections have non-empty saved MDX (defines unlockedIndex). */
function computeUnlockedIndex(
  roots: RootContentStructure[],
  byId: Map<string, SectionInfo>
): number {
  let count = 0;
  for (let i = 0; i < roots.length; i += 1) {
    const id = roots[i]?.id;
    if (!id) break;
    const mdx = byId.get(id)?.tempMDXContent ?? "";
    if (nonEmpty(mdx)) count += 1;
    else break;
  }
  return count;
}

/** Join previous MDX chain with safe MDX comment delimiter. */
function joinChain(chain: string[]): string {
  if (chain.length === 0) return "";
  return chain.join("\n\n{/* ---- previous section ---- */}\n\n");
}

/** Build system and user prompts for section i using saved/generated chain. */
function buildPromptsForIndex(params: {
  roots: RootContentStructure[];
  index: number;
  chainMDX: string[];
}): { system: string; user: string } {
  const { roots, index, chainMDX } = params;
  const section = roots[index];
  const { writingStyle, contentFormat } = readOptionalStyleFields(section);

  const sys: string[] = [];

  // Base self prompt
  if (nonEmpty(section.selfPrompt)) {
    sys.push(String(section.selfPrompt).trim());
  }

  // Style and format hints
  if (nonEmpty(writingStyle)) {
    sys.push(`Writing style preference: ${String(writingStyle).trim()}`);
  }
  if (nonEmpty(contentFormat)) {
    sys.push(`Desired content format: ${String(contentFormat).trim()}`);
  }

  // Advisory word count policy
  sys.push(
    "Word count is decided by the model preferences; min/max are advisory and can be zero."
  );

  // Coherence with previously saved/generated sections
  sys.push(
    "Ensure stylistic and formatting coherence with all previously saved sections."
  );

  // Include read-only MDX context for previous sections
  const joined = joinChain(chainMDX);
  if (nonEmpty(joined)) {
    sys.push("Previously saved sections (MDX, read-only context):");
    sys.push(joined);
  }

  // Minimal informative user seed from section meta
  const userLines: string[] = [
    "Generate high-quality MDX for the current section (H2).",
    "Preserve heading levels and keep consistent formatting.",
  ];
  if (nonEmpty(section.description)) {
    userLines.push(`Section description: ${section.description!.trim()}`);
  }
  if (Array.isArray(section.keywords) && section.keywords.length > 0) {
    userLines.push(`Keywords: ${section.keywords.join(", ")}`);
  }
  if (nonEmpty(section.intent)) {
    userLines.push(`Intent: ${section.intent!.trim()}`);
  }
  if (nonEmpty(section.audiences)) {
    userLines.push(`Target audiences: ${section.audiences!.trim()}`);
  }

  return {
    system: sys.join("\n\n"),
    user: userLines.join("\n"),
  };
}

export async function regenerateAllDrafts(
  input: RegenerateAllDraftsInput
): Promise<RegenerateAllDraftsResult> {
  const {
    pageId,
    roots,
    existingSections,
    regenerateFromIndex,
    model,
    stopOnEmpty = true,
  } = input ?? {};

  const modelName = model ?? "gpt-4.1-mini";

  if (!pageId || !Array.isArray(roots) || roots.length === 0) {
    return {
      pageId: pageId ?? "",
      results: [],
      errors: [
        {
          sectionId: "",
          index: -1,
          message: "Invalid inputs: pageId or roots are missing.",
        },
      ],
      meta: {
        model: modelName,
        startedFromIndex: 0,
        totalCount: 0,
        completedCount: 0,
      },
    };
  }

  // Build index for saved MDX
  const byId = indexSections(existingSections);
  // Default start index equals unlockedIndex (count of leading non-empty MDX)
  const unlocked = computeUnlockedIndex(roots, byId);
  const startIndex =
    typeof regenerateFromIndex === "number" && regenerateFromIndex >= 0
      ? regenerateFromIndex
      : unlocked;

  // Initialize chain with saved MDX for indices < startIndex
  const chainMDX: string[] = [];
  for (let i = 0; i < Math.min(startIndex, roots.length); i += 1) {
    const id = roots[i]?.id;
    if (!id) continue;
    const mdx = byId.get(id)?.tempMDXContent ?? "";
    if (nonEmpty(mdx)) chainMDX.push(mdx.trim());
  }

  const results: RegenerateAllDraftsSectionResult[] = [];
  const errors: RegenerateAllDraftsError[] = [];

  for (let i = startIndex; i < roots.length; i += 1) {
    const id = roots[i]?.id ?? "";
    if (!id) {
      errors.push({
        sectionId: "",
        index: i,
        message: "Missing section id at index.",
      });
      if (stopOnEmpty) break;
      continue;
    }

    const { system, user } = buildPromptsForIndex({
      roots,
      index: i,
      chainMDX,
    });

    try {
      const stream = streamText({
        model: openai(modelName),
        system,
        prompt: user,
        temperature: 0.5,
        maxTokens: 30000,
      });

      const [mdx, finishReason, usage] = await Promise.all([
        stream.text,
        stream.finishReason,
        stream.usage,
      ]);

      const normalized = (mdx ?? "").trim();

      if (!nonEmpty(normalized)) {
        errors.push({
          sectionId: id,
          index: i,
          message: "Empty MDX result",
        });
        if (stopOnEmpty) break;
        // Do not push to chain if empty
        continue;
      }

      // Append to chain for coherence in subsequent sections
      chainMDX.push(normalized);

      results.push({
        sectionId: id,
        index: i,
        mdx: normalized,
        finishReason,
        usage,
      });
    } catch (e: any) {
      errors.push({
        sectionId: id,
        index: i,
        message: e?.message ?? "Generation failed",
      });
      if (stopOnEmpty) break;
    }
  }

  const totalCount = roots.length;
  const completedCount = results.length + Math.min(startIndex, totalCount);
  const coverageAfter =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    pageId,
    results,
    errors,
    meta: {
      model: modelName,
      startedFromIndex: startIndex,
      totalCount,
      completedCount,
      coverageAfter,
    },
  };
}
