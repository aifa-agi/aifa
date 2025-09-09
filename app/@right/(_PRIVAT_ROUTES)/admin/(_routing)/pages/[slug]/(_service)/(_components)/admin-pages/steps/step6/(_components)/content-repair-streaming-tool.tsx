// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_components)/content-repair-streaming-tool.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Activity,
  Timer,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { useContentRepairStreaming } from "../(_hooks)/use-content-repair-streaming";

interface ContentRepairStreamingToolProps {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
  onRepairSuccess: (repairedJsonString: string) => void;
  onCancel: () => void;
  canEdit: boolean;
}

export function ContentRepairStreamingTool({
  invalidJsonString,
  pageName,
  pageSlug,
  onRepairSuccess,
  onCancel,
  canEdit,
}: ContentRepairStreamingToolProps) {
  const [showPartialData, setShowPartialData] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  const {
    state,
    startStreamingRepair,
    resetStreamingState,
    getElapsedTime,
    isStreaming,
    progress,
    stage,
    partialData,
    finalData,
    error,
  } = useContentRepairStreaming();

  // ✅ Update elapsed time
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStreaming) {
      timer = setInterval(() => {
        setElapsedTime(getElapsedTime());
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isStreaming, getElapsedTime]);

  /**
   * ✅ Start streaming repair
   */
  const handleStartStreaming = async () => {
    if (!canEdit || isStreaming) return;

    await startStreamingRepair({
      invalidJsonString,
      pageName,
      pageSlug,
    });
  };

  /**
   * ✅ Handle repair success
   */
  const handleUseRepaired = () => {
    if (finalData && finalData.length > 0) {
      const repairedJson = JSON.stringify(finalData, null, 2);
      onRepairSuccess(repairedJson);
    }
  };

  /**
   * ✅ Copy partial data
   */
  const handleCopyPartial = async () => {
    const dataToCopy = finalData || partialData?.rootContentStructure || [];
    if (dataToCopy.length === 0) return;

    try {
      const jsonString = JSON.stringify(dataToCopy, null, 2);
      await navigator.clipboard.writeText(jsonString);
      toast.success("Streaming data copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy streaming data");
    }
  };

  const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
  const hasData = finalData || partialData?.rootContentStructure?.length > 0;
  const elementsCount =
    finalData?.length || partialData?.rootContentStructure?.length || 0;

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-800">
            <Zap className="size-4" />
            Streaming Content Repair Tool
            <Badge
              variant="outline"
              className="text-xs bg-blue-100 text-blue-700"
            >
              <Activity className="size-3 mr-1" />
              Real-time Streaming
            </Badge>
          </div>

          <Button variant="ghost" size="sm" onClick={onCancel}>
            Close
          </Button>
        </CardTitle>

        <p className="text-sm text-blue-700">
          Stream-powered AI repair prevents Vercel timeouts with real-time H2
          compliance.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ✅ Streaming Progress */}
        {isStreaming && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-blue-700">
                  <Activity className="size-4 animate-pulse" />
                  <span className="font-medium">Streaming in progress</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Timer className="size-3" />
                  <span className="text-xs">{formatTime(elapsedTime)}</span>
                  <Badge variant="outline" className="text-xs">
                    {progress.toFixed(0)}%
                  </Badge>
                </div>
              </div>

              <Progress value={progress} className="h-2 bg-blue-100" />

              <p className="text-xs text-blue-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                {stage}
              </p>

              {/* ✅ Real-time element count */}
              {elementsCount > 0 && (
                <p className="text-xs text-blue-700">
                  📊 Generated {elementsCount} H2 elements so far...
                </p>
              )}
            </div>
          </div>
        )}

        {/* ✅ Status indicator */}
        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border">
          <div className="flex items-center gap-2">
            <div
              className={`size-2 rounded-full ${
                error
                  ? "bg-red-500"
                  : finalData
                    ? "bg-green-500"
                    : isStreaming
                      ? "bg-blue-500 animate-pulse"
                      : "bg-gray-400"
              }`}
            />
            <span className="text-sm font-medium">
              {error
                ? "Streaming Failed"
                : finalData
                  ? "Streaming Complete"
                  : isStreaming
                    ? "Streaming..."
                    : "Ready to Stream"}
            </span>
          </div>

          {hasData && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs text-green-700">
                {elementsCount} H2 Elements
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPartial}
                className="text-xs"
              >
                <Copy className="size-3 mr-1" />
                Copy
              </Button>
            </div>
          )}
        </div>

        {/* ✅ Start streaming button */}
        {!isStreaming && !finalData && !error && (
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                🚀 Real-time Streaming Repair
              </h4>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Prevents Vercel timeout issues</li>
                <li>• Real-time H2 compliance enforcement</li>
                <li>• Progressive data streaming</li>
                <li>• Enhanced reliability for large repairs</li>
              </ul>
            </div>

            <Button
              onClick={handleStartStreaming}
              disabled={!canEdit}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              <Zap className="size-4 mr-2" />
              Start Streaming Repair
            </Button>
          </div>
        )}

        {/* ✅ Success state */}
        {finalData && (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="size-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Streaming Repair Completed
                </span>
              </div>
              <div className="text-xs text-green-700 space-y-1">
                <p>• Elements: {elementsCount} H2-compliant sections</p>
                <p>• Streaming time: {formatTime(elapsedTime)}</p>
                <p>• Status: ✅ Ready for use</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleUseRepaired}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
              >
                <CheckCircle2 className="size-4 mr-2" />
                Use Streaming Result
              </Button>

              <Button variant="outline" onClick={resetStreamingState} size="sm">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* ✅ Error state */}
        {error && (
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="size-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Streaming Repair Failed
                </span>
              </div>
              <p className="text-xs text-red-700">{error}</p>
            </div>

            <Button
              onClick={resetStreamingState}
              variant="outline"
              className="w-full"
            >
              Reset & Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
