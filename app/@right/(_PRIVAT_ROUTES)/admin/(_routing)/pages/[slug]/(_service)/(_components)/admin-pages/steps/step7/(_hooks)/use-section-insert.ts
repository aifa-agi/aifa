// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_hooks)/use-section-insert.ts
"use client";

// Comments are in English. UI texts are in English (US).
// Inserts a new H2 section at a specific root index with default children.
// Keeps compatibility with Step 7 persistence and rollback strategy.

import { useCallback } from "react";
import { toast } from "sonner";
import type {
  PageData,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";
import { useStep7Root } from "../(_contexts)/step7-root-context";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import {
  normalizedRoots,
  replacePageInCategories,
  patchPageFieldInCategories,
  computeLaunchEligibility,
} from "../(_utils)/step7-utils";
import { createDefaultRootSection } from "../(_utils)/step7-section-factory";
import { UI_TEXT } from "../(_constants)/step7-conatants";

export function useSectionInsert() {
  const { page, recomputeDerived } = useStep7Root();
  const { setCategories, updateCategories } = useNavigationMenu();

  const insertAtIndex = useCallback(
    async (index: number) => {
      if (!page || !page.id) {
        toast.error(UI_TEXT.pageUnavailable);
        return false;
      }

      const roots = normalizedRoots(page);
      const boundedIndex = Math.max(0, Math.min(index, roots.length));

      const newSection: RootContentStructure = createDefaultRootSection();
      const patchedRoots = [...roots];
      patchedRoots.splice(boundedIndex, 0, newSection);

      const wasReady = Boolean(page.isReadyDraftForPerplexity);
      const eligible = computeLaunchEligibility(patchedRoots);

      const updatedPage: PageData = {
        ...page,
        draftContentStructure: patchedRoots,
        isReadyDraftForPerplexity: eligible ? true : false,
        updatedAt: new Date().toISOString(),
      };

      setCategories((prev) => replacePageInCategories(prev, updatedPage));
      const err = await updateCategories();
      if (err) {
        setCategories((prev) =>
          patchPageFieldInCategories(prev, page.id, {
            draftContentStructure: page.draftContentStructure,
            isReadyDraftForPerplexity: page.isReadyDraftForPerplexity,
          })
        );
        toast.error(`${UI_TEXT.failedToSave}: ${err.userMessage}`);
        return false;
      }

      recomputeDerived();
      toast.success(UI_TEXT.saved);
      if (!wasReady && eligible) toast.success(UI_TEXT.launchReady);
      else if (wasReady && !eligible) toast.warning(UI_TEXT.launchNowBlocked);

      return true;
    },
    [page, setCategories, updateCategories, recomputeDerived]
  );

  const insertBefore = useCallback(
    async (currentIndex: number) => insertAtIndex(currentIndex),
    [insertAtIndex]
  );

  const insertAfter = useCallback(
    async (currentIndex: number) => insertAtIndex(currentIndex + 1),
    [insertAtIndex]
  );

  return { insertAtIndex, insertBefore, insertAfter };
}
