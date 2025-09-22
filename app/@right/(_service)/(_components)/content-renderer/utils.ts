// @/app/@right/(_service)/(_components)/content-renderer/utils.ts

import { ExtendedSection } from "../../(_types)/section-types";
import { TipTapDocument, TipTapNode } from "./types";

// Импортируем PageImages из типов секций
import type { PageImages } from "../../(_context)/dialogs";

// Функция для извлечения чистого текста из TipTap документа
export function extractTextFromDocument(document: TipTapDocument): string {
  if (!document?.content) {
    return "";
  }

  return document.content
    .map(node => extractTextFromNode(node))
    .join(" ")
    .trim()
    .replace(/\s+/g, " "); // Заменяем множественные пробелы одним
}

// Функция для извлечения текста из узла
export function extractTextFromNode(node: TipTapNode): string {
  if (node.type === "text" && node.text) {
    return node.text;
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content
      .map(childNode => extractTextFromNode(childNode))
      .join(" ");
  }

  return "";
}

// Функция для поиска первого заголовка в документе
export function findFirstHeading(document: TipTapDocument): string | null {
  if (!document?.content) {
    return null;
  }

  for (const node of document.content) {
    if (node.type === "heading" && node.content) {
      const headingText = extractTextFromNode(node);
      if (headingText.trim()) {
        return headingText.trim();
      }
    }
  }

  return null;
}

// Функция для генерации краткого описания из первого параграфа
export function generateDescription(document: TipTapDocument, maxLength: number = 160): string {
  if (!document?.content) {
    return "";
  }

  for (const node of document.content) {
    if (node.type === "paragraph" && node.content) {
      const text = extractTextFromNode(node).trim();
      if (!text) continue;
      
      if (text.length <= maxLength) {
        return text;
      }
      
      // Обрезаем по словам, чтобы не разрывать слова
      const truncated = text.substring(0, maxLength);
      const lastSpace = truncated.lastIndexOf(" ");
      
      if (lastSpace > maxLength * 0.8) {
        return truncated.substring(0, lastSpace) + "...";
      }
      
      return truncated + "...";
    }
  }

  return "";
}

// Функция для подсчета слов в документе
export function countWords(document: TipTapDocument): number {
  const text = extractTextFromDocument(document);
  if (!text.trim()) return 0;
  
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Функция для оценки времени чтения (примерно 200 слов в минуту)
export function estimateReadingTime(document: TipTapDocument): number {
  const wordCount = countWords(document);
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Функция для извлечения всех изображений из документа
export function extractImages(document: TipTapDocument): Array<{ src: string; alt?: string; title?: string }> {
  const images: Array<{ src: string; alt?: string; title?: string }> = [];
  
  function traverseNode(node: TipTapNode) {
    if (node.type === "image" && node.attrs?.src) {
      images.push({
        src: node.attrs.src,
        alt: node.attrs.alt,
        title: node.attrs.title
      });
    }
    
    if (node.content) {
      node.content.forEach(traverseNode);
    }
  }
  
  if (document?.content) {
    document.content.forEach(traverseNode);
  }
  
  return images;
}

// Функция для генерации метаданных из первой секции
export function generateMetadataFromSection(section: ExtendedSection) {
  const { bodyContent,  keywords } = section;
  
  
  return {
    keywords: keywords || [],
    wordCount: bodyContent ? countWords(bodyContent as TipTapDocument) : 0,
    readingTime: bodyContent ? estimateReadingTime(bodyContent as TipTapDocument) : 0
  };
}

// Функция для валидации TipTap документа
export function validateTipTapDocument(document: any): document is TipTapDocument {
  return (
    document &&
    typeof document === "object" &&
    document.type === "doc" &&
    Array.isArray(document.content)
  );
}

// Дополнительная утилитарная функция для безопасного преобразования null в undefined
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

// Функция для создания PageImages из обычных изображений
export function createPageImagesFromSrc(images: Array<{ src: string; alt?: string; title?: string }>): PageImages[] {
  return images.map((img, index) => ({
    id: `image-${Date.now()}-${index}`, // Уникальный ID
    url: img.src,
    alt: img.alt || img.title || ""
  }));
}
