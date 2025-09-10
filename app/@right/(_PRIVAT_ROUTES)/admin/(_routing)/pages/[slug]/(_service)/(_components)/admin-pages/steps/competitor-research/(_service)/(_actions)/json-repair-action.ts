// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_actions)/json-repair-action.ts

"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { CompetitorAnalysisSchema } from "../(_libs)/competitor-analysis-schema";

export interface JsonRepairServerRequest {
  invalidJsonString: string;
  competitorUrl: string;
  competitorName: string;
}

export interface JsonRepairServerResult {
  success: boolean;
  repairedData?: any;
  error?: string;
  originalLength: number;
  repairedLength: number;
  confidence: number;
}

const OPENAI_MODEL = "gpt-4.1-2025-04-14";
const MIN_CONFIDENCE_THRESHOLD = 0.6;
const MAX_REPAIR_ATTEMPTS = 3;

/**
 * Server Action для восстановления JSON через OpenAI
 */
export async function repairJsonServerAction(
  request: JsonRepairServerRequest,
  attemptNumber: number = 1
): Promise<JsonRepairServerResult> {
  console.log("🔧 Server: Starting JSON repair with OpenAI:", {
    originalLength: request.invalidJsonString.length,
    competitorName: request.competitorName,
    attempt: attemptNumber,
  });

  try {
    // Подготовка промпта для восстановления
    const repairPrompt = `
You are an expert JSON repair tool. Fix the following invalid JSON data for competitor analysis.

Competitor Information:
- Name: ${request.competitorName}
- URL: ${request.competitorUrl}

Invalid JSON Data:
${request.invalidJsonString}

Requirements:
1. Repair and structure the data according to CompetitorAnalysis format
2. Extract meaningful competitive intelligence from the content
3. Ensure all required fields are properly filled
4. Maintain semantic meaning from original data
5. Generate realistic analysis based on the content

Return a properly structured CompetitorAnalysis JSON object.
`;

    console.log("🔧 Server: Generated repair prompt, calling OpenAI...");

    // Использование OpenAI generateObject для создания структурированных данных
    const { object } = await generateObject({
      model: openai(OPENAI_MODEL),
      schema: CompetitorAnalysisSchema,
      prompt: repairPrompt,
      temperature: 0.2, // Низкая температура для консистентности
    });

    console.log("✅ Server: OpenAI repair successful:", {
      repairedDataKeys: Object.keys(object),
      competitorStructureLength: object.competitorStructure?.length || 0,
    });

    // Расчет уверенности на основе полноты данных
    const confidence = calculateRepairConfidence(
      object,
      request.invalidJsonString
    );

    const result: JsonRepairServerResult = {
      success: true,
      repairedData: object,
      originalLength: request.invalidJsonString.length,
      repairedLength: JSON.stringify(object).length,
      confidence,
    };

    console.log("✅ Server: JSON repair completed:", {
      confidence,
      originalLength: result.originalLength,
      repairedLength: result.repairedLength,
    });

    return result;
  } catch (error) {
    console.error("❌ Server: OpenAI repair failed:", error);

    const errorMessage =
      error instanceof Error
        ? `OpenAI API Error: ${error.message}`
        : "JSON repair failed";

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
 * Расчет уверенности на основе качества данных
 */
function calculateRepairConfidence(
  repairedData: any,
  originalData: string
): number {
  let confidence = 0.5; // Базовая уверенность

  // Проверка полноты данных
  if (repairedData.competitorName && repairedData.href) confidence += 0.2;
  if (
    repairedData.competitorStructure &&
    repairedData.competitorStructure.length > 0
  )
    confidence += 0.2;
  if (repairedData.overallAnalysis) confidence += 0.1;

  // Проверка содержательности оригинальных данных
  const originalWordCount = originalData.split(/\s+/).length;
  if (originalWordCount > 100) confidence += 0.1;
  if (originalWordCount > 500) confidence += 0.1;

  return Math.min(confidence, 1.0);
}
