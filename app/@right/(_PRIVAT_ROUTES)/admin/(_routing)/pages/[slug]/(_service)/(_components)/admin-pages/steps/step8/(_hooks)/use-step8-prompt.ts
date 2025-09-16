// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_hooks)/use-step8-prompt.ts
"use client";

/**
 * Step 8 - Prompt hook (schema-driven, with chain, SEO, and page meta):
 * Understanding of the task (step-by-step):
 * 1) Build a strict SYSTEM instruction that includes:
 *    - Serialized section blueprint (RootContentStructure + children).
 *    - Page progress meta: totalSections, completedSectionsIndexes (0-based), currentSectionIndex.
 *    - LANGUAGE CONTRACT: enforce appConfig.lang with safe fallback.
 *    - HTML OUTPUT CONTRACT: valid HTML only, start from H3, allowed tags list.
 *    - SEMANTICS & BOUNDS CONTRACT: follow blueprint order, advisory min/max words, intent/audiences/taxonomy, style/format hints.
 *    - CHAIN COHERENCE: inject previous HTML (read-only), explain WHY chain is included.
 *    - SEO BEST PRACTICES: natural keywords usage, LSI/synonyms, headings clarity and scannability, no keyword stuffing.
 *    - WORD COUNT POLICY: ignore header word limits, count child elements' words instead.
 * 2) Build a concise USER seed from description/keywords/intent/audiences.
 * 3) Preserve existing streaming/one-shot flows; do not mutate PageData here.
 * 4) Keep hooks usage valid: do NOT call hooks inside callbacks; use closures from this hook scope only.
 */

import * as React from "react";
import { toast } from "sonner";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import type {
  RootContentStructure,
  SectionInfo,
  ContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { STEP8_IDS } from "../(_constants)/step8-ids";

// Optional app config import for language; keep safe fallback if not present.
import { appConfig } from "@/config/appConfig";

export interface Step8PromptParts {
  system: string;
  user: string;
  meta: {
    sectionId: string;
    sectionIndex: number;
    previousMDXCount: number;
    totalSections: number;
    completedIndexes: number[];
    language: string;
  };
}

function nonEmpty(v?: string | null): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

function indexSections(sections: SectionInfo[] | undefined) {
  const map = new Map<string, SectionInfo>();
  (sections ?? []).forEach((s) => {
    if (s?.id) map.set(s.id, s);
  });
  return map;
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
      ? s.realContentStructure.map((c: ContentStructure) => pick(c))
      : [],
  });
  return JSON.stringify(pick(section), null, 2);
}

function getPreviousSectionsMDX(
  roots: RootContentStructure[],
  sectionIndex: number,
  byId: Map<string, SectionInfo>
): string[] {
  const chain: string[] = [];
  for (let i = 0; i < sectionIndex; i += 1) {
    const id = roots[i]?.id;
    if (!id) continue;
    // Read previous content; historically named tempMDXContent.
    const mdx = byId.get(id)?.tempMDXContent ?? "";
    if (nonEmpty(mdx)) chain.push(mdx.trim());
  }
  return chain;
}

function joinChainMDX(chain: string[]): string {
  if (chain.length === 0) return "";
  // Keep delimiter, textual label updated to "previous section" without MDX mention.
  return chain.join("\n\n<!-- ---- previous section ---- -->\n\n");
}

