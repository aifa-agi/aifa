// @app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_components)/content-repair-tool.tsx

"use client";

/*
  CSS-only improvement plan (no logic changes) — Comments in English:

  1) Card framing:
     - Orange-tinted semantic container with rounded corners and soft shadow.
     - Dark mode variants for border/bg parity.

  2) Focus-visible rings:
     - Add `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background`
       on actionable elements (Buttons/ghost Buttons) for accessibility.
     - Use ring colors aligned with action semantics (primary/orange, green, neutral).

  3) Icon sizing & spacing:
     - Replace `size-*` with `h-* w-*`.
     - Normalize gaps between icons and labels.

  4) Previews:
     - Monospace, better contrast, selection highlight, rounded borders, readable max heights.

  5) Badges & status bars:
     - Subtle borders and backgrounds, consistent text colors; keep existing variants.

  6) No changes to:
     - Component logic, handlers, data flow, or JSX structure beyond presentational classes.
*/

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Wrench,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  FileCode,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useContentRepair } from "../(_hooks)/use-content-repair";
import { ContentRepairRequest } from "../(_types)/content-repair-types";
import { CONTENT_REPAIR_CONFIG } from "../(_constants)/content-repair-config";

interface ContentRepairToolProps {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
  onRepairSuccess: (repairedJsonString: string) => void;
  onCancel: () => void;
  canEdit: boolean;
}

/**
 * Content Repair Tool Component
 * Специализированный инструмент для восстановления ContentStructure JSON с помощью AI
 */
