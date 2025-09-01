// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/competitor-research/(_service)/(_hooks)/use-json-repair.ts

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

import {
  JsonRepairRequest,
  JsonRepairResult,
  JsonRepairState,
} from "../(_types)/json-repair-types";
import {
  JsonRepairServerRequest,
  repairJsonServerAction,
} from "../(_actions)/json-repair-action";

export function useJsonRepair() {
  const [repairState, setRepairState] = useState<JsonRepairState>({
    isRepairing: false,
    repairResult: null,
    showRepairTool: false,
    repairAttempts: 0,
  });

  /**
   * Восстановление JSON через Server Action
   */
  const repairJsonWithServer = useCallback(
    async (request: JsonRepairRequest): Promise<JsonRepairResult> => {
      console.log("🔧 Client: Starting JSON repair via Server Action:", {
        originalLength: request.invalidJsonString.length,
        competitorName: request.competitorName,
        attempt: repairState.repairAttempts + 1,
      });

      try {
        const serverRequest: JsonRepairServerRequest = {
          invalidJsonString: request.invalidJsonString,
          competitorUrl: request.competitorUrl,
          competitorName: request.competitorName,
        };

        console.log("🔧 Client: Calling Server Action...");

        const serverResult = await repairJsonServerAction(
          serverRequest,
          repairState.repairAttempts + 1
        );

        console.log("✅ Client: Server Action response:", {
          success: serverResult.success,
          confidence: serverResult.confidence,
        });

        // Конвертация результата сервера в формат клиентского хука
        const result: JsonRepairResult = {
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
        console.error("❌ Client: Server Action call failed:", error);

        const errorMessage =
          error instanceof Error
            ? `Server Action Error: ${error.message}`
            : "JSON repair request failed";

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
  const repairInvalidJson = useCallback(
    async (request: JsonRepairRequest): Promise<JsonRepairResult> => {
      console.log("🔧 Client: repairInvalidJson called:", {
        competitorName: request.competitorName,
        currentAttempts: repairState.repairAttempts,
        maxAttempts: 3,
      });

      // Проверка максимального количества попыток
      if (repairState.repairAttempts >= 3) {
        console.warn("⚠️ Client: Maximum repair attempts reached");
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
        const result = await repairJsonWithServer(request);

        // Проверка порога уверенности
        if (result.success && result.confidence < 0.6) {
          console.warn(
            "⚠️ Client: Repair confidence below threshold:",
            result.confidence
          );
          toast.warning(
            `Восстановление выполнено с низкой уверенностью: ${Math.round(result.confidence * 100)}%`
          );
        }

        setRepairState((prev) => ({
          ...prev,
          isRepairing: false,
          repairResult: result,
        }));

        if (result.success) {
          toast.success("JSON успешно восстановлен с помощью ИИ", {
            description: `Уверенность: ${Math.round(result.confidence * 100)}%`,
          });
        } else {
          toast.error("Не удалось восстановить структуру JSON", {
            description: result.error,
          });
        }

        return result;
      } catch (error) {
        console.error(
          "❌ Client: Unexpected error in repairInvalidJson:",
          error
        );

        const result: JsonRepairResult = {
          success: false,
          error: error instanceof Error ? error.message : "JSON repair failed",
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
    [repairState.repairAttempts, repairJsonWithServer]
  );

  /**
   * Сброс состояния восстановления
   */
  const resetRepairState = useCallback(() => {
    console.log("🔄 Client: Resetting repair state");
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
    repairInvalidJson,
    resetRepairState,
    toggleRepairTool,
    isRepairing: repairState.isRepairing,
    canRepair: repairState.repairAttempts < 3,
  };
}
