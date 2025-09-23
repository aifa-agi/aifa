// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_constants)/step13-ids.ts

/**
 * Step 13 ID Constants:
 * Unique identifiers for toast notifications, HTML elements, 
 * animation processes, and component states.
 * 
 * Understanding of the task (step-by-step):
 * 1) Toast IDs for Sonner notification system without conflicts
 * 2) HTML element IDs for accessibility and testing
 * 3) Animation process identifiers for state tracking
 * 4) Component state IDs for context management
 * 5) Dropdown and form element identifiers
 */

export const STEP13_IDS = {
  // Toast Notification IDs (for Sonner)
  toasts: {
    // Cleanup Process Toasts
    cleanupStart: "step13-cleanup-start",
    cleanupSuccess: "step13-cleanup-success",
    cleanupError: "step13-cleanup-error",
    cleanupRollback: "step13-cleanup-rollback",
    
    // Data Status Toasts
    statusLoaded: "step13-status-loaded",
    statusError: "step13-status-error",
    
    // Reports Toasts
    reportDownload: "step13-report-download",
    reportError: "step13-report-error",
    
    // Deploy Navigation Toasts
    deployRedirect: "step13-deploy-redirect",
    deployError: "step13-deploy-error",
  },

  // Component Container IDs
  containers: {
    main: "step13-main-container",
    headerCard: "step13-header-card",
    cleanupCard: "step13-cleanup-card", 
    statusCard: "step13-status-card",
    reportsCard: "step13-reports-card",
    deployCard: "step13-deploy-card",
    seoCard: "step13-seo-recommendations",
  },

  // Interactive Element IDs
  elements: {
    // Cleanup Section
    cleanupButton: "step13-cleanup-btn",
    cleanupProgress: "step13-cleanup-progress",
    cleanupAnimation: "step13-cleanup-animation",
    
    // Status Section
    statusDropdown: "step13-status-dropdown",
    statusList: "step13-status-list",
    statusIndicator: "step13-status-indicator",
    
    // Reports Section
    reportsDropdown: "step13-reports-dropdown",
    reportsCounter: "step13-reports-counter",
    downloadButton: "step13-download-btn",
    
    // Deploy Section
    deployButton: "step13-deploy-btn",
    deployDescription: "step13-deploy-description",
    
    // SEO Section
    seoRecommendation: "step13-seo-recommendation",
  },

  // Animation and Process IDs
  animations: {
    // Field Cleanup Animation Sequence
    fieldAppearing: "step13-field-appearing",
    fieldDeleting: "step13-field-deleting", 
    fieldDeleted: "step13-field-deleted",
    
    // Progress Indicators
    cleanupProgress: "step13-cleanup-progress-bar",
    statusLoader: "step13-status-loader",
    reportsLoader: "step13-reports-loader",
  },

  // Form and Input IDs
  forms: {
    statusForm: "step13-status-form",
    reportsForm: "step13-reports-form",
    
    // Input Fields
    statusSelect: "step13-status-select",
    reportsSelect: "step13-reports-select",
  },

  // Accessibility IDs
  accessibility: {
    // ARIA Labels
    cleanupRegion: "step13-cleanup-region",
    statusRegion: "step13-status-region", 
    reportsRegion: "step13-reports-region",
    deployRegion: "step13-deploy-region",
    
    // Live Regions for Screen Readers
    cleanupLive: "step13-cleanup-live",
    statusLive: "step13-status-live",
    errorLive: "step13-error-live",
  },

  // Dialog and Modal IDs
  dialogs: {
    confirmCleanup: "step13-confirm-cleanup-dialog",
    deployWarning: "step13-deploy-warning-dialog",
    errorModal: "step13-error-modal",
  },

  // Context and State IDs
  contexts: {
    rootContext: "step13-root-context",
    cleanupContext: "step13-cleanup-context",
    statusContext: "step13-status-context",
  },

  // Loading State IDs
  loading: {
    pageData: "step13-loading-page-data",
    cleanup: "step13-loading-cleanup",
    status: "step13-loading-status",
    reports: "step13-loading-reports",
  },

  // Error Boundary IDs
  errors: {
    boundary: "step13-error-boundary",
    fallback: "step13-error-fallback", 
    retry: "step13-error-retry",
  },
} as const;

// Export individual ID groups for targeted imports
export const { 
  toasts, 
  containers, 
  elements, 
  animations, 
  forms, 
  accessibility, 
  dialogs, 
  contexts, 
  loading, 
  errors 
} = STEP13_IDS;

// Type helper for ID validation
export type Step13ToastId = typeof STEP13_IDS.toasts[keyof typeof STEP13_IDS.toasts];
export type Step13ElementId = typeof STEP13_IDS.elements[keyof typeof STEP13_IDS.elements];
export type Step13ContainerId = typeof STEP13_IDS.containers[keyof typeof STEP13_IDS.containers];
