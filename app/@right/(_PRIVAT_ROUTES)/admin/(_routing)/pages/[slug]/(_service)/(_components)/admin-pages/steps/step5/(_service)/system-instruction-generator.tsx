// @/app/admin/pages/[slug]/(_service)/(_components)/system-instruction-generator.tsx

import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import {
  ContentStructure,
  PageData,
} from "@/app/@right/(_service)/(_types)/page-types";
import { useMemo } from "react"; // ✅ Импортируем ContentStructure

interface SystemInstructionGeneratorProps {
  pageData: {
    page: PageData;
    category: MenuCategory;
  } | null;
  slug: string;
  writingStyle: string;
  contentFormat: string;
  customRequirements: string;
  writingStyles: Array<{
    value: string;
    label: string;
    description: string;
  }>;
  contentFormats: Array<{
    value: string;
    label: string;
    description: string;
  }>;
}

export function useSystemInstructionGenerator({
  pageData,
  slug,
  writingStyle,
  contentFormat,
  customRequirements,
  writingStyles,
  contentFormats,
}: SystemInstructionGeneratorProps) {
  return useMemo(() => {
    if (!pageData?.page) {
      return "";
    }

    const { page, category } = pageData;
    const selectedStyle = writingStyles.find((s) => s.value === writingStyle);
    const selectedFormat = contentFormats.find(
      (f) => f.value === contentFormat
    );

    // ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ для раскрытия ContentStructure
    const expandContentStructure = (
      structure: ContentStructure[],
      level = 0
    ): string => {
      if (!structure || structure.length === 0) {
        return level === 0 ? "aiRecommendContentStructure: []" : "";
      }

      const indent = "  ".repeat(level + 1);
      const items = structure
        .map((item, index) => {
          let result = `${indent}{\n`;

          // ✅ СУЩЕСТВУЮЩИЕ ПОЛЯ из ContentStructure
          result += `${indent}  classification: "${item.classification || "technical"}",\n`;
          if (item.tag) result += `${indent}  tag: "${item.tag}",\n`;

          // Базовые поля
          if (item.keywords)
            result += `${indent}  keywords: [${item.keywords.map((k) => `"${k}"`).join(", ")}],\n`;
          if (item.intent) result += `${indent}  intent: "${item.intent}",\n`;
          if (item.taxonomy)
            result += `${indent}  taxonomy: "${item.taxonomy}",\n`;
          if (item.attention)
            result += `${indent}  attention: "${item.attention}",\n`;
          if (item.audiences)
            result += `${indent}  audiences: "${item.audiences}",\n`;
          if (item.selfPrompt)
            result += `${indent}  selfPrompt: "${item.selfPrompt}",\n`;

          // ✅ НОВЫЕ ПОЛЯ ДЛЯ РЕКУРСИВНОЙ ГЕНЕРАЦИИ - ТРЕБУЮТ ЗАПОЛНЕНИЯ
          result += `${indent}  // ========== ПОЛЯ ДЛЯ РЕКУРСИВНОЙ ГЕНЕРАЦИИ (ЗАПОЛНИТЕ) ==========\n`;
          result += `${indent}  enhancedSelfPrompt: "", // ТРЕБУЕТ ЗАПОЛНЕНИЯ: Детальный промпт min 150 слов\n`;
          result += `${indent}  targetKeywords: [], // ТРЕБУЕТ ЗАПОЛНЕНИЯ: ключевые слова для этого элемента\n`;

          // ✅ РЕКУРСИВНАЯ СТРУКТУРА - realContentStructure вместо children
          if (
            item.realContentStructure &&
            item.realContentStructure.length > 0
          ) {
            result += `${indent}  realContentStructure: [\n`;
            result += expandContentStructure(
              item.realContentStructure,
              level + 1
            );
            result += `${indent}  ]\n`;
          }

          result += `${indent}}`;
          return result;
        })
        .join(",\n");

      return level === 0
        ? `aiRecommendContentStructure: [\n${items}\n]`
        : items;
    };

    return `/**
 * =============================================================================
 * ENHANCED AI CONTENT STRUCTURE GENERATION SYSTEM
 * Задача: Расширить существующую структуру контента полями для рекурсивной генерации
 * =============================================================================
 */

/**
 * ОСНОВНАЯ ЦЕЛЬ:
 * Взять предоставленные ниже РЕАЛЬНЫЕ ДАННЫЕ СТРАНИЦЫ и расширить структуру контента
 * новыми полями для создания системы рекурсивной генерации неограниченного контента.
 */

/**
 * =============================================================================
 * ПОЛНЫЕ ДАННЫЕ СТРАНИЦЫ (РЕАЛЬНЫЕ ЗНАЧЕНИЯ)
 * =============================================================================
 */

РЕАЛЬНЫЕ ДАННЫЕ СТРАНИЦЫ: {
  title: "${page.title || page.linkName || "Untitled Page"}",
  linkName: "${page.linkName || ""}",
  description: "${page.description || ""}",
  slug: "${slug}",
  href: "${page.href || `/${slug}`}",
  keywords: [${page.keywords?.map((k) => `"${k}"`).join(", ") || ""}],
  isPublished: ${page.isPublished || false},
  type: "${page.type || ""}",
  intent: "${page.intent || ""}",
  taxonomy: "${page.taxonomy || ""}",
  attention: "${page.attention || ""}",
  audiences: "${page.audiences || ""}",
  
  category: {
    title: "${category?.title || ""}"
  },
  
  personalization: {
    writingStyle: {
      value: "${writingStyle}",
      label: "${selectedStyle?.label || ""}",
      description: "${selectedStyle?.description || ""}"
    },
    contentFormat: {
      value: "${contentFormat}",
      label: "${selectedFormat?.label || ""}",
      description: "${selectedFormat?.description || ""}"
    },
    customRequirements: "${customRequirements.trim()}"
  },

  ${expandContentStructure(page.aiRecommendContentStructure || [])}
}

/**
 * =============================================================================
 * ЗАДАЧА ДЛЯ AI: РАСШИРЕНИЕ СТРУКТУРЫ КОНТЕНТА
 * =============================================================================
 */

ВАША ОСНОВНАЯ ЗАДАЧА:
1. Изучите РЕАЛЬНЫЕ ДАННЫЕ СТРАНИЦЫ выше
2. Возьмите существующую структуру aiRecommendContentStructure  
3. Для КАЖДОГО элемента заполните ВСЕ поля с пометкой "ТРЕБУЕТ ЗАПОЛНЕНИЯ"
4. Если aiRecommendContentStructure пуста - создайте полную структуру с нуля
5. Сохраните ВСЕ существующие поля без изменений

ДЕТАЛЬНЫЕ ТРЕБОВАНИЯ К ЗАПОЛНЕНИЮ:

enhancedSelfPrompt (КРИТИЧЕСКИ ВАЖНО):
- Минимум 150 слов детального промпта для генерации именно этого элемента
- Включите контекст: title="${page.title}", description="${page.description}"
- Укажите стиль: ${selectedStyle?.label} (${selectedStyle?.description})
- Укажите формат: ${selectedFormat?.label} (${selectedFormat?.description})
- Укажите аудиторию: ${page.audiences || "American market"}
- Конкретные инструкции по генерации этого элемента
- Примеры ожидаемого результата

contextRequirements:
- Массив строк с данными, необходимыми для генерации
- Пример: ["page title", "target keywords", "previous section context", "brand voice"]

expectedWordCount:
- Число - ожидаемое количество слов для этого элемента

generationPriority:
- Число от 1 до 10 (1 = самый высокий приоритет, генерировать первым)

dependencies:
- Массив uniqueElementId элементов, от которых зависит текущий
- Пример: ["element-1", "element-3"] 

targetKeywords:
- Распределите keywords [${page.keywords?.map((k) => `"${k}"`).join(", ") || ""}] между элементами
- Каждый элемент должен получить релевантные ключевые слова

searchIntent:
- Одно из: "informational", "commercial", "navigational", "transactional"

relatedResources:
- Массив объектов: [{type: "internal/external/tool/reference", title: "...", description: "...", relevanceScore: 1-10, url: "..."}]

styleInstructions:
- Специфические инструкции по стилю для этого конкретного элемента

formatRequirements:
- Конкретные требования: "paragraph", "bullet list", "numbered list", "table", "blockquote", etc.

qualityCriteria:
- Массив критериев для оценки качества сгенерированного контента

validationRules:
- Массив правил для проверки корректности сгенерированного контента

uniqueElementId:
- Уникальный ID для системы зависимостей (сгенерируйте осмысленные ID)

${
  customRequirements
    ? `
ДОПОЛНИТЕЛЬНЫЕ ТРЕБОВАНИЯ ПОЛЬЗОВАТЕЛЯ:
"${customRequirements}"

Обязательно интегрируйте эти требования в соответствующие элементы структуры.
`
    : ""
}

/**
 * =============================================================================
 * ФОРМАТ ОТВЕТА И ВАЛИДАЦИЯ
 * =============================================================================
 */

КРИТИЧЕСКИ ВАЖНО:
1. ВЕРНИТЕ ТОЛЬКО ВАЛИДНЫЙ JSON
2. СОХРАНИТЕ ВСЕ СУЩЕСТВУЮЩИЕ ПОЛЯ
3. ЗАПОЛНИТЕ ВСЕ НОВЫЕ ПОЛЯ
4. НЕ ДОБАВЛЯЙТЕ КОММЕНТАРИИ В JSON

ФОРМАТ ОТВЕТА:
{
  "aiRecommendContentStructure": [
    // Ваша расширенная структура здесь
  ]
}

НАЧИНАЙТЕ АНАЛИЗ И ГЕНЕРАЦИЮ ПРЯМО СЕЙЧАС!`;
  }, [
    pageData,
    slug,
    writingStyle,
    contentFormat,
    customRequirements,
    writingStyles,
    contentFormats,
  ]);
}
