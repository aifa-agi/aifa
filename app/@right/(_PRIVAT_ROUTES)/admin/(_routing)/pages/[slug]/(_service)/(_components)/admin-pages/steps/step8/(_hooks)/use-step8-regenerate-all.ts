// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_hooks)/use-step8-regenerate-all.ts
"use client";

/**
 * Step 8 - Regenerate All hook:
 * Orchestrates mass regeneration for H2 sections using the server action `regenerateAllDrafts`,
 * then applies an optimistic save of returned MDX into PageData.sections[].tempMDXContent
 * followed by provider persistence (updateCategories) and rollback on failure.
 *
 * Understanding of the task (step-by-step):
 * 1) Single source of truth: PageData is stored in navigation categories; no duplication.
 * 2) Call server action with ordered roots + existing sections; action returns per-section MDX.
 * 3) Build updated PageData by upserting mdx for every returned section id.
 * 4) Optimistic patch categories, then persist via provider; rollback on error.
 * 5) UI feedback via Sonner toasts using stable Step 8 toast IDs.
 */

import * as React from "react";
import { toast } from "sonner";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import type { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import type {
  PageData,
  SectionInfo,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";
import { regenerateAllDrafts } from "../(_actions)/regenerate-all-drafts";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { STEP8_IDS } from "../(_constants)/step8-ids";

function deepCloneCategories(src: MenuCategory[]): MenuCategory[] {
  return JSON.parse(JSON.stringify(src)) as MenuCategory[];
}

/** Upsert a single section MDX into a PageData by sectionId. */
function upsertSectionMdx(
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
      summary: prev.summary,
      linksData: prev.linksData,
      tempMDXContent: mdx,
    };
  }
  next.sections = sections;
  return next;
}

/** Replace a page in categories by id, updating updatedAt. */
function replacePage(
  categories: MenuCategory[],
  updatedPage: PageData
): MenuCategory[] {
  let replaced = false;
  const next = categories.map((cat) => {
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
  return replaced ? next : categories;
}

export function useStep8RegenerateAll() {
  const { page, getSections } = useStep8Root();
  const { categories, setCategories, updateCategories } = useNavigationMenu();

  const [isRunning, setIsRunning] = React.useState(false);
  const [lastError, setLastError] = React.useState<string | null>(null);

  const run = React.useCallback(async () => {
    setIsRunning(true);
    setLastError(null);

    if (!page?.id) {
      setIsRunning(false);
      toast.error(STEP8_TEXTS.errors.missingSection, {
        id: STEP8_IDS.toasts.generateError,
        description: STEP8_TEXTS.errors.missingActive,
      });
      return { ok: false };
    }

    // Toast: start
    toast.loading(STEP8_TEXTS.generate.startTitle, {
      id: STEP8_IDS.toasts.generateStart,
      description: "Mass regeneration in progress...",
    });

    // Call server action (sequential chain inside action)
    try {
      const roots: RootContentStructure[] = getSections();
      const res = await regenerateAllDrafts({
        pageId: page.id,
        roots,
        existingSections: page.sections ?? [],
        // default from unlockedIndex inside action via computeUnlockedIndex
        model: "gpt-4.1-mini",
        stopOnEmpty: true,
      });

      // Build updated page: apply returned mdx per section
      let updatedPage: PageData = { ...page };
      for (const r of res.results ?? []) {
        updatedPage = upsertSectionMdx(updatedPage, r.sectionId, r.mdx);
      }

      // If nothing returned, treat as soft error to avoid empty saves
      if (!res.results || res.results.length === 0) {
        toast.error(STEP8_TEXTS.generate.errorTitle, {
          id: STEP8_IDS.toasts.generateError,
          description:
            "No sections were regenerated. Adjust prompts and retry.",
        });
        toast.dismiss(STEP8_IDS.toasts.generateStart);
        setIsRunning(false);
        return { ok: false, result: res };
      }

      // Optimistic patch categories with updated page
      const prevCategories = deepCloneCategories(categories);
      const nextCategories = replacePage(categories, updatedPage);
      setCategories(nextCategories);

      // Persist via provider (NO args)
      const error = await updateCategories();
      if (error) {
        // Rollback last patch
        setCategories(prevCategories);
        toast.error(STEP8_TEXTS.save.errorTitle, {
          id: STEP8_IDS.toasts.saveError,
          description: STEP8_TEXTS.save.errorDescription,
        });
        toast.warning(STEP8_TEXTS.save.rollbackTitle, {
          id: STEP8_IDS.toasts.rollback,
          description: STEP8_TEXTS.save.rollbackDescription,
        });
        toast.dismiss(STEP8_IDS.toasts.generateStart);
        setIsRunning(false);
        return { ok: false, result: res };
      }

      // Success toasts
      toast.success(STEP8_TEXTS.generate.successTitle, {
        id: STEP8_IDS.toasts.generateSuccess,
        description: `Regenerated ${res.results.length} section(s).`,
      });
      toast.dismiss(STEP8_IDS.toasts.generateStart);
      setIsRunning(false);
      return { ok: true, result: res };
    } catch (e: any) {
      const msg = e?.message ?? "Regeneration failed";
      setLastError(String(msg));
      toast.error(STEP8_TEXTS.generate.errorTitle, {
        id: STEP8_IDS.toasts.generateError,
        description: STEP8_TEXTS.generate.errorDescription,
      });
      toast.dismiss(STEP8_IDS.toasts.generateStart);
      setIsRunning(false);
      return { ok: false, error: msg };
    }
  }, [
    page?.id,
    page,
    categories,
    setCategories,
    updateCategories,
    getSections,
  ]);

  return {
    isRunning,
    lastError,
    regenerateAll: run,
  };
}

export type UseStep8RegenerateAllReturn = ReturnType<
  typeof useStep8RegenerateAll
>;
