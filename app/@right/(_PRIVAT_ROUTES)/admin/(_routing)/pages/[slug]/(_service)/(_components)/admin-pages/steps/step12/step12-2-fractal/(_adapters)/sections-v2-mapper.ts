// @/app/(right-routes)/admin/routing/pages/[slug]/service/components/admin-pages/steps/step12/step12-2-fractal/(_adapters)/sections-v2-mapper.ts

import React from 'react';
import type { JSONContent } from '@tiptap/react';
import { ExtendedSection } from '@/app/@right/(_service)/(_types)/section-types';
import { FileSystemSection, FileSystemSectionPayload, SectionStateV2 } from '../(_types)/step12-v2-types';
import { createEmptyDoc, generateSectionLabel, isValidTipTapContent } from '../(_utils)/step12-v2-sections-utils';

/**
 * Converts ExtendedSection from file system to SectionStateV2
 * ИСПРАВЛЕНО: Теперь правильно ищет данные в bodyContent поле
 */
export function fromExtendedSections(sections: ExtendedSection[]): SectionStateV2[] {
  if (!sections || !Array.isArray(sections)) {
    return [createAllSection()];
  }

  const sectionStates: SectionStateV2[] = sections.map((section, index) => {
    // ИСПРАВЛЕНО: Используем bodyContent вместо body
    const content = validateAndExtractContent((section as any).bodyContent);
    const label = generateSectionLabel(content, index);
    
    return {
      id: section.id,
      label,
      hasData: !!content,
      isLoading: false,
      content,
    };
  });

  // Add synthetic "all" section at the beginning
  sectionStates.unshift(createAllSection());

  return sectionStates;
}

/**
 * Converts SectionStateV2 back to FileSystemSectionPayload for saving
 * ИСПРАВЛЕНО: Сохраняем в bodyContent поле
 */
export function toFileSystemPayload(sections: SectionStateV2[], href: string): FileSystemSectionPayload{
  const realSections = sections.filter(s => s.id !== 'all' && s.hasData && s.content);
  
  const fileSystemSections: FileSystemSection[] = realSections.map(section => ({
    id: section.id,
    bodyContent: section.content!, // Сохраняем в bodyContent
    order: undefined, // Maintain original order from file system
    keywords: undefined, // Preserve existing keywords if any
  }));

  return {
    href,
    sections: fileSystemSections,
  };
}

/**
 * Updates specific section with new content from editor
 * Preserves all other section data while updating content and flags
 */
export function updateSectionV2WithContent(
  sections: SectionStateV2[], 
  sectionId: string, 
  content: JSONContent
): SectionStateV2[] {
  return sections.map(section => {
    if (section.id === sectionId) {
      const validContent = isValidTipTapContent(content) ? content : createEmptyDoc();
      const newLabel = generateSectionLabel(validContent, 0);
      
      return {
        ...section,
        content: validContent,
        hasData: true,
        isLoading: false,
        label: newLabel,
      };
    }
    return section;
  });
}

/**
 * Creates initial section state from file system section
 * ИСПРАВЛЕНО: Читает из bodyContent поля
 */
export function createSectionV2State(extendedSection: ExtendedSection, index: number): SectionStateV2 {
  // ИСПРАВЛЕНО: Используем bodyContent которое содержит TipTap JSON
  const content = validateAndExtractContent((extendedSection as any).bodyContent);
  const label = generateSectionLabel(content, index);
  
  return {
    id: extendedSection.id,
    label,
    hasData: !!content,
    isLoading: false,
    content,
  };
}

// Private Helper Functions

/**
 * Creates the synthetic "all" section for merged view
 */
function createAllSection(): SectionStateV2 {
  return {
    id: 'all',
    label: 'All Sections',
    hasData: false, // Synthetic section, content computed on demand
    isLoading: false,
    content: null,
  };
}

/**
 * ИСПРАВЛЕНО: Валидирует и извлекает TipTap JSON контент из bodyContent поля
 * Returns null if content is invalid or empty
 */
function validateAndExtractContent(bodyContent: React.ReactNode | JSON | undefined): JSONContent | null {
  if (!bodyContent) {
    console.warn('validateAndExtractContent: bodyContent is null/undefined');
    return null;
  }

  // Handle the case where bodyContent is already TipTap JSON object
  if (typeof bodyContent === 'object' && bodyContent !== null && !React.isValidElement(bodyContent)) {
    const potentialJson = bodyContent as any;
    
    if (!isValidTipTapContent(potentialJson)) {
      console.warn('validateAndExtractContent: Invalid TipTap content found in bodyContent', potentialJson);
      return null;
    }

    // Check if content has meaningful data
    if (isEmptyContent(potentialJson)) {
      console.warn('validateAndExtractContent: Empty content found in bodyContent');
      return null;
    }

    return potentialJson;
  }

  // ИСПРАВЛЕНО: Если bodyContent - строка, пытаемся парсить как JSON
  if (typeof bodyContent === 'string') {
    try {
      const parsed = JSON.parse(bodyContent);
      if (isValidTipTapContent(parsed) && !isEmptyContent(parsed)) {
        return parsed;
      }
    } catch {
      console.warn('validateAndExtractContent: Failed to parse bodyContent as JSON', bodyContent);
    }
  }

  console.warn('validateAndExtractContent: Unrecognized bodyContent format', typeof bodyContent);
  return null;
}

/**
 * Checks if TipTap content is effectively empty
 */
function isEmptyContent(content: JSONContent): boolean {
  if (!content?.content || !Array.isArray(content.content)) {
    return true;
  }

  // Check if all content nodes are empty
  return content.content.every(node => {
    if (node.type === 'paragraph' && (!node.content || node.content.length === 0)) {
      return true;
    }
    
    if (node.type === 'paragraph' && node.content?.length === 1) {
      const textNode = node.content[0];
      return textNode.type === 'text' && (!textNode.text || !textNode.text.trim());
    }
    
    return false;
  });
}
