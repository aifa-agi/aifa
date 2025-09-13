// @app\@right\(_PRIVAT_ROUTES)\admin\(_routing)\pages\[slug]\(_service)\(_components)\admin-pages\steps\step5\(_hooks)\use-prompt-ready-flag.ts

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Props for usePromptReadyFlag hook
 */
interface UsePromptReadyFlagProps {
  page: PageData | null;
  categoryTitle: string;
  slug: string;
}

/**
 * Return type for usePromptReadyFlag hook
 */
interface UsePromptReadyFlagReturn {
  isUpdating: boolean;
  markPromptAsReady: () => Promise<boolean>;
  unmarkPromptAsReady: () => Promise<boolean>;
  isPromptReady: boolean;
  canUpdate: boolean;
}

/**
 * Custom hook for managing isReadyPromptForPerplexity flag
 * Similar pattern to useSystemFields but specialized for prompt ready state
 */
export function usePromptReadyFlag({
  page,
  categoryTitle,
  slug,
}: UsePromptReadyFlagProps): UsePromptReadyFlagReturn {
  const { categories, setCategories, updateCategories } = useNavigationMenu();

  const [isUpdating, setIsUpdating] = useState(false);

  // Check if page is valid for operations
  const isPageValid = Boolean(page && page.id);
  const isPromptReady = Boolean(page?.isReadyPromptForPerplexity);
  const canUpdate = !isUpdating && isPageValid;

  /**
   * Mark prompt as ready (set isReadyPromptForPerplexity to true)
   */
  const markPromptAsReady = useCallback(async (): Promise<boolean> => {
    if (!isPageValid || !page) {
      console.warn("Cannot mark prompt as ready: page data is not available");
      toast.error("Page data is not available");
      return false;
    }

    if (isUpdating) {
      toast.warning("Update already in progress");
      return false;
    }

    // If already marked as ready, no need to update
    if (page.isReadyPromptForPerplexity) {
      toast.info("Prompt is already marked as ready");
      return true;
    }

    setIsUpdating(true);

    try {
      const updatedPage: PageData = {
        ...page,
        isReadyPromptForPerplexity: true,
        updatedAt: new Date().toISOString(),
      };

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
                          isReadyPromptForPerplexity: false,
                        }
                  ),
                }
          )
        );

        toast.error(
          `Failed to mark prompt as ready: ${updateError.userMessage}`
        );
        console.error("Failed to mark prompt as ready:", updateError);
        return false;
      }

      toast.success("Prompt marked as ready for Perplexity!", {
        duration: 3000,
      });

      console.log(`Successfully marked prompt as ready for page: ${page.id}`);
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
                        isReadyPromptForPerplexity: false,
                      }
                ),
              }
        )
      );

      toast.error("Unexpected error marking prompt as ready");
      console.error("Unexpected error marking prompt as ready:", error);
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

  /**
   * Unmark prompt as ready (set isReadyPromptForPerplexity to false)
   */
  const unmarkPromptAsReady = useCallback(async (): Promise<boolean> => {
    if (!isPageValid || !page) {
      console.warn("Cannot unmark prompt: page data is not available");
      toast.error("Page data is not available");
      return false;
    }

    if (isUpdating) {
      toast.warning("Update already in progress");
      return false;
    }

    // If already unmarked, no need to update
    if (!page.isReadyPromptForPerplexity) {
      toast.info("Prompt is already unmarked");
      return true;
    }

    setIsUpdating(true);

    try {
      const updatedPage: PageData = {
        ...page,
        isReadyPromptForPerplexity: false,
        updatedAt: new Date().toISOString(),
      };

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
                          isReadyPromptForPerplexity: true,
                        }
                  ),
                }
          )
        );

        toast.error(`Failed to unmark prompt: ${updateError.userMessage}`);
        console.error("Failed to unmark prompt:", updateError);
        return false;
      }

      toast.success("Prompt unmarked from ready state");
      console.log(`Successfully unmarked prompt for page: ${page.id}`);
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
                        isReadyPromptForPerplexity: true,
                      }
                ),
              }
        )
      );

      toast.error("Unexpected error unmarking prompt");
      console.error("Unexpected error unmarking prompt:", error);
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
    markPromptAsReady,
    unmarkPromptAsReady,
    isPromptReady,
    canUpdate,
  };
}
