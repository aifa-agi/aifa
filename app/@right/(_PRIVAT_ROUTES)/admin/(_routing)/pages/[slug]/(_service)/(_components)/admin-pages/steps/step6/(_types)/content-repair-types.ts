// @app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_types)/content-repair-types.ts
import { ContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Запрос на восстановление ContentStructure JSON
 */
export interface ContentRepairRequest {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
  originalInstruction?: string;
}

/**
 * Результат восстановления ContentStructure JSON
 */
export interface ContentRepairResult {
  success: boolean;
  repairedData?: ContentStructure[];
  error?: string;
  repairMethod: "openai" | "manual" | "none";
  originalLength: number;
  repairedLength: number;
  confidence: number;
}

/**
 * Состояние процесса восстановления
 */
export interface ContentRepairState {
  isRepairing: boolean;
  repairResult: ContentRepairResult | null;
  showRepairTool: boolean;
  repairAttempts: number;
}

/**
 * Методы восстановления JSON
 */
export type ContentRepairMethod =
  | "openai-generate-object"
  | "openai-chat"
  | "manual";

/**
 * Запрос для Server Action
 */
export interface ContentRepairServerRequest {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
}

/**
 * Ответ от Server Action
 */
export interface ContentRepairServerResult {
  success: boolean;
  repairedData?: ContentStructure[];
  error?: string;
  originalLength: number;
  repairedLength: number;
  confidence: number;
}

/**
 * Конфигурация для восстановления
 */
export interface ContentRepairConfig {
  maxAttempts: number;
  timeout: number;
  minConfidenceThreshold: number;
  openaiModel: string;
}

/**
 * Ошибки валидации ContentStructure
 */
export interface ContentValidationError {
  field: string;
  message: string;
  index?: number;
  severity: "error" | "warning";
}

/**
 * Результат валидации ContentStructure
 */
export interface ContentValidationResult {
  isValid: boolean;
  errors: ContentValidationError[];
  warnings: ContentValidationError[];
  elementsCount: number;
}
