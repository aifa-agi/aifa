// @app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/admin-page-step6.tsx

"use client";

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
      <div className="flex items-center justify-center py-12">
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
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileCode className="size-6 text-primary" />
            <div>
              <CardTitle className="text-xl">
                Draft Content Structure Upload
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Upload AI-generated ContentStructure JSON to save as draft
                content structure
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              <Layers className="size-3 mr-1" />
              Step 6
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Current Status */}
      {hasDraftStructure && (
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">
                    Draft Content Structure Saved
                  </h4>
                  <p className="text-sm text-green-700">
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
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                {isSaving ? (
                  <>
                    <LoadingSpinner className="size-4 mr-2" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4 mr-2" />
                    Clear Structure
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Upload Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="size-6 text-primary" />
            <CardTitle className="text-xl">
              Upload ContentStructure JSON
            </CardTitle>
            {isValidJson && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="size-3 mr-1" />
                Valid Structure
              </Badge>
            )}
            {hasValidationError && (
              <Badge variant="destructive">
                <AlertCircle className="size-3 mr-1" />
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="size-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
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
              className="min-h-[300px] max-h-[500px] resize-y font-mono text-sm"
              disabled={isSaving}
            />

            {/* Character count */}
            {jsonContent.trim() && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{jsonContent.length} characters</span>
                {isValidJson && (
                  <span className="text-green-600">
                    • {parsedContent?.length} elements validated
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Validation Error */}
          {hasValidationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-950 dark:border-red-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="size-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
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
                    className="mt-2 border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <Wrench className="size-3 mr-1" />
                    Repair with AI
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Valid Structure Info */}
          {isValidJson && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 dark:bg-green-950 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-green-900 dark:text-green-100 text-sm">
                      Valid ContentStructure
                    </h5>
                    <p className="text-green-800 dark:text-green-200 text-xs mt-1">
                      {parsedContent?.length} elements ready for saving
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCopyToClipboard}
                  variant="ghost"
                  size="sm"
                  className="text-green-700 hover:bg-green-100"
                >
                  <Copy className="size-3 mr-1" />
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
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner className="size-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Draft Structure
                </>
              )}
            </Button>

            {isValidJson && (
              <span className="text-xs text-green-600">
                {parsedContent?.length} elements ready to save
              </span>
            )}

            {!canUpdate && (
              <span className="text-xs text-orange-600">
                Cannot save: page data is not available or update in progress
              </span>
            )}
          </div>

          {/* Page Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 dark:bg-gray-950 dark:border-gray-800">
            <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <p>
                <span className="font-medium">Page:</span>{" "}
                {page.title || page.linkName}
              </p>
              <p>
                <span className="font-medium">Category:</span> {category.title}
              </p>
              <p>
                <span className="font-medium">Target Field:</span>{" "}
                draftContentStructure
              </p>
              <p>
                <span className="font-medium">Current Draft:</span>{" "}
                {draftElementsCount} elements
              </p>
            </div>
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
    </div>
  );
}
