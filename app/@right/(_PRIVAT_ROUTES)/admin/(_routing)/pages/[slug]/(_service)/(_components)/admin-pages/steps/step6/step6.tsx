// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/admin-page-step6.tsx

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Toggle } from "@/components/ui/toggle";
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
  Shield,
  ShieldCheck,
  ShieldAlert,
  Target,
  Zap,
  Activity,
  Timer,
  Wifi,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { Badge } from "@/components/ui/badge";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { PageNotFound } from "../../../page-not-found";
import { useDraftStructureSaver } from "./(_hooks)/use-draft-structure-saver";
import { useContentRepairStreaming } from "./(_hooks)/use-content-repair-streaming";
import {
  ContentStructure,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";

interface AdminPageStep6Props {
  slug: string;
}

/**
 * ✅ UPDATED: H2 compliance validation for root content structures
 */
const validateRootContentStructure = (
  data: any
): data is RootContentStructure[] => {
  if (!Array.isArray(data)) {
    throw new Error("Content must be an array of RootContentStructure objects");
  }

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!item || typeof item !== "object") {
      throw new Error(`Element at index ${i} must be an object`);
    }

    // ✅ CRITICAL: H2 compliance enforcement
    if (!item.tag || item.tag !== "h2") {
      throw new Error(
        `Element at index ${i}: root elements must have tag "h2" (found: "${item.tag || "undefined"}")`
      );
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

    // ✅ Validate nested structures (must not have H1/H2)
    if (item.realContentStructure && Array.isArray(item.realContentStructure)) {
      for (let j = 0; j < item.realContentStructure.length; j++) {
        const nestedItem = item.realContentStructure[j];
        if (nestedItem.tag === "h1" || nestedItem.tag === "h2") {
          throw new Error(
            `Element at index ${i}, nested element ${j}: nested elements cannot have H1 or H2 tags (found: "${nestedItem.tag}")`
          );
        }
      }
    }
  }

  return true;
};

/**
 * ✅ FIXED: Step6 component with corrected streaming repair logic
 */
