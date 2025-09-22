// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_hooks)/use-step12-save.ts
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import type { PageUploadPayload } from "@/app/@right/(_service)/(_types)/section-types";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { uploadSections, SectionUploadError, UploadErrorType } from "../(_utils)/sections-upload.service";
import { toPageUploadPayload } from "../(_adapters)/sections-mapper";
import { STEP12_IDS } from "../(_constants)/step12-ids";
import { useStep12Root } from "../(_contexts)/step12-root-context";

interface UseStep12SaveReturn {
  save: (page?: PageData) => Promise<boolean>;
  saving: boolean;
}

/**
 * Returns boolean success status so caller can react (e.g., reset confirm flags).
 */
export function useStep12Save(): UseStep12SaveReturn {
  const [localSaving, setLocalSaving] = useState(false);
  const { categories, setCategories } = useNavigationMenu();

  const {
    sections,
    isAllReady,
    resetAllFlags,
    setSaving: setContextSaving,
    page: contextPage,
  } = useStep12Root();

  const save = useCallback(async (page?: PageData): Promise<boolean> => {
    const targetPage = page || contextPage;

    if (!targetPage) {
      toast.error("Page data is required for saving", { id: STEP12_IDS.toasts.saveError });
      return false;
    }

    if (!targetPage.href) {
      toast.error("Page href is required for saving", { id: STEP12_IDS.toasts.saveError });
      return false;
    }

    if (!isAllReady()) {
      toast.error("Please complete all sections before saving", { id: STEP12_IDS.toasts.saveNotReady });
      return false;
    }

    setLocalSaving(true);
    setContextSaving(true);
    toast.loading("Saving page with all sections...", { id: STEP12_IDS.toasts.saveStart });

    try {
      // Создаем новый payload с разделенными метаданными страницы и секциями
      const payload: PageUploadPayload = toPageUploadPayload(sections, targetPage);

      if (payload.sections.length === 0) {
        throw new Error("No sections to save");
      }

      // Валидация метаданных страницы
      if (!payload.pageMetadata.title && !payload.pageMetadata.description) {
        console.warn("Step12Save: Page metadata is incomplete - no title or description provided");
      }

      const response = await uploadSections(payload);

      // Reset content-related flags after success (existing behavior)
      resetAllFlags();

      // Update navigation state optimistically
      try {
        setCategories((prevCategories) =>
          prevCategories.map((category) => ({
            ...category,
            pages: category.pages.map((p) =>
              p.href === targetPage.href
                ? { 
                    ...p, 
                    isPreviewComplited: true, 
                    updatedAt: new Date().toISOString(),
                    // Обновляем также метаданные в навигации
                    title: payload.pageMetadata.title || p.title,
                    description: payload.pageMetadata.description || p.description,
                  }
                : p
            ),
          }))
        );
      } catch (navError) {
        console.warn("Step12Save: Failed to update navigation state", navError);
      }

      toast.success(
        `Successfully saved page "${payload.pageMetadata.title || 'Untitled'}" with ${payload.sections.length} sections${response.filePath ? ` to ${response.filePath}` : ""}`,
        { id: STEP12_IDS.toasts.saveSuccess, duration: 4000 }
      );
      return true;
    } catch (error) {
      console.error("Step12Save: Save failed", error);

      if (error instanceof SectionUploadError) {
        let errorMessage = error.message;

        switch (error.type) {
          case UploadErrorType.VALIDATION_ERROR:
            errorMessage = `Validation error: ${error.message}`;
            break;
          case UploadErrorType.NETWORK_ERROR:
            errorMessage = "Network error: Please check your connection and try again";
            break;
          case UploadErrorType.GITHUB_ERROR:
            errorMessage = "GitHub integration error: Please contact administrator";
            break;
          case UploadErrorType.FILESYSTEM_ERROR:
            errorMessage = "File system error: Unable to save page";
            break;
          case UploadErrorType.SERVER_ERROR:
            errorMessage = `Server error: ${error.message}`;
            break;
          default:
            errorMessage = `Upload failed: ${error.message}`;
        }

        toast.error(errorMessage, { id: STEP12_IDS.toasts.saveError, duration: 6000 });
      } else {
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        toast.error(`Save failed: ${message}`, { id: STEP12_IDS.toasts.saveError, duration: 6000 });
      }

      // Rollback navigation state
      try {
        setCategories((prevCategories) =>
          prevCategories.map((category) => ({
            ...category,
            pages: category.pages.map((p) =>
              p.href === (page || contextPage)?.href
                ? { ...p, isPreviewComplited: false }
                : p
            ),
          }))
        );
      } catch (rollbackError) {
        console.warn("Step12Save: Failed to rollback navigation state", rollbackError);
      }
      return false;
    } finally {
      setLocalSaving(false);
      setContextSaving(false);
      toast.dismiss(STEP12_IDS.toasts.saveStart);
    }
  }, [contextPage, isAllReady, sections, resetAllFlags, setContextSaving, setCategories]);

  return { save, saving: localSaving };
}
