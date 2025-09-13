// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_types)/step7-types.ts
import type {
  PageData,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";

export type Step7Status = "idle" | "updating" | "error";

export interface SectionDerivedProgress {
  total: number;
  confirmed: number;
  isDraft: boolean; // total = 0 or confirmed = 0
  inProcess: boolean; // 0 < confirmed < total
  isConfirmed: boolean; // confirmed = total ≥ 1
}

export interface Step7UIState {
  activeSectionId: string | null;
  status: Step7Status;
  lastError?: string;
  derivedBySection: Record<string, SectionDerivedProgress>;
  isLaunchEligible: boolean;
}

export interface Step7ContextValue {
  page: PageData | null;

  ui: Step7UIState;

  // Selectors only (no CRUD/launch here)
  getDraftSections: () => RootContentStructure[];
  getActiveSection: () => RootContentStructure | null;

  // UI actions
  setActiveSection: (sectionId: string | null) => void;

  // Derived recompute
  recomputeDerived: () => void;
}
