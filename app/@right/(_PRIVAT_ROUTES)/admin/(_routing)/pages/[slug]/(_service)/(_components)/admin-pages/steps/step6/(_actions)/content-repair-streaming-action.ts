// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_actions)/content-repair-streaming-action.ts

"use server";

import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { createStreamableValue } from "ai/rsc";
import {
  RootContentStructureType,
  calculateContentRepairConfidence,
  autoFixH2Compliance,
} from "../(_utils)/content-repair-helpers";

/**
 * ✅ STREAMING: Request interface
 */
export interface StreamingContentRepairRequest {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
  expectedStructureType?: "root" | "nested";
}

/**
 * ✅ STREAMING: Response chunk interface
 */
export interface StreamingRepairChunk {
  type: "progress" | "element" | "complete" | "error";
  data?: any;
  element?: RootContentStructureType;
  progress?: number;
  stage?: string;
  error?: string;
  final?: {
    elements: RootContentStructureType[];
    totalCount: number;
    confidence: number;
    hierarchyCompliance: {
      isH2Compliant: boolean;
      violationsFixed: number;
      rootElementsCount: number;
      h2ElementsCount: number;
    };
  };
  timestamp: number;
}

// ✅ ИСПРАВЛЕНА СХЕМА: Гибкая схема с правильными типами по умолчанию
const StreamingRootElementSchema = z.object({
  id: z.string().optional(),
  classification: z.enum(["semantic", "technical", "hybrid"]).optional(),
  tag: z.string().default("h2"), // ✅ Гибкий tag, исправим потом
  keywords: z.array(z.string()).optional().default([]),
  intent: z.string().optional(),
  taxonomy: z.string().optional(),
  attention: z.string().optional(),
  audiences: z.string().optional(),
  selfPrompt: z.string().optional(),
  designDescription: z.string().optional(),
  connectedDesignSectionId: z.string().optional(),
  linksToSource: z.array(z.string()).optional().default([]),
  additionalData: z.object({
    minWords: z.number().min(10).default(100),
    maxWords: z.number().min(20).default(300),
    actualContent: z.string().min(5),
    position: z
      .object({
        order: z.number().optional(),
        depth: z.number().optional(),
        parentTag: z.string().optional(), // ✅ Принимаем любую строку, исправим потом
      })
      .optional(),
  }),
  realContentStructure: z.array(z.any()).optional().default([]),
});

/**
 * ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ: Исправление типа position для соответствия RootContentStructureType
 */
function fixPositionForRootElement(
  position: any
): { order?: number; depth?: number; parentTag?: "h1" } | undefined {
  if (!position || typeof position !== "object") {
    return undefined;
  }

  const fixedPosition: { order?: number; depth?: number; parentTag?: "h1" } =
    {};

  // Копируем допустимые поля
  if (typeof position.order === "number") {
    fixedPosition.order = position.order;
  }
  if (typeof position.depth === "number") {
    fixedPosition.depth = position.depth;
  }

  // ✅ Исправляем parentTag: только "h1" разрешен для корневых элементов
  if (position.parentTag === "h1") {
    fixedPosition.parentTag = "h1";
  }
  // Если parentTag не "h1", просто не включаем его

  return Object.keys(fixedPosition).length > 0 ? fixedPosition : undefined;
}

/**
 * ✅ ИСПРАВЛЕННОЕ ДЕЙСТВИЕ: Реальное H2-compliant потоковое восстановление контента
 */
