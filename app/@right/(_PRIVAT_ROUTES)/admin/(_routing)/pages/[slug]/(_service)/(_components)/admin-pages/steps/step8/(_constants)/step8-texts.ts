// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_constants)/step8-texts.ts
export const STEP8_TEXTS = {
  // Shared labels
  labels: {
    draftResults: "Draft Results",
    totalSections: "Total Sections",
    withResults: "With Results",
    coverage: "Coverage",
    lastUpdate: "Last update",
    regenerateDraft: "Regenerate draft",
    save: "Save",
    discard: "Discard",
    generate: "Generate",
    cancel: "Cancel",
    locked: "Locked",
    active: "Active",
    section: "Section",
    sections: "Sections",
    copyPrompt: "Copy Prompt",
  },

  // Guard and sequence enforcement
  guard: {
    lockedTitle: "Section is locked",
    lockedDescription:
      "This section is locked due to strict sequence. Complete the previous section to unlock.",
    invalidIndexTitle: "Activation denied",
    invalidIndexDescription:
      "Only the next unlocked section can be activated. Follow the sequence.",
    clearedChainTitle: "Chain revoked",
    clearedChainDescription:
      "Content was cleared. Subsequent sections are locked until the chain is restored.",
  },

  // Generation lifecycle
  generate: {
    startTitle: "Generation started",
    startDescription: "Model is generating MDX for the active section...",
    successTitle: "Generation completed",
    successDescription: "Draft MDX is ready. Review and edit before saving.",
    canceledTitle: "Generation canceled",
    canceledDescription: "The generation process was canceled.",
    errorTitle: "Generation failed",
    errorDescription:
      "Could not generate MDX for this section. Try again or adjust the prompt.",
  },
  stream: {
    startTitle: "Streaming generation",
    startDescription: "Receiving MDX chunks in real time...",
    successTitle: "Stream finished",
    successDescription: "Full MDX was received from the stream.",
    errorTitle: "Streaming error",
    errorDescription: "The stream failed to deliver content.",
    canceledTitle: "Stream canceled",
    canceledDescription: "Streaming has been aborted.",
  },

  // NEW: Copy prompt lifecycle
  copy: {
    successTitle: "Copied",
    successDescription: "System instruction has been copied to clipboard.",
    errorTitle: "Copy failed",
    errorDescription:
      "Could not copy the system instruction. Check browser permissions.",
  },

  // Saving lifecycle
  save: {
    successTitle: "Saved",
    successDescription: "Section MDX has been saved successfully.",
    clearedTitle: "Cleared",
    clearedDescription:
      "Section MDX was cleared. Completion and unlocking were updated.",
    errorTitle: "Save failed",
    errorDescription:
      "Could not save the section MDX. Changes were not persisted.",
    rollbackTitle: "Rolled back",
    rollbackDescription:
      "The last change was reverted due to a persistence error.",
  },

  // Editor
  editor: {
    placeholder:
      "Paste or edit the generated MDX here. Keep headings and formatting consistent.",
    completedBadge: "Completed",
    emptyState:
      "No MDX yet. Generate first or paste your own content and save.",
  },

  // Header card
  header: {
    subtitle:
      "Review AI draft results and analysis before proceeding to reporting.",
  },

  // Results selector
  selector: {
    title: "Sections",
    lockedBadge: "Locked",
    activeBadge: "Active",
    selectPrompt: "Select a section to view or generate its draft.",
  },

  // Progress strip
  progress: {
    coverageLabel: "Coverage",
    currentLabel: "Current",
  },

  // Prompt builder hints (required by spec)
  prompt: {
    wordCountPolicy:
      "Word count is decided by the model preferences; min/max are advisory and can be zero.",
    styleCoherenceHint:
      "Ensure stylistic and formatting coherence with all previously saved sections.",
  },

  // Generic errors
  errors: {
    missingSection: "Section not found.",
    missingActive: "No active section selected.",
    lockedAction: "Action is locked by the sequence policy.",
  },
} as const;

export type Step8Texts = typeof STEP8_TEXTS;
