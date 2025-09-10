// @app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_hooks)/use-draft-structure-saver.ts

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import {
  PageData,
  ContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Props for useDraftStructureSaver hook
 */
interface UseDraftStructureSaverProps {
  page: PageData | null;
  categoryTitle: string;
  slug: string;
}

/**
 * Return type for useDraftStructureSaver hook
 */
interface UseDraftStructureSaverReturn {
  isUpdating: boolean;
  saveDraftStructure: (draftStructure: ContentStructure[]) => Promise<boolean>;
  clearDraftStructure: () => Promise<boolean>;
  hasDraftStructure: boolean;
  draftElementsCount: number;
  canUpdate: boolean;
}

/**
 * Custom hook for managing draftContentStructure field
 * Follows the same pattern as usePromptReadyFlag but for ContentStructure data
 */
export function useDraftStructureSaver({
  page,
  categoryTitle,
  slug,
}: UseDraftStructureSaverProps): UseDraftStructureSaverReturn {
  const { categories, setCategories, updateCategories } = useNavigationMenu();

  const [isUpdating, setIsUpdating] = useState(false);

  // Check if page is valid for operations
  const isPageValid = Boolean(page && page.id);
  const hasDraftStructure = Boolean(page?.draftContentStructure?.length);
  const draftElementsCount = page?.draftContentStructure?.length || 0;
  const canUpdate = !isUpdating && isPageValid;

  /**
   * Save ContentStructure[] to page.draftContentStructure
   */
  const saveDraftStructure = useCallback(
    async (draftStructure: ContentStructure[]): Promise<boolean> => {
      if (!isPageValid || !page) {
        console.warn("Cannot save draft structure: page data is not available");
        toast.error("Page data is not available");
        return false;
      }

      if (isUpdating) {
        toast.warning("Update already in progress");
        return false;
      }

      if (!Array.isArray(draftStructure) || draftStructure.length === 0) {
        toast.error("Invalid draft structure data");
        return false;
      }

      setIsUpdating(true);

      try {
        const updatedPage: PageData = {
          ...page,
          draftContentStructure: draftStructure,
          updatedAt: new Date().toISOString(),
        };

        console.log(
          `🔄 Saving draft structure with ${draftStructure.length} elements for page: ${page.id}`
        );

        // Optimistically update the local state
        setCategories((prev) =>
          prev.map((cat) =>
            cat.title !== categoryTitle
              ? cat
              : {
                  ...cat,
                  pages: cat.pages.map((p) =>
                    p.id !== page.id ? p : updatedPage
                  ),
                }
          )
        );

        // Sync with server
        const updateError = await updateCategories();

        if (updateError) {
          // Rollback on error - restore previous draftContentStructure
          setCategories((prev) =>
            prev.map((cat) =>
              cat.title !== categoryTitle
                ? cat
                : {
                    ...cat,
                    pages: cat.pages.map((p) =>
                      p.id !== page.id
                        ? p
                        : {
                            ...p,
                            draftContentStructure: page.draftContentStructure,
                          }
                    ),
                  }
            )
          );

          toast.error(
            `Failed to save draft structure: ${updateError.userMessage}`
          );
          console.error("Failed to save draft structure:", updateError);
          return false;
        }

        toast.success(
          `Draft structure saved successfully! ${draftStructure.length} content elements processed.`,
          {
            duration: 4000,
            description: "Ready for draft analysis and content generation",
          }
        );

        console.log(
          `✅ Successfully saved draft structure for page: ${page.id}`
        );
        return true;
      } catch (error) {
        // Rollback on unexpected error
        setCategories((prev) =>
          prev.map((cat) =>
            cat.title !== categoryTitle
              ? cat
              : {
                  ...cat,
                  pages: cat.pages.map((p) =>
                    p.id !== page.id
                      ? p
                      : {
                          ...p,
                          draftContentStructure: page.draftContentStructure,
                        }
                  ),
                }
          )
        );

        toast.error("Unexpected error saving draft structure");
        console.error("Unexpected error saving draft structure:", error);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [
      isPageValid,
      page,
      isUpdating,
      categoryTitle,
      setCategories,
      updateCategories,
    ]
  );

  /**
   * Clear draftContentStructure (set to empty array or undefined)
   */
  const clearDraftStructure = useCallback(async (): Promise<boolean> => {
    if (!isPageValid || !page) {
      console.warn("Cannot clear draft structure: page data is not available");
      toast.error("Page data is not available");
      return false;
    }

    if (isUpdating) {
      toast.warning("Update already in progress");
      return false;
    }

    // If already empty, no need to update
    if (
      !page.draftContentStructure ||
      page.draftContentStructure.length === 0
    ) {
      toast.info("Draft structure is already empty");
      return true;
    }

    setIsUpdating(true);

    try {
      const updatedPage: PageData = {
        ...page,
        draftContentStructure: undefined, // or [] if you prefer empty array
        updatedAt: new Date().toISOString(),
      };

      console.log(`🗑️ Clearing draft structure for page: ${page.id}`);

      // Store original data for rollback
      const originalDraftStructure = page.draftContentStructure;

      // Optimistically update the local state
      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((p) =>
                  p.id !== page.id ? p : updatedPage
                ),
              }
        )
      );

      // Sync with server
      const updateError = await updateCategories();

      if (updateError) {
        // Rollback on error
        setCategories((prev) =>
          prev.map((cat) =>
            cat.title !== categoryTitle
              ? cat
              : {
                  ...cat,
                  pages: cat.pages.map((p) =>
                    p.id !== page.id
                      ? p
                      : {
                          ...p,
                          draftContentStructure: originalDraftStructure,
                        }
                  ),
                }
          )
        );

        toast.error(
          `Failed to clear draft structure: ${updateError.userMessage}`
        );
        console.error("Failed to clear draft structure:", updateError);
        return false;
      }

      toast.success("Draft structure cleared successfully");
      console.log(
        `✅ Successfully cleared draft structure for page: ${page.id}`
      );
      return true;
    } catch (error) {
      // Rollback on unexpected error
      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((p) =>
                  p.id !== page.id
                    ? p
                    : {
                        ...p,
                        draftContentStructure: page.draftContentStructure,
                      }
                ),
              }
        )
      );

      toast.error("Unexpected error clearing draft structure");
      console.error("Unexpected error clearing draft structure:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [
    isPageValid,
    page,
    isUpdating,
    categoryTitle,
    setCategories,
    updateCategories,
  ]);

  return {
    isUpdating,
    saveDraftStructure,
    clearDraftStructure,
    hasDraftStructure,
    draftElementsCount,
    canUpdate,
  };
}