function computeCompletedIndexes(
  roots: RootContentStructure[],
  byId: Map<string, SectionInfo>
): number[] {
  const indexes: number[] = [];
  roots.forEach((r, idx) => {
    if (!r?.id) return;
    const mdx = byId.get(r.id)?.tempMDXContent ?? "";
    if (nonEmpty(mdx)) indexes.push(idx);
  });
  return indexes;
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

function buildUserSeed(section: RootContentStructure): string {
  const parts: string[] = [];
  if (nonEmpty(section.description)) {
    parts.push(`Section description: ${section.description!.trim()}`);
  }
  if (Array.isArray(section.keywords) && section.keywords.length > 0) {
    parts.push(`Keywords: ${section.keywords.join(", ")}`);
  }
  if (nonEmpty(section.intent)) {
    parts.push(`Intent: ${section.intent!.trim()}`);
  }
  if (nonEmpty(section.taxonomy)) {
    parts.push(`Taxonomy: ${section.taxonomy!.trim()}`);
  }
  if (nonEmpty(section.attention)) {
    parts.push(`Attention: ${section.attention!.trim()}`);
  }
  if (nonEmpty(section.audiences)) {
    parts.push(`Target audiences: ${section.audiences!.trim()}`);
  }
  if (nonEmpty(section.selfPrompt)) {
    parts.push(`Self Prompt: ${section.selfPrompt!.trim()}`);
  }
  // Keep concise; the system prompt drives the main behavior.
  return parts.join("\n");
}

export function useStep8Prompt() {
  const { page, getSections, getActiveSection } = useStep8Root();

  // Stable roots and index map derived once per render
  const roots = React.useMemo(() => getSections(), [getSections]);
  const indexById = React.useMemo(() => {
    const map = new Map<string, number>();
    roots.forEach((r, i) => {
      if (r?.id) map.set(r.id, i);
    });
    return map;
  }, [roots]);

  const buildForSectionId = React.useCallback(
    (sectionId: string | null | undefined): Step8PromptParts | null => {
      if (!sectionId) {
        toast.error(STEP8_TEXTS.errors.missingActive, {
          id: STEP8_IDS.toasts.generateError,
          description: STEP8_TEXTS.selector.selectPrompt,
        });
        return null;
      }

      const index = indexById.get(sectionId);
      if (typeof index !== "number" || index < 0) {
        toast.error(STEP8_TEXTS.errors.missingSection, {
          id: STEP8_IDS.toasts.generateError,
          description: "Invalid section index.",
        });
        return null;
      }

      const section = roots[index];
      if (!section) {
        toast.error(STEP8_TEXTS.errors.missingSection, {
          id: STEP8_IDS.toasts.generateError,
          description: "Section not found in roots.",
        });
        return null;
      }

      const byId = indexSections(page?.sections);
      const prevChain = getPreviousSectionsMDX(roots, index, byId);
      const chainJoined = joinChainMDX(prevChain);
      const completedIndexes = computeCompletedIndexes(roots, byId);
      const totalSections = roots.length;

      const { writingStyle, contentFormat } = readOptionalStyleFields(section);
      const language = (appConfig as any)?.lang ?? "ru";
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

      const htmlOutputContract = [
        `HTML OUTPUT CONTRACT:`,
        `- Output MUST be a single, valid HTML fragment, not Markdown, not MDX, no JSX.`,
        `- Allowed tags include: <h3>, <h4>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <a>, <code>, <pre>, <blockquote>, <hr>, <br>, <img>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <figure>, <figcaption>, <details>, <summary>, and semantic containers like <section> or <div> when needed.`,
        `- All <a> must have rel="nofollow noopener" when target="_blank".`,
        `- Close all tags properly; ensure nesting is valid.`,
        `- Do NOT include <html>, <head>, or <body>; produce only the content fragment.`,
      ].join("\n");

      const wordCountPolicy = [
        `WORD COUNT POLICY:`,
        `- If child elements have minWords=0 and maxWords=0, generate content at AI model discretion.`,
        `- Example: h3 with minWords=50, maxWords=100, containing two paragraphs each requiring 300 words should result in ~600 words total content.`,
      ].join("\n");

      const semanticsContract = [
        `SEMANTICS & BOUNDS CONTRACT:`,
        `- Follow the blueprint exactly for structure, child order and roles.`,
        `- Use taxonomy/attention/audiences/intent to shape tone, coverage and value.`,
        `- If linksToSource exist, integrate them as HTML links (<a href="...">) where appropriate.`,
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

      const chainCoherence = [
        `CHAIN COHERENCE (read-only context):`,
        `- Reason: enforce a unified tone of voice, avoid semantic duplication, and maintain a continuous flow of thought across the entire page.`,
        STEP8_TEXTS.prompt.styleCoherenceHint,
        nonEmpty(chainJoined)
          ? `Previously saved sections (HTML, read-only context):\n${chainJoined}`
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

      const system = [
        `SECTION BLUEPRINT:`,
        blueprint,
        "",
        pageProgress,
        "",
        languageContract,
        "",
        htmlOutputContract,
        "",
        wordCountPolicy,
        "",
        semanticsContract,
        "",
        chainCoherence,
        "",
        seoContract,
        "",
        // Keep any additional policy lines from STEP8_TEXTS as-is.
        STEP8_TEXTS.prompt.wordCountPolicy,
      ].join("\n");

      const userSeed = buildUserSeed(section);
      const user = [
        `Generate the HTML for the current H2 section strictly following the blueprint and contracts.`,
        ,
        userSeed,
      ]
        .filter(Boolean)
        .join("\n");

      return {
        system,
        user: system,
        meta: {
          sectionId: sectionId,
          sectionIndex: index,
          previousMDXCount: prevChain.length,
          totalSections,
          completedIndexes,
          language,
        },
      };
    },
    [indexById, page?.sections, roots]
  );

  /**
   * Convenience builder for the currently active section (no hook calls inside callback).
   */
  const buildForActiveSection =
    React.useCallback((): Step8PromptParts | null => {
      const active = getActiveSection();
      if (!active?.id) {
        toast.error(STEP8_TEXTS.errors.missingActive, {
          id: STEP8_IDS.toasts.generateError,
          description: STEP8_TEXTS.selector.selectPrompt,
        });
        return null;
      }
      return buildForSectionId(active.id);
    }, [buildForSectionId, getActiveSection]);

  return {
    buildForSectionId,
    buildForActiveSection,
  };
}
