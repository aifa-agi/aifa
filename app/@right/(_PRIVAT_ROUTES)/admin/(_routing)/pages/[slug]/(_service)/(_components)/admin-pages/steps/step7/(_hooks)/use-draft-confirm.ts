//@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_hooks)/use-draft-confirm.ts
"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { useStep7Root } from "../(_contexts)/step7-root-context";
import type {
  PageData,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";

import { UI_TEXT } from "../(_constants)/step7-conatants";

import {
  normalizedRoots,
  patchPageFieldInCategories,
  replacePageInCategories,
  computeLaunchEligibility, // eligibility check across roots
} from "../(_utils)/step7-utils";

import {
  confirmEntireSection,
  confirmSubtreeById,
  updateSectionInRoots,
} from "../(_utils)/step7-tree-utils";

export function useDraftConfirm() {
  const { page, getActiveSection, recomputeDerived } = useStep7Root();
  const { setCategories, updateCategories } = useNavigationMenu();

  /**
   * Confirm all existing descendants of the active section (does not mutate root fields directly),
   * then sync root.status based on children and auto-set isReadyDraftForPerplexity if 100% ready.
   */
  const confirmSection = useCallback(async () => {
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

    const nextSection: RootContentStructure = confirmEntireSection(section);
    const patchedRoots = updateSectionInRoots(roots, nextSection);

    // Compute eligibility after patch
    const wasReady = Boolean(page.isReadyDraftForPerplexity);
    const eligible = computeLaunchEligibility(patchedRoots);

    const updatedPage: PageData = {
      ...page,
      draftContentStructure: patchedRoots,
      isReadyDraftForPerplexity: eligible ? true : false,
      updatedAt: new Date().toISOString(),
    };

    // Optimistic patch
    setCategories((prev) => replacePageInCategories(prev, updatedPage));

    // Persist and rollback on error
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

    // Post-success UI updates
    recomputeDerived();
    toast.success(UI_TEXT.confirmAllDone);

    // Inform about readiness transitions
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

  /**
   * Confirm a subtree by node id (inclusive) within the active section,
   * then sync root.status based on children and auto-set isReadyDraftForPerplexity if 100% ready.
   */
  const confirmSubtree = useCallback(
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

      const nextSection: RootContentStructure = confirmSubtreeById(
        section,
        nodeId
      );
      const patchedRoots = updateSectionInRoots(roots, nextSection);

      // Compute eligibility after patch
      const wasReady = Boolean(page.isReadyDraftForPerplexity);
      const eligible = computeLaunchEligibility(patchedRoots);

      const updatedPage: PageData = {
        ...page,
        draftContentStructure: patchedRoots,
        isReadyDraftForPerplexity: eligible ? true : false,
        updatedAt: new Date().toISOString(),
      };

      // Optimistic patch
      setCategories((prev) => replacePageInCategories(prev, updatedPage));

      // Persist and rollback on error
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

      // Post-success UI updates
      recomputeDerived();
      toast.success(UI_TEXT.saved);

      // Inform about readiness transitions
      if (!wasReady && eligible) {
        toast.success(UI_TEXT.launchReady);
      } else if (wasReady && !eligible) {
        toast.warning(UI_TEXT.launchNowBlocked);
      }

      return true;
    },
    [getActiveSection, page, recomputeDerived, setCategories, updateCategories]
  );

  return { confirmSection, confirmSubtree };
}
