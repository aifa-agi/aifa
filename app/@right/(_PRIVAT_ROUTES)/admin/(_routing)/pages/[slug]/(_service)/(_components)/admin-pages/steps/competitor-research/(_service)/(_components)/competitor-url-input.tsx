// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/competitor-research/(_service)/(_components)/competitor-url-input.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Plus, Globe, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { UrlInputProps } from "../(_types)/competitor-research-types";
import {
  COMPETITOR_UI_CONFIG,
  COMPETITOR_STATES_CLASSES,
  ERROR_MESSAGES,
  isValidCompetitorUrl,
  extractCompetitorNameFromUrl,
} from "../(_constants)/competitor-research-config";

/**
 * Component for adding competitor URLs with validation
 * Provides input field with real-time validation and preview
 *
 * Key features:
 * - Real-time URL validation with visual feedback
 * - Competitor name extraction preview
 * - Keyboard shortcuts (Enter to add)
 * - Duplicate URL prevention
 * - Maximum competitors limit enforcement
 * - Integration with existing design system
 */
export function CompetitorUrlInput({
  onAddCompetitor,
  canEdit,
  isUpdating,
  existingUrls,
}: UrlInputProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Auto-focus input when component becomes editable
   */
  useEffect(() => {
    if (canEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [canEdit]);

  /**
   * Validate URL with debouncing and set preview
   */
  useEffect(() => {
    if (!urlInput.trim()) {
      setValidationError(null);
      setPreviewName(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsValidating(true);

      try {
        // Validate URL format
        if (!isValidCompetitorUrl(urlInput.trim())) {
          setValidationError(ERROR_MESSAGES.URL_INVALID_FORMAT);
          setPreviewName(null);
          return;
        }

        // Check for duplicates
        if (existingUrls.includes(urlInput.trim())) {
          setValidationError(ERROR_MESSAGES.URL_DUPLICATE);
          setPreviewName(null);
          return;
        }

        // Check maximum limit
        if (existingUrls.length >= COMPETITOR_UI_CONFIG.MAX_COMPETITORS) {
          setValidationError(ERROR_MESSAGES.MAX_COMPETITORS_REACHED);
          setPreviewName(null);
          return;
        }

        // Extract and set preview name
        const extractedName = extractCompetitorNameFromUrl(urlInput.trim());
        setPreviewName(extractedName);
        setValidationError(null);
      } catch (error) {
        setValidationError(ERROR_MESSAGES.URL_INVALID_FORMAT);
        setPreviewName(null);
      } finally {
        setIsValidating(false);
      }
    }, COMPETITOR_UI_CONFIG.DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [urlInput, existingUrls]);

  /**
   * Handle URL input change
   */
  const handleUrlChange = (value: string) => {
    setUrlInput(value);
  };

  /**
   * Handle URL submission
   */
  const handleSubmitUrl = () => {
    if (!urlInput.trim() || validationError || isValidating) {
      return;
    }

    onAddCompetitor(urlInput.trim());
    setUrlInput("");
    setPreviewName(null);
    setValidationError(null);

    // Refocus input for next entry
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitUrl();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setUrlInput("");
      setPreviewName(null);
      setValidationError(null);
    }
  };

  /**
   * Determine input state class
   */
  const getInputStateClass = () => {
    if (isUpdating) return COMPETITOR_STATES_CLASSES.loading;
    if (validationError) return COMPETITOR_STATES_CLASSES.input_invalid;
    if (previewName) return COMPETITOR_STATES_CLASSES.input_valid;
    if (isValidating) return COMPETITOR_STATES_CLASSES.input_pending;
    return "";
  };

  const canSubmit =
    urlInput.trim() &&
    !validationError &&
    !isValidating &&
    canEdit &&
    !isUpdating;

  return (
    <Card className={cn("transition-all duration-200", getInputStateClass())}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base">
            <Globe className="size-4" />
            Add Competitor URL
            <Badge variant="outline" className="text-xs">
              {existingUrls.length} / {COMPETITOR_UI_CONFIG.MAX_COMPETITORS}
            </Badge>
          </div>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Add competitor website URLs for analysis. Supported formats:
          https://example.com
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* URL Input */}
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Input
              ref={inputRef}
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://competitor-website.com"
              disabled={!canEdit || isUpdating}
              className={cn(
                "transition-all duration-200",
                getInputStateClass()
              )}
            />

            {/* Validation feedback */}
            {(validationError || previewName || isValidating) && (
              <div className="flex items-start gap-2 text-sm">
                {isValidating && (
                  <>
                    <LoadingSpinner className="size-4 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      Validating URL...
                    </span>
                  </>
                )}

                {validationError && (
                  <>
                    <AlertCircle className="size-4 mt-0.5 shrink-0 text-destructive" />
                    <span className="text-destructive">{validationError}</span>
                  </>
                )}

                {previewName && !validationError && !isValidating && (
                  <>
                    <ExternalLink className="size-4 mt-0.5 shrink-0 text-green-600" />
                    <div className="text-green-600">
                      <span className="font-medium">Ready to add:</span>{" "}
                      {previewName}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Add button */}
          <Button
            onClick={handleSubmitUrl}
            disabled={!canSubmit}
            className={cn(
              "shrink-0 transition-all duration-200",
              canSubmit
                ? COMPETITOR_STATES_CLASSES.button_primary
                : COMPETITOR_STATES_CLASSES.button_secondary
            )}
            size="default"
          >
            {isUpdating ? (
              <LoadingSpinner className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
            <span className="ml-2">Add</span>
          </Button>
        </div>

        {/* Help text */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {existingUrls.length > 0 &&
              `${existingUrls.length} competitor${existingUrls.length !== 1 ? "s" : ""} added`}
          </span>
          <span className="text-right">Enter to add • Esc to clear</span>
        </div>

        {/* Existing URLs preview (if any) */}
        {existingUrls.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              Added Competitors:
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {existingUrls.slice(-3).map((url, index) => (
                <div
                  key={url}
                  className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted/50 rounded"
                >
                  <ExternalLink className="size-3 shrink-0" />
                  <span className="truncate flex-1" title={url}>
                    {extractCompetitorNameFromUrl(url)} - {url}
                  </span>
                </div>
              ))}
              {existingUrls.length > 3 && (
                <div className="text-center text-xs text-muted-foreground italic">
                  ... and {existingUrls.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
