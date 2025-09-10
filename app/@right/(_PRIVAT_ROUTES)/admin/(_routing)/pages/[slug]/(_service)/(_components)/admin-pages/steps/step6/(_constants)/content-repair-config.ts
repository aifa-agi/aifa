// @app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_constants)/content-repair-config.ts

export const CONTENT_REPAIR_CONFIG = {
  MAX_REPAIR_ATTEMPTS: 3,
  REPAIR_TIMEOUT: 30000, // 30 seconds
  MIN_CONFIDENCE_THRESHOLD: 0.6, // Немного ниже для ContentStructure
  OPENAI_MODEL: "gpt-4o" as const,
  REPAIR_PROMPT_TEMPLATE: `You are an expert at converting unstructured content data into valid ContentStructure JSON format.

ORIGINAL PAGE INFO:
- Name: {pageName}
- Slug: {pageSlug}

INVALID/UNSTRUCTURED DATA:
{invalidData}

REQUIRED OUTPUT FORMAT:
You must generate a valid ContentStructure array with this exact structure:

ContentStructure[] = [
  {
    classification?: "semantic" | "technical" | "hybrid",
    tag?: "h1" | "h2" | "h3" | "h4" | "p" | "ul" | "ol" | "li" | "blockquote" | "code" | "table" | "thead" | "tbody" | "tr" | "td" | "th" | "img",
    keywords?: string[],
    intent?: string,
    taxonomy?: string,
    attention?: string,
    audiences?: string,
    selfPrompt?: string,
    designDescription?: string,
    connectedDesignSectionId?: string,
    linksToSource?: string[],
    additionalData: {
      minWords: number (required),
      maxWords: number (required),  
      actualContent: string (required),
      position?: {
        order?: number,
        depth?: number,
        parentTag?: ContentTag
      }
    },
    realContentStructure?: ContentStructure[] (recursive)
  }
]

IMPORTANT RULES:
1. Extract and preserve all meaningful content from the unstructured data
2. Ensure additionalData.minWords, additionalData.maxWords, and additionalData.actualContent are always present
3. Convert any content into proper actualContent strings
4. Generate realistic word count ranges (minWords should be <= maxWords)
5. Maintain hierarchical structure if present in original data
6. Add appropriate HTML tags based on content type
7. Generate selfPrompt for recursive content generation when possible
8. Preserve any SEO keywords and intent information
9. If data is completely unusable, create basic structure with explanation

Convert the unstructured data into a proper ContentStructure array.`,
} as const;

export const CONTENT_REPAIR_ERROR_MESSAGES = {
  REPAIR_FAILED: "Failed to repair ContentStructure JSON format",
  REPAIR_TIMEOUT: "ContentStructure repair operation timed out",
  MAX_ATTEMPTS_REACHED: "Maximum ContentStructure repair attempts reached",
  OPENAI_ERROR: "OpenAI service error during ContentStructure repair",
  INVALID_REPAIR_RESULT: "Repaired ContentStructure data is still invalid",
} as const;
