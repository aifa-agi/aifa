// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/admin-pages/steps/step8/(_actions)/regenerate-all-drafts.ts
"use server";

/**
 * Step 8 - Server Action: regenerateAllDrafts (enhanced system with page meta, language, SEO, and chain)
 * Understanding of the task (step-by-step):
 * 1) For each section i, build SYSTEM with:
 *    - Progress meta (total, completed indexes, current index + narrative directive).
 *    - LANGUAGE/MDX/SEMANTICS/SEO contracts.
 *    - Chain of previous saved/generated MDX with delimiter and WHY explanation.
 *    - Word count policy that ignores header limits and focuses on child elements.
 * 2) Use advisory min/max words; avoid truncation artifacts.
 * 3) Keep sequential chain: append each successful MDX to chainMDX.
 * 4) Return full MDX per section; no persistence here.
 */

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import type {
  RootContentStructure,
  SectionInfo,
} from "@/app/@right/(_service)/(_types)/page-types";

// Optional app config import for language
import { appConfig } from "@/config/appConfig";

export type RegenerateAllDraftsInput = {
  pageId: string;
  roots: RootContentStructure[];
  existingSections?: SectionInfo[];
  regenerateFromIndex?: number;
  model?: string;
  stopOnEmpty?: boolean;
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

function joinChain(chain: string[]): string {
  if (chain.length === 0) return "";
  return chain.join("\n\n{/* ---- previous section ---- */}\n\n");
}

function serializeBlueprint(section: RootContentStructure): string {
  const pick = (s: any): any => ({
    id: s?.id ?? null,
    order: s?.order ?? null,
    classification: s?.classification ?? null,
    tag: s?.tag ?? null,
    description: s?.description ?? null,
    keywords: Array.isArray(s?.keywords) ? s.keywords : [],
    intent: s?.intent ?? null,
    taxonomy: s?.taxonomy ?? null,
    attention: s?.attention ?? null,
    audiences: s?.audiences ?? null,
    selfPrompt: s?.selfPrompt ?? null,
    designDescription: s?.designDescription ?? null,
    connectedDesignSectionId: s?.connectedDesignSectionId ?? null,
    linksToSource: Array.isArray(s?.linksToSource) ? s.linksToSource : [],
    additionalData: {
      minWords: s?.additionalData?.minWords ?? 0,
      maxWords: s?.additionalData?.maxWords ?? 0,
    },
    status: s?.status ?? null,
    children: Array.isArray(s?.realContentStructure)
      ? s.realContentStructure.map((c: any) => pick(c))
      : [],
  });
  return JSON.stringify(pick(section), null, 2);
}

function buildPromptsForIndex(params: {
  roots: RootContentStructure[];
  index: number;
  chainMDX: string[];
  language: string;
}): { system: string; user: string } {
  const { roots, index, chainMDX, language } = params;
  const section = roots[index];
  const { writingStyle, contentFormat } = readOptionalStyleFields(section);

  const totalSections = roots.length;
  const completedIndexes = Array.from({ length: index }, (_, i) => i);

  const blueprint = serializeBlueprint(section);

  const pageProgress = [
    `PAGE PROGRESS CONTEXT:`,
    `- totalSections: ${totalSections}`,
    `- completedSectionsIndexes (0-based): [${completedIndexes.join(", ")}]`,
    `- currentSectionIndex (0-based): ${index}`,
    `Narrative directive: "Previously presented content covers sections ${
      completedIndexes.map((i) => i + 1).join(", ") || "none"
    }, now we generate section ${index + 1}, total ${totalSections} sections. Use this to maintain sequential exposition and cross-section continuity."`,
  ].join("\n");

  const languageContract = [
    `LANGUAGE CONTRACT:`,
    `- All output MUST be written in "${language}".`,
    `- Do NOT switch language unless explicitly required by the blueprint.`,
  ].join("\n");

  const mdxContract = [
    `MDX OUTPUT CONTRACT:`,
    `- Return ONLY valid MDX suitable for the Next.js MDX parser.`,
    `- Do NOT include explanations, pre/post text, or code fences.`,
    `- Do NOT duplicate the H2 title of the section.`,
    `- Start headings from H3 and below.`,
    `- Allowed tags: h3, h4, p, ul, ol, li, blockquote, code, table, thead, tbody, tr, td, th, img.`,
  ].join("\n");

  const wordCountPolicy = [
    `WORD COUNT POLICY:`,
    `- IGNORE minWords and maxWords requirements specified in headings (h2, h3, h4).`,
    `- The actual content size is determined by the sum of minWords/maxWords of child elements.`,
    `- If child elements have minWords=0 and maxWords=0, generate content at AI model discretion.`,
    `- Example: h3 with minWords=50, maxWords=100, containing two paragraphs each requiring 300 words should result in ~600 words total content.`,
  ].join("\n");

  const semanticsContract = [
    `SEMANTICS & BOUNDS CONTRACT:`,
    `- Follow the blueprint exactly for structure, child order and roles.`,
    `- Use taxonomy/attention/audiences/intent to shape tone, coverage and value.`,
    `- If linksToSource exist, integrate them as Markdown links where appropriate.`,
    `- Apply selfPrompt instructions if present in the section blueprint.`,
    writingStyle
      ? `- Writing style preference: ${String(writingStyle).trim()}`
      : "",
    contentFormat
      ? `- Desired content format: ${String(contentFormat).trim()}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const joined = joinChain(chainMDX);
  const chainCoherence = [
    `CHAIN COHERENCE (read-only context):`,
    `- Reason: enforce a unified tone of voice, avoid semantic duplication, and maintain a continuous flow of thought across the entire page.`,
    `Ensure stylistic and formatting coherence with all previously saved sections.`,
    nonEmpty(joined)
      ? `Previously saved sections (MDX, read-only context):\n${joined}`
      : `No previous sections saved.`,
  ].join("\n\n");

  const seoContract = [
    `SEO BEST PRACTICES:`,
    `- Target given keywords naturally; avoid keyword stuffing.`,
    `- Use semantically related terms and synonyms (LSI) to improve relevance.`,
    `- Keep headings (H3/H4) clear; ensure scannability with concise paragraphs and lists.`,
    `- Align with the section's intent, audiences and taxonomy to match search intent.`,
    `- Maintain internal consistency of terminology and avoid content duplication.`,
  ].join("\n");

  const sys = [
    `SECTION BLUEPRINT (read-only JSON):`,
    blueprint,
    "",
    pageProgress,
    "",
    languageContract,
    "",
    mdxContract,
    "",
    wordCountPolicy,
    "",
    semanticsContract,
    "",
    chainCoherence,
    "",
    seoContract,
    "",
    "Word count is decided by the model preferences; min/max are advisory and can be zero.",
  ].join("\n");

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
  if (nonEmpty(section.attention)) {
    userLines.push(`Attention: ${section.attention!.trim()}`);
  }
  if (nonEmpty(section.taxonomy)) {
    userLines.push(`Taxonomy: ${section.taxonomy!.trim()}`);
  }
  if (nonEmpty(section.attention)) {
    userLines.push(`Attention focus: ${section.attention!.trim()}`);
  }
  if (nonEmpty(section.audiences)) {
    userLines.push(`Target audiences: ${section.audiences!.trim()}`);
  }
  if (nonEmpty(section.selfPrompt)) {
    userLines.push(`Self Prompt: ${section.selfPrompt!.trim()}`);
  }

  return {
    system: sys,
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
  const language = (appConfig as any)?.lang ?? "ru";

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

  const byId = indexSections(existingSections);
  const unlocked = computeUnlockedIndex(roots, byId);
  const startIndex =
    typeof regenerateFromIndex === "number" && regenerateFromIndex >= 0
      ? regenerateFromIndex
      : unlocked;

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
      language,
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
        errors.push({ sectionId: id, index: i, message: "Empty MDX result" });
        if (stopOnEmpty) break;
        continue;
      }

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
