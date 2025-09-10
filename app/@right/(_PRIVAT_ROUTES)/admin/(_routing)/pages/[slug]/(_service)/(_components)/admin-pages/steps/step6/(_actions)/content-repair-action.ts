// @app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_actions)/content-repair-action.ts

"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// ✅ Правильный импорт типов
export interface ContentRepairServerRequest {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
}

export interface ContentRepairServerResult {
  success: boolean;
  repairedData?: ContentStructureType[];
  error?: string;
  originalLength: number;
  repairedLength: number;
  confidence: number;
}

const OPENAI_MODEL = "gpt-4o";

// ✅ Zod схема
const TechnicalTagSchema = z.enum([
  "h2",
  "h3",
  "h4",
  "p",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
  "img",
]);

const ContentClassificationSchema = z.enum(["semantic", "technical", "hybrid"]);

type ContentStructureType = {
  classification?: "semantic" | "technical" | "hybrid";
  tag?:
    | "h2"
    | "h3"
    | "h4"
    | "p"
    | "ul"
    | "ol"
    | "li"
    | "blockquote"
    | "code"
    | "table"
    | "thead"
    | "tbody"
    | "tr"
    | "td"
    | "th"
    | "img";
  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  attention?: string;
  audiences?: string;
  selfPrompt?: string;
  designDescription?: string;
  connectedDesignSectionId?: string;
  linksToSource?: string[];
  additionalData: {
    minWords: number;
    maxWords: number;
    actualContent: string;
    position?: {
      order?: number;
      depth?: number;
      parentTag?:
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "p"
        | "ul"
        | "ol"
        | "li"
        | "blockquote"
        | "code"
        | "table"
        | "thead"
        | "tbody"
        | "tr"
        | "td"
        | "th"
        | "img";
    };
  };
  realContentStructure?: ContentStructureType[];
};

const ContentStructureSchema: z.ZodType<ContentStructureType> = z.lazy(() =>
  z.object({
    classification: ContentClassificationSchema.optional(),
    tag: TechnicalTagSchema.optional(),
    keywords: z.array(z.string()).optional(),
    intent: z.string().optional(),
    taxonomy: z.string().optional(),
    attention: z.string().optional(),
    audiences: z.string().optional(),
    selfPrompt: z.string().optional(),
    designDescription: z.string().optional(),
    connectedDesignSectionId: z.string().optional(),
    linksToSource: z.array(z.string()).optional(),
    additionalData: z.object({
      minWords: z.number(),
      maxWords: z.number(),
      actualContent: z.string(),
      position: z
        .object({
          order: z.number().optional(),
          depth: z.number().optional(),
          parentTag: TechnicalTagSchema.optional(),
        })
        .optional(),
    }),
    realContentStructure: z.array(ContentStructureSchema).optional(),
  })
);

// ✅ ИСПРАВЛЕНИЕ: Оборачиваем массив в объект
const ContentRepairResponseSchema = z.object({
  contentStructure: z.array(ContentStructureSchema),
});

/**
 * Server Action для восстановления ContentStructure JSON через OpenAI
 */
