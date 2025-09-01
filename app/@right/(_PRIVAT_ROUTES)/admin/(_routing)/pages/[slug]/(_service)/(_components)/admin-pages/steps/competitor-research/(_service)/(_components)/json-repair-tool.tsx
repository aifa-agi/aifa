// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/competitor-research/(_service)/(_components)/json-repair-tool.tsx

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useJsonRepair } from "../(_hooks)/use-json-repair";
import { JsonRepairRequest } from "../(_types)/json-repair-types";
import { JSON_REPAIR_CONFIG } from "../(_constants)/json-repair-config";

interface JsonRepairToolProps {
  invalidJsonString: string;
  competitorUrl: string;
  competitorName: string;
  onRepairSuccess: (repairedJsonString: string) => void;
  onCancel: () => void;
  canEdit: boolean;
}

export function JsonRepairTool({
  invalidJsonString,
  competitorUrl,
  competitorName,
  onRepairSuccess,
  onCancel,
  canEdit,
}: JsonRepairToolProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [showRepaired, setShowRepaired] = useState(true);

  const {
    repairState,
    repairInvalidJson,
    resetRepairState,
    isRepairing,
    canRepair,
  } = useJsonRepair();

  /**
   * Handle repair attempt
   */
  const handleRepairAttempt = async () => {
    if (!canEdit || isRepairing || !canRepair) return;

    const request: JsonRepairRequest = {
      invalidJsonString,
      competitorUrl,
      competitorName,
    };

    const result = await repairInvalidJson(request);

    if (result.success && result.repairedData) {
      const repairedJsonString = JSON.stringify(result.repairedData, null, 2);
      console.log("✅ Repair successful, calling onRepairSuccess");
      onRepairSuccess(repairedJsonString);
    }
  };

  /**
   * Handle copy repaired JSON
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
      toast.success("Repaired JSON copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy JSON");
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

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-800">
            <Wrench className="size-4" />
            JSON Repair Tool
            <Badge
              variant="outline"
              className="text-xs bg-orange-100 text-orange-700"
            >
              AI-Powered
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            Close
          </Button>
        </CardTitle>

        <p className="text-sm text-orange-700">
          The AI response contains invalid JSON structure. Use our automated
          repair tool to fix it.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Repair Status */}
        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-2 rounded-full",
                hasRepairResult
                  ? repairSuccessful
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-orange-500"
              )}
            />
            <span className="text-sm font-medium">
              {hasRepairResult
                ? repairSuccessful
                  ? "Repair Successful"
                  : "Repair Failed"
                : "Ready to Repair"}
            </span>

            {hasRepairResult && (
              <Badge variant="outline" className="text-xs">
                Attempt {repairState.repairAttempts}/
                {JSON_REPAIR_CONFIG.MAX_REPAIR_ATTEMPTS}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasRepairResult && repairSuccessful && (
              <Badge variant="outline" className="text-xs text-green-700">
                {Math.round((repairState.repairResult?.confidence || 0) * 100)}%
                Confidence
              </Badge>
            )}
          </div>
        </div>

        {/* Original JSON Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <XCircle className="size-4 text-red-600" />
              Invalid JSON ({invalidJsonString.length} chars)
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-xs"
            >
              {showOriginal ? (
                <EyeOff className="size-3 mr-1" />
              ) : (
                <Eye className="size-3 mr-1" />
              )}
              {showOriginal ? "Hide" : "Show"}
            </Button>
          </div>

          {showOriginal && (
            <div className="bg-red-50 border border-red-200 rounded p-3 max-h-40 overflow-y-auto">
              <pre className="text-xs text-red-800 whitespace-pre-wrap break-words font-mono">
                {invalidJsonString.substring(0, 1000)}
                {invalidJsonString.length > 1000 && "..."}
              </pre>
            </div>
          )}
        </div>

        {/* Repair Action */}
        {!hasRepairResult ? (
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="size-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    AI Repair Process
                  </h4>
                  <p className="text-xs text-blue-700 mb-3">
                    Our AI will analyze the invalid response and convert it into
                    a properly structured CompetitorAnalysis JSON format using
                    OpenAI GPT-4.1.
                  </p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Extract competitive intelligence data</li>
                    <li>• Structure content sections properly</li>
                    <li>• Generate missing analysis fields</li>
                    <li>• Validate final JSON format</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={handleRepairAttempt}
              disabled={!canEdit || isRepairing || !canRepair}
              className="w-full bg-orange-600 text-white hover:bg-orange-700"
            >
              {isRepairing ? (
                <>
                  <LoadingSpinner className="size-4 mr-2" />
                  Repairing JSON with AI...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  Repair JSON with AI
                </>
              )}
            </Button>

            {!canRepair && (
              <div className="text-center p-3 bg-red-50 border border-red-200 rounded">
                <AlertTriangle className="size-4 text-red-600 mx-auto mb-1" />
                <p className="text-xs text-red-700">
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
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      JSON Successfully Repaired
                    </span>
                  </div>
                  <div className="text-xs text-green-700 space-y-1">
                    <p>
                      • Original: {repairState.repairResult?.originalLength}{" "}
                      characters
                    </p>
                    <p>
                      • Repaired: {repairState.repairResult?.repairedLength}{" "}
                      characters
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
                      <h4 className="text-sm font-medium text-green-800">
                        Repaired JSON Structure
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyRepairedJson}
                        className="text-xs"
                      >
                        <Copy className="size-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3 max-h-40 overflow-y-auto">
                      <pre className="text-xs text-green-800 whitespace-pre-wrap break-words font-mono">
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
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  >
                    <CheckCircle2 className="size-4 mr-2" />
                    Use Repaired JSON
                  </Button>

                  {canRepair && (
                    <Button
                      variant="outline"
                      onClick={handleResetAndRetry}
                      size="sm"
                    >
                      <RefreshCw className="size-3 mr-1" />
                      Try Again
                    </Button>
                  )}
                </div>
              </>
            ) : (
              /* Failure Result */
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="size-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Repair Failed
                    </span>
                  </div>
                  <p className="text-xs text-red-700">
                    {repairState.repairResult?.error}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {canRepair ? (
                    <Button
                      onClick={handleResetAndRetry}
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className="size-4 mr-2" />
                      Try Again ({repairState.repairAttempts}/
                      {JSON_REPAIR_CONFIG.MAX_REPAIR_ATTEMPTS})
                    </Button>
                  ) : (
                    <div className="flex-1 text-center p-3 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-xs text-gray-600">
                        All repair attempts exhausted. Please check the original
                        response.
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
