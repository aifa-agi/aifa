// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_utils)/step12-sections-utils.ts
import type { JSONContent, SectionState } from "../(_types)/step12-types";

/**
 * Understanding and plan (EN):
 * - The duplicated H2 issue comes from injecting an extra H2 before each section's content.
 * - Fix: do not inject a synthetic H2 at merge time; just concatenate each section's content.
 * - Keep a simple fallback paragraph if content is missing.
 */

function p(text: string): JSONContent {
  return { type: "paragraph", attrs: { textAlign: "left" }, content: [{ type: "text", text }] };
}

export function mergeDocs(sections: SectionState[]): JSONContent {
  const merged: JSONContent = { type: "doc", content: [] as JSONContent[] };

  sections
    .filter((s) => s.id !== "all")
    .forEach((s, idx) => {
      if (s.content && Array.isArray((s.content as any).content)) {
        merged.content!.push(...((s.content as any).content as JSONContent[]));
      } else {
        merged.content!.push(p("No content loaded for this section yet."));
      }

      // Optional: add a blank paragraph between sections (visual spacing)
      if (idx < sections.length - 1) {
        merged.content!.push(p(""));
      }
    });

  return merged;
}
