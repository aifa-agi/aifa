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
 * ✅ ИСПРАВЛЕННЫЙ Custom hook для восстановления ContentStructure JSON с помощью streamObject
 */
export function useContentRepair() {
  const [repairState, setRepairState] = useState<ContentRepairState>({
    isRepairing: false,
    repairResult: null,
    showRepairTool: false,
    repairAttempts: 0,
  });

  /**
   * ✅ ОСНОВНАЯ ФУНКЦИЯ: Восстановление ContentStructure через streamObject Server Action
   */
  const repairContentWithServer = useCallback(
    async (request: ContentRepairRequest): Promise<ContentRepairResult> => {
      console.log("🔧 Client: Starting ContentStructure STREAM repair:", {
        originalLength: request.invalidJsonString.length,
        pageName: request.pageName,
        attempt: repairState.repairAttempts + 1,
      });

      try {
        const serverRequest: ContentRepairServerRequest = {
          invalidJsonString: request.invalidJsonString,
          pageName: request.pageName,
          pageSlug: request.pageSlug,
        };

        console.log(
          "🔧 Client: Calling ContentStructure STREAM Server Action..."
        );

        // ✅ Вызываем обновленный streamObject action
        const serverResult = await repairContentStructureAction(
          serverRequest,
          repairState.repairAttempts + 1
        );

        console.log(
          "✅ Client: ContentStructure STREAM Server Action response:",
          {
            success: serverResult.success,
            confidence: serverResult.confidence,
            elementsCount: Array.isArray(serverResult.repairedData)
              ? serverResult.repairedData.length
              : 0,
          }
        );

        // ✅ ИСПРАВЛЕНИЕ: Заменяем "openai" на "openai-stream"
        const result: ContentRepairResult = {
          success: serverResult.success,
          repairedData: serverResult.repairedData,
          error: serverResult.error,
          repairMethod: "openai-stream", // ✅ ИСПРАВЛЕНО: используем новый тип
          originalLength: serverResult.originalLength,
          repairedLength: serverResult.repairedLength,
          confidence: serverResult.confidence,
        };

        return result;
      } catch (error) {
        console.error(
          "❌ Client: ContentStructure STREAM Server Action call failed:",
          error
        );

        const errorMessage =
          error instanceof Error
            ? `StreamObject Server Action Error: ${error.message}`
            : "ContentStructure JSON stream repair request failed";

        return {
          success: false,
          error: errorMessage,
          repairMethod: "openai-stream", // ✅ ИСПРАВЛЕНО: используем новый тип
          originalLength: request.invalidJsonString.length,
          repairedLength: 0,
          confidence: 0,
        };
      }
    },
    [repairState.repairAttempts]
  );

  /**
   * ✅ ОБНОВЛЕННАЯ основная функция восстановления с логикой повторов для streamObject
   */
  const repairInvalidContentStructure = useCallback(
    async (request: ContentRepairRequest): Promise<ContentRepairResult> => {
      console.log("🔧 Client: repairInvalidContentStructure called (STREAM):", {
        pageName: request.pageName,
        currentAttempts: repairState.repairAttempts,
        maxAttempts: 3,
      });

      // ✅ Проверка максимального количества попыток
      if (repairState.repairAttempts >= 3) {
        console.warn(
          "⚠️ Client: Maximum ContentStructure STREAM repair attempts reached"
        );
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

        // ✅ Проверка порога уверенности для streamObject результатов
        if (result.success && result.confidence < 0.6) {
          console.warn(
            "⚠️ Client: ContentStructure STREAM repair confidence below threshold:",
            result.confidence
          );
          toast.warning(
            `Восстановление ContentStructure (Stream) выполнено с низкой уверенностью: ${Math.round(result.confidence * 100)}%`
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
            "ContentStructure успешно восстановлена с помощью Stream ИИ",
            {
              description: `${elementsCount} элементов, уверенность: ${Math.round(result.confidence * 100)}%`,
            }
          );
        } else {
          toast.error(
            "Не удалось восстановить структуру ContentStructure (Stream)",
            {
              description: result.error,
            }
          );
        }

        return result;
      } catch (error) {
        console.error(
          "❌ Client: Unexpected error in repairInvalidContentStructure (STREAM):",
          error
        );

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
   * ✅ Сброс состояния восстановления
   */
  const resetRepairState = useCallback(() => {
    console.log("🔄 Client: Resetting ContentStructure STREAM repair state");
    setRepairState({
      isRepairing: false,
      repairResult: null,
      showRepairTool: false,
      repairAttempts: 0,
    });
  }, []);

  /**
   * ✅ Переключение видимости инструмента восстановления
   */
  const toggleRepairTool = useCallback(() => {
    setRepairState((prev) => ({
      ...prev,
      showRepairTool: !prev.showRepairTool,
    }));
  }, []);

  // ✅ ОБНОВЛЕННЫЙ return объект с поддержкой streamObject
  return {
    repairState,
    repairInvalidContentStructure, // Основная функция для компонентов
    repairContentWithServer, // Прямой вызов server action
    resetRepairState,
    toggleRepairTool,
    isRepairing: repairState.isRepairing,
    canRepair: repairState.repairAttempts < 3,
    // ✅ ИСПРАВЛЕНО: возвращаем корректный тип
    repairMethod: "openai-stream" as const, // Индикатор что используется streamObject
  };
}
