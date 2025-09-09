"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  ContentRepairRequest,
  ContentRepairResult,
  ContentRepairState,
} from "../(_types)/content-repair-types";
import {
  ContentRepairServerRequest,
  repairContentStructureAction,
} from "../(_actions)/content-repair-action";

/**
 * ✅ UPDATED Custom hook for ContentStructure JSON repair using streamObject
 */
export function useContentRepair() {
  const [repairState, setRepairState] = useState<ContentRepairState>({
    isRepairing: false,
    repairResult: null,
    showRepairTool: false,
    repairAttempts: 0,
  });

  /**
   * ✅ MAIN FUNCTION: ContentStructure repair via streamObject Server Action
   */
  const repairContentWithServer = useCallback(
    async (request: ContentRepairRequest): Promise<ContentRepairResult> => {
      try {
        const serverRequest: ContentRepairServerRequest = {
          invalidJsonString: request.invalidJsonString,
          pageName: request.pageName,
          pageSlug: request.pageSlug,
        };

        // ✅ Call updated streamObject action
        const serverResult = await repairContentStructureAction(
          serverRequest,
          repairState.repairAttempts + 1
        );

        // ✅ FIX: Replace "openai" with "openai-stream"
        const result: ContentRepairResult = {
          success: serverResult.success,
          repairedData: serverResult.repairedData,
          error: serverResult.error,
          repairMethod: "openai-stream", // ✅ FIXED: using new type
          originalLength: serverResult.originalLength,
          repairedLength: serverResult.repairedLength,
          confidence: serverResult.confidence,
        };

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? `StreamObject Server Action Error: ${error.message}`
            : "ContentStructure JSON stream repair request failed";

        return {
          success: false,
          error: errorMessage,
          repairMethod: "openai-stream", // ✅ FIXED: using new type
          originalLength: request.invalidJsonString.length,
          repairedLength: 0,
          confidence: 0,
        };
      }
    },
    [repairState.repairAttempts]
  );

  /**
   * ✅ UPDATED main repair function with retry logic for streamObject
   */
  const repairInvalidContentStructure = useCallback(
    async (request: ContentRepairRequest): Promise<ContentRepairResult> => {
      // ✅ Check maximum attempts limit
      if (repairState.repairAttempts >= 3) {
        return {
          success: false,
          error: "Maximum stream repair attempts reached",
          repairMethod: "none",
          originalLength: request.invalidJsonString.length,
          repairedLength: 0,
          confidence: 0,
        };
      }

      setRepairState((prev) => ({
        ...prev,
        isRepairing: true,
        repairAttempts: prev.repairAttempts + 1,
      }));

      try {
        const result = await repairContentWithServer(request);

        // ✅ Check confidence threshold for streamObject results
        if (result.success && result.confidence < 0.6) {
          toast.warning(
            `ContentStructure repair (Stream) completed with low confidence: ${Math.round(result.confidence * 100)}%`
          );
        }

        setRepairState((prev) => ({
          ...prev,
          isRepairing: false,
          repairResult: result,
        }));

        if (result.success) {
          const elementsCount = Array.isArray(result.repairedData)
            ? result.repairedData.length
            : 0;
          toast.success(
            "ContentStructure successfully repaired using Stream AI",
            {
              description: `${elementsCount} elements, confidence: ${Math.round(result.confidence * 100)}%`,
            }
          );
        } else {
          toast.error("Failed to repair ContentStructure (Stream)", {
            description: result.error,
          });
        }

        return result;
      } catch (error) {
        const result: ContentRepairResult = {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "ContentStructure JSON stream repair failed",
          repairMethod: "none",
          originalLength: request.invalidJsonString.length,
          repairedLength: 0,
          confidence: 0,
        };

        setRepairState((prev) => ({
          ...prev,
          isRepairing: false,
          repairResult: result,
        }));

        return result;
      }
    },
    [repairState.repairAttempts, repairContentWithServer]
  );

  /**
   * ✅ Reset repair state
   */
  const resetRepairState = useCallback(() => {
    setRepairState({
      isRepairing: false,
      repairResult: null,
      showRepairTool: false,
      repairAttempts: 0,
    });
  }, []);

  /**
   * ✅ Toggle repair tool visibility
   */
  const toggleRepairTool = useCallback(() => {
    setRepairState((prev) => ({
      ...prev,
      showRepairTool: !prev.showRepairTool,
    }));
  }, []);

  // ✅ UPDATED return object with streamObject support
  return {
    repairState,
    repairInvalidContentStructure, // Main function for components
    repairContentWithServer, // Direct server action call
    resetRepairState,
    toggleRepairTool,
    isRepairing: repairState.isRepairing,
    canRepair: repairState.repairAttempts < 3,
    // ✅ FIXED: returning correct type
    repairMethod: "openai-stream" as const, // Indicator that streamObject is used
  };
}
