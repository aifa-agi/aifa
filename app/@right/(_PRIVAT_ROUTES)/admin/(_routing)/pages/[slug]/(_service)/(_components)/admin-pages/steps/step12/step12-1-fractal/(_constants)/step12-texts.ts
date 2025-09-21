// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_constants)/step12-texts.ts
export const STEP12_TEXTS = {
  labels: {
    sections: "Sections",
    selectToEdit: "Pick a section to enable editing.",
    editingEnabled: "Editing is enabled for the selected section.",
    saveAll: "Save all sections",
    saving: "Saving...",
    resultBadge: "confirm", // renamed from "result" to "confirm"
    headerSubtitle: "Review AI draft results and analysis before proceeding to reporting.",
    headerCta: "Preview flow",
  },
  save: {
    notReadyTitle: "Not ready",
    notReadyDescription: "All sections must be populated before saving.",
    startTitle: "Saving started",
    startDescription: "Uploading changes for all sections...",
    successTitle: "Saved",
    successDescription: "All changes have been saved successfully.",
    errorTitle: "Save failed",
    errorDescription: "Could not save the changes. Please try again.",
    rollbackTitle: "Rolled back",
    rollbackDescription: "Local changes were reverted due to an error.",
  },
  preview: {
    completedSetTitle: "Preview marked as completed",
    completedSetDescription: "This page is now marked as preview-completed.",
    completedUnsetTitle: "Preview completion removed",
    completedUnsetDescription: "The preview completion flag has been cleared.",
    missingPageTitle: "Page not available",
    missingPageDescription: "Cannot update preview completion; page context is missing.",
  },
} as const;
export type Step12Texts = typeof STEP12_TEXTS;
