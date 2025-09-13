// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/right-panel/(_sub_domains)/forms/(_contexts)/forms-context.tsx
"use client";

/**
 * RightFormsContext
 * - Holds temporary edits per node (tempEdits) and selection for RightPanel.
 * - Finish & Save batches changes into PageData via setCategories/updateCategories.
 * - Enforces Step 7: no 'h2' among descendants; H2 root only for linksToSource.
 * Comments: English. UI texts: English (US).
 */

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type {
  ContentStructure,
  RootContentStructure,
  PageData,
} from "@/app/@right/(_service)/(_types)/page-types";
import { useStep7Root } from "@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_contexts)/step7-root-context";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";

import {
  normalizedRoots,
  replacePageInCategories,
  patchPageFieldInCategories,
  computeLaunchEligibility,
  validateBlockHierarchy,
} from "@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_utils)/step7-utils";

import { UI_TEXT } from "@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_constants)/step7-conatants";

type CommonEditableFields = {
  description?: string;
  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  audiences?: string;
  selfPrompt?: string;
  linksToSource?: string[];
  additionalData?: {
    minWords?: number;
    maxWords?: number;
  };
};

export type TempNodePatch = CommonEditableFields;
type TempEditsMap = Record<string, TempNodePatch>;

export interface RightFormsContextValue {
  selectedNodeId: string | null;
  setSelectedNode: (nodeId: string | null) => void;

  getEffectiveNode: () => ContentStructure | RootContentStructure | null;

  // Save a field into tempEdits (local overlay); Finish will persist.
  saveTempField: <K extends keyof TempNodePatch>(
    key: K,
    value: TempNodePatch[K]
  ) => void;

  // Batch commit into PageData
  finishAndPersist: () => Promise<boolean>;

  isH2Selected: () => boolean;
}

const RightFormsContext = React.createContext<RightFormsContextValue | null>(
  null
);

export function useRightForms(): RightFormsContextValue {
  const ctx = React.useContext(RightFormsContext);
  if (!ctx)
    throw new Error("useRightForms must be used within RightFormsProvider");
  return ctx;
}

function storageKey(pageId?: string | null) {
  return pageId ? `step7:rightForms:${pageId}` : `step7:rightForms:unknown`;
}

function findNodeById(
  section: RootContentStructure,
  nodeId: string
): ContentStructure | RootContentStructure | null {
  if (section.id === nodeId) return section;
  const stack = [...(section.realContentStructure ?? [])];
  while (stack.length) {
    const n = stack.shift()!;
    if (n?.id === nodeId) return n;
    if (n?.realContentStructure?.length) stack.push(...n.realContentStructure);
  }
  return null;
}

// Apply temp patches across the active section, producing a new section
function applyPatchesToSection(
  section: RootContentStructure,
  patches: TempEditsMap
): RootContentStructure {
  const applyToNode = (node: ContentStructure): ContentStructure => {
    const patch = node.id ? patches[node.id] : undefined;

    const isRootH2 = section.id === node.id;

    const next: ContentStructure = {
      ...node,
      description: patch?.description ?? node.description,
      keywords: !isRootH2 ? (patch?.keywords ?? node.keywords) : node.keywords,
      intent: patch?.intent ?? node.intent,
      taxonomy: patch?.taxonomy ?? node.taxonomy,
      audiences: patch?.audiences ?? node.audiences,
      selfPrompt: patch?.selfPrompt ?? node.selfPrompt,
      linksToSource: isRootH2
        ? (patch?.linksToSource ?? node.linksToSource)
        : node.linksToSource,
      additionalData: {
        minWords:
          patch?.additionalData?.minWords ?? node.additionalData?.minWords ?? 0,
        maxWords:
          patch?.additionalData?.maxWords ?? node.additionalData?.maxWords ?? 0,
        // actualContent is intentionally untouched here per spec
        actualContent: node.additionalData?.actualContent ?? "",
      },
    };

    const children = node.realContentStructure?.map(applyToNode);
    return { ...next, realContentStructure: children };
  };

  const nextChildren = section.realContentStructure?.map(applyToNode);
  return { ...section, realContentStructure: nextChildren };
}

