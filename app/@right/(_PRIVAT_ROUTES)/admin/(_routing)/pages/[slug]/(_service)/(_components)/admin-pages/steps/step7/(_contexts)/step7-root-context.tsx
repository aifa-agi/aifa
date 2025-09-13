// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_contexts)/step7-root-context.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type {
  PageData,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";
import {
  computeDerivedForSection,
  computeLaunchEligibility,
  normalizedRoots,
} from "../(_utils)/step7-utils";
import type {
  SectionDerivedProgress,
  Step7ContextValue,
  Step7UIState,
} from "../(_types)/step7-types";

const Step7Context = createContext<Step7ContextValue | null>(null);

export function useStep7Root() {
  const ctx = useContext(Step7Context);
  if (!ctx)
    throw new Error("useStep7Root must be used within Step7RootProvider");
  return ctx;
}

interface Step7RootProviderProps {
  page: PageData | null;
  children: React.ReactNode;
}

/**
 * Step7RootProvider holds only UI state and selectors; no CRUD/launch logic here.
 */
export function Step7RootProvider({ page, children }: Step7RootProviderProps) {
  const [ui, setUI] = useState<Step7UIState>({
    activeSectionId: null,
    status: "idle",
    derivedBySection: {},
    isLaunchEligible: false,
  });

  const getDraftSections = useCallback((): RootContentStructure[] => {
    return normalizedRoots(page);
  }, [page]);

  const getActiveSection = useCallback((): RootContentStructure | null => {
    if (!ui.activeSectionId) return null;
    const roots = getDraftSections();
    return roots.find((s) => s.id === ui.activeSectionId) ?? null;
  }, [getDraftSections, ui.activeSectionId]);

  const recomputeDerived = useCallback(() => {
    const roots = getDraftSections();
    const map: Record<string, SectionDerivedProgress> = {};
    for (const r of roots) {
      if (!r.id) continue;
      map[r.id] = computeDerivedForSection(r);
    }
    const eligible = computeLaunchEligibility(roots);
    setUI((prev) => ({
      ...prev,
      derivedBySection: map,
      isLaunchEligible: eligible,
    }));
  }, [getDraftSections]);

  const setActiveSection = useCallback((sectionId: string | null) => {
    setUI((prev) => ({ ...prev, activeSectionId: sectionId }));
  }, []);

  React.useEffect(() => {
    recomputeDerived();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page?.draftContentStructure, ui.activeSectionId]);

  const value: Step7ContextValue = {
    page,
    ui,
    getDraftSections,
    getActiveSection,
    setActiveSection,
    recomputeDerived,
  };

  return (
    <Step7Context.Provider value={value}>{children}</Step7Context.Provider>
  );
}
