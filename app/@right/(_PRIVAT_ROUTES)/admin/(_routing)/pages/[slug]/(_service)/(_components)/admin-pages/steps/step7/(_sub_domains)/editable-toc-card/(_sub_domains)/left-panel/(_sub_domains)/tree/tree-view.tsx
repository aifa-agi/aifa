// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/left-panel/(_sub_domains)/tree/tree-view.tsx

"use client";

/**
 * Comments are in English. UI texts are in English (US).
 *
 * Update plan (step-by-step):
 * 1) Keep visual/props contract: flat rendering, TreeNode per item, PlusRow between items.
 * 2) Wire PlusRow actions:
 *    - The first PlusRow after the root (H2) inserts a new paragraph as the very first child of the section.
 *    - Each PlusRow under a node inserts a new paragraph as a sibling immediately after that node (same level).
 * 3) Delegate creation to Step 7 hook (useDraftSectionCreate) for optimistic persist and status sync.
 * 4) Avoid local state; rely on provider/hook for debounced persistence and derived recalculation.
 */

import * as React from "react";
import { TreeNode } from "./tree-node";
import type {
  ContentStructure,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";
import { useDraftSectionCreate } from "../../../../../../(_hooks)/use-draft-section-create";

export interface TreeViewProps {
  nodes: ContentStructure[] | undefined;
  root: RootContentStructure | null;
}

/** Flatten nested children to a flat array preserving computed depth starting at 1 for children of H2. */
function flatten(
  nodes: ContentStructure[] | undefined,
  depth = 1
): Array<{ node: ContentStructure; depth: number }> {
  const acc: Array<{ node: ContentStructure; depth: number }> = [];
  if (!nodes) return acc;
  for (const n of nodes) {
    if (!n?.id) continue;
    acc.push({ node: n, depth });
    if (n.realContentStructure && n.realContentStructure.length > 0) {
      acc.push(...flatten(n.realContentStructure, depth + 1));
    }
  }
  return acc;
}

/** Full-width placeholder row; triggers an insertion on click. */
function PlusRow({
  aria,
  onClick,
}: {
  aria?: string;
  onClick?: () => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      className="my-1 w-full rounded-md border border-dashed border-neutral-700 bg-neutral-900/40 px-3 py-2 text-center text-xs text-neutral-400 hover:bg-neutral-850 hover:text-neutral-200"
      aria-label={aria ?? "Add element"}
      title="Add element"
      onClick={onClick}
    >
      +
    </button>
  );
}

export function TreeView({ root, nodes }: TreeViewProps) {
  const { addFirstChildP, addSiblingAfterP } = useDraftSectionCreate();

  // Create handlers:
  // - After section (first placeholder): insert first child paragraph at index 0 of active section.
  const handleAddAfterSection = React.useCallback(async () => {
    await addFirstChildP();
  }, [addFirstChildP]);

  // - After item: insert paragraph as a sibling immediately after the given node id.
  const makeHandleAddAfterItem = React.useCallback(
    (id?: string) => async () => {
      if (!id) return;
      await addSiblingAfterP(id);
    },
    [addSiblingAfterP]
  );

  const flat = React.useMemo(() => flatten(nodes, 1), [nodes]);

  if (!root) {
    return (
      <div className="text-xs text-neutral-500">
        No active section selected.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Root H2 (Level 0) */}
      <TreeNode node={root as ContentStructure} depth={0} isRoot />

      {/* Full-width placeholder between root and first child -> insert first child paragraph */}
      <PlusRow
        aria="Add element after section"
        onClick={handleAddAfterSection}
      />

      {/* Flat children with placeholder rows between and after */}
      {flat.map(({ node, depth }, idx) => (
        <React.Fragment key={node.id}>
          <TreeNode node={node} depth={depth} />
          <PlusRow
            aria={`Add element after item ${idx + 1}`}
            onClick={makeHandleAddAfterItem(node.id)}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