export function RightFormsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { page, getActiveSection, recomputeDerived } = useStep7Root();
  const { setCategories, updateCategories } = useNavigationMenu();

  const pageId = page?.id ?? null;
  const [selectedNodeId, setSelectedNode] = useState<string | null>(null);
  const [tempEdits, setTempEdits] = useState<TempEditsMap>({});

  const storageRef = useRef(storageKey(pageId));

  // Hydrate temp from localStorage per page
  useEffect(() => {
    storageRef.current = storageKey(pageId);
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(storageRef.current)
          : null;
      const parsed = raw ? (JSON.parse(raw) as TempEditsMap) : {};
      setTempEdits(parsed || {});
    } catch {
      setTempEdits({});
    }
    setSelectedNode(null);
  }, [pageId]);

  const persistTemp = useCallback((next: TempEditsMap) => {
    setTempEdits(next);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageRef.current, JSON.stringify(next));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const getEffectiveNode = useCallback(() => {
    const active = getActiveSection();
    if (!active || !selectedNodeId) return null;
    const base = findNodeById(active, selectedNodeId);
    if (!base) return null;

    const patch = tempEdits[selectedNodeId];
    if (!patch) return base;

    const merged: ContentStructure = {
      ...(base as ContentStructure),
      description: patch.description ?? (base as ContentStructure).description,
      keywords: patch.keywords ?? (base as ContentStructure).keywords,
      intent: patch.intent ?? (base as ContentStructure).intent,
      taxonomy: patch.taxonomy ?? (base as ContentStructure).taxonomy,
      audiences: patch.audiences ?? (base as ContentStructure).audiences,
      selfPrompt: patch.selfPrompt ?? (base as ContentStructure).selfPrompt,
      linksToSource:
        active.id === (base as any).id
          ? (patch.linksToSource ?? (base as any).linksToSource)
          : (base as any).linksToSource,
      additionalData: {
        minWords:
          patch.additionalData?.minWords ??
          (base as any).additionalData?.minWords ??
          0,
        maxWords:
          patch.additionalData?.maxWords ??
          (base as any).additionalData?.maxWords ??
          0,
        actualContent: (base as any).additionalData?.actualContent ?? "",
      },
    };
    return merged as ContentStructure | RootContentStructure;
  }, [getActiveSection, selectedNodeId, tempEdits]);

  const isH2Selected = useCallback(() => {
    const active = getActiveSection();
    if (!active || !selectedNodeId) return false;
    return active.id === selectedNodeId;
  }, [getActiveSection, selectedNodeId]);

  const saveTempField = useCallback(
    <K extends keyof TempNodePatch>(key: K, value: TempNodePatch[K]) => {
      if (!selectedNodeId) return;
      const prev = tempEdits[selectedNodeId] || {};
      const nextForNode: TempNodePatch = { ...prev, [key]: value };
      const nextMap: TempEditsMap = {
        ...tempEdits,
        [selectedNodeId]: nextForNode,
      };
      persistTemp(nextMap);
    },
    [persistTemp, selectedNodeId, tempEdits]
  );

  const finishAndPersist = useCallback(async (): Promise<boolean> => {
    const active = getActiveSection();
    if (!page || !page.id) {
      toast.error(UI_TEXT.pageUnavailable);
      return false;
    }
    if (!active || !active.id) {
      toast.error("Active section is not selected");
      return false;
    }

    const hasAny = Object.keys(tempEdits).length > 0;
    if (!hasAny) {
      toast.info("Nothing to save.");
      return true;
    }

    const roots = normalizedRoots(page);
    const section = roots.find((r) => r.id === active.id);
    if (!section) {
      toast.error(UI_TEXT.pageUnavailable);
      return false;
    }

    const patchedSection = applyPatchesToSection(section, tempEdits);

    const v = validateBlockHierarchy(patchedSection.realContentStructure ?? []);
    if (!v.isValid) {
      toast.warning(UI_TEXT.h2NotAllowedInChildren);
    }

    const patchedRoots = roots.map((r) =>
      r.id === patchedSection.id ? patchedSection : r
    );

    const wasReady = Boolean(page.isReadyDraftForPerplexity);
    const eligible = computeLaunchEligibility(patchedRoots);

    const updatedPage: PageData = {
      ...page,
      draftContentStructure: patchedRoots,
      isReadyDraftForPerplexity: eligible ? true : false,
      updatedAt: new Date().toISOString(),
    };

    setCategories((prev) => replacePageInCategories(prev, updatedPage));

    const err = await updateCategories();
    if (err) {
      setCategories((prev) =>
        patchPageFieldInCategories(prev, page.id, {
          draftContentStructure: page.draftContentStructure,
          isReadyDraftForPerplexity: page.isReadyDraftForPerplexity,
        })
      );
      toast.error(`${UI_TEXT.failedToSave}: ${err.userMessage}`);
      return false;
    }

    toast.success(UI_TEXT.saved);
    if (!wasReady && eligible) toast.success(UI_TEXT.launchReady);
    else if (wasReady && !eligible) toast.warning(UI_TEXT.launchNowBlocked);

    // Clear temp edits after successful persist
    persistTemp({});
    recomputeDerived();

    return true;
  }, [
    getActiveSection,
    page,
    setCategories,
    updateCategories,
    tempEdits,
    persistTemp,
    recomputeDerived,
  ]);

  const value = useMemo<RightFormsContextValue>(
    () => ({
      selectedNodeId,
      setSelectedNode,
      getEffectiveNode,
      saveTempField,
      finishAndPersist,
      isH2Selected,
    }),
    [
      selectedNodeId,
      getEffectiveNode,
      saveTempField,
      finishAndPersist,
      isH2Selected,
    ]
  );

  return (
    <RightFormsContext.Provider value={value}>
      {children}
    </RightFormsContext.Provider>
  );
}
