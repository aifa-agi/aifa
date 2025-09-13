// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/_utils/step7-tree-utils.ts

/**
 * Comments are in English. UI texts must be provided by callers (hooks/components).
 *
 * Step 7 tree utilities:
 * - Pure, immutable helpers for working with ContentStructure/RootContentStructure trees.
 * - No side effects, no toasts, no category/page persistence here.
 *
 * Design notes (from step 7 spec):
 * - Root is H2; descendants cannot contain H2 (validation happens elsewhere).
 * - Status policy: root.status reflects children:
 *   if all descendants are 'checked' and total >= 1 -> root.status='checked', else 'draft'.
 * - Nodes without id must be ignored (not created by policy, but we guard anyway).
 */

import type {
  ContentStructure,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";

/* =========================
   Generic tree traversal
   ========================= */

/** Safe iteration over nodes; skips falsy and nodes without id when needed. */
export function walkNodes(
  nodes: ContentStructure[] | undefined,
  visit: (n: ContentStructure) => void
): void {
  if (!nodes || nodes.length === 0) return;
  for (const n of nodes) {
    if (!n) continue;
    visit(n);
    walkNodes(n.realContentStructure, visit);
  }
}

/** Count total and confirmed nodes in a subtree (skips nodes without id). */
export function countTotals(nodes: ContentStructure[] | undefined): {
  total: number;
  confirmed: number;
} {
  let total = 0;
  let confirmed = 0;
  walkNodes(nodes, (n) => {
    if (!n.id) return;
    total += 1;
    if (n.status === "checked") confirmed += 1;
  });
  return { total, confirmed };
}

/* =========================
   Collect subtree ids
   ========================= */

/**
 * Collect a flat list of ids for the subtree starting at targetId (including the target itself).
 * If targetId is null or equals section.id, it returns all descendant ids inside the section.
 */
export function collectSubtreeIds(
  section: RootContentStructure,
  targetId: string | null
): string[] {
  const ids: string[] = [];
  const isAllDescendants = !targetId || targetId === section.id;

  const collect = (nodes?: ContentStructure[]) => {
    if (!nodes) return;
    for (const n of nodes) {
      if (n?.id) ids.push(n.id);
      collect(n.realContentStructure);
    }
  };

  if (isAllDescendants) {
    collect(section.realContentStructure);
    return ids;
  }

  // Find the subtree by id and collect from there
  const dfsFind = (nodes?: ContentStructure[]): ContentStructure | null => {
    if (!nodes) return null;
    for (const n of nodes) {
      if (n?.id === targetId) return n;
      const found = dfsFind(n.realContentStructure);
      if (found) return found;
    }
    return null;
  };

  const start = dfsFind(section.realContentStructure);
  if (start) {
    if (start.id) ids.push(start.id);
    collect(start.realContentStructure);
  }
  return ids;
}

/* =========================
   Immutable mapping helpers
   ========================= */

/** Map transform over a subtree; returns new array preserving structure. */
function mapSubtree(
  nodes: ContentStructure[] | undefined,
  transform: (n: ContentStructure) => ContentStructure
): ContentStructure[] | undefined {
  if (!nodes) return nodes;
  return nodes.map((n) => {
    const self = transform(n);
    return {
      ...self,
      realContentStructure: mapSubtree(self.realContentStructure, transform),
    };
  });
}

/** Apply transform only to subtree whose root matches targetId (inclusive). */
function mapOnlySubtreeById(
  nodes: ContentStructure[] | undefined,
  targetId: string,
  transform: (n: ContentStructure) => ContentStructure
): ContentStructure[] | undefined {
  if (!nodes) return nodes;
  return nodes.map((n) => {
    if (n.id === targetId) {
      // Transform this node and all its descendants
      const transformed = transform(n);
      return {
        ...transformed,
        realContentStructure: mapSubtree(
          transformed.realContentStructure,
          transform
        ),
      };
    }
    return {
      ...n,
      realContentStructure: mapOnlySubtreeById(
        n.realContentStructure,
        targetId,
        transform
      ),
    };
  });
}

/** Delete a subtree by id (removes the matching node and all its descendants). */
function deleteSubtree(
  nodes: ContentStructure[] | undefined,
  targetId: string
): ContentStructure[] | undefined {
  if (!nodes) return nodes;
  return nodes
    .filter((n) => n.id !== targetId)
    .map((n) => ({
      ...n,
      realContentStructure: deleteSubtree(n.realContentStructure, targetId),
    }));
}

/* =========================
   Root status sync
   ========================= */

/**
 * Sync root.status according to policy:
 * - if all descendants confirmed and total >= 1 -> 'checked'
 * - else 'draft'
 */
export function syncSectionRootStatus(
  section: RootContentStructure
): RootContentStructure {
  const { total, confirmed } = countTotals(section.realContentStructure);
  const allConfirmed = total >= 1 && confirmed === total;
  const nextStatus = allConfirmed ? ("checked" as const) : ("draft" as const);
  if (section.status === nextStatus) return section;
  return { ...section, status: nextStatus };
}

/* =========================
   Public operations (existing)
   ========================= */

/** Confirm every existing node inside the section (descendants only). */
export function confirmEntireSection(
  section: RootContentStructure
): RootContentStructure {
  const nextChildren = mapSubtree(section.realContentStructure, (n) => ({
    ...n,
    status: "checked" as const,
  }));
  return syncSectionRootStatus({
    ...section,
    realContentStructure: nextChildren,
  });
}

/** Confirm a subtree by node id (includes the node itself and all its descendants). */
export function confirmSubtreeById(
  section: RootContentStructure,
  nodeId: string
): RootContentStructure {
  const nextChildren = mapOnlySubtreeById(
    section.realContentStructure,
    nodeId,
    (n) => ({ ...n, status: "checked" as const })
  );
  return syncSectionRootStatus({
    ...section,
    realContentStructure: nextChildren,
  });
}

/** Delete a subtree by node id (removes the node and its descendants). */
export function deleteSubtreeById(
  section: RootContentStructure,
  nodeId: string
): RootContentStructure {
  const nextChildren = deleteSubtree(section.realContentStructure, nodeId);
  return syncSectionRootStatus({
    ...section,
    realContentStructure: nextChildren,
  });
}

/** Replace section in roots by id; returns new roots array. */
export function updateSectionInRoots(
  roots: RootContentStructure[],
  updated: RootContentStructure
): RootContentStructure[] {
  return roots.map((r) => (r.id === updated.id ? updated : r));
}

/* =========================
   New immutable helpers (insertions)
   ========================= */

/** Insert a child at the beginning of a specific parent's children (internal). */
function insertChildAtStart(
  parent: ContentStructure,
  child: ContentStructure
): ContentStructure {
  const nextChildren = [child, ...(parent.realContentStructure ?? [])];
  return { ...parent, realContentStructure: nextChildren };
}

/**
 * Splice a sibling after targetId inside nodes.
 * Returns { changed, next } where `next` is the new children array when changed.
 */
function spliceSiblingAfter(
  nodes: ContentStructure[] | undefined,
  targetId: string,
  toInsert: ContentStructure
): { changed: boolean; next?: ContentStructure[] } {
  if (!nodes) return { changed: false, next: nodes };
  const next = nodes.map((n) => ({ ...n })); // shallow copy
  for (let i = 0; i < next.length; i++) {
    const n = next[i];
    if (n.id === targetId) {
      next.splice(i + 1, 0, toInsert);
      return { changed: true, next };
    }
    // Try inside
    const inner = spliceSiblingAfter(
      n.realContentStructure,
      targetId,
      toInsert
    );
    if (inner.changed) {
      n.realContentStructure = inner.next;
      return { changed: true, next };
    }
  }
  return { changed: false, next };
}

/* =========================
   Public insert operations for Step 7
   ========================= */

/**
 * Insert a new first child inside the H2 section (before any existing child).
 * Pure and immutable. Caller is responsible for defaults/validation.
 */
export function insertFirstChildAtRootSection(
  section: RootContentStructure,
  newNode: ContentStructure
): RootContentStructure {
  const nextSection: RootContentStructure = {
    ...section,
    realContentStructure: [newNode, ...(section.realContentStructure ?? [])],
  };
  return syncSectionRootStatus(nextSection);
}

/**
 * Insert a sibling immediately after the target node id (same level).
 * Pure and immutable. Caller is responsible for defaults/validation.
 */
export function insertSiblingAfter(
  section: RootContentStructure,
  targetId: string,
  newNode: ContentStructure
): RootContentStructure {
  const { changed, next } = spliceSiblingAfter(
    section.realContentStructure,
    targetId,
    newNode
  );
  const nextSection: RootContentStructure = changed
    ? { ...section, realContentStructure: next }
    : section;
  return syncSectionRootStatus(nextSection);
}
