// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_types)/content-repair-types.ts

import { ContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Request for ContentStructure JSON repair
 */
export interface ContentRepairRequest {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
  originalInstruction?: string;
}

/**
 * ✅ UPDATED ContentStructure JSON repair result
 */
export interface ContentRepairResult {
  success: boolean;
  repairedData?: ContentStructure[];
  error?: string;
  repairMethod: "openai-stream" | "openai-generate" | "manual" | "none"; // ✅ Updated for streamObject
  originalLength: number;
  repairedLength: number;
  confidence: number;
  // ✅ New fields for streamObject
  isStreaming?: boolean;
  streamDuration?: number; // Stream execution time in ms
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
}

/**
 * State of repair process
 */
export interface ContentRepairState {
  isRepairing: boolean;
  repairResult: ContentRepairResult | null;
  showRepairTool: boolean;
  repairAttempts: number;
  // ✅ New fields for tracking stream state
  isStreaming?: boolean;
  streamProgress?: number; // 0-100%
  streamStartTime?: number;
}

/**
 * ✅ UPDATED JSON repair methods
 */
export type ContentRepairMethod =
  | "openai-stream-object" // ✅ New primary method
  | "openai-generate-object" // ✅ Old method (deprecated)
  | "openai-chat"
  | "manual";

/**
 * Request for Server Action
 */
export interface ContentRepairServerRequest {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
  // ✅ New optional parameters for streamObject
  streamingOptions?: {
    enableProgressTracking?: boolean;
    maxStreamDuration?: number; // in ms
    preferredMethod?: "stream" | "generate"; // Preferred method
  };
}

/**
 * ✅ UPDATED Server Action response
 */
export interface ContentRepairServerResult {
  success: boolean;
  repairedData?: ContentStructure[];
  error?: string;
  originalLength: number;
  repairedLength: number;
  confidence: number;
  // ✅ New fields for streamObject
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
 * ✅ UPDATED repair configuration
 */
export interface ContentRepairConfig {
  maxAttempts: number;
  timeout: number;
  minConfidenceThreshold: number;
  openaiModel: string;
  // ✅ New settings for streamObject
  streamingConfig: {
    enableStreaming: boolean;
    maxStreamDuration: number; // 60000ms = 60s
    progressUpdateInterval: number; // 500ms
    fallbackToGenerate: boolean; // Fallback if stream doesn't work
    retryStreamOnFailure: boolean;
  };
  performanceTracking: {
    enableMetrics: boolean;
    logStreamingStats: boolean;
  };
}

// ✅ NEW types specifically for streamObject

/**
 * Streaming process configuration
 */
export interface StreamingConfig {
  enableProgressUpdates: boolean;
  updateInterval: number; // in ms
  maxDuration: number; // in ms
  onProgress?: (progress: number, stage: string) => void;
  onStageChange?: (stage: StreamingStage) => void;
}

/**
 * Streaming process stages
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
 * Result with streaming information
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
 * ✅ Extended request with streaming support
 */
export interface StreamingContentRepairRequest extends ContentRepairRequest {
  streamingConfig?: StreamingConfig;
  fallbackToGenerate?: boolean; // If streaming fails
}

// ✅ Existing types remain unchanged for compatibility

/**
 * ContentStructure validation errors
 */
export interface ContentValidationError {
  field: string;
  message: string;
  index?: number;
  severity: "error" | "warning";
}

/**
 * ContentStructure validation result
 */
export interface ContentValidationResult {
  isValid: boolean;
  errors: ContentValidationError[];
  warnings: ContentValidationError[];
  elementsCount: number;
}

// ✅ NEW utility types for streamObject

/**
 * Streaming performance metrics
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
 * Streaming operation status
 */
export interface StreamingStatus {
  isActive: boolean;
  currentStage: StreamingStage;
  progress: number; // 0-100
  estimatedTimeRemaining?: number;
  error?: string;
}

// ✅ Type guards for type checking

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

// ✅ Constants for streamObject

export const STREAMING_STAGES: Record<
  StreamingStage,
  { name: string; weight: number }
> = {
  initializing: { name: "Initializing", weight: 5 },
  "analyzing-input": { name: "Analyzing input data", weight: 15 },
  "generating-structure": { name: "Generating structure", weight: 60 },
  "validating-output": { name: "Validating result", weight: 15 },
  finalizing: {
    name: "Finalizing... This may take up to 10 minutes",
    weight: 5,
  },
  completed: { name: "Completed", weight: 0 },
  error: { name: "Error", weight: 0 },
};

export const DEFAULT_STREAMING_CONFIG: StreamingConfig = {
  enableProgressUpdates: true,
  updateInterval: 500,
  maxDuration: 60000, // 60 seconds
};

export const DEFAULT_REPAIR_CONFIG_WITH_STREAMING: ContentRepairConfig = {
  maxAttempts: 3,
  timeout: 60000, // Increased for streaming
  minConfidenceThreshold: 0.6,
  openaiModel: "gpt-4o" as const,
  streamingConfig: {
    enableStreaming: true,
    maxStreamDuration: 45000, // 45 seconds
    progressUpdateInterval: 500,
    fallbackToGenerate: true,
    retryStreamOnFailure: false,
  },
  performanceTracking: {
    enableMetrics: true,
    logStreamingStats: false, // Can be enabled in production as needed
  },
};
