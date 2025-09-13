// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/_utils/step7-section-factory.ts

// Comments are in English. UI texts are in English (US).
// Generates a default H2 section with a valid child structure:
// H2
//  ├─ p
//  ├─ h3
//  │   ├─ p
//  │   └─ p
//  └─ h3
//      ├─ p
//      └─ p

import { generateCuid } from "@/lib/utils/generateCuid";
import type {
  ContentStructure,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";

function makeP(): ContentStructure {
  return {
    id: generateCuid(),
    tag: "p",
    status: "draft",
    additionalData: { minWords: 0, maxWords: 0, actualContent: "" },
  };
}

function makeH3(children: ContentStructure[]): ContentStructure {
  return {
    id: generateCuid(),
    tag: "h3",
    status: "draft",
    additionalData: { minWords: 0, maxWords: 0, actualContent: "" },
    realContentStructure: children,
  };
}

export function createDefaultRootSection(): RootContentStructure {
  const p1 = makeP();
  const h3a = makeH3([makeP(), makeP()]);
  const h3b = makeH3([makeP(), makeP()]);

  return {
    id: generateCuid(),
    tag: "h2",
    status: "draft",
    additionalData: { minWords: 0, maxWords: 0, actualContent: "" },
    realContentStructure: [p1, h3a, h3b],
    // Optional fields are intentionally omitted for minimalism
  };
}
