// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)
/*  /(_components)/admin-pages/steps/step7/(_hooks)/use-draft-section-create.ts  */

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
  validateBlockHierarchy, // from utils
  replacePageInCategories,
  patchPageFieldInCategories,
  computeLaunchEligibility, // NEW: eligibility after patch
} from "../(_utils)/step7-utils";
import { generateCuid } from "@/lib/utils/generateCuid";
import { UI_TEXT } from "../(_constants)/step7-conatants";

/**
 * Create operations for active section.
 */
export function useDraftSectionCreate() {
  const { page, getActiveSection, recomputeDerived } = useStep7Root();
  const { setCategories, updateCategories } = useNavigationMenu();

  const addChild = useCallback(
    async (parentId: string | null, node: Omit<ContentStructure, "id">) => {
      if (!page || !page.id) {
        toast.error(UI_TEXT.pageUnavailable);
        return false;
      }
      const active = getActiveSection();
      if (!active || !active.id) {
        toast.error("Active section is not selected");
        return false;
      }

      const newNode: ContentStructure = {
        ...node,
        id: generateCuid(),
        status: "draft",
        additionalData: node.additionalData ?? {
          minWords: 0,
          maxWords: 0,
          actualContent: "",
        },
      };

      const roots = normalizedRoots(page);
      const section = roots.find((r) => r.id === active.id)!;

      const nextSection: RootContentStructure = (() => {
        if (!parentId) {
          const nextChildren = [
            ...(section.realContentStructure ?? []),
            newNode,
          ];
          const v = validateBlockHierarchy(nextChildren);
          if (!v.isValid) {
            toast.warning(UI_TEXT.h2NotAllowedInChildren);
            return section;
          }
          return { ...section, realContentStructure: nextChildren };
        }
        const attach = (n: ContentStructure): ContentStructure => {
          if (n.id === parentId) {
            const next = {
              ...n,
              realContentStructure: [
                ...(n.realContentStructure ?? []),
                newNode,
              ],
            };
            const v = validateBlockHierarchy(next.realContentStructure ?? []);
            if (!v.isValid) {
              toast.warning(UI_TEXT.h2NotAllowedInChildren);
              return n;
            }
            return next;
          }
          return {
            ...n,
            realContentStructure: n.realContentStructure?.map(attach),
          };
        };
        const nextChildren = (section.realContentStructure ?? []).map(attach);
        return { ...section, realContentStructure: nextChildren };
      })();

      const patchedRoots = roots.map((r) =>
        r.id === nextSection.id ? nextSection : r
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

      // Optimistic update across all categories (categoryTitle not required)
      setCategories((prev) => replacePageInCategories(prev, updatedPage));

      const err = await updateCategories();
      if (err) {
        // Roll back only the last optimistic patch (structure + readiness flag)
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

  const addSiblingAtRoot = useCallback(async () => {
    if (!page || !page.id) {
      toast.error(UI_TEXT.pageUnavailable);
      return false;
    }

    const roots = normalizedRoots(page);
    const newSection: RootContentStructure = {
      id: generateCuid(),
      tag: "h2",
      status: "draft",
      additionalData: { minWords: 0, maxWords: 0, actualContent: "" },
      realContentStructure: [],
    };

    const patchedRoots = [...roots, newSection];

    // Compute eligibility after adding a new root (normally becomes not eligible)
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
  }, [page, setCategories, updateCategories, recomputeDerived]);

  return { addChild, addSiblingAtRoot };
}
