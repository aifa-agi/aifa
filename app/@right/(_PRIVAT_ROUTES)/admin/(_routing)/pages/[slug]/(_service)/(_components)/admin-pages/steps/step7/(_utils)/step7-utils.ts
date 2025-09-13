// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_utils)/step7-utils.ts
import type {
  ContentStructure,
  PageData,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";
import type { SectionDerivedProgress } from "../(_types)/step7-types";
import type { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

/**
 * Return only valid H2 roots with ids.
 */
export function normalizedRoots(page: PageData | null): RootContentStructure[] {
  const roots = (page?.draftContentStructure ?? []) as RootContentStructure[];
  return roots.filter((r) => Boolean(r?.id) && r.tag === "h2");
}

/**
 * Compute derived metrics for a single H2 section.
 */
export function computeDerivedForSection(
  section: RootContentStructure | null
): SectionDerivedProgress {
  const walk = (
    nodes?: ContentStructure[]
  ): { total: number; confirmed: number } => {
    if (!nodes || nodes.length === 0) return { total: 0, confirmed: 0 };
    let total = 0;
    let confirmed = 0;
    for (const n of nodes) {
      if (!n?.id) continue;
      total += 1;
      if (n.status === "checked") confirmed += 1;
      const child = walk(n.realContentStructure);
      total += child.total;
      confirmed += child.confirmed;
    }
    return { total, confirmed };
  };

  if (!section) {
    return {
      total: 0,
      confirmed: 0,
      isDraft: true,
      inProcess: false,
      isConfirmed: false,
    };
  }
  const { total, confirmed } = walk(section.realContentStructure);
  const isDraft = total === 0 || confirmed === 0;
  const isConfirmed = total >= 1 && confirmed === total;
  const inProcess = !isDraft && !isConfirmed;
  return { total, confirmed, isDraft, inProcess, isConfirmed };
}

/**
 * True if at least one section exists and every root is 'checked'.
 */
export function computeLaunchEligibility(
  roots: RootContentStructure[]
): boolean {
  return roots.length > 0 && roots.every((r) => r.status === "checked");
}

/**
 * Safely derive a human-readable page title (plain string).
 */
export function getPageTitleSafe(page: PageData | null | undefined): string {
  const raw =
    page?.title ?? page?.metadata?.title ?? page?.linkName ?? "Untitled Page";
  return typeof raw === "string" ? raw : String(raw);
}

/**
 * Validate block hierarchy for active section children.
 * Rules:
 * - 'h2' is forbidden in any descendants of a root H2 section.
 * - 'h3','h4' and technical tags are acceptable (no further tag policing here).
 */
export function validateBlockHierarchy(nodes: ContentStructure[]): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let isValid = true;

  const dfs = (n: ContentStructure) => {
    if (n.tag === "h2") {
      isValid = false;
      issues.push("Child contains forbidden 'h2' tag");
      suggestions.push(
        "Replace child 'h2' with 'h3' or lower-level/technical tags"
      );
    }
    n.realContentStructure?.forEach(dfs);
  };

  nodes.forEach(dfs);
  return { isValid, issues, suggestions };
}

/**
 * Replace a PageData by id across all categories (immutably).
 */
export function replacePageInCategories(
  prev: MenuCategory[],
  updatedPage: PageData
): MenuCategory[] {
  return prev.map((cat) => ({
    ...cat,
    pages: cat.pages.map((p) => (p.id !== updatedPage.id ? p : updatedPage)),
  }));
}

/**
 * Patch specific fields of a PageData by id across all categories (immutably).
 */
export function patchPageFieldInCategories(
  prev: MenuCategory[],
  pageId: string,
  fieldPatch: Partial<PageData>
): MenuCategory[] {
  return prev.map((cat) => ({
    ...cat,
    pages: cat.pages.map((p) =>
      p.id !== pageId ? p : { ...p, ...fieldPatch }
    ),
  }));
}
