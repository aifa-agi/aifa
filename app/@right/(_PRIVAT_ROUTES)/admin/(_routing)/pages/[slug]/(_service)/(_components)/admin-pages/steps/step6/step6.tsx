// @app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/admin-page-step6.tsx

"use client";

/*
  CSS-only refactor plan (no logic changes) — Comments in English:

  1) Focus visibility & accessibility
     - Add focus-visible rings to actionable elements (Buttons, Textarea) with ring-offset for contrast.
     - Ensure mouse clicks don't show obtrusive rings; keyboard nav remains clearly indicated.

  2) Icon sizing & consistency
     - Replace inconsistent `size-*` with Tailwind `h-* w-*` pairs for predictable behavior across setups.

  3) Status & message cards
     - Use subtle semantic backgrounds/borders for success, warning, and error sections with dark mode counterparts.
     - Keep rounded corners consistent with shadcn/ui feel.

  4) Spacing & typography
     - Normalize paddings, gaps, and font sizes across header, content areas, and meta info.
     - Improve Textarea readability: monospace, better line-height, selection color, responsive min/max heights.

  5) Buttons
     - Add clear hover/focus/disabled states aligned with shadcn/ui best practices.
     - Keep icon sizes consistent and spacing between icon and label uniform.

  6) Do not change:
     - Component logic, handlers, hooks, render conditions, or text content.
     - Only Tailwind classes and presentational tweaks are adjusted.
*/

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  AlertCircle,
  Save,
  FileCode,
  Layers,
  CheckCircle,
  Database,
  Wrench,
  RefreshCw,
  Copy,
  Trash2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { Badge } from "@/components/ui/badge";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { PageNotFound } from "../../../page-not-found";
import { useDraftStructureSaver } from "./(_hooks)/use-draft-structure-saver";
import { useContentRepair } from "./(_hooks)/use-content-repair";
import { ContentRepairTool } from "./(_components)/content-repair-tool";
import { ContentStructure } from "@/app/@right/(_service)/(_types)/page-types";
import { ValidationTipsWarning } from "./(_components)/validation-tips-warning";
import { RepairLimitationsError } from "./(_components)/repair-limitations-error";

interface AdminPageStep6Props {
  slug: string;
}

/**
 * Компонент Step6 для загрузки и сохранения AI-сгенерированной ContentStructure
 * в поле draftContentStructure с валидацией и восстановлением через AI
 */
