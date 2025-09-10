// @app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_hooks)/use-draft-structure-saver.ts

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import {
  PageData,
  ContentStructure,
  RootContentStructure,
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
  // ОБНОВЛЕНО: принимает ContentStructure[], но конвертирует в RootContentStructure[]
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
  console.log(`🔍 Processing ${structure.length} elements at current level`);

  return structure.map((element, index) => {
    console.log(`\n--- Processing element ${index} ---`);
    console.log("Original element.id:", element.id);
    console.log("Element tag:", element.tag);
    console.log("Element classification:", element.classification);

    const newId = element.id || generateShortId();
    console.log("Assigned ID:", newId);

    const processedElement: ContentStructure = {
      ...element,
      id: newId,
    };

    // Рекурсивно обрабатываем вложенные элементы
    if (
      element.realContentStructure &&
      element.realContentStructure.length > 0
    ) {
      console.log(
        `📁 Element has ${element.realContentStructure.length} nested elements`
      );
      processedElement.realContentStructure = assignIdsToStructure(
        element.realContentStructure
      );
    } else {
      console.log("📄 Element has no nested structure");
    }

    console.log("Final element ID:", processedElement.id);
    return processedElement;
  });
};

/**
 * Convert ContentStructure[] to RootContentStructure[] with H2 validation
 * @param structure - Array of ContentStructure elements
 * @returns Array of RootContentStructure with enforced H2 tags
 */
const convertToRootStructure = (
  structure: ContentStructure[]
): RootContentStructure[] => {
  console.log(
    `🏗️ Converting ${structure.length} elements to RootContentStructure`
  );

  return structure.map((element, index) => {
    const originalTag = element.tag;

    // Принудительно устанавливаем H2 для корневых элементов
    const rootElement: RootContentStructure = {
      ...element,
      tag: "h2" as const,
    };

    if (originalTag && originalTag !== "h2") {
      console.warn(
        `⚠️ Converting root element ${index} from tag "${originalTag}" to "h2" for semantic hierarchy`
      );
    }

    console.log(`✅ Root element ${index}: ID=${rootElement.id}, tag=h2`);
    return rootElement;
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
      console.error(`❌ Element missing ID:`, element);
      return false;
    }

    // Рекурсивно валидируем вложенные элементы
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
 * Count total elements including nested ones
 * @param structure - Array of ContentStructure elements
 * @returns Total count of all elements
 */
const countTotalElements = (structure: ContentStructure[]): number => {
  return structure.reduce((count, element) => {
    let nestedCount = 0;
    if (
      element.realContentStructure &&
      element.realContentStructure.length > 0
    ) {
      nestedCount = countTotalElements(element.realContentStructure);
    }
    return count + 1 + nestedCount;
  }, 0);
};

/**
 * Custom hook for managing draftContentStructure field with ID generation
 * Combines ContentStructure processing with RootContentStructure type safety
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
        console.warn("Invalid structure provided for ID generation");
        return [];
      }

      console.log(`🔧 Starting ID generation for ${structure.length} elements`);
      return assignIdsToStructure(structure);
    },
    []
  );

  /**
   * Save ContentStructure[] to page.draftContentStructure
   * Includes automatic ID generation, H2 conversion, and validation
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
        console.log(
          `🚀 Starting draft structure processing for ${draftStructure.length} elements`
        );

        // Step 1: Generate IDs for elements that don't have them
        console.log(`🔧 Step 1: Assigning IDs to structure elements`);
        const structureWithIds = assignIdsToStructure(draftStructure);

        // Step 2: Validate that all elements now have IDs
        console.log(`🔍 Step 2: Validating ID assignment`);
        if (!validateStructureIds(structureWithIds)) {
          toast.error("Failed to assign IDs to all content elements");
          console.error("❌ ID validation failed for draft structure");
          return false;
        }

        // Step 3: Convert to RootContentStructure with H2 enforcement
        console.log(`🏗️ Step 3: Converting to RootContentStructure`);
        const rootStructure = convertToRootStructure(structureWithIds);

        // Step 4: Count total elements for reporting
        const totalElementsCount = countTotalElements(structureWithIds);
        console.log(
          `📊 Total elements processed: ${totalElementsCount} (${rootStructure.length} root elements)`
        );

        // Step 5: Prepare updated page data
        const updatedPage: PageData = {
          ...page,
          draftContentStructure: rootStructure, // Теперь типы совместимы
          updatedAt: new Date().toISOString(),
        };

        console.log(`💾 Step 4: Saving draft structure for page: ${page.id}`);

        // Step 6: Optimistically update the local state
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

        // Step 7: Sync with server
        console.log(`🌐 Step 5: Syncing with server`);
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
          console.error("❌ Failed to save draft structure:", updateError);
          return false;
        }

        toast.success(
          `Draft structure saved successfully! ${rootStructure.length} H2 sections with unique IDs processed.`,
          {
            duration: 4000,
            description: `${totalElementsCount} total elements ready for draft analysis and content generation`,
          }
        );

        console.log(
          `✅ Successfully saved draft structure with IDs for page: ${page.id}`
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
        console.error("❌ Unexpected error saving draft structure:", error);
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
        draftContentStructure: undefined,
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
    generateContentStructureIds,
  };
}
