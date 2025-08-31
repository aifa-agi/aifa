// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_hooks)/use-keywords-field.ts

"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import {
  UseKeywordsFieldReturn,
  KeywordsValidation,
} from "../(_types)/admin-page-types";
import {
  KEYWORDS_VALIDATION_RULES,
  FIELD_UI_CONFIG,
  OPERATION_TIMEOUTS,
} from "../(_constants)/system-fields-config";

/**
 * Props for useKeywordsField hook
 */
interface UseKeywordsFieldProps {
  page: PageData | null;
  categoryTitle: string;
  slug: string;
}

/**
 * Validates a single keyword according to business rules
 */
const validateKeyword = (
  keyword: string
): { isValid: boolean; error?: string; sanitizedValue?: string } => {
  const sanitized = KEYWORDS_VALIDATION_RULES.TRIM_WHITESPACE
    ? keyword.trim()
    : keyword;

  if (sanitized.length < KEYWORDS_VALIDATION_RULES.MIN_KEYWORD_LENGTH) {
    return {
      isValid: false,
      error: `Keyword must be at least ${KEYWORDS_VALIDATION_RULES.MIN_KEYWORD_LENGTH} characters long`,
    };
  }

  if (sanitized.length > KEYWORDS_VALIDATION_RULES.MAX_KEYWORD_LENGTH) {
    return {
      isValid: false,
      error: `Keyword must not exceed ${KEYWORDS_VALIDATION_RULES.MAX_KEYWORD_LENGTH} characters`,
    };
  }

  if (!KEYWORDS_VALIDATION_RULES.ALLOWED_CHARS.test(sanitized)) {
    return {
      isValid: false,
      error:
        "Keyword contains invalid characters. Only letters, numbers, spaces, hyphens, and underscores are allowed",
    };
  }

  return {
    isValid: true,
    sanitizedValue: sanitized,
  };
};

/**
 * Validates the entire keywords array
 */
const validateKeywords = (keywords: string[]): KeywordsValidation => {
  // Remove empty keywords and trim
  const sanitizedKeywords = keywords
    .map((k) => (KEYWORDS_VALIDATION_RULES.TRIM_WHITESPACE ? k.trim() : k))
    .filter((k) => k.length > 0);

  // Check maximum count
  if (sanitizedKeywords.length > KEYWORDS_VALIDATION_RULES.MAX_KEYWORDS) {
    return {
      isValid: false,
      error: `Maximum ${KEYWORDS_VALIDATION_RULES.MAX_KEYWORDS} keywords allowed`,
    };
  }

  // Validate each keyword individually
  for (const keyword of sanitizedKeywords) {
    const validation = validateKeyword(keyword);
    if (!validation.isValid) {
      return {
        isValid: false,
        error: `Invalid keyword "${keyword}": ${validation.error}`,
      };
    }
  }

  // Remove duplicates (case-insensitive if configured)
  const uniqueKeywords = KEYWORDS_VALIDATION_RULES.REMOVE_DUPLICATES
    ? Array.from(
        new Set(
          KEYWORDS_VALIDATION_RULES.CASE_INSENSITIVE_DUPLICATES
            ? sanitizedKeywords.map((k) => k.toLowerCase())
            : sanitizedKeywords
        )
      ).map((k) => {
        // Find original case version for case-insensitive deduplication
        if (KEYWORDS_VALIDATION_RULES.CASE_INSENSITIVE_DUPLICATES) {
          return (
            sanitizedKeywords.find((orig) => orig.toLowerCase() === k) || k
          );
        }
        return k;
      })
    : sanitizedKeywords;

  return {
    isValid: true,
    sanitizedKeywords: uniqueKeywords,
  };
};

/**
 * Custom hook for managing keywords field in admin page
 * Provides functionality to add, remove, and save keywords
 */
