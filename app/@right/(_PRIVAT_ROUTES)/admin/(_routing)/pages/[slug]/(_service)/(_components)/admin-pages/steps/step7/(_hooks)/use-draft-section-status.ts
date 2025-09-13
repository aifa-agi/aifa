// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_hooks)/use-draft-section-status.ts
"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { useStep7Root } from "../(_contexts)/step7-root-context";
import type {
  ContentStructure,
  PageData,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";
import {
  normalizedRoots,
  replacePageInCategories,
  patchPageFieldInCategories,
  computeLaunchEligibility, // NEW: eligibility check after patch
} from "../(_utils)/step7-utils";
import { UI_TEXT } from "../(_constants)/step7-conatants";

/**
 * Node status operations: confirmNode (draft -> checked) and confirmAll (bulk).
 */
export function useDraftSectionStatus() {
  const { page, getActiveSection, recomputeDerived } = useStep7Root();
  const { setCategories, updateCategories } = useNavigationMenu();

  const confirmNode = useCallback(
    async (nodeId: string) => {
      if (!page || !page.id) {
        toast.error(UI_TEXT.pageUnavailable);
        return false;
      }
      const active = getActiveSection();
      if (!active || !active.id) {
        toast.error("Active section is not selected");
        return false;
      }

      const roots = normalizedRoots(page);
      const section = roots.find((r) => r.id === active.id)!;

      const dfsUpdate = (
        node: ContentStructure,
        predicate: (n: ContentStructure) => boolean,
        updater: (n: ContentStructure) => ContentStructure
      ): ContentStructure => {
        const match = predicate(node);
        const updatedSelf = match ? updater(node) : node;
        const children = updatedSelf.realContentStructure?.map((c) =>
          dfsUpdate(c, predicate, updater)
        );
        return { ...updatedSelf, realContentStructure: children };
      };

      const nextChildren = (section.realContentStructure ?? []).map((n) =>
        dfsUpdate(
          n,
          (x) => x.id === nodeId,
          (x) => ({ ...x, status: "checked" as const })
        )
      );

      const patchedSection: RootContentStructure = {
        ...section,
        realContentStructure: nextChildren,
      };
      const patchedRoots = roots.map((r) =>
        r.id === patchedSection.id ? patchedSection : r
      );

      // Compute eligibility after patch
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

      recomputeDerived();
      toast.success(UI_TEXT.saved);

      // Readiness transition toasts
      if (!wasReady && eligible) {
        toast.success(UI_TEXT.launchReady);
      } else if (wasReady && !eligible) {
        toast.warning(UI_TEXT.launchNowBlocked);
      }

      return true;
    },
    [getActiveSection, page, recomputeDerived, setCategories, updateCategories]
  );

  const confirmAll = useCallback(async () => {
    if (!page || !page.id) {
      toast.error(UI_TEXT.pageUnavailable);
      return false;
    }
    const active = getActiveSection();
    if (!active || !active.id) {
      toast.error("Active section is not selected");
      return false;
    }

    const roots = normalizedRoots(page);
    const section = roots.find((r) => r.id === active.id)!;

    const dfsConfirm = (n: ContentStructure): ContentStructure => ({
      ...n,
      status: "checked",
      realContentStructure: n.realContentStructure?.map(dfsConfirm),
    });

    const nextChildren = (section.realContentStructure ?? []).map(dfsConfirm);
    const patchedSection: RootContentStructure = {
      ...section,
      realContentStructure: nextChildren,
    };
    const patchedRoots = roots.map((r) =>
      r.id === patchedSection.id ? patchedSection : r
    );

    // Compute eligibility after patch
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

    recomputeDerived();
    toast.success(UI_TEXT.confirmAllDone);

    // Readiness transition toasts
    if (!wasReady && eligible) {
      toast.success(UI_TEXT.launchReady);
    } else if (wasReady && !eligible) {
      toast.warning(UI_TEXT.launchNowBlocked);
    }

    return true;
  }, [
    getActiveSection,
    page,
    recomputeDerived,
    setCategories,
    updateCategories,
  ]);

  return { confirmNode, confirmAll };
}
