"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2";
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
  generateContentStructureIds: (
    structure: ContentStructure[]
  ) => ContentStructure[];
}

/**
 * Generate short 6-character ID using cuid v2
 */
const generateShortId = (): string => {
  const fullId = createId();
  return fullId.substring(0, 6);
};

/**
 * Recursively assign IDs to ContentStructure elements that don't have them
 * @param structure - Array of ContentStructure elements
 * @returns Array with all elements having IDs
 */
const assignIdsToStructure = (
  structure: ContentStructure[]
): ContentStructure[] => {
  return structure.map((element, index) => {
    const newId = element.id || generateShortId();

    const processedElement: ContentStructure = {
      ...element,
      id: newId,
    };

    if (
      element.realContentStructure &&
      element.realContentStructure.length > 0
    ) {
      processedElement.realContentStructure = assignIdsToStructure(
        element.realContentStructure
      );
    }

    return processedElement;
  });
};

/**
 * Validate that all ContentStructure elements have IDs
 * @param structure - Array of ContentStructure elements to validate
 * @returns true if all elements have IDs, false otherwise
 */
const validateStructureIds = (structure: ContentStructure[]): boolean => {
  const validateElement = (element: ContentStructure): boolean => {
    if (!element.id) {
      return false;
    }

    // Recursively validate nested elements
    if (
      element.realContentStructure &&
      element.realContentStructure.length > 0
    ) {
      return element.realContentStructure.every(validateElement);
    }

    return true;
  };

  return structure.every(validateElement);
};

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
   * Generate IDs for ContentStructure elements that don't have them
   * Public method that can be used externally
   */
  const generateContentStructureIds = useCallback(
    (structure: ContentStructure[]): ContentStructure[] => {
      if (!Array.isArray(structure) || structure.length === 0) {
        return [];
      }

      return assignIdsToStructure(structure);
    },
    []
  );

  /**
   * Save ContentStructure[] to page.draftContentStructure
   * Now includes automatic ID generation and validation
   */
  const saveDraftStructure = useCallback(
    async (draftStructure: ContentStructure[]): Promise<boolean> => {
      if (!isPageValid || !page) {
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
        // Step 1: Generate IDs for elements that don't have them
        const structureWithIds = assignIdsToStructure(draftStructure);

        // Step 2: Validate that all elements now have IDs
        if (!validateStructureIds(structureWithIds)) {
          toast.error("Failed to assign IDs to all content elements");
          return false;
        }

        const totalElementsCount = structureWithIds.reduce((count, element) => {
          const nestedCount = element.realContentStructure?.length || 0;
          return count + 1 + nestedCount;
        }, 0);

        // Step 3: Prepare updated page data
        const updatedPage: PageData = {
          ...page,
          draftContentStructure: structureWithIds,
          updatedAt: new Date().toISOString(),
        };

        // Step 4: Optimistically update the local state
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

        // Step 5: Sync with server
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
          return false;
        }

        toast.success(
          `Draft structure saved successfully! ${structureWithIds.length} content elements with unique IDs processed.`,
          {
            duration: 4000,
            description: `${totalElementsCount} total elements ready for draft analysis and content generation`,
          }
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
        return false;
      }

      toast.success("Draft structure cleared successfully");
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
    generateContentStructureIds,
  };
}
