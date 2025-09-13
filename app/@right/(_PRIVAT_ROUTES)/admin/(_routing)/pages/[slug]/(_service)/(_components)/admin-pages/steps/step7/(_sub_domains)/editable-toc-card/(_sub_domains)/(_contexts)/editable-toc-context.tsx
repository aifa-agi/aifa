// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/(_contexts)/editable-toc-context.tsx
"use client";

/**
 * Comments are in English. UI texts are in English (US).
 * EditableTocContext exposes only UI-derived data for the left panel:
 * - sectionTitle: compact title for the active H2 section header.
 * - nodes: children of the active H2 section (ContentStructure[]).
 *
 * No duplication of trees: the single source of truth remains in PageData.draftContentStructure.
 */

import * as React from "react";
import type {
  ContentStructure,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";
import { useStep7Root } from "../../../../(_contexts)/step7-root-context";
type EditableTocContextValue = {
  sectionId: string | null;
  sectionTitle: string;
  rootSection: RootContentStructure | null;
  nodes: ContentStructure[] | undefined;
};

const EditableTocContext = React.createContext<EditableTocContextValue | null>(
  null
);

export function useEditableToc(): EditableTocContextValue {
  const ctx = React.useContext(EditableTocContext);
  if (!ctx)
    throw new Error("useEditableToc must be used within EditableTocProvider");
  return ctx;
}

export function EditableTocProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getActiveSection } = useStep7Root();

  const value = React.useMemo<EditableTocContextValue>(() => {
    const active: RootContentStructure | null = getActiveSection();
    const sectionId = active?.id ?? null;

    // Very compact title for the header; do not depend on optional fields here.
    const sectionTitle = active ? "Content Structure" : "No section selected";

    const nodes = active?.realContentStructure ?? [];
    return { sectionId, rootSection: active ?? null, sectionTitle, nodes };
  }, [getActiveSection]);

  return (
    <EditableTocContext.Provider value={value}>
      {children}
    </EditableTocContext.Provider>
  );
}
