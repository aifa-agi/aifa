// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_hooks)/use-draft-section-create.ts
"use client";

/**
 * Comments are in English. UI texts are in English (US).
 *
 * This hook handles creation operations in Step 7:
 * - Existing APIs:
 *   - addChild(parentId, node): generic attach to end of children for backward compatibility.
 *   - addSiblingAtRoot(): adds a new H2 section at the end of roots.
 * - New APIs (elements creation):
 *   - addFirstChildP(): insert a new paragraph as the very first child of active H2 section.
 *   - addSiblingAfterP(targetId): insert a new paragraph as a sibling immediately after target node.
 *
 * All operations:
 * - Generate cuid2 for new nodes.
 * - Default additionalData { minWords: 0, maxWords: 0, actualContent: "" }.
 * - Status policy: new nodes are 'draft'; root.status is synced via tree utils during section replacement.
 * - Persistence: optimistic setCategories + updateCategories; rollback last patch on error.
 */

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
  validateBlockHierarchy,
  replacePageInCategories,
  patchPageFieldInCategories,
  computeLaunchEligibility,
} from "../(_utils)/step7-utils";
import {
  insertFirstChildAtRootSection,
  insertSiblingAfter,
  updateSectionInRoots,
} from "../(_utils)/step7-tree-utils";
import { generateCuid } from "@/lib/utils/generateCuid";
import { UI_TEXT } from "../(_constants)/step7-conatants";

/** Factory for a new paragraph node with defaults. */
function makeParagraphNode(): ContentStructure {
  return {
    id: generateCuid(),
    tag: "p",
    status: "draft",
    additionalData: { minWords: 0, maxWords: 0, actualContent: "" },
  };
}

/**
 * Create operations for active section.
 */
export function useDraftSectionCreate() {
  const { page, getActiveSection, recomputeDerived } = useStep7Root();
  const { setCategories, updateCategories } = useNavigationMenu();

  /**
   * Legacy/generic attach (kept for compatibility):
   * - If parentId is null -> push to the end of section children.
   * - Else -> push to the end of target parent's children.
   * Note: new insert-first/insert-after methods are preferred for precise placement.
   */
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

      if (!wasReady && eligible) {
        toast.success(UI_TEXT.launchReady);
      } else if (wasReady && !eligible) {
        toast.warning(UI_TEXT.launchNowBlocked);
      }

      return true;
    },
    [getActiveSection, page, recomputeDerived, setCategories, updateCategories]
  );

  /**
   * New: insert a new paragraph as the first child of the active section.
   * - Pure placement at index 0 via tree utils (no reorder of existing nodes).
   */
  const addFirstChildP = useCallback(async () => {
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

    const newNode = makeParagraphNode();
    const nextSection = insertFirstChildAtRootSection(section, newNode);
    const patchedRoots = updateSectionInRoots(roots, nextSection);

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

    if (!wasReady && eligible) toast.success(UI_TEXT.launchReady);
    else if (wasReady && !eligible) toast.warning(UI_TEXT.launchNowBlocked);

    return true;
  }, [
    getActiveSection,
    page,
    recomputeDerived,
    setCategories,
    updateCategories,
  ]);

  /**
   * New: insert a new paragraph as a sibling immediately after the given node id.
   * - Works at the same depth level as target node.
   */
  const addSiblingAfterP = useCallback(
    async (targetId: string) => {
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

      const newNode = makeParagraphNode();
      const nextSection = insertSiblingAfter(section, targetId, newNode);
      if (nextSection === section) {
        // target not found -> noop
        toast.error("Target element was not found");
        return false;
      }

      const patchedRoots = updateSectionInRoots(roots, nextSection);

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

      if (!wasReady && eligible) toast.success(UI_TEXT.launchReady);
      else if (wasReady && !eligible) toast.warning(UI_TEXT.launchNowBlocked);

      return true;
    },
    [getActiveSection, page, recomputeDerived, setCategories, updateCategories]
  );

  /**
   * Existing API: add a new H2 section at the end of roots.
   */
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

    if (!wasReady && eligible) {
      toast.success(UI_TEXT.launchReady);
    } else if (wasReady && !eligible) {
      toast.warning(UI_TEXT.launchNowBlocked);
    }

    return true;
  }, [page, setCategories, updateCategories, recomputeDerived]);

  return {
    // legacy
    addChild,
    addSiblingAtRoot,
    // new precise insertions for paragraph nodes
    addFirstChildP,
    addSiblingAfterP,
  };
}
