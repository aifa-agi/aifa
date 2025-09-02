// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/competitor-research/(_service)/(_constants)/json-repair-config.ts
export const JSON_REPAIR_CONFIG = {
  MAX_REPAIR_ATTEMPTS: 3,
  REPAIR_TIMEOUT: 30000, // 30 seconds
  MIN_CONFIDENCE_THRESHOLD: 0.8,
  OPENAI_MODEL: "gpt-4.1" as const,
  REPAIR_PROMPT_TEMPLATE: `You are an expert at converting unstructured competitive analysis data into valid CompetitorAnalysis JSON format.

ORIGINAL COMPETITOR INFO:
- Name: {competitorName}
- URL: {competitorUrl}

INVALID/UNSTRUCTURED DATA:
{invalidData}

REQUIRED OUTPUT FORMAT:
You must generate a valid CompetitorAnalysis object with this exact structure:
- href: string (competitor URL)
- competitorName: string
- isSuitable: boolean
- isAnalyzed: boolean (set to true)
- recommendationReason: string
- competitorStructure: array of content sections
- overallAnalysis: object with summary and insights

IMPORTANT RULES:
1. Extract and preserve all useful competitive intelligence from the unstructured data
2. Create meaningful content sections based on what you can identify
3. Generate realistic analysis scores and ratings
4. Ensure all required fields are present and properly typed
5. If data is completely unusable, create a basic structure with explanation

Convert the unstructured data into a proper CompetitorAnalysis JSON object.`,
} as const;

export const REPAIR_ERROR_MESSAGES = {
  REPAIR_FAILED: "Failed to repair JSON structure",
  REPAIR_TIMEOUT: "JSON repair operation timed out",
  MAX_ATTEMPTS_REACHED: "Maximum repair attempts reached",
  OPENAI_ERROR: "OpenAI service error during repair",
  INVALID_REPAIR_RESULT: "Repaired data is still invalid",
} as const;