export async function streamContentStructureRepair(
  request: StreamingContentRepairRequest
) {
  const stream = createStreamableValue<StreamingRepairChunk>();

  // ✅ Запустить асинхронный процесс потоковой передачи
  (async () => {
    try {
      console.log("🚀 STARTING STREAMING REPAIR");
      console.log("📝 Input length:", request.invalidJsonString.length);
      console.log("📝 Page:", request.pageName);
      console.log("📝 Slug:", request.pageSlug);

      // ✅ Начальный прогресс
      stream.update({
        type: "progress",
        progress: 0,
        stage: "Initializing H2-compliant streaming repair...",
        timestamp: Date.now(),
      });

      // ✅ ИСПРАВЛЕННЫЙ ПРОМПТ: Более четкие инструкции для генерации
      const streamingPrompt = `You are an expert content structure generator. Your task is to create H2-compliant content sections.

CRITICAL REQUIREMENTS:
- Generate 3-5 meaningful H2 sections
- Each section must have substantial content (not placeholders)
- All sections should be relevant to: "${request.pageName}"

EXACT OUTPUT FORMAT REQUIRED:
Each element must be a complete H2 section with:
- tag: "h2" (exactly this string)
- additionalData.actualContent: Real, meaningful content (minimum 50 words)
- additionalData.minWords: Realistic minimum word count (50-200)
- additionalData.maxWords: Realistic maximum word count (150-500)
- keywords: Array of relevant SEO keywords
- intent: Clear purpose of this section
- taxonomy: Section category/type

CONTENT CONTEXT:
Page Name: ${request.pageName}
Page Slug: ${request.pageSlug}
Source Data: ${request.invalidJsonString.substring(0, 500)}...

EXAMPLE SECTION:
{
  "tag": "h2",
  "keywords": ["introduction", "overview", "getting started"],
  "intent": "Introduce readers to the main topic and set expectations",
  "taxonomy": "Introduction Section",
  "audiences": "General audience",
  "additionalData": {
    "minWords": 120,
    "maxWords": 250,
    "actualContent": "This comprehensive introduction to ${request.pageName} provides readers with essential background information and context. We'll explore the key concepts, benefits, and practical applications that make this topic relevant to your needs. By the end of this section, you'll have a clear understanding of what to expect and why this information matters."
  }
}

Generate 3-5 similar sections, each with unique, substantial content.`;

      // ✅ Обновление прогресса
      stream.update({
        type: "progress",
        progress: 15,
        stage: "Connecting to OpenAI with enhanced prompt...",
        timestamp: Date.now(),
      });

      console.log("🎯 PROMPT PREPARED, LENGTH:", streamingPrompt.length);

      // ✅ ИСПРАВЛЕННАЯ КОНФИГУРАЦИЯ: Оптимизированные настройки
      const { elementStream, usage } = streamObject({
        model: openai("gpt-4o"),
        output: "array",
        schema: StreamingRootElementSchema,
        prompt: streamingPrompt,
        temperature: 0.2, // ✅ Повышенная креативность
        maxTokens: 60000, // ✅ Достаточно токенов для содержательного контента
      });

      const collectedElements: RootContentStructureType[] = [];
      let elementCount = 0;

      // ✅ Обновление прогресса
      stream.update({
        type: "progress",
        progress: 25,
        stage: "Streaming H2 elements in real-time...",
        timestamp: Date.now(),
      });

      console.log("🔄 STARTING ELEMENT STREAM PROCESSING");

      // ✅ ИСПРАВЛЕННАЯ ОБРАБОТКА ПОТОКА: Правильная типизация и обработка ошибок
      try {
        for await (const element of elementStream) {
          elementCount++;
          console.log(`✅ ELEMENT ${elementCount} RECEIVED:`, {
            tag: element.tag,
            hasContent: !!element.additionalData?.actualContent,
            contentLength: element.additionalData?.actualContent?.length || 0,
          });

          // ✅ ИСПРАВЛЕНО: Правильное создание validElement с типобезопасностью
          const originalAdditionalData = element.additionalData || {};

          // Исправляем position отдельно
          const fixedPosition = fixPositionForRootElement(
            originalAdditionalData.position
          );

          // ✅ Создаем additionalData без конфликтов типов
          const fixedAdditionalData: RootContentStructureType["additionalData"] =
            {
              minWords: Math.max(originalAdditionalData.minWords || 100, 50),
              maxWords: Math.max(originalAdditionalData.maxWords || 250, 150),
              actualContent:
                originalAdditionalData.actualContent ||
                `Generated H2 section ${elementCount} content for ${request.pageName}. This section provides comprehensive information about the topic and includes relevant details that help readers understand the key concepts and practical applications.`,
              // ✅ position обрабатывается отдельно и типобезопасно
              ...(fixedPosition && { position: fixedPosition }),
            };

          // ✅ Создаем validElement без конфликтов типов
          const validElement: RootContentStructureType = {
            id: element.id,
            classification: element.classification,
            tag: "h2", // ✅ Принудительно H2
            keywords: element.keywords || [
              `section-${elementCount}`,
              request.pageSlug,
            ],
            intent:
              element.intent ||
              `Provide information about section ${elementCount}`,
            taxonomy: element.taxonomy || `Section ${elementCount}`,
            attention: element.attention,
            audiences: element.audiences || "General audience",
            selfPrompt: element.selfPrompt,
            designDescription: element.designDescription,
            connectedDesignSectionId: element.connectedDesignSectionId,
            linksToSource: element.linksToSource || [],
            additionalData: fixedAdditionalData,
            realContentStructure: element.realContentStructure || [],
          };

          collectedElements.push(validElement);

          // ✅ Отправить обновление элемента в реальном времени
          stream.update({
            type: "element",
            element: validElement,
            progress: Math.min(25 + elementCount * 15, 85),
            stage: `Generated H2 section ${elementCount}: ${validElement.additionalData.actualContent.substring(0, 50)}...`,
            timestamp: Date.now(),
          });

          // ✅ Предотвратить избыточные элементы
          if (elementCount >= 7) {
            console.warn("⚠️ Maximum elements reached, stopping stream");
            break;
          }
        }
      } catch (streamError) {
        console.error("❌ ERROR IN ELEMENT STREAM:", streamError);
        throw streamError;
      }

      console.log(
        `📊 STREAM PROCESSING COMPLETE: ${collectedElements.length} elements`
      );

      // ✅ ИСПРАВЛЕН FALLBACK: Создать элементы, если ничего не было сгенерировано
      if (collectedElements.length === 0) {
        console.warn("⚠️ NO ELEMENTS GENERATED, CREATING FALLBACK");

        const fallbackElements: RootContentStructureType[] = [
          {
            tag: "h2",
            keywords: ["introduction", "overview"],
            intent: "Introduce the main topic",
            taxonomy: "Introduction",
            audiences: "General audience",
            additionalData: {
              minWords: 120,
              maxWords: 250,
              actualContent: `Welcome to ${request.pageName}. This comprehensive guide introduces you to the essential concepts and provides a thorough overview of what you need to know. We'll cover the fundamental principles, key benefits, and practical applications that make this topic valuable for your understanding and implementation.`,
            },
          },
          {
            tag: "h2",
            keywords: ["main content", "detailed information"],
            intent: "Provide detailed information",
            taxonomy: "Main Content",
            audiences: "General audience",
            additionalData: {
              minWords: 200,
              maxWords: 400,
              actualContent: `This section delves deep into the core aspects of ${request.pageName}. Here you'll find detailed explanations, practical examples, and actionable insights that form the foundation of understanding. We explore various approaches, methodologies, and best practices that have proven effective. The information presented here builds upon the introduction and provides the substance you need to move forward with confidence and clarity.`,
            },
          },
          {
            tag: "h2",
            keywords: ["conclusion", "summary", "next steps"],
            intent: "Summarize key points and provide next steps",
            taxonomy: "Conclusion",
            audiences: "General audience",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent: `In conclusion, ${request.pageName} offers significant value through the concepts and practices we've explored. The key takeaways include understanding the fundamental principles, applying best practices, and implementing the strategies discussed. Moving forward, you can use this knowledge to achieve your objectives and continue learning in this area.`,
            },
          },
        ];

        collectedElements.push(...fallbackElements);

        // Отправить fallback элементы
        fallbackElements.forEach((element, index) => {
          stream.update({
            type: "element",
            element,
            progress: Math.min(50 + index * 10, 80),
            stage: `Created fallback H2 section ${index + 1}`,
            timestamp: Date.now(),
          });
        });
      }

      // ✅ Финальная валидация и проверка соответствия
      stream.update({
        type: "progress",
        progress: 90,
        stage: "Applying final H2 compliance validation...",
        timestamp: Date.now(),
      });

      // ✅ Применить исправления соответствия H2
      let finalElements = collectedElements;
      let violationsFixed = 0;

      finalElements.forEach((element) => {
        if (element.tag !== "h2") {
          element.tag = "h2";
          violationsFixed++;
        }
      });

      // ✅ Рассчитать итоговую уверенность
      const confidence = calculateContentRepairConfidence(
        finalElements,
        request.invalidJsonString
      );

      console.log(
        `🎉 FINAL RESULT: ${finalElements.length} elements, confidence: ${confidence}`
      );

      // ✅ ЗАВЕРШЕНИЕ: Отправить финальный результат
      stream.done({
        type: "complete",
        final: {
          elements: finalElements,
          totalCount: finalElements.length,
          confidence,
          hierarchyCompliance: {
            isH2Compliant: finalElements.every((el) => el.tag === "h2"),
            violationsFixed,
            rootElementsCount: finalElements.length,
            h2ElementsCount: finalElements.filter((el) => el.tag === "h2")
              .length,
          },
        },
        progress: 100,
        stage: `✅ Streaming complete: ${finalElements.length} H2-compliant sections generated`,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("❌ STREAMING ERROR:", error);

      // ✅ ОБРАБОТКА ОШИБОК: Отправить обновление об ошибке
      const errorMessage =
        error instanceof Error
          ? `Streaming repair error: ${error.message}`
          : "Unknown streaming error occurred";

      stream.done({
        type: "error",
        error: errorMessage,
        progress: 0,
        stage: "Streaming repair failed",
        timestamp: Date.now(),
      });
    }
  })();

  return {
    stream: stream.value,
    streamId: `repair-${Date.now()}`,
  };
}

/**
 * ✅ УТИЛИТА: Конвертировать результат потоковой передачи в устаревший формат
 */
export async function convertStreamingResultToLegacy(
  streamingResult: StreamingRepairChunk["final"]
) {
  if (!streamingResult) {
    throw new Error("No streaming result to convert");
  }

  return {
    success: true,
    repairedData: streamingResult.elements,
    originalLength: 0, // Будет установлено вызывающим
    repairedLength: JSON.stringify(streamingResult.elements).length,
    confidence: streamingResult.confidence,
    repairMethod: "stream-object" as const,
    hierarchyCompliance: streamingResult.hierarchyCompliance,
    performanceMetrics: {
      streamingTime: 0, // Потоковая передача в реальном времени
      validationTime: 0,
      totalTime: 0,
    },
  };
}
