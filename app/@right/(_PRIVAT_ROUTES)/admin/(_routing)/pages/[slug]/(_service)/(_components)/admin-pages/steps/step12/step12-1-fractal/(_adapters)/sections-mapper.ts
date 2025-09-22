// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_adapters)/sections-mapper.ts

import type { SectionState } from "../(_types)/step12-types";
import type { ExtendedSection, PageUploadPayload } from "@/app/@right/(_service)/(_types)/section-types";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import type { SectionInfo } from "@/app/@right/(_service)/(_types)/page-types"; 
import type { JSONContent } from "@tiptap/react";
import { parseSectionsForStep12 } from "../(_lib)/html-section-parser";

// ✅ ДОБАВЛЯЕМ НЕДОСТАЮЩИЕ ФУНКЦИИ

/**
 * Преобразует SectionInfo[] из PageData в SectionState[] для Step12 контекста
 */
export function fromSectionInfo(sections: SectionInfo[]): SectionState[] {
  const parsed = parseSectionsForStep12(sections);
  
  const sectionStates: SectionState[] = parsed.map(p => ({
    id: p.id,
    label: p.label,
    content: p.content,
    hasData: false, // Start neutral until user edits
    isLoading: false,
  }));

  // Добавляем синтетическую секцию "all" в начало
  sectionStates.unshift({
    id: "all",
    label: "All Sections", 
    content: null, // Merged on demand via getMergedDoc
    hasData: false, // Synthetic chip shouldn't show result
    isLoading: false,
  });

  return sectionStates;
}

/**
 * Проверяет готовность всех секций (исключая "all")
 */
export function areAllSectionsReady(sections: SectionState[]): boolean {
  const realSections = sections.filter(s => s.id !== "all");
  return realSections.length > 0 && realSections.every(s => s.hasData);
}

// ✅ ОСТАЛЬНЫЕ ФУНКЦИИ (как ранее созданные)

/**
 * Преобразует SectionState[] в ExtendedSection[]
 */
export function toExtendedSections(sections: SectionState[]): ExtendedSection[] {
  const realSections = sections.filter(s => s.id !== "all" && s.hasData && s.content);
  
  const extendedSections: ExtendedSection[] = realSections.map((section, index) => ({
    id: section.id,
    bodyContent: section.content as JSONContent,
    order: index + 1,
  }));
  
  return extendedSections;
}

/**
 * Создает полный payload для загрузки страницы с разделенными метаданными
 */
export function toPageUploadPayload(
  sections: SectionState[], 
  pageData: PageData
): PageUploadPayload {
  const extendedSections = toExtendedSections(sections);
  
  const pageMetadata = {
    title: pageData.title,
    description: pageData.description,
    images: pageData.images,
    keywords: pageData.keywords,
    intent: pageData.intent,
    taxonomy: pageData.taxonomy,
    attention: pageData.attention,
    audiences: pageData.audiences,
  };

  const payload: PageUploadPayload = {
    href: pageData.href!,
    pageMetadata,
    sections: extendedSections,
  };

  return payload;
}

/**
 * Валидация payload перед отправкой
 */
export function validatePageUploadPayload(payload: PageUploadPayload): string[] {
  const errors: string[] = [];
  
  if (!payload.href) {
    errors.push("href is required");
  }
  
  if (!payload.sections || payload.sections.length === 0) {
    errors.push("At least one section is required");
  }
  
  payload.sections?.forEach((section, index) => {
    if (!section.id) {
      errors.push(`Section ${index + 1} is missing id`);
    }
    if (!section.bodyContent) {
      errors.push(`Section ${index + 1} is missing bodyContent`);
    }
  });
  
  return errors;
}


/**
 * Обновляет секцию новым контентом
 */
/**
 * Обновляет секцию новым контентом
 */
export function updateSectionWithContent(
  sections: SectionState[],
  sectionId: string, 
  sectionInfo: SectionInfo[]
): SectionState[] {
  // Находим соответствующую SectionInfo для данного sectionId
  const targetSectionInfo = sectionInfo.find(info => info.id === sectionId);
  if (!targetSectionInfo) {
    console.warn(`SectionInfo with id "${sectionId}" not found`);
    return sections;
  }

  // Парсим только нужную секцию
  const parsed = parseSectionsForStep12([targetSectionInfo]);
  if (!parsed || parsed.length === 0) {
    console.warn(`Failed to parse SectionInfo with id "${sectionId}"`);
    return sections;
  }

  // ✅ ИСПРАВЛЕНО: обращаемся к первому элементу массива
  const parsedSection = parsed[0];
  
  return sections.map(s => 
    s.id === sectionId 
      ? { 
          ...s, 
          content: parsedSection.content, // ✅ Правильный доступ к content
          hasData: true, 
          isLoading: false 
        }
      : s
  );
}


/**
 * Находит SectionInfo по ID
 */
export function findSectionInfo(sections: SectionInfo[], sectionId: string): SectionInfo | null {
  return sections.find(s => s.id === sectionId) || null;
}

/**
 * Создает пустое состояние секции
 */
export function createEmptySectionState(id: string, label: string): SectionState {
  return {
    id,
    label,
    content: null,
    hasData: false,
    isLoading: false,
  };
}

// ✅ LEGACY ТИПЫ И ФУНКЦИИ (для обратной совместимости)

export interface ExtendedSectionPayload {
  href: string;
  sections: ExtendedSection[];
}

/**
 * @deprecated Use toPageUploadPayload instead
 */
export function toExtendedSections_LEGACY(sections: SectionState[], href?: string): ExtendedSectionPayload {
  console.warn("toExtendedSections_LEGACY is deprecated. Use toPageUploadPayload instead.");
  
  const extendedSections = toExtendedSections(sections);
  
  return {
    href: href!,
    sections: extendedSections,
  };
}
