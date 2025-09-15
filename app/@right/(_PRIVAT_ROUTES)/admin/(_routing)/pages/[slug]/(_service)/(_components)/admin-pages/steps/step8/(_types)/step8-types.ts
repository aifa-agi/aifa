// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_types)/step8-types.ts

import type { DraftContentResult } from "@/app/@right/(_service)/(_types)/page-types";

export type GenerationStatus = "idle" | "generating" | "ready" | "error";

/** Map of sectionId -> boolean completeness for Step 8 (non-empty tempMDXContent). */
export type CompletedBySectionMap = Record<string, boolean>;

/** Map of sectionId -> GenerationStatus for Step 8. */
export type GenerationStatusBySectionMap = Record<string, GenerationStatus>;

export interface Step8Derived {
  savedCount: number;
  totalCount: number;
  coverage8: number; // integer percent
  unlockedIndex: number; // index of the next allowed section
  isAllSaved8: boolean;
}

export interface Step8UIState {
  activeSectionId: string | null;
  selectedResultNodeId: string | null;

  // Draft results presence by section (computed from PageData.draftContentResult).
  resultsBySection: Record<string, boolean>;
  resultRootsBySection: Record<string, DraftContentResult | undefined>;

  // Per-section generation status for Step 8.
  generationStatusBySection: GenerationStatusBySectionMap;

  // Derived completion/sequence metrics for Step 8.
  completedBySection: CompletedBySectionMap;
  unlockedIndex: number;
  savedCount: number;
  totalCount: number;
  coverage8: number; // 0..100 integer
  isAllSaved8: boolean;

  // Last error for UI feedback (toast/inline), not persisted.
  lastError?: string | null;
}
