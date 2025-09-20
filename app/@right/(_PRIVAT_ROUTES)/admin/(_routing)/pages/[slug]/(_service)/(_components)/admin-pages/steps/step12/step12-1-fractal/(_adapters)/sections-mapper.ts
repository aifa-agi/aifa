// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_adapters)/sections-mapper.ts
// Adapts between domain types: SectionInfo -> SectionState -> ExtendedSection
// Handles bidirectional mapping for Step 12 data flow

/**
 * Understanding and plan (EN):
 * - Keep content eagerly parsed (good UX), but set hasData=false initially so buttons are neutral gray.
 * - Insert synthetic "all" section at the top with hasData=false.
 * - areAllSectionsReady() will become true only after user edits and we set hasData=true in updateSectionContent.
 */

import type { SectionInfo } from '@/app/@right/(_service)/(_types)/page-types';
import type { ExtendedSection } from '@/app/@right/(_service)/(_types)/section-types';
import type { SectionState } from '../(_types)/step12-types';
import { parseSectionsForStep12 } from '../(_lib)/html-section-parser';
import type { JSONContent } from '@tiptap/react';

export function fromSectionInfo(sections: SectionInfo[]): SectionState[] {
  const parsed = parseSectionsForStep12(sections || []);
  const sectionStates: SectionState[] = parsed.map(p => ({
    id: p.id,
    label: p.label,
    content: p.content,       // Eagerly available
    hasData: false,           // Start neutral (gray) until user edits
    isLoading: false,
  }));

  sectionStates.unshift({
    id: 'all',
    label: 'All Sections',
    content: null,            // Merged on demand via getMergedDoc
    hasData: false,           // Synthetic chip shouldn't show "result"
    isLoading: false,
  });

  return sectionStates;
}

export function toExtendedSections(
  sections: SectionState[],
  href?: string
): ExtendedSectionPayload {
  const realSections = sections.filter(s => s.id !== 'all' && s.hasData && s.content);
  const extendedSections: ExtendedSection[] = realSections.map(section => ({
    id: section.id,
    bodyContent: section.content as JSONContent,
    order: undefined,
    keywords: undefined,
  }));

  return {
    href: href || '',
    sections: extendedSections,
  };
}

export function updateSectionWithContent(
  sections: SectionState[],
  sectionId: string,
  sectionInfo: SectionInfo
): SectionState[] {
  const parsed = parseSectionsForStep12([sectionInfo])[0];
  if (!parsed) return sections;

  return sections.map(s =>
    s.id === sectionId
      ? {
          ...s,
          content: parsed.content,
          hasData: true,
          isLoading: false,
        }
      : s
  );
}

export function areAllSectionsReady(sections: SectionState[]): boolean {
  const realSections = sections.filter(s => s.id !== 'all');
  return realSections.length > 0 && realSections.every(s => s.hasData);
}

export function findSectionInfo(
  sections: SectionInfo[],
  sectionId: string
): SectionInfo | null {
  return sections.find(s => s.id === sectionId) || null;
}

export interface ExtendedSectionPayload {
  href: string;
  sections: ExtendedSection[];
}

export function createEmptySectionState(id: string, label: string): SectionState {
  return {
    id,
    label,
    content: null,
    hasData: false,
    isLoading: false,
  };
}
