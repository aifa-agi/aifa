// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_hooks)/use-step12-init.ts
import { useMemo } from 'react';
import type { PageData } from '@/app/@right/(_service)/(_types)/page-types';
import type { SectionState } from '../(_types)/step12-types';
import { fromSectionInfo } from '../(_adapters)/sections-mapper';


/**
* Initialize section states from page data.
* Returns empty array if page has no sections.
*/
export function useStep12Init(page?: PageData): SectionState[] {
 return useMemo(() => {
   if (!page?.sections || !Array.isArray(page.sections)) {
     // Return empty state with just the "all" section if no real sections exist
     return [{
       id: 'all',
       label: 'All Sections',
       content: null,
       hasData: false,
       isLoading: false,
     }];
   }


   // Convert SectionInfo[] to SectionState[] using the adapter
   return fromSectionInfo(page.sections);
 }, [page?.sections]);
}


/**
* Get total count of real sections (excluding synthetic "all" section).
*/
export function useRealSectionsCount(page?: PageData): number {
 return useMemo(() => {
   return page?.sections?.length ?? 0;
 }, [page?.sections?.length]);
}


/**
* Check if the page has valid sections to work with.
*/
export function useHasValidSections(page?: PageData): boolean {
 return useMemo(() => {
   return Boolean(page?.sections && Array.isArray(page.sections) && page.sections.length > 0);
 }, [page?.sections]);
}


/**
* Get section info by ID for lazy loading.
*/
export function useFindSectionInfo(page?: PageData) {
 return useMemo(() => {
   return (sectionId: string) => {
     if (!page?.sections || sectionId === 'all') return null;
     return page.sections.find(s => s.id === sectionId) || null;
   };
 }, [page?.sections]);
}


/**
* Combined hook that provides all initialization data for Step 12.
*/
export function useStep12InitData(page?: PageData) {
 const sections = useStep12Init(page);
 const realSectionsCount = useRealSectionsCount(page);
 const hasValidSections = useHasValidSections(page);
 const findSectionInfo = useFindSectionInfo(page);


 return {
   sections,
   realSectionsCount,
   hasValidSections,
   findSectionInfo,
 };
}


/**
* Debug information about the initialization process.
*/
export function useStep12InitDebug(page?: PageData) {
 return useMemo(() => {
   const debugInfo = {
     hasPage: Boolean(page),
     hasSections: Boolean(page?.sections),
     sectionsCount: page?.sections?.length ?? 0,
     sectionIds: page?.sections?.map(s => s.id) ?? [],
     pageHref: page?.href ?? 'no-href',
     pageTitle: page?.title ?? 'no-title',
   };


   if (process.env.NODE_ENV === 'development') {
     console.log('[Step12Init] Debug info:', debugInfo);
   }


   return debugInfo;
 }, [page]);
}


