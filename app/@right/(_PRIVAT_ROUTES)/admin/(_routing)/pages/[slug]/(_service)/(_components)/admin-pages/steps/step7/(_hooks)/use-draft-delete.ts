//  @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_hooks)/use-draft-delete.ts
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
  deleteSubtreeById,
  updateSectionInRoots,
} from "../(_utils)/step7-tree-utils";
import {
  normalizedRoots,
  patchPageFieldInCategories,
  replacePageInCategories,
  computeLaunchEligibility,
} from "../(_utils)/step7-utils";

export function useDraftDelete() {
  const { page, getActiveSection, recomputeDerived, setActiveSection, ui } =
    useStep7Root();
  const { setCategories, updateCategories } = useNavigationMenu();

  /**
   * Delete any subtree by node id inside the active section.
   * If nodeId equals active section id, it deletes the entire section.
   */
  const deleteSubtree = useCallback(
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

      // If deleting the section itself -> drop the entire section
      if (nodeId === active.id) {
        const patchedRoots = roots.filter((r) => r.id !== active.id);

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

        if (ui.activeSectionId === active.id) {
          setActiveSection(null);
        }

        recomputeDerived();
        toast.info(UI_TEXT.activeSectionDeleted);

        // Readiness transition toasts
        if (!wasReady && eligible) {
          toast.success(UI_TEXT.launchReady);
        } else if (wasReady && !eligible) {
          toast.warning(UI_TEXT.launchNowBlocked);
        }

        return true;
      }

      // Otherwise delete a nested subtree inside the section
      const section = roots.find((r) => r.id === active.id)!;
      const nextSection: RootContentStructure = deleteSubtreeById(
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
    [
      getActiveSection,
      page,
      recomputeDerived,
      setActiveSection,
      setCategories,
      updateCategories,
      ui.activeSectionId,
    ]
  );

  /**
   * Explicit helper to delete the entire active H2 section (alias).
   */
  const deleteActiveSectionCascade = useCallback(async () => {
    const active = getActiveSection();
    if (!active?.id) {
      toast.error("Active section is not selected");
      return false;
    }
    return deleteSubtree(active.id);
  }, [deleteSubtree, getActiveSection]);

  return { deleteSubtree, deleteActiveSectionCascade };
}
