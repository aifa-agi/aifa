// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_components)/editable-system-field.tsx

"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Edit3, Save, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EditableSystemField,
  SystemFieldConfig,
} from "../(_types)/admin-page-types";
import {
  FIELD_UI_CONFIG,
  FIELD_STATES_CLASSES,
} from "../(_constants)/system-fields-config";

/**
 * Props for EditableSystemField component
 */
interface EditableSystemFieldProps {
  config: SystemFieldConfig;
  currentValue?: string;
  isEditing: boolean;
  editingValue: string;
  isUpdating: boolean;
  canEdit: boolean;
  onStartEdit: (field: EditableSystemField, currentValue: string) => void;
  onCancel: () => void;
  onSave: () => Promise<boolean>;
  onValueChange: (value: string) => void;
}

/**
 * Component for displaying and editing system instruction fields
 * Provides inline editing functionality with validation and state management
 *
 * Key features:
 * - Inline editing with textarea expansion
 * - Keyboard shortcuts (Ctrl+S to save, Escape to cancel)
 * - Visual feedback for different states (editing, saving, error)
 * - Auto-focus on edit start
 * - Responsive design with proper spacing
 * - Integration with existing design system
 */
export function EditableSystemFields({
  config,
  currentValue = "",
  isEditing,
  editingValue,
  isUpdating,
  canEdit,
  onStartEdit,
  onCancel,
  onSave,
  onValueChange,
}: EditableSystemFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { field, title, icon: Icon, placeholder, description } = config;

  /**
   * Auto-focus textarea when editing starts
   */
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      const length = editingValue.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing, editingValue]);

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isEditing) return;

    // Save on Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }

    // Cancel on Escape
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  /**
   * Handle save operation with loading state
   */
  const handleSave = async () => {
    const success = await onSave();
    console.log(
      `Save operation for field ${field}:`,
      success ? "SUCCESS" : "FAILED"
    );
  };

  /**
   * Handle edit start
   */
  const handleStartEdit = () => {
    if (!canEdit) {
      console.warn(`Cannot edit field ${field}: editing disabled`);
      return;
    }
    onStartEdit(field, currentValue);
  };

  /**
   * Determine field state class
   */
  const getFieldStateClass = () => {
    if (isUpdating) return FIELD_STATES_CLASSES.saving;
    if (isEditing) return FIELD_STATES_CLASSES.editing;
    return FIELD_STATES_CLASSES.idle;
  };

  /**
   * Check if field has content
   */
  const hasContent = currentValue && currentValue.trim().length > 0;

  return (
    <Card className={cn("transition-all duration-200", getFieldStateClass())}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base">
            <Icon className="size-4" />
            {title}
          </div>

          {/* Edit/Save/Cancel buttons */}
          <div className="flex items-center gap-1">
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartEdit}
                disabled={!canEdit}
                className="h-8 w-8 p-0"
                title={`Edit ${title.toLowerCase()}`}
              >
                <Edit3 className="size-3" />
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  title="Save changes (Ctrl+S)"
                >
                  {isUpdating ? (
                    <LoadingSpinner className="size-3" />
                  ) : (
                    <Save className="size-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  disabled={isUpdating}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Cancel editing (Esc)"
                >
                  <X className="size-3" />
                </Button>
              </div>
            )}
          </div>
        </CardTitle>

        {/* Field description */}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardHeader>

      <CardContent onKeyDown={handleKeyDown}>
        {isEditing ? (
          /* Editing mode - textarea */
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              value={editingValue}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder={placeholder}
              disabled={isUpdating}
              className={cn(
                "min-h-[80px] resize-y",
                isUpdating && "opacity-50"
              )}
              rows={FIELD_UI_CONFIG.TEXTAREA_MIN_ROWS}
            />

            {/* Character count */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {editingValue.length > 0 && (
                  <>Characters: {editingValue.length}</>
                )}
              </span>
              <span className="text-right">Ctrl+S to save • Esc to cancel</span>
            </div>
          </div>
        ) : (
          /* Display mode - read-only */
          <div
            className={cn(
              "min-h-[80px] p-3 rounded-md border transition-colors cursor-pointer",
              hasContent
                ? "bg-muted text-foreground hover:bg-muted/80"
                : "bg-muted/50 text-muted-foreground hover:bg-muted/70",
              !canEdit && "cursor-not-allowed opacity-75"
            )}
            onClick={handleStartEdit}
            role="button"
            tabIndex={canEdit ? 0 : -1}
            aria-label={`${title} field. ${hasContent ? "Has content." : "Empty."} Click to edit.`}
          >
            {hasContent ? (
              <div className="whitespace-pre-wrap break-words">
                {currentValue}
              </div>
            ) : (
              <div className="flex items-center gap-2 italic">
                <AlertCircle className="size-4 flex-shrink-0" />
                <span>Click to add {title.toLowerCase()}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