export function useKeywordsField({
  page,
  categoryTitle,
  slug,
}: UseKeywordsFieldProps): UseKeywordsFieldReturn {
  const { categories, setCategories, updateCategories } = useNavigationMenu();

  const [editingKeywords, setEditingKeywords] = useState(false);
  const [keywordsList, setKeywordsList] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const originalKeywordsRef = useRef<string[]>([]);

  // Check if page is valid for operations
  const isPageValid = Boolean(page && page.id);

  /**
   * Start editing keywords
   */
  const startEditingKeywords = useCallback(() => {
    if (!isPageValid) {
      console.warn("Cannot start editing keywords: page data is not available");
      toast.warning("Page data is not available for editing");
      return;
    }

    if (isUpdating) {
      toast.warning("Please wait for the current update to complete");
      return;
    }

    const currentKeywords = page?.keywords || [];
    setEditingKeywords(true);
    setKeywordsList([...currentKeywords]);
    setNewKeyword("");
    originalKeywordsRef.current = [...currentKeywords];

    console.log(
      `Started editing keywords for page: ${page?.id}`,
      currentKeywords
    );
  }, [isUpdating, isPageValid, page]);

  /**
   * Cancel editing and restore original keywords
   */
  const cancelEditingKeywords = useCallback(() => {
    if (isUpdating) {
      toast.warning("Cannot cancel while update is in progress");
      return;
    }

    console.log(`Cancelled editing keywords for page: ${page?.id}`);

    setEditingKeywords(false);
    setKeywordsList([]);
    setNewKeyword("");
    originalKeywordsRef.current = [];
  }, [isUpdating, page?.id]);

  /**
   * Add a new keyword to the list
   */
  const addKeyword = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) {
        return;
      }

      const validation = validateKeyword(keyword);
      if (!validation.isValid) {
        toast.error(validation.error || "Invalid keyword");
        return;
      }

      const sanitizedKeyword = validation.sanitizedValue!;

      // Check for duplicates (case-insensitive if configured)
      const isDuplicate = KEYWORDS_VALIDATION_RULES.CASE_INSENSITIVE_DUPLICATES
        ? keywordsList.some(
            (k) => k.toLowerCase() === sanitizedKeyword.toLowerCase()
          )
        : keywordsList.includes(sanitizedKeyword);

      if (isDuplicate) {
        toast.warning("This keyword already exists");
        return;
      }

      // Check maximum count
      if (keywordsList.length >= KEYWORDS_VALIDATION_RULES.MAX_KEYWORDS) {
        toast.error(
          `Maximum ${KEYWORDS_VALIDATION_RULES.MAX_KEYWORDS} keywords allowed`
        );
        return;
      }

      setKeywordsList((prev) => [...prev, sanitizedKeyword]);
      setNewKeyword("");

      console.log(`Added keyword: "${sanitizedKeyword}"`);
    },
    [keywordsList]
  );

  /**
   * Remove keyword by index
   */
  const removeKeyword = useCallback(
    (index: number) => {
      if (index < 0 || index >= keywordsList.length) {
        console.warn(`Invalid keyword index: ${index}`);
        return;
      }

      const removedKeyword = keywordsList[index];
      setKeywordsList((prev) => prev.filter((_, i) => i !== index));

      console.log(`Removed keyword at index ${index}: "${removedKeyword}"`);
    },
    [keywordsList]
  );

  /**
   * Update the new keyword input value
   */
  const updateNewKeyword = useCallback((value: string) => {
    setNewKeyword(value);
  }, []);

  /**
   * Save keywords to the navigation context
   */
  const saveKeywords = useCallback(async (): Promise<boolean> => {
    if (!isPageValid || !page) {
      console.warn("Cannot save keywords: page data is not available");
      toast.error("Page data is not available for saving");
      return false;
    }

    if (isUpdating) {
      toast.warning("Update already in progress");
      return false;
    }

    // Validate the entire keywords array
    const validation = validateKeywords(keywordsList);
    if (!validation.isValid) {
      toast.error(validation.error || "Invalid keywords");
      return false;
    }

    setIsUpdating(true);

    try {
      const updatedPage: PageData = {
        ...page,
        keywords: validation.sanitizedKeywords || [],
      };

      // Update categories in context
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

      // Attempt to persist changes
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
                          keywords: originalKeywordsRef.current,
                        }
                  ),
                }
          )
        );

        toast.error(`Failed to update keywords: ${updateError.userMessage}`);
        console.error("Failed to update keywords:", updateError);
        return false;
      }

      // Success - reset editing state
      setEditingKeywords(false);
      setKeywordsList([]);
      setNewKeyword("");
      originalKeywordsRef.current = [];

      const keywordCount = validation.sanitizedKeywords?.length || 0;
      toast.success(
        `Keywords updated successfully (${keywordCount} keyword${keywordCount !== 1 ? "s" : ""})`,
        { duration: FIELD_UI_CONFIG.SUCCESS_TOAST_DURATION }
      );

      console.log(
        `Successfully updated keywords for page: ${page.id}`,
        validation.sanitizedKeywords
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
                        keywords: originalKeywordsRef.current,
                      }
                ),
              }
        )
      );

      toast.error("Unexpected error updating keywords", {
        duration: FIELD_UI_CONFIG.ERROR_TOAST_DURATION,
      });

      console.error("Unexpected error updating keywords:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [
    keywordsList,
    isUpdating,
    page,
    categoryTitle,
    setCategories,
    updateCategories,
    isPageValid,
  ]);

  // Ensure canEdit is always boolean
  const canEdit: boolean = !isUpdating && isPageValid;

  return {
    editingKeywords,
    keywordsList,
    newKeyword,
    isUpdating,
    startEditingKeywords,
    cancelEditingKeywords,
    saveKeywords,
    addKeyword,
    removeKeyword,
    updateNewKeyword,
    canEdit,
  };
}
