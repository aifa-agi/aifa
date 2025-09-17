// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_hooks)/use-step12-save.ts
"use client";

import * as React from "react";
import { toast } from "sonner";
import { useStep12Root } from "../(_contexts)/step12-root-context";
import { STEP12_TEXTS } from "../(_constants)/step12-texts";
import { STEP12_IDS } from "../(_constants)/step12-ids";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Save all sections:
 * - Validates readiness.
 * - Shows start/success/error toasts.
 * - Simulates server save (3s).
 * - On success: clears hasData flags in section context AND marks current page as isPreviewComplited=true (optimistic).
 */
export function useStep12Save() {
  const { isAllReady, setSaving, resetAllFlags } = useStep12Root();
  const { categories, setCategories, updateCategories } = useNavigationMenu();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const save = React.useCallback(async (page?: PageData | null): Promise<boolean> => {
    setError(null);

    if (!isAllReady()) {
      toast.error(STEP12_TEXTS.save.notReadyTitle, {
        id: STEP12_IDS.toasts.saveNotReady,
        description: STEP12_TEXTS.save.notReadyDescription,
      });
      return false;
    }

    toast.message(STEP12_TEXTS.save.startTitle, {
      id: STEP12_IDS.toasts.saveStart,
      description: STEP12_TEXTS.save.startDescription,
    });

    setLoading(true);
    setSaving(true);

    try {
      // Simulate server latency
      await new Promise((r) => setTimeout(r, 3000));

      // Clear local "dirty" flags in section context
      resetAllFlags();

      // Mark page as preview-completed (optimistic)
      if (page?.id) {
        const updatedCategories = categories.map((cat) => ({
          ...cat,
          pages: cat.pages.map((p) =>
            p.id === page.id ? { ...p, isPreviewComplited: true, updatedAt: new Date().toISOString() } : p
          ),
        }));

        setCategories(updatedCategories);

        // Persist with provider
        const updateErr = await updateCategories();
        if (updateErr) {
          // Rollback only the completion flag
          setCategories((prev) =>
            prev.map((cat) => ({
              ...cat,
              pages: cat.pages.map((p) =>
                p.id === page.id ? { ...p, isPreviewComplited: false } : p
              ),
            }))
          );

          throw new Error(updateErr.userMessage ?? "Update failed");
        }
      }

      toast.success(STEP12_TEXTS.save.successTitle, {
        id: STEP12_IDS.toasts.saveSuccess,
        description: STEP12_TEXTS.save.successDescription,
      });

      setLoading(false);
      setSaving(false);
      return true;
    } catch (e) {
      setLoading(false);
      setSaving(false);
      setError("save_error");

      toast.error(STEP12_TEXTS.save.errorTitle, {
        id: STEP12_IDS.toasts.saveError,
        description: STEP12_TEXTS.save.errorDescription,
      });
      toast.warning(STEP12_TEXTS.save.rollbackTitle, {
        id: STEP12_IDS.toasts.rollback,
        description: STEP12_TEXTS.save.rollbackDescription,
      });

      return false;
    }
  }, [isAllReady, resetAllFlags, setSaving, categories, setCategories, updateCategories]);

  return { loading, error, save };
}
