// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_contexts)/step8-root-context.tsx
"use client";

/**
 * Step8RootProvider:
 * - Holds UI-only state: activeSectionId, selectedResultNodeId, derived maps.
 * - Provides selectors over PageData.draftContentStructure and PageData.draftContentResult.
 * - Does not duplicate trees; keeps single source of truth in PageData.
 */

import * as React from "react";
import type {
  PageData,
  RootContentStructure,
  DraftContentResult,
} from "@/app/@right/(_service)/(_types)/page-types";
import { normalizedRoots } from "../../step7/(_utils)/step7-utils";

type Step8UIState = {
  activeSectionId: string | null;
  selectedResultNodeId: string | null;
  // Derived: sectionId -> hasResults
  resultsBySection: Record<string, boolean>;
  // Derived: sectionId -> result tree root (DraftContentResult)
  resultRootsBySection: Record<string, DraftContentResult | undefined>;
};

type Step8ContextValue = {
  page: PageData | null;

  ui: Step8UIState;

  // Sections
  getSections: () => RootContentStructure[];
  getActiveSection: () => RootContentStructure | null;
  setActiveSection: (sectionId: string | null) => void;

  // Results
  getSectionResultRoot: (sectionId: string | null) => DraftContentResult | null;

  // Result node selection
  selectedResultNodeId: string | null;
  setSelectedResultNodeId: (id: string | null) => void;
};

const Step8Context = React.createContext<Step8ContextValue | null>(null);

export function useStep8Root() {
  const ctx = React.useContext(Step8Context);
  if (!ctx)
    throw new Error("useStep8Root must be used within Step8RootProvider");
  return ctx;
}

function indexDraftResultsBySection(
  roots: RootContentStructure[] | undefined,
  results: DraftContentResult[] | undefined
): {
  resultsBySection: Record<string, boolean>;
  resultRootsBySection: Record<string, DraftContentResult | undefined>;
} {
  const map: Record<string, boolean> = {};
  const link: Record<string, DraftContentResult | undefined> = {};

  if (!roots || roots.length === 0)
    return { resultsBySection: map, resultRootsBySection: link };
  const resultById = new Map<string, DraftContentResult>();
  (results ?? []).forEach((r) => {
    if (r?.contentStructure?.id) {
      resultById.set(r.contentStructure.id, r);
    }
  });

  for (const s of roots) {
    if (!s?.id) continue;
    const has = resultById.has(s.id);
    map[s.id] = has;
    link[s.id] = has ? resultById.get(s.id) : undefined;
  }
  return { resultsBySection: map, resultRootsBySection: link };
}

export function Step8RootProvider({
  page,
  children,
}: {
  page: PageData | null;
  children: React.ReactNode;
}) {
  const [ui, setUI] = React.useState<Step8UIState>({
    activeSectionId: null,
    selectedResultNodeId: null,
    resultsBySection: {},
    resultRootsBySection: {},
  });

  const getSections = React.useCallback((): RootContentStructure[] => {
    return normalizedRoots(page);
  }, [page]);

  const getActiveSection =
    React.useCallback((): RootContentStructure | null => {
      if (!ui.activeSectionId) return null;
      const roots = getSections();
      return roots.find((s) => s.id === ui.activeSectionId) ?? null;
    }, [getSections, ui.activeSectionId]);

  const getSectionResultRoot = React.useCallback(
    (sectionId: string | null): DraftContentResult | null => {
      if (!sectionId) return null;
      return ui.resultRootsBySection[sectionId] ?? null;
    },
    [ui.resultRootsBySection]
  );

  const setActiveSection = React.useCallback((sectionId: string | null) => {
    setUI((prev) => ({
      ...prev,
      activeSectionId: sectionId,
      selectedResultNodeId: null,
    }));
  }, []);

  const setSelectedResultNodeId = React.useCallback((id: string | null) => {
    setUI((prev) => ({ ...prev, selectedResultNodeId: id }));
  }, []);

  // Recompute derived links any time page results or sections change
  React.useEffect(() => {
    const sections = getSections();
    const { resultsBySection, resultRootsBySection } =
      indexDraftResultsBySection(sections, page?.draftContentResult);
    setUI((prev) => ({
      ...prev,
      resultsBySection,
      resultRootsBySection,
    }));
    // Keep activeSectionId if still valid
    if (prevActiveInvalid((prev) => prev.activeSectionId, sections)) {
      setActiveSection(null);
    }
    function prevActiveInvalid(
      getId: (p: Step8UIState) => string | null,
      roots: RootContentStructure[]
    ) {
      const id = getId(ui);
      if (!id) return false;
      return !roots.some((r) => r.id === id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page?.draftContentStructure, page?.draftContentResult]);

  const value: Step8ContextValue = {
    page,
    ui,
    getSections,
    getActiveSection,
    setActiveSection,
    getSectionResultRoot,
    selectedResultNodeId: ui.selectedResultNodeId,
    setSelectedResultNodeId,
  };

  return (
    <Step8Context.Provider value={value}>{children}</Step8Context.Provider>
  );
}
