// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_hooks)/use-step8-guard.ts

"use client";

/**
 * Step 8 - Guard hook:
 * Enforces strict sequential activation using unlockedIndex derived from PageData.
 *
 * Understanding of the task (step-by-step):
 * 1) Only the section at `unlockedIndex` can be activated (0-based).
 * 2) unlockedIndex equals the count of sections with non-empty tempMDXContent.
 * 3) If user tries to activate a locked section, show a toast and deny the action.
 * 4) Guard does not mutate PageData. It delegates activation to Step8Root context when allowed.
 * 5) UI strings and toast ids come from central constants; toasts are displayed with Sonner.
 *
 * Notes:
 * - Comments and UI strings in English (US). Chat remains in Russian.
 * - No tree duplication; roots come from normalized PageData.
 */

import * as React from "react";
import { toast } from "sonner";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import { useStep8Status } from "./use-step8-status";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { STEP8_IDS } from "../(_constants)/step8-ids";
import { normalizedRoots } from "../../step7/(_utils)/step7-utils";

/** Public API of the guard hook. */
export function useStep8Guard() {
  const { page, setActiveSection, getSections } = useStep8Root();
  const { unlockedIndex } = useStep8Status();

  // Stable memoized list of root sections (H2).
  const roots = React.useMemo(() => getSections(), [getSections]);

  /** Map section id -> index for quick lookups. */
  const indexById = React.useMemo(() => {
    const map = new Map<string, number>();
    roots.forEach((r, i) => {
      if (r?.id) map.set(r.id, i);
    });
    return map;
  }, [roots]);

  /** Get index by id; returns -1 if not found. */
  const getIndexById = React.useCallback(
    (sectionId: string | null | undefined): number => {
      if (!sectionId) return -1;
      return indexById.get(sectionId) ?? -1;
    },
    [indexById]
  );

  /** Get id by index; returns null if out of range. */
  const getIdByIndex = React.useCallback(
    (index: number): string | null => {
      if (index < 0 || index >= roots.length) return null;
      return roots[index]?.id ?? null;
    },
    [roots]
  );

  /** Returns true if the given index is currently allowed to activate. */
  const canActivateIndex = React.useCallback(
    (index: number): boolean => {
      // Only the next unlocked section is allowed.
      return index === unlockedIndex;
    },
    [unlockedIndex]
  );

  /** Returns true if the given section id is allowed to activate. */
  const canActivateId = React.useCallback(
    (sectionId: string | null | undefined): boolean => {
      const idx = getIndexById(sectionId);
      if (idx < 0) return false;
      return canActivateIndex(idx);
    },
    [canActivateIndex, getIndexById]
  );

  /** Expose current unlocked index to consumers. */
  const getUnlockedIndex = React.useCallback(
    () => unlockedIndex,
    [unlockedIndex]
  );

  /**
   * Guarded activation by id:
   * - If id invalid: toast "Activation denied".
   * - If index !== unlockedIndex: toast "Section is locked".
   * - Otherwise: delegate to context's setActiveSection.
   */
  const setActiveSectionGuarded = React.useCallback(
    (sectionId: string | null | undefined) => {
      const idx = getIndexById(sectionId);
      if (idx < 0) {
        toast.error(STEP8_TEXTS.guard.invalidIndexTitle, {
          id: STEP8_IDS.toasts.guardInvalid,
          description: STEP8_TEXTS.guard.invalidIndexDescription,
        });
        return;
      }
      if (!canActivateIndex(idx)) {
        toast.error(STEP8_TEXTS.guard.lockedTitle, {
          id: STEP8_IDS.toasts.guardLocked,
          description: STEP8_TEXTS.guard.lockedDescription,
        });
        return;
      }
      setActiveSection(sectionId!);
    },
    [canActivateIndex, getIndexById, setActiveSection]
  );

  /**
   * Guarded activation by numeric index convenience helper.
   */
  const setActiveSectionGuardedByIndex = React.useCallback(
    (index: number) => {
      const id = getIdByIndex(index);
      if (!id) {
        toast.error(STEP8_TEXTS.guard.invalidIndexTitle, {
          id: STEP8_IDS.toasts.guardInvalid,
          description: STEP8_TEXTS.guard.invalidIndexDescription,
        });
        return;
      }
      setActiveSectionGuarded(id);
    },
    [getIdByIndex, setActiveSectionGuarded]
  );

  return {
    // Sequence
    unlockedIndex,
    getUnlockedIndex,

    // Checks
    canActivateIndex,
    canActivateId,

    // Activation
    setActiveSectionGuarded,
    setActiveSectionGuardedByIndex,

    // Indexing helpers
    getIndexById,
    getIdByIndex,

    // Data
    roots,
    totalCount: roots.length,
  };
}
