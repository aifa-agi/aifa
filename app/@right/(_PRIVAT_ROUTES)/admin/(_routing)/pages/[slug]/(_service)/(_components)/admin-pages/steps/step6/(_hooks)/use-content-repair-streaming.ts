// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_hooks)/use-content-repair-streaming.ts

"use client";

import { useState, useCallback, useRef } from "react";
import { readStreamableValue } from "ai/rsc";
import { toast } from "sonner";
import {
  streamContentStructureRepair,
  StreamingContentRepairRequest,
} from "../(_actions)/content-repair-streaming-action";
import {
  STREAMING_CONFIG,
  shouldNotifyProgress,
  getToastConfig,
} from "../(_config)/streaming-config";

interface StreamingRepairState {
  isStreaming: boolean;
  progress: number;
  stage: string;
  partialData: any;
  finalData: any[] | null;
  error: string | null;
  startTime: number | null;
}

export function useContentRepairStreaming() {
  const [state, setState] = useState<StreamingRepairState>({
    isStreaming: false,
    progress: 0,
    stage: "",
    partialData: null,
    finalData: null,
    error: null,
    startTime: null,
  });

  // ✅ Use ref to track previous progress
  const lastProgressRef = useRef(0);

  /**
   * ✅ MAIN STREAMING FUNCTION: Start streaming repair process
   */
  const startStreamingRepair = useCallback(
    async (request: StreamingContentRepairRequest) => {
      // ✅ Reset progress tracking
      lastProgressRef.current = 0;

      setState((prev) => ({
        ...prev,
        isStreaming: true,
        progress: 0,
        stage: "Initializing streaming repair...",
        error: null,
        startTime: Date.now(),
        partialData: null,
        finalData: null,
      }));

      try {
        const { stream } = await streamContentStructureRepair(request);

        // ✅ Process streaming data
        for await (const chunk of readStreamableValue(stream)) {
          if (chunk?.type === "progress") {
            const progressPercentage = chunk.progress || 0;

            setState((prev) => ({
              ...prev,
              progress: progressPercentage,
              stage: chunk.stage || "Processing...",
              partialData: chunk.data,
            }));

            // ✅ Show progress notifications
            if (
              shouldNotifyProgress(progressPercentage, lastProgressRef.current)
            ) {
              toast.info(
                `Repair progress: ${progressPercentage.toFixed(0)}%`,
                getToastConfig("progress")
              );
              lastProgressRef.current = progressPercentage;
            }
          } else if (chunk?.type === "element") {
            setState((prev) => ({
              ...prev,
              progress: chunk.progress || prev.progress,
              stage: chunk.stage || "Generating elements...",
              partialData: chunk.element,
            }));
          } else if (chunk?.type === "complete") {
            setState((prev) => ({
              ...prev,
              isStreaming: false,
              progress: 100,
              stage: "Repair completed successfully!",
              finalData: chunk.final?.elements || [],
            }));

            // ✅ Success notification
            const elementsCount = chunk.final?.elements?.length || 0;
            toast.success(
              `✅ Streaming repair completed: ${elementsCount} H2 elements`,
              getToastConfig("success")
            );
          } else if (chunk?.type === "error") {
            setState((prev) => ({
              ...prev,
              isStreaming: false,
              error: chunk.error || "Unknown error",
              stage: "Repair failed",
            }));

            // ✅ Error notification
            toast.error("Streaming repair failed", {
              description: chunk.error,
              ...getToastConfig("error"),
            });
          }
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isStreaming: false,
          error: error instanceof Error ? error.message : "Streaming failed",
          stage: "Connection error",
        }));

        // ✅ Connection error notification
        toast.error("Streaming connection failed", {
          description: "Please try again or check your connection",
          ...getToastConfig("error"),
        });
      }
    },
    [] // ✅ No dependencies to avoid unnecessary re-renders
  );

  /**
   * ✅ Reset streaming state
   */
  const resetStreamingState = useCallback(() => {
    lastProgressRef.current = 0;

    setState({
      isStreaming: false,
      progress: 0,
      stage: "",
      partialData: null,
      finalData: null,
      error: null,
      startTime: null,
    });
  }, []);

  /**
   * ✅ Get elapsed time
   */
  const getElapsedTime = useCallback(() => {
    if (!state.startTime) return 0;
    return Date.now() - state.startTime;
  }, [state.startTime]);

  return {
    state,
    startStreamingRepair, // ✅ EXPORT THIS FUNCTION
    resetStreamingState,
    getElapsedTime,
    // ✅ Direct state access for convenience
    isStreaming: state.isStreaming,
    progress: state.progress,
    stage: state.stage,
    partialData: state.partialData,
    finalData: state.finalData,
    error: state.error,
  };
}
