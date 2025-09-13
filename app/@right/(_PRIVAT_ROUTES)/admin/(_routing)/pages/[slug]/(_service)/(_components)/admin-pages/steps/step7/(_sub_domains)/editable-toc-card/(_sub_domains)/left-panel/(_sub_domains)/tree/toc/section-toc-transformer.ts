// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/
// (_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/
// (_sub_domains)/left-panel/(_sub_domains)/toc/section-toc-transformer.ts

// Comments are in English. UI texts are in English (US).
// Transforms a single section's children (ContentStructure[]) to TreeViewElement[]
// compatible with "@/components/extension/toc/tree-view-api".

import type { ContentStructure } from "@/app/@right/(_service)/(_types)/page-types";
import type { TreeViewElement } from "@/components/extension/toc/tree-view-api";

/** Build a readable name for a node: prefer tag, then classification. */
function nodeName(structure: ContentStructure, index: number): string {
  return structure.tag || structure.classification || `content-${index}`;
}

/** Generate stable id: prefer id, then order, then depth-index fallback. */
function nodeId(
  structure: ContentStructure,
  index: number,
  depth: number,
  parentId?: string
): string {
  if (structure.id) return structure.id;
  if (typeof structure.order === "number") {
    return parentId
      ? `${parentId}-order-${structure.order}`
      : `order-${structure.order}`;
  }
  const base = structure.classification || structure.tag || "content";
  return parentId
    ? `${parentId}-${base}-${index}`
    : `${base}-${depth}-${index}`;
}

/** Recursive transformation for a single section subtree. */
function toTree(
  structure: ContentStructure,
  index: number,
  depth: number,
  parentId?: string
): TreeViewElement {
  const id = nodeId(structure, index, depth, parentId);
  const name = nodeName(structure, index);

  const childrenRaw = structure.realContentStructure || [];
  const children = childrenRaw
    .filter((c) => !!c && !!c.id) // skip falsy and id-less nodes by policy
    .map((c, i) => toTree(c, i, depth + 1, id));

  const hasChildren = children.length > 0;

  return {
    id,
    name,
    // Mark only leaves as selectable to keep parity with sample TOC
    ...(hasChildren ? {} : { isSelectable: true }),
    ...(hasChildren ? { children } : {}),
  };
}

/** Public API: transform the children of an active section (H2). */
export function transformSectionChildrenToTOC(
  sectionChildren: ContentStructure[] | undefined
): TreeViewElement[] {
  const list = sectionChildren || [];
  return list.filter((n) => !!n && !!n.id).map((n, i) => toTree(n, i, 0));
}
