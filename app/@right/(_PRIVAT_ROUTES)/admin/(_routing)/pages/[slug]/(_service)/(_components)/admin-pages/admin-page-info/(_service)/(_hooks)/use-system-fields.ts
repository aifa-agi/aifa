// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_hooks)/use-system-fields.ts

"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import {
  EditableSystemField,
  UseSystemFieldsReturn,
  FieldValidation,
} from "../(_types)/admin-page-types";
import {
  FIELD_VALIDATION_RULES,
  FIELD_UI_CONFIG,
  OPERATION_TIMEOUTS,
} from "../(_constants)/system-fields-config";

/**
 * Props for useSystemFields hook - now accepts null page
 */
interface UseSystemFieldsProps {
  page: PageData | null;
  categoryTitle: string;
  slug: string;
}

/**
 * Validates field value according to business rules
 */
const validateField = (
  field: EditableSystemField,
  value: string
): FieldValidation => {
  const sanitizedValue = FIELD_VALIDATION_RULES.TRIM_WHITESPACE
    ? value.trim()
    : value;

  if (
    sanitizedValue.length > 0 &&
    sanitizedValue.length < FIELD_VALIDATION_RULES.MIN_LENGTH
  ) {
    return {
      isValid: false,
      error: `${field} must be at least ${FIELD_VALIDATION_RULES.MIN_LENGTH} characters long`,
    };
  }

  if (sanitizedValue.length > FIELD_VALIDATION_RULES.MAX_LENGTH) {
    return {
      isValid: false,
      error: `${field} must not exceed ${FIELD_VALIDATION_RULES.MAX_LENGTH} characters`,
    };
  }

  if (
    FIELD_VALIDATION_RULES.REQUIRED_FIELDS.includes(field) &&
    sanitizedValue.length === 0
  ) {
    return {
      isValid: false,
      error: `${field} is required`,
    };
  }

  return {
    isValid: true,
    sanitizedValue,
  };
};

/**
 * Custom hook for managing editable system fields in admin page
 * Now properly handles null page values following React hooks rules
 */
export function useSystemFields({
  page,
  categoryTitle,
  slug,
}: UseSystemFieldsProps): UseSystemFieldsReturn {
  const { categories, setCategories, updateCategories } = useNavigationMenu();

  const [editingField, setEditingField] = useState<EditableSystemField | null>(
    null
  );
  const [editingValue, setEditingValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const originalValueRef = useRef<string>("");

  // Check if page is valid for operations - FIXED: properly convert to boolean
  const isPageValid = Boolean(page && page.id);

  /**
   * Start editing a specific field
   */
  const startEditing = useCallback(
    (field: EditableSystemField, currentValue: string) => {
      if (!isPageValid) {
        console.warn("Cannot start editing: page data is not available");
        toast.warning("Page data is not available for editing");
        return;
      }

      if (isUpdating) {
        toast.warning("Please wait for the current update to complete");
        return;
      }

      setEditingField(field);
      setEditingValue(currentValue || "");
      originalValueRef.current = currentValue || "";

      console.log(`Started editing field: ${field} for page: ${page?.id}`);
    },
    [isUpdating, isPageValid, page?.id]
  );

  /**
   * Cancel editing and restore original value
   */
  const cancelEditing = useCallback(() => {
    if (isUpdating) {
      toast.warning("Cannot cancel while update is in progress");
      return;
    }

    console.log(
      `Cancelled editing field: ${editingField} for page: ${page?.id}`
    );

    setEditingField(null);
    setEditingValue("");
    originalValueRef.current = "";
  }, [isUpdating, editingField, page?.id]);

  /**
   * Update the editing value (for controlled input)
   */
  const updateValue = useCallback((value: string) => {
    setEditingValue(value);
  }, []);

  /**
   * Save the current field value to the navigation context
   */
  const saveField = useCallback(async (): Promise<boolean> => {
    if (!isPageValid || !page) {
      console.warn("Cannot save: page data is not available");
      toast.error("Page data is not available for saving");
      return false;
    }

    if (!editingField) {
      toast.error("No field is being edited");
      return false;
    }

    if (isUpdating) {
      toast.warning("Update already in progress");
      return false;
    }

    const validation = validateField(editingField, editingValue);
    if (!validation.isValid) {
      toast.error(validation.error || "Invalid field value");
      return false;
    }

    setIsUpdating(true);

    try {
      const updatedPage: PageData = {
        ...page,
        [editingField]: validation.sanitizedValue,
      };

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
                          [editingField]: originalValueRef.current,
                        }
                  ),
                }
          )
        );

        toast.error(
          `Failed to update ${editingField}: ${updateError.userMessage}`
        );
        console.error(`Failed to update field ${editingField}:`, updateError);
        return false;
      }

      setEditingField(null);
      setEditingValue("");
      originalValueRef.current = "";

      toast.success(`${editingField} updated successfully`, {
        duration: FIELD_UI_CONFIG.SUCCESS_TOAST_DURATION,
      });

      console.log(
        `Successfully updated field: ${editingField} for page: ${page.id}`
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
                        [editingField]: originalValueRef.current,
                      }
                ),
              }
        )
      );

      toast.error(`Unexpected error updating ${editingField}`, {
        duration: FIELD_UI_CONFIG.ERROR_TOAST_DURATION,
      });

      console.error(`Unexpected error updating field ${editingField}:`, error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [
    editingField,
    editingValue,
    isUpdating,
    page,
    categoryTitle,
    setCategories,
    updateCategories,
    isPageValid,
  ]);

  // FIXED: Ensure canEdit is always boolean
  const canEdit: boolean = !isUpdating && isPageValid;

  return {
    editingField,
    editingValue,
    isUpdating,
    startEditing,
    cancelEditing,
    saveField,
    updateValue,
    canEdit,
  };
}
