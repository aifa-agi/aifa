// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_constants)/step12-v2-texts.ts
export const STEP12_V2_TEXTS = {
  labels: {
    // Section management
    sections: "Sections",
    selectToEdit: "Pick a section to enable editing.",
    editingEnabled: "Editing is enabled for the selected section.",
    allSections: "All Sections",
    
    // Actions
    saveAll: "Save all sections",
    saving: "Saving...",
    loading: "Loading...",
    resultBadge: "confirm",
    
    // Header texts
    headerSubtitle: "Edit sections loaded from file system and save updates.",
    headerCta: "File Editor",
  },

  save: {
    // Save operation states
    notReadyTitle: "Not ready",
    notReadyDescription: "All sections must be loaded and edited before saving.",
    startTitle: "Saving started", 
    startDescription: "Uploading changes for all sections to file system...",
    successTitle: "Saved",
    successDescription: "All changes have been saved to file system successfully.",
    errorTitle: "Save failed",
    errorDescription: "Could not save the changes to file system. Please try again.",
    rollbackTitle: "Rolled back",
    rollbackDescription: "Local changes were reverted due to an error.",
  },

  loading: {
    // Loading states for file system operations
    sectionContent: "Loading section content...",
    pageData: "Loading page data...",
    fileSystem: "Reading from file system...",
    allSections: "Loading all sections...",
  },

  errors: {
    // Error messages for file system operations
    sectionNotFound: "Section not found in file system",
    invalidContent: "Invalid section content format",
    fileSystemError: "File system access error",
    networkError: "Network error. Please check your connection and try again.",
    validationError: "Validation error", 
    serverError: "Server error",
    unknownError: "Unknown error occurred",
    missingHref: "Page href is required for file system operations",
    noSections: "No sections available to edit",
  },

  placeholders: {
    // Editor placeholders
    editorEmpty: "Start typing to add content...",
    sectionEmpty: "No content in this section",
    noSectionsDisplay: "No sections to display yet.",
  },

  status: {
    // Section status indicators
    loaded: "Loaded",
    modified: "Modified", 
    saved: "Saved",
    error: "Error",
    empty: "Empty",
  },
} as const;

export type Step12V2Texts = typeof STEP12_V2_TEXTS;
