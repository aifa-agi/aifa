// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/left-panel/(_sub_domains)/tree/tree-view.tsx

"use client";

/**
 * Comments are in English. UI texts are in English (US).
 *
 * TreeView:
 * - Renders a flat vertical list visually (no horizontal offset by depth).
 * - Delegates per-node rendering to TreeNode with computed depth.
 */

import * as React from "react";
import { TreeNode } from "./tree-node";
import type {
  ContentStructure,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";

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
/** Full-width placeholder row. It does nothing yet; spans entire container width. */
function PlusRow({ aria }: { aria?: string }) {
  return (
    <button
      type="button"
      className="my-1 w-full rounded-md border border-dashed border-neutral-700 bg-neutral-900/40 px-3 py-2 text-center text-xs text-neutral-400 hover:bg-neutral-850 hover:text-neutral-200"
      aria-label={aria ?? "Add element (placeholder)"}
      title="Add element (placeholder)"
    >
      +
    </button>
  );
}

export function TreeView({ root, nodes }: TreeViewProps) {
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

      {/* Full-width placeholder between root and first child */}
      <PlusRow aria="Add element after section (placeholder)" />

      {/* Flat children with placeholder rows between and after */}
      {flat.map(({ node, depth }, idx) => (
        <React.Fragment key={node.id}>
          <TreeNode node={node} depth={depth} />
          <PlusRow aria={`Add element after item ${idx + 1} (placeholder)`} />
        </React.Fragment>
      ))}
    </div>
  );
}
