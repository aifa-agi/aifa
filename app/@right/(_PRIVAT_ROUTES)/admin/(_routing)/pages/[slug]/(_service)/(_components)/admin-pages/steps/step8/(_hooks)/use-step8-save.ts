// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_hooks)/use-step8-save.ts

"use client";

/**
 * Step 8 - Save hook:
 * Optimistically upserts SectionInfo.tempMDXContent into the current PageData,
 * persists via NavigationMenuProvider.updateCategories(), and rolls back on error.
 * Additionally resets isPreviewComplited to false when content changes.
 *
 * Understanding of the task (step-by-step):
 * 1) Single source of truth: PageData lives inside menu categories; no tree duplication.
 * 2) Build nextCategories by updating the current page's sections: upsert { id, tempMDXContent }.
 * 3) Reset isPreviewComplited to false to indicate preview needs regeneration.
 * 4) Optimistic UX: setCategories(nextCategories), then await updateCategories() (NO args).
 * 5) On failure: rollback to prevCategories and show rollback toast.
 * 6) Clearing with empty string is allowed and removes "completed" derived state.
 *
 * Notes:
 * - Comments and UI strings are in English (US). Chat remains in Russian.
 * - Sonner is used for toasts with stable IDs from constants.
 * - Minimal helpers are kept local; can be extracted to utils later.
 */

import * as React from "react";
import { toast } from "sonner";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import type { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import type {
  PageData,
  SectionInfo,
} from "@/app/@right/(_service)/(_types)/page-types";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { STEP8_IDS } from "../(_constants)/step8-ids";

/** Deep clone utility to snapshot categories for rollback. */
function deepCloneCategories(src: MenuCategory[]): MenuCategory[] {
  return JSON.parse(JSON.stringify(src)) as MenuCategory[];
}

/** Returns true if string is non-empty after trim. */
function nonEmpty(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/** 
 * Upserts SectionInfo { id, tempMDXContent } in a PageData, preserving summary/linksData.
 * Also resets isPreviewComplited to false since content has changed.
 */
function upsertSectionInfoInPage(
  page: PageData,
  sectionId: string,
  mdx: string
): PageData {
  const next: PageData = { ...page };
  const sections: SectionInfo[] = Array.isArray(next.sections)
    ? [...next.sections]
    : [];
  const idx = sections.findIndex((s) => s?.id === sectionId);

  if (idx === -1) {
    sections.push({ id: sectionId, tempMDXContent: mdx });
  } else {
    const prev = sections[idx];
    sections[idx] = {
      id: prev.id,
      summary: prev.summary, // preserve
      linksData: prev.linksData, // preserve
      tempMDXContent: mdx, // update
    };
  }

  next.sections = sections;
  // Reset preview completion flag since content has changed
  next.isPreviewComplited = false;
  
  return next;
}

/** Replaces a page within categories by id, returns new categories array. */
function replacePageInCategories(
  categories: MenuCategory[],
  updatedPage: PageData
): MenuCategory[] {
  let replaced = false;
  const nextCategories = categories.map((cat) => {
    const pages = Array.isArray(cat.pages) ? cat.pages : [];
    const newPages = pages.map((p) => {
      if (p?.id === updatedPage.id) {
        replaced = true;
        return { ...updatedPage, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    return { ...cat, pages: newPages };
  });

  // If the page was not found, return original to avoid accidental data loss.
  return replaced ? nextCategories : categories;
}

export function useStep8Save() {
  const { page } = useStep8Root();
  const { categories, setCategories, updateCategories } = useNavigationMenu();

  /**
   * Saves MDX for a section id (empty string allowed to clear content).
   * Optimistic flow with rollback on failure.
   * Resets isPreviewComplited to false when content changes.
   */
  const saveSectionTempMDX = React.useCallback(
    async (sectionId: string, mdx: string): Promise<boolean> => {
      if (!page?.id) {
        toast.error(STEP8_TEXTS.errors.missingSection, {
          id: STEP8_IDS.toasts.saveError,
          description: STEP8_TEXTS.errors.missingActive,
        });
        return false;
      }

      // Snapshot for rollback
      const prevCategories = deepCloneCategories(categories);

      // Build updated page (includes resetting isPreviewComplited)
      const updatedPage = upsertSectionInfoInPage(page, sectionId, mdx);

      // Compute next categories (replace page by id)
      const nextCategories = replacePageInCategories(categories, updatedPage);

      // Optimistic patch
      setCategories(nextCategories);

      // Persist with provider (NO args)
      const error = await updateCategories();

      if (error) {
        // Rollback strictly last patch
        setCategories(prevCategories);

        // Error + rollback toasts
        toast.error(STEP8_TEXTS.save.errorTitle, {
          id: STEP8_IDS.toasts.saveError,
          description: STEP8_TEXTS.save.errorDescription,
        });
        toast.warning(STEP8_TEXTS.save.rollbackTitle, {
          id: STEP8_IDS.toasts.rollback,
          description: STEP8_TEXTS.save.rollbackDescription,
        });

        return false;
      }

      // Success toast
      if (nonEmpty(mdx)) {
        toast.success(STEP8_TEXTS.save.successTitle, {
          id: STEP8_IDS.toasts.saveSuccess,
          description: STEP8_TEXTS.save.successDescription,
        });
      } else {
        toast.info(STEP8_TEXTS.save.clearedTitle, {
          id: STEP8_IDS.toasts.saveCleared,
          description: STEP8_TEXTS.save.clearedDescription,
        });
      }

      return true;
    },
    [page?.id, categories, setCategories, updateCategories]
  );

  /** Convenience helper: clears a section's MDX (sets it to empty string). */
  const clearSectionTempMDX = React.useCallback(
    async (sectionId: string): Promise<boolean> => {
      return await saveSectionTempMDX(sectionId, "");
    },
    [saveSectionTempMDX]
  );

  return {
    saveSectionTempMDX,
    clearSectionTempMDX,
  };
}
