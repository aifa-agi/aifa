// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_hooks)/use-step8-status.ts

"use client";

/**
 * Step 8 - Status hook:
 * Computes UI-only derived metrics based on PageData:
 * - completedBySection (non-empty sections[].tempMDXContent)
 * - savedCount, totalCount, coverage8, isAllSaved8
 * - unlockedIndex (strict sequential activation)
 *
 * Understanding of the task (step-by-step):
 * 1) The single source of truth lives in PageData (roots and sections).
 * 2) Completion is true when SectionInfo.tempMDXContent is non-empty.
 * 3) unlockedIndex equals the count of completed sections, enforcing strict sequence.
 * 4) No tree duplication; this hook only computes and exposes derived values.
 * 5) This hook does NOT mutate context; saving/rollback happens in dedicated hooks.
 *
 * Notes:
 * - Comments and UI strings in English (US). Chat/communication is Russian.
 * - Minimal types: reuse global domain types; local UI-only types from step8-types.
 */

import * as React from "react";
import type {
  PageData,
  RootContentStructure,
  SectionInfo,
} from "@/app/@right/(_service)/(_types)/page-types";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import { normalizedRoots } from "../../step7/(_utils)/step7-utils";
import type {
  CompletedBySectionMap,
  Step8Derived,
} from "../(_types)/step8-types";

/** Helper: builds a quick index from sections[].id -> SectionInfo */
function indexSections(
  sections: SectionInfo[] | undefined
): Map<string, SectionInfo> {
  const map = new Map<string, SectionInfo>();
  (sections ?? []).forEach((s) => {
    if (s?.id) map.set(s.id, s);
  });
  return map;
}

/** Helper: checks if the tempMDXContent is non-empty (completion condition). */
function isCompletedTemp(mdx: string | undefined | null): boolean {
  if (typeof mdx !== "string") return false;
  return mdx.trim().length > 0;
}

/** Computes completed map and derived metrics from PageData. */
function computeDerived(page: PageData | null): {
  completedBySection: CompletedBySectionMap;
  savedCount: number;
  totalCount: number;
  unlockedIndex: number;
  coverage8: number;
  isAllSaved8: boolean;
} {
  const roots: RootContentStructure[] = normalizedRoots(page);
  const byId = indexSections(page?.sections);

  const completedBySection: CompletedBySectionMap = {};
  let savedCount = 0;

  for (const r of roots) {
    if (!r?.id) continue;
    const mdx = byId.get(r.id)?.tempMDXContent;
    const completed = isCompletedTemp(mdx);
    completedBySection[r.id] = completed;
    if (completed) savedCount += 1;
  }

  const totalCount = roots.length;
  const unlockedIndex = Math.min(savedCount, Math.max(0, totalCount)); // next allowed index
  const coverage8 =
    totalCount > 0 ? Math.round((savedCount / totalCount) * 100) : 0;
  const isAllSaved8 = savedCount === totalCount && totalCount > 0;

  return {
    completedBySection,
    savedCount,
    totalCount,
    unlockedIndex,
    coverage8,
    isAllSaved8,
  };
}

/**
 * useStep8Status:
 * Public selectors to consume derived status in Step 8 UI.
 */
export function useStep8Status() {
  const { page } = useStep8Root();

  // Memoize derived metrics to avoid unnecessary recomputations.
  const derived: Step8Derived & { completedBySection: CompletedBySectionMap } =
    React.useMemo(() => {
      const d = computeDerived(page);
      return {
        completedBySection: d.completedBySection,
        savedCount: d.savedCount,
        totalCount: d.totalCount,
        unlockedIndex: d.unlockedIndex,
        coverage8: d.coverage8,
        isAllSaved8: d.isAllSaved8,
      };
    }, [
      page?.id,
      page?.updatedAt,
      page?.draftContentStructure,
      page?.sections,
    ]);

  /** Get completion boolean for a specific section id. */
  const getCompletionFor = React.useCallback(
    (sectionId: string | null | undefined): boolean => {
      if (!sectionId) return false;
      return Boolean(derived.completedBySection[sectionId]);
    },
    [derived.completedBySection]
  );

  /** Recompute on demand (exposes the same structure in case consumers need immediate sync reads). */
  const recomputeNow = React.useCallback(() => computeDerived(page), [page]);

  return {
    // Maps and metrics
    completedBySection: derived.completedBySection,
    savedCount: derived.savedCount,
    totalCount: derived.totalCount,
    coverage8: derived.coverage8,
    isAllSaved8: derived.isAllSaved8,
    unlockedIndex: derived.unlockedIndex,

    // Selectors
    getCompletionFor,

    // Utility
    recomputeNow,
    derived, // full derived bundle if consumer prefers a single object
  };
}