export function AdminPageStep6({ slug }: AdminPageStep6Props) {
  const { categories, loading, initialized } = useNavigationMenu();

  // Локальное состояние
  const [jsonContent, setJsonContent] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [parsedContent, setParsedContent] = useState<ContentStructure[] | null>(
    null
  );
  const [showRepairTool, setShowRepairTool] = useState(false);

  // Поиск данных страницы
  const pageData = findPageBySlug(categories, slug);

  // Хук для управления draftContentStructure
  const {
    saveDraftStructure, // вместо saveDraftContentStructure
    clearDraftStructure, // вместо clearDraftContentStructure
    isUpdating: isSaving,
    hasDraftStructure, // вместо hasDraftContent
    draftElementsCount,
    canUpdate,
  } = useDraftStructureSaver({
    page: pageData?.page || null,
    categoryTitle: pageData?.category?.title || "",
    slug,
  });

  // Хук для восстановления JSON через AI
  const { resetRepairState } = useContentRepair();

  /**
   * Валидация ContentStructure JSON
   */
  const validateContentStructure = (data: any): data is ContentStructure[] => {
    if (!Array.isArray(data)) {
      throw new Error("Content must be an array of ContentStructure objects");
    }

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (!item || typeof item !== "object") {
        throw new Error(`Element at index ${i} must be an object`);
      }

      if (!item.additionalData || typeof item.additionalData !== "object") {
        throw new Error(
          `Element at index ${i} must have "additionalData" object`
        );
      }

      const { additionalData } = item;

      if (
        typeof additionalData.minWords !== "number" ||
        additionalData.minWords < 0
      ) {
        throw new Error(
          `Element at index ${i}: minWords must be a positive number`
        );
      }

      if (
        typeof additionalData.maxWords !== "number" ||
        additionalData.maxWords < additionalData.minWords
      ) {
        throw new Error(`Element at index ${i}: maxWords must be >= minWords`);
      }

      if (
        !additionalData.actualContent ||
        typeof additionalData.actualContent !== "string"
      ) {
        throw new Error(
          `Element at index ${i}: actualContent must be a non-empty string`
        );
      }
    }

    return true;
  };

  /**
   * Обработка изменения JSON контента
   */
  const handleJsonChange = (value: string) => {
    setJsonContent(value);
    setValidationError("");
    setParsedContent(null);
    setShowRepairTool(false);
    resetRepairState();

    if (!value.trim()) return;

    try {
      const parsed = JSON.parse(value);
      validateContentStructure(parsed);
      setParsedContent(parsed);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid JSON format";
      setValidationError(errorMessage);
    }
  };

  /**
   * Сохранение ContentStructure в draftContentStructure
   */
  const handleSaveStructure = async () => {
    if (!parsedContent) {
      toast.error("No valid content structure to save");
      return;
    }

    const success = await saveDraftStructure(parsedContent);

    if (success) {
      setJsonContent("");
      setParsedContent(null);
      setValidationError("");
      setShowRepairTool(false);
    }
  };

  /**
   * Очистка сохраненной структуры
   */
  const handleClearStructure = async () => {
    const success = await clearDraftStructure();

    if (success) {
      setJsonContent("");
      setParsedContent(null);
      setValidationError("");
      setShowRepairTool(false);
    }
  };

  /**
   * Показать инструмент восстановления
   */
  const handleShowRepairTool = () => {
    if (!validationError || !jsonContent.trim()) {
      toast.error("No invalid JSON to repair");
      return;
    }
    setShowRepairTool(true);
  };

  /**
   * Обработка успешного восстановления
   */
  const handleRepairSuccess = (repairedJsonString: string) => {
    handleJsonChange(repairedJsonString);
    setShowRepairTool(false);
    toast.success("JSON structure successfully repaired and validated!");
  };

  /**
   * Копирование в буфер обмена
   */
  const handleCopyToClipboard = async () => {
    if (!parsedContent) return;

    try {
      const jsonString = JSON.stringify(parsedContent, null, 2);
      await navigator.clipboard.writeText(jsonString);
      toast.success("Content structure copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Состояния загрузки
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12 text-sm">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">
          Loading draft content structure...
        </span>
      </div>
    );
  }

  if (!pageData) {
    return <PageNotFound slug={slug} />;
  }

  const { page, category } = pageData;
  const isValidJson = parsedContent !== null;
  const hasValidationError = !!validationError;
  const canSave = isValidJson && !isSaving && canUpdate;
  const canClear = hasDraftStructure && !isSaving && canUpdate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileCode className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl md:text-2xl font-semibold">
                Draft Content Structure Upload
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Upload AI-generated ContentStructure JSON to save as draft
                content structure
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              <Layers className="h-3 w-3 mr-1" />
              Step 6
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Current Status */}
      {hasDraftStructure && (
        <Card className="border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/40 rounded-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h4 className="font-medium text-emerald-900 dark:text-emerald-100">
                    Draft Content Structure Saved
                  </h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    {draftElementsCount} elements stored in
                    draftContentStructure
                  </p>
                </div>
              </div>
              <Button
                onClick={handleClearStructure}
                variant="outline"
                size="sm"
                disabled={!canClear}
                className="border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-950 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <LoadingSpinner className="h-4 w-4 mr-2" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Structure
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Upload Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl md:text-2xl font-semibold">
              Upload ContentStructure JSON
            </CardTitle>
            {isValidJson && (
              <Badge variant="default" className="bg-emerald-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Valid Structure
              </Badge>
            )}
            {hasValidationError && (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Invalid JSON
              </Badge>
            )}
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="leading-relaxed">
              Paste your AI-generated ContentStructure JSON array. The system
              will validate the structure and save it to the
              draftContentStructure field for further processing.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Instructions */}
          <div className="rounded-md border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/40">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-2">
                  Expected Format:
                </h4>
                <div className="text-blue-800 dark:text-blue-200 text-xs space-y-1">
                  <p>• Array of ContentStructure objects</p>
                  <p>
                    • Each element must have additionalData.minWords, maxWords,
                    actualContent
                  </p>
                  <p>
                    • Optional fields: tag, keywords, intent, taxonomy,
                    audiences, selfPrompt
                  </p>
                  <p>• Supports nested structure via realContentStructure</p>
                </div>
              </div>
            </div>
          </div>

          {/* JSON Input */}
          <div className="space-y-3">
            <Label htmlFor="json-content" className="text-sm font-medium">
              ContentStructure JSON Array
            </Label>

            <Textarea
              id="json-content"
              placeholder={`Paste your ContentStructure JSON array here, for example:
[
  {
    "tag": "h2",
    "keywords": ["example", "content"],
    "intent": "Introduce the main topic",
    "taxonomy": "Introduction",
    "audiences": "General audience",
    "selfPrompt": "Generate an engaging introduction about...",
    "additionalData": {
      "minWords": 50,
      "maxWords": 150,
      "actualContent": "Complete introduction text here..."
    }
  }
]`}
              value={jsonContent}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="min-h-[320px] md:min-h-[360px] max-h-[600px] resize-y font-mono text-xs md:text-sm leading-6 whitespace-pre-wrap break-words selection:bg-primary/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              disabled={isSaving}
            />

            {/* Character count */}
            {jsonContent.trim() && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{jsonContent.length} characters</span>
                {isValidJson && (
                  <span className="text-emerald-700 dark:text-emerald-300">
                    • {parsedContent?.length} elements validated
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Validation Error */}
          {hasValidationError && (
            <div className="rounded-md border border-red-200 bg-red-50/70 p-3 dark:border-red-900/50 dark:bg-red-950/40">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-medium text-red-900 dark:text-red-100 text-sm">
                    Validation Error:
                  </h5>
                  <p className="text-red-800 dark:text-red-200 text-xs mt-1">
                    {validationError}
                  </p>
                  <Button
                    onClick={handleShowRepairTool}
                    variant="outline"
                    size="sm"
                    className="mt-2 border-orange-300 text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                  >
                    <Wrench className="h-3 w-3 mr-1" />
                    Repair with AI
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Valid Structure Info */}
          {isValidJson && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/40">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-emerald-900 dark:text-emerald-100 text-sm">
                      Valid ContentStructure
                    </h5>
                    <p className="text-emerald-800 dark:text-emerald-200 text-xs mt-1">
                      {parsedContent?.length} elements ready for saving
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCopyToClipboard}
                  variant="ghost"
                  size="sm"
                  className="text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSaveStructure}
              disabled={!canSave}
              className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner className="h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Draft Structure
                </>
              )}
            </Button>

            {isValidJson && (
              <span className="text-xs text-emerald-700 dark:text-emerald-300">
                {parsedContent?.length} elements ready to save
              </span>
            )}

            {!canUpdate && (
              <span className="text-xs text-orange-600">
                Cannot save: page data is not available or update in progress
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Repair Tool */}
      {showRepairTool && hasValidationError && (
        <ContentRepairTool
          invalidJsonString={jsonContent}
          pageName={page.title || page.linkName}
          pageSlug={slug}
          onRepairSuccess={handleRepairSuccess}
          onCancel={() => setShowRepairTool(false)}
          canEdit={!isSaving}
        />
      )}

      <ValidationTipsWarning />
      <RepairLimitationsError />
    </div>
  );
}
