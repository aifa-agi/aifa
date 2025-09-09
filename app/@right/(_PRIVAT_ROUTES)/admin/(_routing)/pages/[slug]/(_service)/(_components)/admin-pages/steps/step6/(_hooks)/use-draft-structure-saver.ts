// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_hooks)/use-draft-structure-saver.ts

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
 * ✅ NEW: H2 compliance validation result
 */
interface H2ComplianceResult {
  isCompliant: boolean;
  violations: string[];
  suggestions: string[];
  rootElementsCount: number;
  h2ElementsCount: number;
}

/**
 * ✅ NEW: H2 compliance fix result
 */
interface H2ComplianceFixResult extends H2ComplianceResult {
  fixedStructure: ContentStructure[];
  violationsFixed: number;
  autoFixApplied: boolean;
}

/**
 * ✅ NEW: Current compliance status
 */
interface H2ComplianceStatus {
  isCompliant: boolean;
  totalElements: number;
  h2Elements: number;
  compliancePercentage: number;
  lastChecked?: string;
}

/**
 * ✅ UPDATED: Props with H2 compliance support
 */
interface UseDraftStructureSaverProps {
  page: PageData | null;
  categoryTitle: string;
  slug: string;
  enforceH2Compliance?: boolean;
}

/**
 * ✅ UPDATED: Return type with H2 compliance features
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
  // ✅ NEW: H2 compliance features
  validateH2Compliance: (structure: any[]) => Promise<H2ComplianceResult>;
  fixH2Compliance: (structure: any[]) => Promise<H2ComplianceFixResult>;
  getDraftComplianceStatus: () => H2ComplianceStatus;
}

/**
 * Generate short 6-character ID using cuid v2
 */
const generateShortId = (): string => {
  const fullId = createId();
  return fullId.substring(0, 6);
};

/**
 * ✅ UPDATED: Recursively assign IDs with type safety
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
 * ✅ UPDATED: Validate IDs with enhanced checking
 */
