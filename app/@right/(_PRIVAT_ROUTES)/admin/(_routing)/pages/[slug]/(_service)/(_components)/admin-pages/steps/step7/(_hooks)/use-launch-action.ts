// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_hooks)/use-launch-action.ts
"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { useStep7Root } from "../(_contexts)/step7-root-context";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";

import {
  replacePageInCategories,
  patchPageFieldInCategories,
} from "../(_utils)/step7-utils";
import { UI_TEXT } from "../(_constants)/step7-conatants";

/**
 * Launch action: mark the draft as ready for Perplexity.
 * IMPORTANT: The button should only be enabled when all H2 sections are 'checked'.
 */
export function useLaunchAction() {
  const { page } = useStep7Root();
  const { setCategories, updateCategories } = useNavigationMenu();

  const launch = useCallback(async () => {
    if (!page || !page.id) {
      toast.error(UI_TEXT.pageUnavailable);
      return false;
    }

    // Keep previous value to allow precise rollback on persist error
    const wasReady = Boolean(page.isReadyDraftForPerplexity);

    // Optimistic page update
    const updatedPage: PageData = {
      ...page,
      isReadyDraftForPerplexity: true,
      updatedAt: new Date().toISOString(),
    };

    setCategories((prev) => replacePageInCategories(prev, updatedPage));

    const err = await updateCategories();
    if (err) {
      // Roll back strictly the last optimistic patch
      setCategories((prev) =>
        patchPageFieldInCategories(prev, page.id, {
          isReadyDraftForPerplexity: wasReady,
        })
      );
      toast.error(`${UI_TEXT.failedToSave}: ${err.userMessage}`);
      return false;
    }

    // Success toasts
    if (!wasReady) {
      toast.success(UI_TEXT.launchReady);
    }

    return true;
  }, [page, setCategories, updateCategories]);

  return { launch };
}
