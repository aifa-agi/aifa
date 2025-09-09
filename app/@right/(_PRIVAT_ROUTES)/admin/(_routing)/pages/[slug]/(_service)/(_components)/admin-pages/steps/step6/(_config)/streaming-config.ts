// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_config)/streaming-config.ts

/**
 * ✅ Configuration constants for streaming content repair operations
 */
export const STREAMING_CONFIG = {
  // ✅ Vercel timeout prevention
  maxDuration: 30, // Maximum 30 seconds to prevent Vercel timeout

  // ✅ Content generation limits
  maxElements: 10, // Maximum number of H2 elements to generate
  minElements: 3, // Minimum number of H2 elements to generate

  // ✅ Progress tracking
  progressThreshold: 10, // Progress update threshold (percentage points)

  // ✅ OpenAI model configuration
  modelName: "gpt-4o" as const,
  temperature: 0.2,
  maxOutputTokens: 4000,
  maxRetries: 2,

  // ✅ Streaming behavior
  chunkDelay: 100, // Milliseconds between chunk processing
  timeoutBuffer: 5000, // 5 second buffer before timeout

  // ✅ Toast notification settings
  toastDuration: {
    progress: 1000, // Progress notifications duration
    success: 4000, // Success notifications duration
    error: 5000, // Error notifications duration
    warning: 4000, // Warning notifications duration
  },

  // ✅ H2 compliance settings
  h2Compliance: {
    enforceRootH2: true, // Force all root elements to be H2
    autoFixViolations: true, // Automatically fix H1/H2 violations in nested elements
    validateOnStream: true, // Validate H2 compliance during streaming
  },

  // ✅ Content quality thresholds
  qualityThresholds: {
    minConfidence: 0.6, // Minimum confidence for repair results
    minWordCount: 10, // Minimum words per section
    maxWordCount: 500, // Maximum words per section
  },
} as const;

/**
 * ✅ Type definition for streaming configuration
 */
export type StreamingConfig = typeof STREAMING_CONFIG;

/**
 * ✅ Helper function to get timeout value with buffer
 */
export const getStreamingTimeout = (): number => {
  return STREAMING_CONFIG.maxDuration * 1000 - STREAMING_CONFIG.timeoutBuffer;
};

/**
 * ✅ Helper function to check if progress should trigger notification
 */
export const shouldNotifyProgress = (
  currentProgress: number,
  lastProgress: number
): boolean => {
  return currentProgress > lastProgress + STREAMING_CONFIG.progressThreshold;
};

/**
 * ✅ Helper function to get model configuration for streamObject
 */
export const getModelConfig = () => ({
  model: STREAMING_CONFIG.modelName,
  temperature: STREAMING_CONFIG.temperature,
  maxOutputTokens: STREAMING_CONFIG.maxOutputTokens,
  maxRetries: STREAMING_CONFIG.maxRetries,
});

/**
 * ✅ Helper function to get toast configuration
 */
export const getToastConfig = (
  type: keyof typeof STREAMING_CONFIG.toastDuration
) => ({
  duration: STREAMING_CONFIG.toastDuration[type],
});