const validateStructureIds = (structure: ContentStructure[]): boolean => {
  const validateElement = (element: ContentStructure): boolean => {
    if (!element.id) {
      return false;
    }

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
 * ✅ NEW: Auto-fix H2 compliance by converting all root tags to h2
 */
const autoFixH2Compliance = (
  structure: any[]
): {
  fixed: ContentStructure[];
  fixedCount: number;
} => {
  const fixed: ContentStructure[] = [];
  let fixedCount = 0;

  structure.forEach((item) => {
    const fixedItem = { ...item };

    // Fix root element tag to h2
    if (!fixedItem.tag || fixedItem.tag !== "h2") {
      fixedItem.tag = "h2";
      fixedCount++;
    }

    // Ensure nested elements don't have h1 or h2
    if (
      fixedItem.realContentStructure &&
      Array.isArray(fixedItem.realContentStructure)
    ) {
      fixedItem.realContentStructure = fixedItem.realContentStructure.map(
        (nestedItem: any) => {
          if (nestedItem.tag === "h1" || nestedItem.tag === "h2") {
            fixedCount++;
            return { ...nestedItem, tag: "h3" }; // Convert to h3
          }
          return nestedItem;
        }
      );
    }

    // Ensure required fields exist
    if (!fixedItem.additionalData) {
      fixedItem.additionalData = {
        minWords: 50,
        maxWords: 200,
        actualContent: "Content to be generated...",
      };
      fixedCount++;
    }

    fixed.push(fixedItem);
  });

  return { fixed, fixedCount };
};

/**
 * ✅ NEW: Generate H2 compliance report
 */
const generateH2ComplianceReport = (
  structure: any[]
): {
  isFullyCompliant: boolean;
  violations: string[];
  rootElementsCount: number;
  h2CompliantCount: number;
} => {
  const violations: string[] = [];
  let h2CompliantCount = 0;

  structure.forEach((item, index) => {
    if (!item.tag || item.tag !== "h2") {
      violations.push(
        `Root element ${index}: has tag "${item.tag || "undefined"}" instead of "h2"`
      );
    } else {
      h2CompliantCount++;
    }

    // Check nested elements
    if (item.realContentStructure && Array.isArray(item.realContentStructure)) {
      item.realContentStructure.forEach(
        (nestedItem: any, nestedIndex: number) => {
          if (nestedItem.tag === "h1" || nestedItem.tag === "h2") {
            violations.push(
              `Element ${index}, nested ${nestedIndex}: nested elements cannot have H1 or H2 tags (found: "${nestedItem.tag}")`
            );
          }
        }
      );
    }
  });

  return {
    isFullyCompliant: violations.length === 0,
    violations,
    rootElementsCount: structure.length,
    h2CompliantCount,
  };
};

/**
 * ✅ UPDATED: Custom hook with H2 compliance enforcement
 */
export function useDraftStructureSaver({
  page,
  categoryTitle,
  slug,
  enforceH2Compliance = true,
}: UseDraftStructureSaverProps): UseDraftStructureSaverReturn {
  const { categories, setCategories, updateCategories } = useNavigationMenu();

  const [isUpdating, setIsUpdating] = useState(false);

  // Check if page is valid for operations
  const isPageValid = Boolean(page && page.id);
  const hasDraftStructure = Boolean(page?.draftContentStructure?.length);
  const draftElementsCount = page?.draftContentStructure?.length || 0;
  const canUpdate = !isUpdating && isPageValid;

  /**
   * ✅ NEW: Validate H2 compliance
   */
  const validateH2Compliance = useCallback(
    async (structure: any[]): Promise<H2ComplianceResult> => {
      try {
        const complianceReport = generateH2ComplianceReport(structure);

        return {
          isCompliant: complianceReport.isFullyCompliant,
          violations: complianceReport.violations,
          suggestions: complianceReport.violations.map((violation) =>
            violation.includes("h2")
              ? `Convert to H2: ${violation}`
              : `Fix hierarchy: ${violation}`
          ),
          rootElementsCount: complianceReport.rootElementsCount,
          h2ElementsCount: complianceReport.h2CompliantCount,
        };
      } catch (error) {
        return {
          isCompliant: false,
          violations: [
            `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
          ],
          suggestions: ["Check data format and structure"],
          rootElementsCount: 0,
          h2ElementsCount: 0,
        };
      }
    },
    []
  );

  /**
   * ✅ NEW: Fix H2 compliance issues
   */
  const fixH2Compliance = useCallback(
    async (structure: any[]): Promise<H2ComplianceFixResult> => {
      try {
        const fixResult = autoFixH2Compliance(structure);
        const validationResult = await validateH2Compliance(fixResult.fixed);

        return {
          ...validationResult,
          fixedStructure: fixResult.fixed,
          violationsFixed: fixResult.fixedCount,
          autoFixApplied: fixResult.fixedCount > 0,
        };
      } catch (error) {
        return {
          isCompliant: false,
          violations: [
            `Fix error: ${error instanceof Error ? error.message : "Unknown error"}`,
          ],
          suggestions: ["Check data format and try manual fix"],
          rootElementsCount: 0,
          h2ElementsCount: 0,
          fixedStructure: [],
          violationsFixed: 0,
          autoFixApplied: false,
        };
      }
    },
    [validateH2Compliance]
  );

  /**
   * ✅ NEW: Get current draft compliance status
   */
  const getDraftComplianceStatus = useCallback((): H2ComplianceStatus => {
    if (
      !page?.draftContentStructure ||
      page.draftContentStructure.length === 0
    ) {
      return {
        isCompliant: true,
        totalElements: 0,
        h2Elements: 0,
        compliancePercentage: 100,
      };
    }

    const totalElements = page.draftContentStructure.length;
    const h2Elements = page.draftContentStructure.filter(
      (item) => item.tag === "h2"
    ).length;

    const isCompliant = h2Elements === totalElements;
    const compliancePercentage =
      totalElements > 0 ? (h2Elements / totalElements) * 100 : 100;

    return {
      isCompliant,
      totalElements,
      h2Elements,
      compliancePercentage,
      lastChecked: new Date().toISOString(),
    };
  }, [page?.draftContentStructure]);

  /**
   * Generate IDs for ContentStructure elements that don't have them
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
   * ✅ UPDATED: Save with H2 compliance enforcement
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
        let structureWithIds = assignIdsToStructure(draftStructure);

        // Step 2: Validate that all elements now have IDs
        if (!validateStructureIds(structureWithIds)) {
          toast.error("Failed to assign IDs to all content elements");
          setIsUpdating(false);
          return false;
        }

        // ✅ Step 3: H2 Compliance enforcement (if enabled)
        let finalStructure = structureWithIds;
        let h2ComplianceApplied = false;
        let violationsFixed = 0;

        if (enforceH2Compliance) {
          const complianceCheck = await validateH2Compliance(structureWithIds);

          if (!complianceCheck.isCompliant) {
            toast.info(
              `Applying H2 compliance fixes (${complianceCheck.violations.length} violations found)...`,
              { duration: 3000 }
            );

            const fixResult = await fixH2Compliance(structureWithIds);

            if (fixResult.autoFixApplied) {
              finalStructure = fixResult.fixedStructure;
              h2ComplianceApplied = true;
              violationsFixed = fixResult.violationsFixed;

              toast.success(
                `H2 compliance applied: fixed ${violationsFixed} violations`,
                { duration: 4000 }
              );
            } else {
              toast.warning(
                "H2 compliance could not be automatically applied",
                { duration: 4000 }
              );
            }
          }
        }

        // Step 4: Calculate total elements count
        const totalElementsCount = finalStructure.reduce((count, element) => {
          const nestedCount = element.realContentStructure?.length || 0;
          return count + 1 + nestedCount;
        }, 0);

        // Step 5: Prepare updated page data
        const updatedPage: PageData = {
          ...page,
          draftContentStructure: finalStructure as RootContentStructure[], // ✅ Type assertion for compatibility
          updatedAt: new Date().toISOString(),
        };

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

        // ✅ Enhanced success message with H2 compliance info
        const baseMessage = `Draft structure saved successfully! ${finalStructure.length} content elements with unique IDs processed.`;
        const complianceMessage = h2ComplianceApplied
          ? ` H2 compliance enforced (${violationsFixed} violations fixed).`
          : "";

        toast.success(baseMessage + complianceMessage, {
          duration: 5000,
          description: `${totalElementsCount} total elements ready for draft analysis and content generation`,
        });

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

        const errorMessage =
          error instanceof Error
            ? `Draft structure save error: ${error.message}`
            : "Unexpected error saving draft structure";

        toast.error(errorMessage);
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
      enforceH2Compliance,
      validateH2Compliance,
      fixH2Compliance,
    ]
  );

  /**
   * ✅ UPDATED: Clear with compliance status reporting
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

    if (
      !page.draftContentStructure ||
      page.draftContentStructure.length === 0
    ) {
      toast.info("Draft structure is already empty");
      return true;
    }

    setIsUpdating(true);

    try {
      // ✅ Get current compliance status before clearing
      const currentCompliance = getDraftComplianceStatus();

      const updatedPage: PageData = {
        ...page,
        draftContentStructure: undefined,
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

      // ✅ Enhanced success message with compliance info
      const complianceInfo = currentCompliance.isCompliant
        ? ` (was H2-compliant: ${currentCompliance.h2Elements}/${currentCompliance.totalElements})`
        : ` (had ${currentCompliance.totalElements - currentCompliance.h2Elements} H2 violations)`;

      toast.success(`Draft structure cleared successfully${complianceInfo}`);
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

      const errorMessage =
        error instanceof Error
          ? `Clear draft structure error: ${error.message}`
          : "Unexpected error clearing draft structure";

      toast.error(errorMessage);
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
    getDraftComplianceStatus,
  ]);

  return {
    isUpdating,
    saveDraftStructure,
    clearDraftStructure,
    hasDraftStructure,
    draftElementsCount,
    canUpdate,
    generateContentStructureIds,
    // ✅ NEW: H2 compliance features
    validateH2Compliance,
    fixH2Compliance,
    getDraftComplianceStatus,
  };
}
