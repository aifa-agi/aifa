// @app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_hooks)/use-content-repair.ts

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
 * Custom hook для восстановления ContentStructure JSON с помощью AI
 * Адаптация useJsonRepair специально для ContentStructure
 */
export function useContentRepair() {
  const [repairState, setRepairState] = useState<ContentRepairState>({
    isRepairing: false,
    repairResult: null,
    showRepairTool: false,
    repairAttempts: 0,
  });

  /**
   * Восстановление ContentStructure JSON через Server Action
   */
  const repairContentWithServer = useCallback(
    async (request: ContentRepairRequest): Promise<ContentRepairResult> => {
      console.log(
        "🔧 Client: Starting ContentStructure repair via Server Action:",
        {
          originalLength: request.invalidJsonString.length,
          pageName: request.pageName,
          attempt: repairState.repairAttempts + 1,
        }
      );

      try {
        const serverRequest: ContentRepairServerRequest = {
          invalidJsonString: request.invalidJsonString,
          pageName: request.pageName,
          pageSlug: request.pageSlug,
        };

        console.log("🔧 Client: Calling ContentStructure Server Action...");

        const serverResult = await repairContentStructureAction(
          serverRequest,
          repairState.repairAttempts + 1
        );

        console.log("✅ Client: ContentStructure Server Action response:", {
          success: serverResult.success,
          confidence: serverResult.confidence,
          elementsCount: Array.isArray(serverResult.repairedData)
            ? serverResult.repairedData.length
            : 0,
        });

        // Конвертация результата сервера в формат клиентского хука
        const result: ContentRepairResult = {
          success: serverResult.success,
          repairedData: serverResult.repairedData,
          error: serverResult.error,
          repairMethod: "openai",
          originalLength: serverResult.originalLength,
          repairedLength: serverResult.repairedLength,
          confidence: serverResult.confidence,
        };

        return result;
      } catch (error) {
        console.error(
          "❌ Client: ContentStructure Server Action call failed:",
          error
        );

        const errorMessage =
          error instanceof Error
            ? `Server Action Error: ${error.message}`
            : "ContentStructure JSON repair request failed";

        return {
          success: false,
          error: errorMessage,
          repairMethod: "openai",
          originalLength: request.invalidJsonString.length,
          repairedLength: 0,
          confidence: 0,
        };
      }
    },
    [repairState.repairAttempts]
  );

  /**
   * Основная функция восстановления с логикой повторов
   */
  const repairInvalidContentStructure = useCallback(
    async (request: ContentRepairRequest): Promise<ContentRepairResult> => {
      console.log("🔧 Client: repairInvalidContentStructure called:", {
        pageName: request.pageName,
        currentAttempts: repairState.repairAttempts,
        maxAttempts: 3,
      });

      // Проверка максимального количества попыток
      if (repairState.repairAttempts >= 3) {
        console.warn(
          "⚠️ Client: Maximum ContentStructure repair attempts reached"
        );
        return {
          success: false,
          error: "Maximum repair attempts reached",
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

        // Проверка порога уверенности
        if (result.success && result.confidence < 0.6) {
          console.warn(
            "⚠️ Client: ContentStructure repair confidence below threshold:",
            result.confidence
          );
          toast.warning(
            `Восстановление ContentStructure выполнено с низкой уверенностью: ${Math.round(result.confidence * 100)}%`
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
          toast.success("ContentStructure успешно восстановлена с помощью ИИ", {
            description: `${elementsCount} элементов, уверенность: ${Math.round(result.confidence * 100)}%`,
          });
        } else {
          toast.error("Не удалось восстановить структуру ContentStructure", {
            description: result.error,
          });
        }

        return result;
      } catch (error) {
        console.error(
          "❌ Client: Unexpected error in repairInvalidContentStructure:",
          error
        );

        const result: ContentRepairResult = {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "ContentStructure JSON repair failed",
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
   * Сброс состояния восстановления
   */
  const resetRepairState = useCallback(() => {
    console.log("🔄 Client: Resetting ContentStructure repair state");
    setRepairState({
      isRepairing: false,
      repairResult: null,
      showRepairTool: false,
      repairAttempts: 0,
    });
  }, []);

  /**
   * Переключение видимости инструмента восстановления
   */
  const toggleRepairTool = useCallback(() => {
    setRepairState((prev) => ({
      ...prev,
      showRepairTool: !prev.showRepairTool,
    }));
  }, []);

  return {
    repairState,
    repairInvalidContentStructure,
    resetRepairState,
    toggleRepairTool,
    isRepairing: repairState.isRepairing,
    canRepair: repairState.repairAttempts < 3,
  };
}
