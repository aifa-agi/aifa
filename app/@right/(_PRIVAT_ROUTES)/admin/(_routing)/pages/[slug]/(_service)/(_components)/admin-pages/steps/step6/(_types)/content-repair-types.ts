// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_types)/content-repair-types.ts

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
 * ✅ ОБНОВЛЕННЫЙ Результат восстановления ContentStructure JSON
 */
export interface ContentRepairResult {
  success: boolean;
  repairedData?: ContentStructure[];
  error?: string;
  repairMethod: "openai-stream" | "openai-generate" | "manual" | "none"; // ✅ Обновлено для streamObject
  originalLength: number;
  repairedLength: number;
  confidence: number;
  // ✅ Новые поля для streamObject
  isStreaming?: boolean;
  streamDuration?: number; // Время выполнения стрима в мс
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
}

/**
 * Состояние процесса восстановления
 */
export interface ContentRepairState {
  isRepairing: boolean;
  repairResult: ContentRepairResult | null;
  showRepairTool: boolean;
  repairAttempts: number;
  // ✅ Новые поля для отслеживания stream состояния
  isStreaming?: boolean;
  streamProgress?: number; // 0-100%
  streamStartTime?: number;
}

/**
 * ✅ ОБНОВЛЕННЫЕ Методы восстановления JSON
 */
export type ContentRepairMethod =
  | "openai-stream-object" // ✅ Новый основной метод
  | "openai-generate-object" // ✅ Старый метод (deprecated)
  | "openai-chat"
  | "manual";

/**
 * Запрос для Server Action
 */
export interface ContentRepairServerRequest {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
  // ✅ Новые опциональные параметры для streamObject
  streamingOptions?: {
    enableProgressTracking?: boolean;
    maxStreamDuration?: number; // в мс
    preferredMethod?: "stream" | "generate"; // Предпочтительный метод
  };
}

/**
 * ✅ ОБНОВЛЕННЫЙ Ответ от Server Action
 */
export interface ContentRepairServerResult {
  success: boolean;
  repairedData?: ContentStructure[];
  error?: string;
  originalLength: number;
  repairedLength: number;
  confidence: number;
  // ✅ Новые поля для streamObject
  repairMethod: "stream-object" | "generate-object" | "fallback";
  streamDuration?: number;
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
  performanceMetrics?: {
    streamingTime: number;
    validationTime: number;
    totalTime: number;
  };
}

/**
 * ✅ ОБНОВЛЕННАЯ Конфигурация для восстановления
 */
export interface ContentRepairConfig {
  maxAttempts: number;
  timeout: number;
  minConfidenceThreshold: number;
  openaiModel: string;
  // ✅ Новые настройки для streamObject
  streamingConfig: {
    enableStreaming: boolean;
    maxStreamDuration: number; // 60000ms = 60s
    progressUpdateInterval: number; // 500ms
    fallbackToGenerate: boolean; // Fallback если stream не работает
    retryStreamOnFailure: boolean;
  };
  performanceTracking: {
    enableMetrics: boolean;
    logStreamingStats: boolean;
  };
}

// ✅ НОВЫЕ типы специально для streamObject

/**
 * Конфигурация streaming процесса
 */
export interface StreamingConfig {
  enableProgressUpdates: boolean;
  updateInterval: number; // в мс
  maxDuration: number; // в мс
  onProgress?: (progress: number, stage: string) => void;
  onStageChange?: (stage: StreamingStage) => void;
}

/**
 * Стадии streaming процесса
 */
export type StreamingStage =
  | "initializing"
  | "analyzing-input"
  | "generating-structure"
  | "validating-output"
  | "finalizing"
  | "completed"
  | "error";

/**
 * Результат с информацией о streaming
 */
export interface StreamingRepairResult extends ContentRepairResult {
  streamingStats: {
    stages: Array<{
      stage: StreamingStage;
      duration: number;
      timestamp: number;
    }>;
    totalStreamTime: number;
    averageTokensPerSecond?: number;
  };
}

/**
 * ✅ Расширенный запрос с поддержкой streaming
 */
export interface StreamingContentRepairRequest extends ContentRepairRequest {
  streamingConfig?: StreamingConfig;
  fallbackToGenerate?: boolean; // Если streaming не удается
}

// ✅ Существующие типы остаются без изменений для совместимости

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

// ✅ НОВЫЕ утилитарные типы для streamObject

/**
 * Метрики производительности streaming
 */
export interface StreamingMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  tokensProcessed: number;
  tokensPerSecond: number;
  stages: StreamingStageMetric[];
}

export interface StreamingStageMetric {
  stage: StreamingStage;
  startTime: number;
  duration: number;
  success: boolean;
  details?: Record<string, any>;
}

/**
 * Статус streaming операции
 */
export interface StreamingStatus {
  isActive: boolean;
  currentStage: StreamingStage;
  progress: number; // 0-100
  estimatedTimeRemaining?: number;
  error?: string;
}

// ✅ Type guards для проверки типов

export function isStreamingResult(
  result: ContentRepairResult
): result is StreamingRepairResult {
  return "streamingStats" in result;
}

export function isStreamingRequest(
  request: ContentRepairRequest
): request is StreamingContentRepairRequest {
  return "streamingConfig" in request;
}

// ✅ Constants для streamObject

export const STREAMING_STAGES: Record<
  StreamingStage,
  { name: string; weight: number }
> = {
  initializing: { name: "Инициализация", weight: 5 },
  "analyzing-input": { name: "Анализ входных данных", weight: 15 },
  "generating-structure": { name: "Генерация структуры", weight: 60 },
  "validating-output": { name: "Валидация результата", weight: 15 },
  finalizing: { name: "Финализация", weight: 5 },
  completed: { name: "Завершено", weight: 0 },
  error: { name: "Ошибка", weight: 0 },
};

export const DEFAULT_STREAMING_CONFIG: StreamingConfig = {
  enableProgressUpdates: true,
  updateInterval: 500,
  maxDuration: 60000, // 60 секунд
};

export const DEFAULT_REPAIR_CONFIG_WITH_STREAMING: ContentRepairConfig = {
  maxAttempts: 3,
  timeout: 60000, // Увеличено для streaming
  minConfidenceThreshold: 0.6,
  openaiModel: "gpt-4o" as const,
  streamingConfig: {
    enableStreaming: true,
    maxStreamDuration: 45000, // 45 секунд
    progressUpdateInterval: 500,
    fallbackToGenerate: true,
    retryStreamOnFailure: false,
  },
  performanceTracking: {
    enableMetrics: true,
    logStreamingStats: false, // Включать в production можно по необходимости
  },
};