export function AdminPageStep6({ slug }: AdminPageStep6Props) {
  const { categories, loading, initialized } = useNavigationMenu();

  // ✅ FIXED: Added ref to track if repair was just completed
  const repairCompletedRef = useRef(false);

  // ✅ UPDATED: Local state with streaming mode support
  const [jsonContent, setJsonContent] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [parsedContent, setParsedContent] = useState<
    RootContentStructure[] | null
  >(null);
  const [useStreamingMode, setUseStreamingMode] = useState(true);
  const [h2ComplianceStatus, setH2ComplianceStatus] = useState<{
    isCompliant: boolean;
    violations: string[];
    h2Count: number;
    totalCount: number;
  }>({ isCompliant: true, violations: [], h2Count: 0, totalCount: 0 });

  // Find page data
  const pageData = findPageBySlug(categories, slug);

  // ✅ UPDATED: Hook with H2 compliance features
  const {
    saveDraftStructure,
    clearDraftStructure,
    isUpdating: isSaving,
    hasDraftStructure,
    draftElementsCount,
    canUpdate,
    validateH2Compliance,
    fixH2Compliance,
    getDraftComplianceStatus,
  } = useDraftStructureSaver({
    page: pageData?.page || null,
    categoryTitle: pageData?.category?.title || "",
    slug,
    enforceH2Compliance: true,
  });

  // ✅ UPDATED: Streaming repair hook
  const {
    startStreamingRepair,
    resetStreamingState,
    isStreaming,
    progress,
    stage,
    finalData: streamingFinalData,
    error: streamingError,
  } = useContentRepairStreaming();

  /**
   * ✅ FIXED: Handle JSON content change with proper state reset
   */
  const handleJsonChange = useCallback(
    (value: string) => {
      // ✅ FIXED: Reset repair completed flag
      repairCompletedRef.current = false;

      setJsonContent(value);
      setValidationError("");
      setParsedContent(null);
      setH2ComplianceStatus({
        isCompliant: true,
        violations: [],
        h2Count: 0,
        totalCount: 0,
      });

      // ✅ FIXED: Only reset streaming state if not currently streaming
      if (!isStreaming) {
        resetStreamingState();
      }

      if (!value.trim()) return;

      try {
        const parsed = JSON.parse(value);
        validateRootContentStructure(parsed);
        setParsedContent(parsed);

        // ✅ Check H2 compliance
        const totalCount = parsed.length;
        const h2Count = parsed.filter((item: any) => item.tag === "h2").length;
        const isCompliant = h2Count === totalCount;
        const violations: string[] = [];

        if (!isCompliant) {
          parsed.forEach((item: any, index: number) => {
            if (item.tag !== "h2") {
              violations.push(
                `Element ${index}: has tag "${item.tag || "undefined"}" instead of "h2"`
              );
            }
          });
        }

        setH2ComplianceStatus({ isCompliant, violations, h2Count, totalCount });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Invalid JSON format";
        setValidationError(errorMessage);
      }
    },
    [isStreaming, resetStreamingState]
  );

  /**
   * ✅ FIXED: Corrected streaming repair handler logic
   */
  const handleDirectStreamingRepair = useCallback(async () => {
    if (!jsonContent.trim()) {
      toast.error("No JSON content to repair");
      return;
    }

    // ✅ FIXED: Correct logic - only proceed if there IS a validation error
    if (!validationError) {
      toast.warning("Content appears valid - no repair needed");
      return;
    }

    // ✅ FIXED: Check streaming mode availability
    if (!useStreamingMode) {
      toast.error("Enable streaming mode to use repair functionality");
      return;
    }

    try {
      // ✅ FIXED: Set repair started flag
      repairCompletedRef.current = false;

      await startStreamingRepair({
        invalidJsonString: jsonContent,
        pageName:
          pageData?.page?.title || pageData?.page?.linkName || "Untitled Page",
        pageSlug: slug,
        expectedStructureType: "root",
      });
    } catch (error) {
      console.error("Streaming repair failed:", error);
      toast.error(
        `Streaming repair failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }, [
    jsonContent,
    validationError,
    useStreamingMode,
    startStreamingRepair,
    pageData,
    slug,
  ]);

  /**
   * ✅ FIXED: Auto-fix H2 compliance
   */
  const handleAutoFixH2 = async () => {
    if (!parsedContent) return;

    try {
      const fixResult = await fixH2Compliance(parsedContent as any[]);

      if (fixResult.autoFixApplied && fixResult.fixedStructure.length > 0) {
        const fixedJsonString = JSON.stringify(
          fixResult.fixedStructure,
          null,
          2
        );
        setJsonContent(fixedJsonString);
        setParsedContent(fixResult.fixedStructure as RootContentStructure[]);
        setH2ComplianceStatus({
          isCompliant: true,
          violations: [],
          h2Count: fixResult.fixedStructure.length,
          totalCount: fixResult.fixedStructure.length,
        });

        toast.success(
          `H2 compliance auto-fixed: ${fixResult.violationsFixed} violations corrected`,
          { duration: 4000 }
        );
      } else {
        toast.warning("H2 compliance could not be automatically fixed");
      }
    } catch (error) {
      toast.error("Failed to auto-fix H2 compliance");
    }
  };

  /**
   * ✅ Save ContentStructure to draftContentStructure
   */
  const handleSaveStructure = async () => {
    if (!parsedContent) {
      toast.error("No valid content structure to save");
      return;
    }

    const contentStructure: ContentStructure[] = parsedContent.map((item) => ({
      ...item,
    }));

    const success = await saveDraftStructure(contentStructure);

    if (success) {
      setJsonContent("");
      setParsedContent(null);
      setValidationError("");
      setH2ComplianceStatus({
        isCompliant: true,
        violations: [],
        h2Count: 0,
        totalCount: 0,
      });
      // ✅ FIXED: Reset repair flag on successful save
      repairCompletedRef.current = false;
    }
  };

  /**
   * ✅ Clear saved structure
   */
  const handleClearStructure = async () => {
    const success = await clearDraftStructure();

    if (success) {
      setJsonContent("");
      setParsedContent(null);
      setValidationError("");
      setH2ComplianceStatus({
        isCompliant: true,
        violations: [],
        h2Count: 0,
        totalCount: 0,
      });
      repairCompletedRef.current = false;
    }
  };

  /**
   * ✅ FIXED: Handle successful repair with duplicate prevention
   */
  const handleRepairSuccess = useCallback(
    (repairedJsonString: string) => {
      // ✅ FIXED: Prevent duplicate success handling
      if (repairCompletedRef.current) {
        return;
      }

      repairCompletedRef.current = true;
      handleJsonChange(repairedJsonString);
      toast.success("JSON structure successfully repaired and validated!");
    },
    [handleJsonChange]
  );

  /**
   * ✅ FIXED: Handle streaming repair completion with duplicate prevention
   */
  useEffect(() => {
    if (
      streamingFinalData &&
      streamingFinalData.length > 0 &&
      !repairCompletedRef.current
    ) {
      const repairedJsonString = JSON.stringify(streamingFinalData, null, 2);
      handleRepairSuccess(repairedJsonString);
    }
  }, [streamingFinalData, handleRepairSuccess]);

  /**
   * ✅ Handle streaming errors
   */
  useEffect(() => {
    if (streamingError) {
      toast.error(`Streaming repair error: ${streamingError}`);
      repairCompletedRef.current = false; // ✅ Reset on error
    }
  }, [streamingError]);

  /**
   * Copy to clipboard
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

  // ✅ Get current draft compliance status on mount
  useEffect(() => {
    if (hasDraftStructure) {
      const complianceStatus = getDraftComplianceStatus();
    }
  }, [hasDraftStructure, getDraftComplianceStatus]);

  // Loading states
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
  const canSave =
    isValidJson && !isSaving && canUpdate && h2ComplianceStatus.isCompliant;
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
                H2-Compliant Draft Content Structure Upload
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Upload AI-generated ContentStructure JSON with H2 semantic
                hierarchy enforcement and streaming repair support
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              <Layers className="size-3 mr-1" />
              Step 6
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* ✅ H2 Compliance Status */}
      {hasDraftStructure && (
        <Card className="border-green-200 bg-green-50/40">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">
                    H2-Compliant Draft Structure Saved
                  </h4>
                  <p className="text-sm text-green-700">
                    {draftElementsCount} H2 root elements stored in
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

      {/* ✅ H2 Compliance Panel */}
      {isValidJson && (
        <Card
          className={`${
            h2ComplianceStatus.isCompliant
              ? "border-green-200 bg-green-50/30"
              : "border-orange-200 bg-orange-50/30"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {h2ComplianceStatus.isCompliant ? (
                  <Shield className="size-5 text-green-600" />
                ) : (
                  <ShieldAlert className="size-5 text-orange-600" />
                )}
                <div>
                  <h4
                    className={`font-medium ${
                      h2ComplianceStatus.isCompliant
                        ? "text-green-900"
                        : "text-orange-900"
                    }`}
                  >
                    H2 Semantic Hierarchy Compliance
                  </h4>
                  <p
                    className={`text-sm ${
                      h2ComplianceStatus.isCompliant
                        ? "text-green-700"
                        : "text-orange-700"
                    }`}
                  >
                    {h2ComplianceStatus.isCompliant
                      ? `✅ All ${h2ComplianceStatus.totalCount} elements are H2-compliant`
                      : `⚠️ ${h2ComplianceStatus.violations.length} H2 violations found`}
                  </p>
                </div>
              </div>

              {!h2ComplianceStatus.isCompliant && (
                <Button
                  onClick={handleAutoFixH2}
                  size="sm"
                  className="bg-orange-600 text-white hover:bg-orange-700"
                >
                  <Zap className="size-3 mr-1" />
                  Auto-Fix H2
                </Button>
              )}
            </div>
          </CardHeader>

          {!h2ComplianceStatus.isCompliant && (
            <CardContent className="pt-0">
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <h5 className="font-medium text-orange-900 text-sm mb-2">
                  H2 Compliance Violations:
                </h5>
                <ul className="text-xs text-orange-800 space-y-1">
                  {h2ComplianceStatus.violations
                    .slice(0, 5)
                    .map((violation, index) => (
                      <li key={index}>• {violation}</li>
                    ))}
                  {h2ComplianceStatus.violations.length > 5 && (
                    <li>
                      • ... and {h2ComplianceStatus.violations.length - 5} more
                      violations
                    </li>
                  )}
                </ul>
                <p className="text-xs text-orange-700 mt-2">
                  💡 <strong>Semantic Hierarchy:</strong> H1 (page title) → H2
                  (main sections) → H3+ (subsections)
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Main Upload Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="size-6 text-primary" />
            <CardTitle className="text-xl">
              Upload H2-Compliant ContentStructure JSON
            </CardTitle>
            {isValidJson && h2ComplianceStatus.isCompliant && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="size-3 mr-1" />
                H2 Valid Structure
              </Badge>
            )}
            {isValidJson && !h2ComplianceStatus.isCompliant && (
              <Badge variant="destructive">
                <Target className="size-3 mr-1" />
                H2 Violations
              </Badge>
            )}
            {hasValidationError && (
              <Badge variant="destructive">
                <AlertCircle className="size-3 mr-1" />
                Invalid JSON
              </Badge>
            )}
            {useStreamingMode && (
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                <Activity className="size-3 mr-1" />
                Streaming Ready
              </Badge>
            )}
            {isStreaming && (
              <Badge variant="default" className="bg-green-600">
                <Activity className="size-3 mr-1 animate-pulse" />
                Streaming Active
              </Badge>
            )}
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="leading-relaxed">
              Paste your AI-generated ContentStructure JSON array. The system
              enforces H2 semantic hierarchy and validates compliance before
              saving to draftContentStructure.
              {useStreamingMode &&
                " Streaming mode provides real-time progress and prevents timeouts."}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ✅ Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="size-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-2">
                  H2-Compliant Expected Format:
                </h4>
                <div className="text-blue-800 dark:text-blue-200 text-xs space-y-1">
                  <p>• Array of RootContentStructure objects</p>
                  <p>
                    • <strong>REQUIRED:</strong> All root elements must have
                    tag: &quot;h2&quot;
                  </p>
                  <p>
                    • Each element must have additionalData.minWords, maxWords,
                    actualContent
                  </p>
                  <p>
                    • Optional fields: keywords, intent, taxonomy, audiences,
                    selfPrompt
                  </p>
                  <p>
                    • Nested elements (realContentStructure) can only use H3,
                    H4, P, etc.
                  </p>
                  <p>
                    • <strong>Semantic Hierarchy:</strong> H1 (page) → H2
                    (sections) → H3+ (subsections)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* JSON Input */}
          <div className="space-y-3">
            <Label htmlFor="json-content" className="text-sm font-medium">
              H2-Compliant ContentStructure JSON Array
            </Label>

            <Textarea
              id="json-content"
              placeholder={`Paste your H2-compliant ContentStructure JSON array here, for example:
[
  {
    "tag": "h2",
    "keywords": ["main topic", "introduction"],
    "intent": "Introduce the main section topic",
    "taxonomy": "Main Section",
    "audiences": "General audience",
    "selfPrompt": "Generate an engaging main section about...",
    "additionalData": {
      "minWords": 100,
      "maxWords": 300,
      "actualContent": "Complete main section content here..."
    },
    "realContentStructure": [
      {
        "tag": "h3",
        "additionalData": {
          "minWords": 50,
          "maxWords": 150,
          "actualContent": "Subsection content here..."
        }
      }
    ]
  }
]`}
              value={jsonContent}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="min-h-[300px] max-h-[500px] resize-y font-mono text-sm"
              disabled={isSaving || isStreaming}
            />

            {/* Character count */}
            {jsonContent.trim() && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{jsonContent.length} characters</span>
                {isValidJson && (
                  <>
                    <span className="text-green-600">
                      • {parsedContent?.length} elements validated
                    </span>
                    {h2ComplianceStatus.isCompliant ? (
                      <span className="text-green-600">• H2 compliant ✅</span>
                    ) : (
                      <span className="text-orange-600">
                        • {h2ComplianceStatus.violations.length} H2 violations
                        ⚠️
                      </span>
                    )}
                  </>
                )}
                {useStreamingMode && (
                  <span className="text-blue-600">
                    • Streaming mode active 🚀
                  </span>
                )}
                {isStreaming && (
                  <span className="text-green-600">
                    • Streaming in progress... {progress?.toFixed(0) || 0}%
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ✅ FIXED: Validation Error with Direct Streaming Repair */}
          {hasValidationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-950 dark:border-red-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="size-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h5 className="font-medium text-red-900 dark:text-red-100 text-sm">
                    Validation Error:
                  </h5>
                  <p className="text-red-800 dark:text-red-200 text-xs mt-1">
                    {validationError}
                  </p>

                  {/* ✅ FIXED: Repair button logic */}
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={handleDirectStreamingRepair}
                      variant="outline"
                      size="sm"
                      disabled={isStreaming || !jsonContent.trim()}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <Wrench className="size-3 mr-1" />
                      {isStreaming ? (
                        <>
                          <LoadingSpinner className="size-3 mr-1" />
                          Streaming Repair...
                        </>
                      ) : (
                        "Stream Repair with AI"
                      )}
                    </Button>

                    {!useStreamingMode && (
                      <span className="text-xs text-orange-600 flex items-center">
                        Enable streaming mode to repair
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Valid Structure Info */}
          {isValidJson && h2ComplianceStatus.isCompliant && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 dark:bg-green-950 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-medium text-green-900 dark:text-green-100 text-sm">
                      H2-Compliant Valid ContentStructure
                    </h5>
                    <p className="text-green-800 dark:text-green-200 text-xs mt-1">
                      {parsedContent?.length} H2 root elements ready for saving
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
              disabled={!canSave || isStreaming}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner className="size-4" />
                  Saving H2 Structure...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save H2-Compliant Draft Structure
                </>
              )}
            </Button>

            {isValidJson && h2ComplianceStatus.isCompliant && (
              <span className="text-xs text-green-600">
                {parsedContent?.length} H2 elements ready to save
              </span>
            )}

            {isValidJson && !h2ComplianceStatus.isCompliant && (
              <span className="text-xs text-orange-600">
                Fix H2 violations before saving (
                {h2ComplianceStatus.violations.length} issues)
              </span>
            )}

            {!canUpdate && (
              <span className="text-xs text-orange-600">
                Cannot save: page data is not available or update in progress
              </span>
            )}

            {isStreaming && (
              <span className="text-xs text-blue-600 flex items-center gap-1">
                <Activity className="size-3 animate-pulse" />
                Streaming in progress... {progress?.toFixed(0) || 0}%
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
