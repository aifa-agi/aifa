// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_components)/editable-keywords-field.tsx

"use client";

import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Edit3, Save, X, AlertCircle, Plus, Hash, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  KeywordsFieldConfig,
  UseKeywordsFieldReturn,
} from "../(_types)/admin-page-types";
import {
  FIELD_UI_CONFIG,
  KEYWORDS_STATES_CLASSES,
  FIELD_STATES_CLASSES,
  KEYBOARD_SHORTCUTS,
} from "../(_constants)/system-fields-config";

/**
 * Props for EditableKeywordsField component
 */
interface EditableKeywordsFieldProps {
  config: KeywordsFieldConfig;
  currentKeywords?: string[];
  keywordsHook: UseKeywordsFieldReturn;
}

/**
 * Type guard function to check if key is a valid keyword addition key
 */
const isAddKeywordKey = (key: string): key is "Enter" | "Tab" | "," => {
  return key === "Enter" || key === "Tab" || key === ",";
};

/**
 * Component for displaying and editing keywords field
 * Provides inline editing functionality with add/remove capabilities
 *
 * Key features:
 * - Inline editing with keyword management
 * - Add keywords with Enter, Tab, or comma
 * - Remove keywords with click or keyboard
 * - Visual feedback for different states
 * - Validation and duplicate detection
 * - Auto-focus on edit start
 * - Responsive design with proper spacing
 */
export function EditableKeywordsField({
  config,
  currentKeywords = [],
  keywordsHook,
}: EditableKeywordsFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { title, icon: Icon, placeholder, description, maxKeywords } = config;

  const {
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
  } = keywordsHook;

  /**
   * Auto-focus input when editing starts
   */
  useEffect(() => {
    if (editingKeywords && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingKeywords]);

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!editingKeywords) return;

    // Save on Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }

    // Cancel on Escape
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEditingKeywords();
    }
  };

  /**
   * Handle input key press for adding keywords
   */
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    const value = newKeyword.trim();

    // Add keyword on Enter, Tab, or comma - FIXED: Using type guard function
    if (isAddKeywordKey(e.key)) {
      e.preventDefault();
      if (value) {
        addKeyword(value);
      }
    }

    // Remove last keyword on Backspace if input is empty
    if (e.key === "Backspace" && !newKeyword && keywordsList.length > 0) {
      removeKeyword(keywordsList.length - 1);
    }
  };

  /**
   * Handle save operation
   */
  const handleSave = async () => {
    // Add current input value if exists
    if (newKeyword.trim()) {
      addKeyword(newKeyword.trim());
      // Wait a bit for state to update
      setTimeout(async () => {
        const success = await saveKeywords();
        console.log("Save keywords operation:", success ? "SUCCESS" : "FAILED");
      }, 100);
    } else {
      const success = await saveKeywords();
      console.log("Save keywords operation:", success ? "SUCCESS" : "FAILED");
    }
  };

  /**
   * Determine field state class
   */
  const getFieldStateClass = () => {
    if (isUpdating) return FIELD_STATES_CLASSES.saving;
    if (editingKeywords) return KEYWORDS_STATES_CLASSES.editing;
    return FIELD_STATES_CLASSES.idle;
  };

  /**
   * Check if field has keywords
   */
  const hasKeywords = currentKeywords && currentKeywords.length > 0;
  const displayKeywords = editingKeywords ? keywordsList : currentKeywords;

  return (
    <Card className={cn("transition-all duration-200", getFieldStateClass())}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base">
            <Icon className="size-4" />
            {title}
            {maxKeywords && (
              <Badge variant="outline" className="text-xs">
                Max {maxKeywords}
              </Badge>
            )}
          </div>

          {/* Edit/Save/Cancel buttons */}
          <div className="flex items-center gap-1">
            {!editingKeywords ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={startEditingKeywords}
                disabled={!canEdit}
                className="size-8 p-0"
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
                  className="size-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
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
                  onClick={cancelEditingKeywords}
                  disabled={isUpdating}
                  className="size-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
        {editingKeywords ? (
          /* Editing mode */
          <div className="space-y-4">
            {/* Keywords container */}
            <div
              className={cn(
                KEYWORDS_STATES_CLASSES.container,
                isUpdating && "opacity-50"
              )}
            >
              {/* Display existing keywords */}
              {keywordsList.map((keyword, index) => (
                <div
                  key={`${keyword}-${index}`}
                  className={KEYWORDS_STATES_CLASSES.keyword}
                >
                  <Hash className="size-3" />
                  <span>{keyword}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKeyword(index)}
                    disabled={isUpdating}
                    className={cn(
                      "size-4 p-0 ml-1",
                      KEYWORDS_STATES_CLASSES.keywordRemove
                    )}
                    title={`Remove "${keyword}"`}
                  >
                    <X className="size-2" />
                  </Button>
                </div>
              ))}

              {/* Input for new keywords */}
              <div className="flex-1 min-w-[120px] flex items-center">
                <Input
                  ref={inputRef}
                  value={newKeyword}
                  onChange={(e) => updateNewKeyword(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder={placeholder}
                  disabled={isUpdating}
                  className={cn(
                    KEYWORDS_STATES_CLASSES.input,
                    "border-none shadow-none focus-visible:ring-0"
                  )}
                />

                {/* Add button */}
                {newKeyword.trim() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addKeyword(newKeyword.trim())}
                    disabled={
                      isUpdating || keywordsList.length >= (maxKeywords || 20)
                    }
                    className={cn(
                      "size-6 p-0 text-primary hover:text-primary/80",
                      KEYWORDS_STATES_CLASSES.addButton
                    )}
                    title="Add keyword"
                  >
                    <Plus className="size-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Keywords count and help text */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Keywords: {keywordsList.length}
                {maxKeywords && ` / ${maxKeywords}`}
              </span>
              <span className="text-right">
                Enter, Tab, or comma to add • Ctrl+S to save • Esc to cancel
              </span>
            </div>
          </div>
        ) : (
          /* Display mode - read-only */
          <div
            className={cn(
              "min-h-[80px] p-3 rounded-md border transition-colors cursor-pointer",
              hasKeywords
                ? "bg-muted text-foreground hover:bg-muted/80"
                : "bg-muted/50 text-muted-foreground hover:bg-muted/70",
              !canEdit && "cursor-not-allowed opacity-75"
            )}
            onClick={startEditingKeywords}
            role="button"
            tabIndex={canEdit ? 0 : -1}
            aria-label={`${title} field. ${hasKeywords ? `Has ${currentKeywords.length} keywords.` : "No keywords."} Click to edit.`}
          >
            {hasKeywords ? (
              <div className="flex flex-wrap gap-2">
                {displayKeywords.map((keyword, index) => (
                  <Badge
                    key={`display-${keyword}-${index}`}
                    variant="secondary"
                    className="text-xs"
                  >
                    <Hash className="size-3 mr-1" />
                    {keyword}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 italic">
                <AlertCircle className="size-4 shrink-0" />
                <span>Click to add keywords</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