export function ContentRepairTool({
  invalidJsonString,
  pageName,
  pageSlug,
  onRepairSuccess,
  onCancel,
  canEdit,
}: ContentRepairToolProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [showRepaired, setShowRepaired] = useState(true);

  const {
    repairState,
    repairInvalidContentStructure,
    resetRepairState,
    isRepairing,
    canRepair,
  } = useContentRepair();

  /**
   * Handle ContentStructure repair attempt
   */
  const handleRepairAttempt = async () => {
    if (!canEdit || isRepairing || !canRepair) return;

    const request: ContentRepairRequest = {
      invalidJsonString,
      pageName,
      pageSlug,
    };

    const result = await repairInvalidContentStructure(request);

    if (result.success && result.repairedData) {
      const repairedJsonString = JSON.stringify(result.repairedData, null, 2);
      console.log(
        "✅ ContentStructure repair successful, calling onRepairSuccess"
      );
      onRepairSuccess(repairedJsonString);
    }
  };

  /**
   * Handle copy repaired ContentStructure JSON
   */
  const handleCopyRepairedJson = async () => {
    if (!repairState.repairResult?.repairedData) return;

    try {
      const jsonString = JSON.stringify(
        repairState.repairResult.repairedData,
        null,
        2
      );
      await navigator.clipboard.writeText(jsonString);
      toast.success("Repaired ContentStructure copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy ContentStructure JSON");
    }
  };

  /**
   * Handle reset and try again
   */
  const handleResetAndRetry = () => {
    resetRepairState();
  };

  const hasRepairResult = repairState.repairResult !== null;
  const repairSuccessful = repairState.repairResult?.success === true;
  const elementsCount = Array.isArray(repairState.repairResult?.repairedData)
    ? repairState.repairResult.repairedData.length
    : 0;

  return (
    <Card className="rounded-md border-orange-200 bg-orange-50/40 shadow-sm dark:border-orange-900/50 dark:bg-orange-950/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
            <Wrench className="h-4 w-4" />
            ContentStructure Repair Tool
            <Badge
              variant="outline"
              className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-200"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-orange-500"
          >
            Close
          </Button>
        </CardTitle>

        <p className="text-sm text-orange-800 dark:text-orange-300">
          The AI response contains invalid ContentStructure JSON format. Use our
          automated repair tool to fix it.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Repair Status */}
        <div className="flex items-center justify-between rounded-md border bg-white/60 p-3 dark:border-neutral-800 dark:bg-neutral-900/40">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                hasRepairResult
                  ? repairSuccessful
                    ? "bg-emerald-500"
                    : "bg-red-500"
                  : "bg-orange-500"
              )}
            />
            <span className="text-sm font-medium text-foreground">
              {hasRepairResult
                ? repairSuccessful
                  ? "Repair Successful"
                  : "Repair Failed"
                : "Ready to Repair"}
            </span>

            {hasRepairResult && (
              <Badge variant="outline" className="text-xs">
                Attempt {repairState.repairAttempts}/
                {CONTENT_REPAIR_CONFIG.MAX_REPAIR_ATTEMPTS}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasRepairResult && repairSuccessful && (
              <>
                <Badge
                  variant="outline"
                  className="text-xs text-emerald-700 dark:text-emerald-300"
                >
                  {Math.round(
                    (repairState.repairResult?.confidence || 0) * 100
                  )}
                  % Confidence
                </Badge>
                {elementsCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-blue-700 dark:text-blue-300"
                  >
                    <Layers className="h-3 w-3 mr-1" />
                    {elementsCount} Elements
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>

        {/* Page Information */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-950/30">
          <div className="mb-2 flex items-center gap-2">
            <FileCode className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Page Information
            </h4>
          </div>
          <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
            <p>
              <span className="font-medium">Page:</span> {pageName}
            </p>
            <p>
              <span className="font-medium">Slug:</span> {pageSlug}
            </p>
            <p>
              <span className="font-medium">Target:</span> draftContentStructure
              field
            </p>
          </div>
        </div>

        {/* Original JSON Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Invalid ContentStructure JSON ({invalidJsonString.length} chars)
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-neutral-500"
            >
              {showOriginal ? (
                <EyeOff className="h-3 w-3 mr-1" />
              ) : (
                <Eye className="h-3 w-3 mr-1" />
              )}
              {showOriginal ? "Hide" : "Show"}
            </Button>
          </div>

          {showOriginal && (
            <div className="max-h-40 overflow-y-auto rounded border border-red-200 bg-red-50 p-3 dark:border-red-900/40 dark:bg-red-950/30">
              <pre className="whitespace-pre-wrap break-words font-mono text-xs text-red-800 dark:text-red-200 selection:bg-red-400/20">
                {invalidJsonString.substring(0, 1000)}
                {invalidJsonString.length > 1000 && "..."}
              </pre>
            </div>
          )}
        </div>

        {/* Repair Action */}
        {!hasRepairResult ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-medium text-blue-800 dark:text-blue-200">
                    AI ContentStructure Repair Process
                  </h4>
                  <p className="mb-3 text-xs text-blue-700 dark:text-blue-300">
                    Our AI will analyze the invalid response and convert it into
                    a properly structured ContentStructure array using OpenAI
                    GPT-4o with specialized validation.
                  </p>
                  <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                    <li>• Extract and preserve meaningful content data</li>
                    <li>
                      • Ensure additionalData fields are properly structured
                    </li>
                    <li>• Validate minWords, maxWords, and actualContent</li>
                    <li>• Generate proper HTML tag hierarchy</li>
                    <li>• Create selfPrompt fields for recursive generation</li>
                    <li>• Maintain semantic relationships between elements</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={handleRepairAttempt}
              disabled={!canEdit || isRepairing || !canRepair}
              className="w-full bg-orange-600 text-white hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRepairing ? (
                <>
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                  Repairing ContentStructure with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Repair ContentStructure with AI
                </>
              )}
            </Button>

            {!canRepair && (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-center dark:border-red-900/40 dark:bg-red-950/30">
                <AlertTriangle className="mx-auto mb-1 h-4 w-4 text-red-600" />
                <p className="text-xs text-red-700 dark:text-red-300">
                  Maximum repair attempts reached. Please check the original
                  response or try again later.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Repair Results */
          <div className="space-y-3">
            {repairSuccessful ? (
              <>
                {/* Success Result */}
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                      ContentStructure Successfully Repaired
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-emerald-700 dark:text-emerald-300">
                    <p>
                      • Original: {repairState.repairResult?.originalLength}{" "}
                      characters
                    </p>
                    <p>
                      • Repaired: {repairState.repairResult?.repairedLength}{" "}
                      characters
                    </p>
                    <p>
                      • Elements: {elementsCount} content structure elements
                    </p>
                    <p>
                      • Confidence:{" "}
                      {Math.round(
                        (repairState.repairResult?.confidence || 0) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>

                {/* Repaired JSON Preview */}
                {showRepaired && repairState.repairResult?.repairedData && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        <Layers className="h-4 w-4" />
                        Repaired ContentStructure ({elementsCount} elements)
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyRepairedJson}
                        className="text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-emerald-500"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="max-h-60 overflow-y-auto rounded border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                      <pre className="whitespace-pre-wrap break-words font-mono text-xs text-emerald-800 dark:text-emerald-200 selection:bg-emerald-400/20">
                        {JSON.stringify(
                          repairState.repairResult.repairedData,
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      const jsonString = JSON.stringify(
                        repairState.repairResult?.repairedData,
                        null,
                        2
                      );
                      onRepairSuccess(jsonString);
                    }}
                    className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Use Repaired ContentStructure
                  </Button>

                  {canRepair && (
                    <Button
                      variant="outline"
                      onClick={handleResetAndRetry}
                      size="sm"
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Try Again
                    </Button>
                  )}
                </div>
              </>
            ) : (
              /* Failure Result */
              <div className="space-y-3">
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">
                  <div className="mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                      ContentStructure Repair Failed
                    </span>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    {repairState.repairResult?.error}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {canRepair ? (
                    <Button
                      onClick={handleResetAndRetry}
                      variant="outline"
                      className="flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again ({repairState.repairAttempts}/
                      {CONTENT_REPAIR_CONFIG.MAX_REPAIR_ATTEMPTS})
                    </Button>
                  ) : (
                    <div className="flex-1 rounded border border-gray-200 bg-gray-50 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/30">
                      <p className="text-xs text-gray-600 dark:text-neutral-300">
                        All ContentStructure repair attempts exhausted. Please
                        check the original response.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
