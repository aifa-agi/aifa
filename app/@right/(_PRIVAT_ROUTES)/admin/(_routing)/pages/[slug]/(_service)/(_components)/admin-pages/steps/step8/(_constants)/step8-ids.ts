// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_constants)/step8-ids.ts

/**
 * Step 8 stable identifiers and keys.
 *
 * Understanding of the task (step-by-step):
 * 1) Provide stable IDs for toasts, actions, and UI elements to avoid duplicates and allow dedup/updates.
 * 2) Keep naming consistent across hooks/components to simplify imports and telemetry.
 * 3) Do not include business logic here; only constants used by UI and hooks.
 * 4) IDs are namespaced under "step8/*" to prevent collisions with other steps.
 */

export const STEP8_IDS = {
  context: "step8/context/Step8RootContext",
  components: {
    headerCard: "step8/component/Step8HeaderCard",
    selectorCard: "step8/component/ResultsSelectorCard",
    generateCard: "step8/component/DraftGenerateCard",
    editorCard: "step8/component/MDXEditorCard",
    progressStrip: "step8/component/ProgressStrip",
    resultsCard: "step8/component/DraftResultsCard",
  },
  actions: {
    generateSection: "step8/action/generate-section-mdx",
    regenerateAll: "step8/action/regenerate-all-drafts",
    saveSectionMDX: "step8/action/save-section-mdx",
    copyPrompt: "step8/action/copy-prompt",
  },
  toasts: {
    guardLocked: "step8/toast/guard-locked",
    guardInvalid: "step8/toast/guard-invalid",
    generateStart: "step8/toast/generate-start",
    generateSuccess: "step8/toast/generate-success",
    generateError: "step8/toast/generate-error",
    generateCanceled: "step8/toast/generate-canceled",
    saveSuccess: "step8/toast/save-success",
    saveCleared: "step8/toast/save-cleared",
    saveError: "step8/toast/save-error",
    rollback: "step8/toast/rollback",

    // Stream
    streamStart: "s8_stream_start",
    streamSuccess: "s8_stream_success",
    streamError: "s8_stream_error",
    streamCanceled: "s8_stream_canceled",

    // NEW: Copy prompt
    copySuccess: "s8_copy_success",
    copyError: "s8_copy_error",
  },
  telemetry: {
    eventPrefix: "step8/event",
  },
} as const;

export type Step8ToastId =
  (typeof STEP8_IDS)["toasts"][keyof (typeof STEP8_IDS)["toasts"]];
