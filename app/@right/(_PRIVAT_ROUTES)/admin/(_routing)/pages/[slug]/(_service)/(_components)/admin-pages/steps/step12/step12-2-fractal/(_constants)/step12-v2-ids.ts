// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_constants)/step12-v2-ids.ts

/**
 * Step12 V2 IDs Constants - File System Based Section Editor
 * All unique identifiers for components, contexts, actions and toasts
 * Adapted from step12-ids.ts for V2 version
 */

export const STEP12_V2_IDS = {
  // Context identifiers for V2
  context: {
    step12V2RootContext: "step12-v2-context:Step12V2RootContext",
    step12V2ButtonsContext: "step12-v2-context:Step12V2ButtonsContext",
  },

  // Component identifiers for V2
  components: {
    selectorCard: "step12-v2-component:SectionsSelectorV2Card",
    saveButton: "step12-v2-component:SaveAllV2Button", 
    editor: "step12-v2-component:SimpleEditorV2",
    headerCard: "step12-v2-component:Step12V2HeaderCard",
    mainWrapper: "step12-v2-component:Step12V2Wrapper",
    editorHost: "step12-v2-component:EditorHostV2",
  },

  // Action identifiers for V2 file system operations
  actions: {
    saveAll: "step12-v2-action:save-all-sections-fs",
    loadSection: "step12-v2-action:load-section-from-fs",
    updateSection: "step12-v2-action:update-section-content",
    refreshAll: "step12-v2-action:refresh-all-from-fs",
    resetFlags: "step12-v2-action:reset-confirmation-flags",
  },

  // Toast notification IDs for V2
  toasts: {
    saveStart: "step12-v2-toast:save-start",
    saveSuccess: "step12-v2-toast:save-success", 
    saveError: "step12-v2-toast:save-error",
    saveNotReady: "step12-v2-toast:save-not-ready",
    rollback: "step12-v2-toast:rollback",
    loadingSection: "step12-v2-toast:loading-section",
    loadingError: "step12-v2-toast:loading-error",
    fileSystemError: "step12-v2-toast:filesystem-error",
    validationError: "step12-v2-toast:validation-error",
    networkError: "step12-v2-toast:network-error",
  },

  // Element selectors for V2 testing and debugging
  selectors: {
    sectionChip: "step12-v2-selector:section-chip",
    activeSection: "step12-v2-selector:active-section",
    saveAllButton: "step12-v2-selector:save-all-button",
    editorContent: "step12-v2-selector:editor-content",
    loadingSpinner: "step12-v2-selector:loading-spinner",
    errorMessage: "step12-v2-selector:error-message",
  },
} as const;

export type Step12V2ToastId = typeof STEP12_V2_IDS["toasts"][keyof typeof STEP12_V2_IDS["toasts"]];
export type Step12V2ComponentId = typeof STEP12_V2_IDS["components"][keyof typeof STEP12_V2_IDS["components"]];
export type Step12V2ActionId = typeof STEP12_V2_IDS["actions"][keyof typeof STEP12_V2_IDS["actions"]];