export async function repairContentStructureAction(
  request: ContentRepairServerRequest,
  attemptNumber: number = 1
): Promise<ContentRepairServerResult> {
  console.log("🔧 Server: Starting ContentStructure repair with OpenAI:", {
    originalLength: request.invalidJsonString.length,
    pageName: request.pageName,
    attempt: attemptNumber,
  });

  try {
    const repairPrompt = `
You are an expert JSON repair tool specialized in ContentStructure data format. Fix the following invalid JSON data for content structure.

Page Information:
- Name: ${request.pageName}
- Slug: ${request.pageSlug}

Invalid JSON Data:
${request.invalidJsonString}

REQUIRED OUTPUT FORMAT:
You must generate a valid response object with "contentStructure" field containing an array:

{
  "contentStructure": [
    {
      "classification": "semantic" | "technical" | "hybrid" (optional),
      "tag": "h1" | "h2" | "h3" | "h4" | "p" | "ul" | "ol" | "li" | "blockquote" | "code" | "table" | "thead" | "tbody" | "tr" | "td" | "th" | "img" (optional),
      "keywords": ["keyword1", "keyword2"] (optional),
      "intent": "string description" (optional),
      "taxonomy": "content category" (optional),
      "attention": "attention notes" (optional),
      "audiences": "target audience" (optional),
      "selfPrompt": "generation prompt" (optional),
      "designDescription": "design notes" (optional),
      "connectedDesignSectionId": "section id" (optional),
      "linksToSource": ["url1", "url2"] (optional),
      "additionalData": {
        "minWords": number (required),
        "maxWords": number (required),  
        "actualContent": "string content" (required),
        "position": {
          "order": number (optional),
          "depth": number (optional),
          "parentTag": "tag" (optional)
        } (optional)
      },
      "realContentStructure": [] (optional, recursive)
    }
  ]
}

IMPORTANT REPAIR RULES:
1. Extract and preserve all meaningful content from the invalid data
2. Ensure additionalData.minWords, additionalData.maxWords, and additionalData.actualContent are always present
3. Convert any content into proper actualContent strings
4. Generate realistic word count ranges (minWords should be <= maxWords)
5. Maintain hierarchical structure if present in original data
6. Add appropriate HTML tags based on content type
7. Generate selfPrompt for recursive content generation when possible
8. Preserve any SEO keywords and intent information
9. If completely unusable, create basic structure with explanation

CONTENT STRUCTURE GUIDELINES:
- h1: Main page titles (minWords: 3-10, maxWords: 5-15)
- h2: Section headers (minWords: 3-8, maxWords: 5-12)
- h3: Subsection headers (minWords: 2-6, maxWords: 4-10)
- p: Paragraph content (minWords: 20-100, maxWords: 50-300)
- ul/ol: List containers (minWords: 10-50, maxWords: 30-150)
- li: List items (minWords: 3-20, maxWords: 10-50)

Return a properly structured response object with contentStructure array.
`;

    console.log("🔧 Server: Generated repair prompt, calling OpenAI...");

    // ✅ ИСПРАВЛЕНИЕ: Используем схему объекта вместо массива
    const { object } = await generateObject({
      model: openai(OPENAI_MODEL),
      schema: ContentRepairResponseSchema,
      prompt: repairPrompt,
      temperature: 0.2,
    });

    // ✅ ИСПРАВЛЕНИЕ: Извлекаем массив из объекта
    const repairedArray = object.contentStructure;

    console.log("✅ Server: OpenAI repair successful:", {
      repairedArrayLength: repairedArray.length,
      firstElementKeys: repairedArray[0] ? Object.keys(repairedArray[0]) : [],
      hasAdditionalData: repairedArray.every((item) => item.additionalData),
    });

    const confidence = calculateContentRepairConfidence(
      repairedArray,
      request.invalidJsonString
    );

    const result: ContentRepairServerResult = {
      success: true,
      repairedData: repairedArray,
      originalLength: request.invalidJsonString.length,
      repairedLength: JSON.stringify(repairedArray).length,
      confidence,
    };

    console.log("✅ Server: ContentStructure repair completed:", {
      confidence,
      originalLength: result.originalLength,
      repairedLength: result.repairedLength,
      elementsCount: repairedArray.length,
    });

    return result;
  } catch (error) {
    console.error("❌ Server: OpenAI ContentStructure repair failed:", error);

    const errorMessage =
      error instanceof Error
        ? `OpenAI API Error: ${error.message}`
        : "ContentStructure JSON repair failed";

    return {
      success: false,
      error: errorMessage,
      originalLength: request.invalidJsonString.length,
      repairedLength: 0,
      confidence: 0,
    };
  }
}

/**
 * Расчет уверенности на основе качества восстановленных данных ContentStructure
 */
function calculateContentRepairConfidence(
  repairedData: ContentStructureType[],
  originalData: string
): number {
  let confidence = 0.4;

  if (Array.isArray(repairedData) && repairedData.length > 0) {
    confidence += 0.2;
  }

  const validElements = repairedData.filter((item) => {
    return (
      item.additionalData &&
      typeof item.additionalData.actualContent === "string" &&
      typeof item.additionalData.minWords === "number" &&
      typeof item.additionalData.maxWords === "number"
    );
  });

  const validElementsRatio = validElements.length / repairedData.length;
  confidence += validElementsRatio * 0.2;

  const elementsWithIntent = repairedData.filter((item) => item.intent).length;
  const elementsWithKeywords = repairedData.filter(
    (item) => item.keywords?.length && item.keywords.length > 0
  ).length;
  const elementsWithSelfPrompt = repairedData.filter(
    (item) => item.selfPrompt
  ).length;

  if (elementsWithIntent > 0) confidence += 0.05;
  if (elementsWithKeywords > 0) confidence += 0.05;
  if (elementsWithSelfPrompt > 0) confidence += 0.05;

  const logicalWordCounts = validElements.filter(
    (item) =>
      item.additionalData.minWords <= item.additionalData.maxWords &&
      item.additionalData.minWords > 0 &&
      item.additionalData.maxWords > 0
  ).length;

  if (logicalWordCounts === validElements.length && validElements.length > 0) {
    confidence += 0.1;
  }

  const originalWordCount = originalData.split(/\s+/).length;
  if (originalWordCount > 100) confidence += 0.05;
  if (originalWordCount > 500) confidence += 0.05;

  return Math.min(confidence, 1.0);
}

// ✅ УБРАНА ФУНКЦИЯ validateRepairedContentStructure - она была не нужна здесь
