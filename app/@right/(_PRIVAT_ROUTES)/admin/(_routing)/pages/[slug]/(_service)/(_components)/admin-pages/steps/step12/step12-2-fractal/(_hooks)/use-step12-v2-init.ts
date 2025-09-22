// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_hooks)/use-step12-v2-init.ts
/**
 * Step12 V2 Initialization Hook - File System Based Section Editor
 * Integrates with SectionProvider for loading data from file system
 * Adapted from use-step12-init.ts for V2 architecture with TipTap JSON
 */

import { useMemo } from "react";

import type { SectionStateV2 } from "../(_types)/step12-v2-types";
import { fromExtendedSections } from "../(_adapters)/sections-v2-mapper";
import { ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";

/**
 * Initialize section states from ExtendedSection[] (file system data)
 * Key difference from V1: uses ExtendedSection[] instead of SectionInfo[]
 * Data comes with TipTap JSON already parsed in section.body
 */
export function useStep12V2Init(sections?: ExtendedSection[]): SectionStateV2[] {
  return useMemo(() => {
    if (!sections || !Array.isArray(sections)) {
      // Return empty state with just the "all" section if no real sections exist
      return [{
        id: "all",
        label: "All Sections",
        content: null,
        hasData: false,
        isLoading: false,
      }];
    }

    // Convert ExtendedSection[] to SectionStateV2[] using the V2 adapter
    return fromExtendedSections(sections);
  }, [sections]);
}

/**
 * Get total count of real sections excluding synthetic "all" section
 * Adapted for ExtendedSection[] from file system
 */
export function useRealSectionsV2Count(sections?: ExtendedSection[]): number {
  return useMemo(() => {
    return sections?.length ?? 0;
  }, [sections?.length]);
}

/**
 * Check if the sections data has valid sections to work with
 * Adapted for ExtendedSection[] format from file system
 */
export function useHasValidV2Sections(sections?: ExtendedSection[]): boolean {
  return useMemo(() => {
    return Boolean(sections && Array.isArray(sections) && sections.length > 0);
  }, [sections]);
}

/**
 * Get ExtendedSection by ID for lazy loading operations
 * Used when loading individual sections from file system
 */
export function useFindV2SectionInfo(sections?: ExtendedSection[]) {
  return useMemo(() => {
    return (sectionId: string) => {
      if (!sections || sectionId === "all") return null;
      return sections.find(s => s.id === sectionId) || null;
    };
  }, [sections]);
}

/**
 * Combined hook that provides all initialization data for Step12-V2
 * Integrates with SectionProvider data structure
 */
export function useStep12V2InitData(sections?: ExtendedSection[]) {
  const sectionStates = useStep12V2Init(sections);
  const realSectionsCount = useRealSectionsV2Count(sections);
  const hasValidSections = useHasValidV2Sections(sections);
  const findSectionInfo = useFindV2SectionInfo(sections);

  return {
    sections: sectionStates,
    realSectionsCount,
    hasValidSections,
    findSectionInfo,
  };
}

/**
 * Debug information about the V2 initialization process
 * Helps with troubleshooting file system integration
 */
export function useStep12V2InitDebug(sections?: ExtendedSection[], href?: string) {
  return useMemo(() => {
    const debugInfo = {
      hasSections: Boolean(sections),
      sectionsCount: sections?.length ?? 0,
      sectionIds: sections?.map(s => s.id) ?? [],
      pageHref: href ?? "no-href",
      hasBodyContent: sections?.map(s => Boolean(s.bodyContent)) ?? [],
      bodyContentTypes: sections?.map(s => typeof s.bodyContent) ?? [],
    };

    if (process.env.NODE_ENV === "development") {
      console.log("Step12V2Init Debug info:", debugInfo);
    }

    return debugInfo;
  }, [sections, href]);
}

/**
 * Helper to validate if ExtendedSection has valid TipTap content
 * Used during initialization to filter out empty sections
 */
export function useValidV2Sections(sections?: ExtendedSection[]): ExtendedSection[] {
  return useMemo(() => {
    if (!sections) return [];
    
    return sections.filter(section => {
      // Check if section has meaningful body content
      if (!section.bodyContent) return false;
      
      // Handle JSON object case
      if (typeof section.bodyContent === 'object' && section.bodyContent !== null) {
        const content = section.bodyContent as any;
        return content.type === 'doc' && content.content && Array.isArray(content.content);
      }
      
      // Handle string case (JSON string)
      if (typeof section.bodyContent === 'string') {
        try {
          const parsed = JSON.parse(section.bodyContent);
          return parsed.type === 'doc' && parsed.content && Array.isArray(parsed.content);
        } catch {
          return false;
        }
      }
      
      return false;
    });
  }, [sections]);
}
