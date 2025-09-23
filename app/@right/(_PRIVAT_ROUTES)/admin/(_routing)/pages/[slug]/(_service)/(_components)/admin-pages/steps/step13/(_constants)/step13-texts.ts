// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_constants)/step13-texts.ts

/**
 * Step 13 Text Constants:
 * All interface texts, messages, tooltips, and errors in English.
 * Grouped by semantic blocks: header, cleanup, status, reports, deploy.
 * 
 * Understanding of the task (step-by-step):
 * 1) Header card titles and descriptions
 * 2) Data cleanup process messages and animations
 * 3) Field status indicators and dropdown labels
 * 4) Report management interface texts
 * 5) Deploy functionality descriptions and warnings
 * 6) SEO recommendations and best practices
 */

export const STEP13_TEXTS = {
  // Header Card Section
  header: {
    title: "Final Step",
    description: "Complete your content creation process with data cleanup and deployment preparation.",
    subtitle: "Finalize and optimize your page content",
  },

  // Data Cleanup Section
  cleanup: {
    title: "Data Cleanup",
    description: "If you have finished working on the content, it is recommended to clean up temporary data. You can do this now or at any other time.",
    buttonLabel: "Clean All Temporary Data",
    buttonTooltip: "Remove all temporary data except essential fields",
    
    // Animation Messages
    animation: {
      appearing: "Preparing cleanup...",
      deleting: "Deleting...",
      deleted: "Deleted",
      completing: "Cleanup completed successfully",
    },

    // Process States
    states: {
      idle: "Ready to clean temporary data",
      active: "Cleaning data in progress...",
      completed: "All temporary data has been cleaned",
      error: "Error occurred during cleanup process",
    },
  },

  // Data Status Section  
  status: {
    title: "Data Status Overview",
    description: "This card shows the current state of data for this pageData.",
    dropdownLabel: "View field status",
    dropdownPlaceholder: "Select field to check status",
    
    // Field Status Labels
    fieldLabels: {
      exists: "Exists",
      not_exists: "Not Exists",
      required: "Required",
      optional: "Optional",
    },

    // Status Messages
    messages: {
      allFieldsPresent: "All required fields are present",
      missingFields: "Some required fields are missing",
      optionalFieldsOnly: "Only optional fields detected",
    },
  },

  // Reports Section
  reports: {
    title: "Page Reports",
    description: "reports are currently available for this page.",
    noReportsMessage: "No reports available at this time.",
    downloadLabel: "Download Report",
    dropdownPlaceholder: "Select report to download",
    
    // Report Types
    types: {
      draft: "Draft Report",
      final: "Final Report", 
      analysis: "Analysis Report",
    },

    // Report Status
    statusLabels: {
      available: "Available",
      processing: "Processing",
      error: "Error",
    },
  },

  // Deploy Section
  deploy: {
    title: "Launch Deploy",
    description: "Deploy is designed to transform temporary data stored in your GitHub into static HTML files. You need to launch deploy on the Vercel server.",
    buttonLabel: "Go to Deploy",
    
    // Timing Information
    timing: {
      description: "Depending on the number of pages, this process can take from 3 minutes to several hours.",
      estimate: "Estimated time: 3 minutes to several hours",
    },

    // Navigation Info
    navigation: {
      targetPage: "admin/vercel-deploy",
      actionType: "Navigate to deployment management page",
    },
  },

  // SEO Recommendations
  seo: {
    title: "SEO Best Practice",
    recommendation: "It is recommended to use the ability to publish and unpublish created content so that the Google search engine sees only the final version of content that will never change again. This is important for search engine optimization.",
    
    // SEO Actions
    actions: {
      publish: "Publish final content",
      unpublish: "Unpublish draft content",
      optimize: "Optimize for search engines",
    },
  },

  // Error Messages
  errors: {
    cleanupFailed: "Failed to clean temporary data",
    missingPageData: "Page data not found",
    invalidSlug: "Invalid page identifier",
    serverError: "Server error occurred",
    networkError: "Network connection failed",
    
    // Detailed Error Descriptions
    descriptions: {
      cleanupFailed: "An error occurred while removing temporary data. Please try again.",
      missingPageData: "Unable to locate page data for cleanup process.",
      serverError: "Server encountered an error. Please refresh and try again.",
    },
  },

  // Success Messages  
  success: {
    cleanupCompleted: "Data cleanup completed successfully",
    dataOptimized: "Page data has been optimized",
    readyForDeploy: "Content is ready for deployment",
    
    // Success Descriptions
    descriptions: {
      cleanupCompleted: "All temporary data has been removed. Essential data preserved.",
      dataOptimized: "Page performance improved through data optimization.",
    },
  },

  // Loading States
  loading: {
    cleanup: "Cleaning data...",
    status: "Checking data status...",
    reports: "Loading reports...",
    navigation: "Preparing navigation...",
  },

  // Button Labels
  buttons: {
    cleanup: "Clean Data",
    cancel: "Cancel",
    retry: "Retry",
    refresh: "Refresh",
    download: "Download",
    deploy: "Deploy Now",
    viewStatus: "View Status",
  },

  // Tooltips and Help Text
  tooltips: {
    cleanup: "Removes all temporary data while preserving essential page information",
    status: "Shows which data fields are currently present or missing",
    reports: "Access generated reports for this page content",
    deploy: "Launch deployment process to publish static HTML files",
    seo: "Follow SEO best practices for search engine optimization",
  },
} as const;

// Export individual text groups for targeted imports
export const { header, cleanup, status, reports, deploy, seo, errors, success, loading, buttons, tooltips } = STEP13_TEXTS;
