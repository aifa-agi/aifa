// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_constants)/step12-ids.ts
export const STEP12_IDS = {
 context: "step12/context/Step12RootContext",
 components: {
   selectorCard: "step12/component/SectionsSelectorCard",
   saveButton: "step12/component/SaveAllButton",
   editor: "step12/component/SimpleEditor",
   headerCard: "step12/component/Step12HeaderCard",
 },
 actions: {
   saveAll: "step12/action/save-all-sections",
   setPreviewCompleted: "step12/action/set-preview-completed",
 },
 toasts: {
   saveStart: "step12/toast/save-start",
   saveSuccess: "step12/toast/save-success",
   saveError: "step12/toast/save-error",
   saveNotReady: "step12/toast/save-not-ready",
   rollback: "step12/toast/rollback",
   previewSet: "step12/toast/preview-set",
   previewUnset: "step12/toast/preview-unset",
   previewMissing: "step12/toast/preview-missing",
 },
} as const;
export type Step12ToastId = (typeof STEP12_IDS)["toasts"][keyof (typeof STEP12_IDS)["toasts"]];




