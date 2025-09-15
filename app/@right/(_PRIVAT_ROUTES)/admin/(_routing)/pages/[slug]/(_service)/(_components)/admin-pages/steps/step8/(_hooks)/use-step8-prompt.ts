// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_hooks)/use-step8-prompt.ts
"use client";

/**
 * Step 8 - Prompt hook:
 * Builds the system/user prompt parts for MDX generation of a given H2 section.
 *
 * Understanding of the task (step-by-step):
 * 1) The source of truth is PageData (draftContentStructure for H2 sections and sections[].tempMDXContent for saved MDX).
 * 2) For section i, the system prompt must include: selfPrompt, writingStyle, contentFormat, and a coherence hint,
 *    plus all previously saved MDX [0..i-1] concatenated for stylistic consistency.
 * 3) Word count policy is advisory (min/max can be zero). We explicitly state this in the system prompt.
 * 4) The hook exposes builders for active section and by arbitrary section id, without mutating PageData.
 * 5) Errors (e.g., missing section or inconsistent chain) are surfaced via Sonner toasts.
 *
 * Notes:
 * - Comments and UI strings are in English (US). Chat/communication is Russian.
 * - writingStyle/contentFormat may be optional on RootContentStructure; access with care.
 */

import * as React from "react";
import { toast } from "sonner";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import type {
  PageData,
  RootContentStructure,
  SectionInfo,
} from "@/app/@right/(_service)/(_types)/page-types";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { STEP8_IDS } from "../(_constants)/step8-ids";
import { normalizedRoots } from "../../step7/(_utils)/step7-utils";

/** Prompt parts contract used by the generator hook. */
export interface Step8PromptParts {
  system: string;
  user: string;
  meta: {
    sectionId: string;
    sectionIndex: number;
    previousMDXCount: number;
  };
}

/** External prompt for single-input UIs (e.g., Perplexity). */
export interface ExternalPrompt {
  system: string;
  user: string;
  combined: string; // SYSTEM + USER + OUTPUT FORMAT contract (plain text)
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

function nonEmpty(value: string | undefined | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
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
    const mdx = byId.get(id)?.tempMDXContent ?? "";
    if (nonEmpty(mdx)) chain.push(mdx.trim());
  }
  return chain;
}

function joinChainMDX(chain: string[]): string {
  if (chain.length === 0) return "";
  return chain.join("\n\n{/* ---- previous section ---- */}\n\n");
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
  if (nonEmpty(section.audiences)) {
    parts.push(`Target audiences: ${section.audiences!.trim()}`);
  }
  return parts.join("\n");
}

/**
 * useStep8Prompt:
 * Exposes prompt builders for the active section and by arbitrary section id.
 */
export function useStep8Prompt() {
  const { page, ui, getSections, getActiveSection } = useStep8Root();

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
          description: STEP8_TEXTS.guard.invalidIndexDescription,
        });
        return null;
      }

      const section = roots[index];
      if (!section) {
        toast.error(STEP8_TEXTS.errors.missingSection, {
          id: STEP8_IDS.toasts.generateError,
          description: STEP8_TEXTS.guard.invalidIndexDescription,
        });
        return null;
      }

      const byId = indexSections(page?.sections);
      const prevChain = getPreviousSectionsMDX(roots, index, byId);
      if (index > 0 && prevChain.length === 0) {
        toast.warning(STEP8_TEXTS.guard.clearedChainTitle, {
          id: STEP8_IDS.toasts.rollback,
          description: STEP8_TEXTS.guard.clearedChainDescription,
        });
      }

      const { writingStyle, contentFormat } = readOptionalStyleFields(section);

      const systemLines: string[] = [];
      if (nonEmpty(section.selfPrompt)) {
        systemLines.push(String(section.selfPrompt).trim());
      }
      if (nonEmpty(writingStyle)) {
        systemLines.push(
          `Writing style preference: ${String(writingStyle).trim()}`
        );
      }
      if (nonEmpty(contentFormat)) {
        systemLines.push(
          `Desired content format: ${String(contentFormat).trim()}`
        );
      }
      systemLines.push(STEP8_TEXTS.prompt.wordCountPolicy);
      systemLines.push(STEP8_TEXTS.prompt.styleCoherenceHint);

      const chainJoined = joinChainMDX(prevChain);
      if (nonEmpty(chainJoined)) {
        systemLines.push("Previously saved sections (MDX, read-only context):");
        systemLines.push(chainJoined);
      }

      const userSeed = buildUserSeed(section);
      const user = [
        "Generate high-quality MDX for the current section (H2).",
        "Preserve heading levels and keep consistent formatting.",
        userSeed,
      ]
        .filter(Boolean)
        .join("\n");

      const prompt: Step8PromptParts = {
        system: systemLines.join("\n\n"),
        user,
        meta: {
          sectionId: sectionId,
          sectionIndex: index,
          previousMDXCount: prevChain.length,
        },
      };

      return prompt;
    },
    [indexById, page?.sections, roots]
  );

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

  /**
   * Builds a single-string external prompt for single-input UIs (e.g., Perplexity).
   * Appends an explicit OUTPUT FORMAT contract to force MDX.
   */
  const buildExternalPromptForSectionId = React.useCallback(
    (sectionId: string | null | undefined): ExternalPrompt | null => {
      const p = buildForSectionId(sectionId);
      if (!p) return null;

      const outputContract = [
        "OUTPUT FORMAT:",
        "- Return ONLY valid MDX content suitable for Next.js MDX parser.",
        "- Do NOT include any explanations, prefaces, or meta text.",
        "- Do NOT wrap the output in code fences.",
        "- Keep heading levels consistent: start from H3 and below; do NOT duplicate the H2 title.",
        "- Use lists, tables, blockquotes and inline code as MDX; avoid raw HTML unless required by MDX components.",
      ].join("\n");

      const combined = [
        "SYSTEM INSTRUCTION:",
        p.system,
        "",
        "USER TASK:",
        p.user,
        "",
        outputContract,
      ].join("\n");

      return { system: p.system, user: p.user, combined };
    },
    [buildForSectionId]
  );

  const buildExternalPromptForActiveSection =
    React.useCallback((): ExternalPrompt | null => {
      const active = getActiveSection();
      if (!active?.id) {
        toast.error(STEP8_TEXTS.errors.missingActive, {
          id: STEP8_IDS.toasts.generateError,
          description: STEP8_TEXTS.selector.selectPrompt,
        });
        return null;
      }
      return buildExternalPromptForSectionId(active.id);
    }, [buildExternalPromptForSectionId, getActiveSection]);

  const getSectionIndex = React.useCallback(
    (sectionId: string | null | undefined): number => {
      if (!sectionId) return -1;
      return indexById.get(sectionId) ?? -1;
    },
    [indexById]
  );

  return {
    buildForSectionId,
    buildForActiveSection,
    buildExternalPromptForSectionId,
    buildExternalPromptForActiveSection,
    getSectionIndex,
    roots,
  };
}
