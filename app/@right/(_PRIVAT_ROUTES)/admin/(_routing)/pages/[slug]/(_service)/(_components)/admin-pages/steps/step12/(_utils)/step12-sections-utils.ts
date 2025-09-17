// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_utils)/step12-sections-utils.ts
import type { JSONContent, SectionState } from "../(_types)/step12-types";

function makeSeededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function h(level: 1 | 2 | 3, text: string): JSONContent {
  return { type: "heading", attrs: { textAlign: "left", level }, content: [{ type: "text", text }] };
}
function p(text: string): JSONContent {
  return { type: "paragraph", attrs: { textAlign: "left" }, content: [{ type: "text", text }] };
}
function code(text: string): JSONContent {
  return { type: "codeBlock", attrs: { language: "txt" }, content: [{ type: "text", text }] };
}

export function buildRandomDoc(seed: number, sectionLabel: string): JSONContent {
  const rand = makeSeededRandom(seed);
  const features = ["Bold", "Italic", "Lists", "Links", "Images", "Tasks", "Typography"];
  const pick = (arr: string[]) => arr[Math.floor(rand() * arr.length)];
  const paras = Array.from({ length: 2 + Math.floor(rand() * 3) }).map((_, i) =>
    p(`Sample paragraph ${i + 1} for ${sectionLabel}. Feature: ${pick(features)}.`)
  );
  return { type: "doc", content: [h(1, `${sectionLabel}: Getting started`), ...paras, h(2, "Notes"), code(`seed=${seed}; section="${sectionLabel}"`)] };
}

export function mergeDocs(sections: SectionState[]): JSONContent {
  const merged: JSONContent = { type: "doc", content: [] as JSONContent[] };
  sections.filter((s) => s.id !== "all").forEach((s) => {
    merged.content.push(h(2, s.label));
    if (s.content && Array.isArray(s.content.content)) merged.content.push(...s.content.content);
    else merged.content.push(p("No content loaded for this section yet."));
  });
  return merged;
}
