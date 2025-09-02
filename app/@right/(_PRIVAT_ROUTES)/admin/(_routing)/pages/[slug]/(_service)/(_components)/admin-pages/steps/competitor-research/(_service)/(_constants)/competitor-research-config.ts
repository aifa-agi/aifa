// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/competitor-research/(_service)/(_constants)/competitor-research-config.ts
"use client";

import {
  Globe,
  Search,
  Copy,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { CompetitorAnalysisSchema } from "../(_libs)/competitor-analysis-schema";
export const LOCAL_SAVE_MESSAGES = {
  LOCAL_SAVE_SUCCESS: "Исследование конкурентов сохранено локально",
  LOCAL_SAVE_DESCRIPTION: "Готово для выгрузки на сервер",
  SERVER_UPLOAD_SUCCESS: "Данные успешно выгружены на сервер",
  SERVER_UPLOAD_PROGRESS: "Выгружаем данные на сервер...",
  SERVER_UPLOAD_FAILED: "Ошибка выгрузки на сервер",
  NO_LOCAL_DATA: "Нет данных для выгрузки",
  LOCAL_CHANGES_AVAILABLE: "Есть локальные изменения для выгрузки",
} as const;

/**
 * НОВЫЕ CSS классы для кнопок сохранения
 */
export const SAVE_BUTTON_CLASSES = {
  // Зеленая кнопка локального сохранения
  local_save:
    "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300",
  local_save_icon: "text-green-600",

  // Оранжевая кнопка серверной выгрузки
  server_upload:
    "bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-300",
  server_upload_icon: "text-orange-600",

  // Состояния
  pending_upload: "border-orange-200 bg-orange-50 text-orange-800",
  has_changes: "border-blue-200 bg-blue-50 text-blue-800",
} as const;

/**
 * НОВЫЕ иконки для операций сохранения
 */
export const SAVE_OPERATION_ICONS = {
  LOCAL_SAVE: "Save",
  SERVER_UPLOAD: "Upload",
  PENDING: "Clock",
  SUCCESS: "CheckCircle2",
  ERROR: "AlertCircle",
} as const;
/**
 * Configuration for competitor research workflow states
 * Defines icons, labels, and descriptions for each stage
 */
export const WORKFLOW_STATES_CONFIG = {
  url_added: {
    state: "url_added",
    label: "URL Added",
    description: "Competitor URL has been added to research list",
    icon: Globe,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  instruction_generated: {
    state: "instruction_generated",
    label: "Instruction Ready",
    description: "System instruction has been generated and ready to copy",
    icon: Search,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  instruction_copied: {
    state: "instruction_copied",
    label: "Instruction Copied",
    description: "System instruction copied, awaiting AI analysis",
    icon: Copy,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  analysis_provided: {
    state: "analysis_provided",
    label: "Analysis Added",
    description: "AI analysis response has been provided",
    icon: MessageSquare,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  completed: {
    state: "completed",
    label: "Completed",
    description: "Competitor research is fully completed",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
} as const;

/**
 * Enhanced system instruction template for Perplexity Pro
 * Updated to generate CompetitorAnalysis-compatible JSON structure
 */
export const SYSTEM_INSTRUCTION_TEMPLATE = `You are an expert competitive analysis researcher. Please analyze the website: {competitorUrl}

Company Information:
- Competitor Name: {competitorName}
- URL: {competitorUrl}

**IMPORTANT**: Your response must be a valid JSON object that matches the CompetitorAnalysis interface structure. Some fields are optional and can be omitted if data is unavailable.

Required Analysis Areas:

1. **Basic Information Assessment**
   - Determine if this competitor is suitable for analysis (isSuitable: boolean)
   - Provide a clear recommendation reason
   - Company/project primary purpose and goals

2. **Content Structure Analysis**
   - Main website sections and blocks
   - Content hierarchy and organization
   - Semantic content types (hero, features, pricing, testimonials, etc.)
   - Technical implementation details

3. **Competitive Intelligence**
   - Unique value propositions
   - Strengths and competitive advantages
   - Weaknesses and opportunities
   - Market positioning

4. **SEO and Technical Analysis**
   - Meta tags, headers, and SEO optimization
   - Site structure and navigation
   - Performance and technical quality

5. **UX and Design Evaluation**
   - User experience quality
   - Visual design and branding
   - Conversion optimization elements

**Response Format Requirements:**

Return ONLY a valid JSON object with this exact structure:

\`\`\`json
{
  "href": "{competitorUrl}",
  "competitorName": "{competitorName}",
  "isSuitable": false,
  "isAnalyzed": true,
  "recommendationReason": "Don't do research, in response return empty'' ",
  "competitorStructure": [
    {
      "id": "unique-section-id",
      "contentStructure": {
        "classification": "semantic"|"technical"|"hybrid",
        "tag": "semantic-block-type-or-technical-tag",
        "semanticMetadata": {
          "purpose": "Brief description of section purpose",
          "userIntent": "informational"|"navigational"|"transactional"|"commercial",
          "interactionType": "passive"|"interactive"|"form"|"media",
          "visualPriority": "primary"|"secondary"|"tertiary"
        },
        "keywords": ["relevant", "keywords", "list"],
        "intent": "User intent description",
        "taxonomy": "Content categorization",
        "attention": "What draws user attention",
        "audiences": "Target audience description",
        "additionalData": {
          "actualContent": "Brief content summary",
          "position": {
            "order": 1,
            "depth": 0
          },
          "styling": {
            "hasSpecialFormatting": true|false,
            "visualWeight": "light"|"medium"|"bold"
          }
        }
      },
      "researchResult": {
        "analysisText": "Detailed analysis of this content section",
        "elementAnalysis": {
          "qualityScore": 0-100,
          "effectivenessRating": "poor"|"average"|"good"|"excellent",
          "intentAlignment": 0-100
        },
        "recommendations": ["improvement", "suggestions", "list"],
        "strengths": ["identified", "strengths"],
        "weaknesses": ["identified", "weaknesses"],
        "opportunities": ["potential", "improvements"]
      }
    }
  ],
  "overallAnalysis": {
    "overallScore": 0-100,
    "summary": "Comprehensive summary of the competitive analysis",
    "keyFindings": ["key", "insights", "discovered"],
    "actionableInsights": ["specific", "actionable", "recommendations"],
    "ourAdvantages": ["potential", "competitive", "advantages"],
    "semanticPatterns": {
      "commonBlocks": ["hero", "features", "pricing"],
      "unusualImplementations": ["unique", "approaches", "found"],
      "missingOpportunities": ["gaps", "we", "can", "exploit"]
    }
  }
}
\`\`\`

**Important Notes:**
- All fields marked with "?" in the interface are optional
- If you cannot determine a value for an optional field, omit it from the JSON
- Focus on providing actionable competitive intelligence
- Be objective and analytical in your assessment
- Ensure all string values are properly escaped for JSON
- The competitorStructure array should contain 3-7 main sections maximum

Analyze the website now and return only the JSON response.`;

/**
 * Validation rules for competitor URLs
 * Defines constraints and patterns for URL validation
 */
export const URL_VALIDATION_RULES = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 500,
  REQUIRED_PROTOCOL: true,
  ALLOWED_PROTOCOLS: ["http", "https"],
  // Regex for URL validation
  URL_PATTERN:
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  BLOCKED_DOMAINS: ["localhost", "127.0.0.1", "0.0.0.0"],
  TRIM_WHITESPACE: true,
} as const;

/**
 * Enhanced validation rules for AI response input
 * Updated to validate CompetitorAnalysis JSON structure
 */
export const AI_RESPONSE_VALIDATION_RULES = {
  MIN_LENGTH: 200, // Increased minimum for comprehensive analysis
  MAX_LENGTH: 50000, // Increased maximum for detailed competitive analysis
  REQUIRED_FIELD: true,
  TRIM_WHITESPACE: true,
  // JSON validation for CompetitorAnalysis structure
  EXPECT_JSON_FORMAT: true,
  JSON_REQUIRED_FIELDS: [
    "href",
    "competitorName",
    "isSuitable",
    "isAnalyzed",
    "recommendationReason",
    "competitorStructure",
  ],
  // Optional fields that can be missing
  JSON_OPTIONAL_FIELDS: [
    "overallAnalysis",
    "overallAnalysis.overallScore",
    "overallAnalysis.summary",
    "overallAnalysis.keyFindings",
    "overallAnalysis.actionableInsights",
    "overallAnalysis.ourAdvantages",
    "overallAnalysis.semanticPatterns",
  ],
} as const;

/**
 * UI behavior constants
 * Timing, animations, and UX configurations
 */
export const COMPETITOR_UI_CONFIG = {
  // Timing configurations
  AUTO_SAVE_DELAY: 2000, // ms
  DEBOUNCE_DELAY: 500, // ms for URL input
  COPY_FEEDBACK_DURATION: 2000, // ms
  SUCCESS_TOAST_DURATION: 3000, // ms
  ERROR_TOAST_DURATION: 5000, // ms

  // Animation durations
  TRANSITION_DURATION: 200, // ms
  EXPAND_ANIMATION: 300, // ms
  FADE_DURATION: 150, // ms

  // List configurations
  MAX_COMPETITORS: 10,
  MIN_COMPETITORS_FOR_SAVE: 1,

  // Text areas
  TEXTAREA_MIN_ROWS: 6, // Increased for longer JSON responses
  TEXTAREA_MAX_ROWS: 20, // Increased for comprehensive analysis

  // Instruction display
  INSTRUCTION_PREVIEW_LINES: 5, // Increased for longer instructions
} as const;

/**
 * Operation timeouts for async operations
 * Prevents hanging operations and improves UX
 */
export const OPERATION_TIMEOUTS = {
  URL_VALIDATION: 2000, // 2 seconds
  INSTRUCTION_GENERATION: 1000, // 1 second
  SAVE_COMPETITORS: 15000, // 15 seconds
  COPY_TO_CLIPBOARD: 1000, // 1 second
  AI_RESPONSE_VALIDATION: 5000, // Increased for JSON parsing
  JSON_PARSING: 3000, // New timeout for JSON validation
} as const;

/**
 * CSS classes for different component states
 * Provides consistent styling across the component
 */
export const COMPETITOR_STATES_CLASSES = {
  // Container states
  idle: "",
  loading: "opacity-75 pointer-events-none",
  saving: "opacity-50 cursor-not-allowed",
  error: "ring-2 ring-destructive ring-offset-2",
  success: "ring-2 ring-green-500 ring-offset-2",

  // Individual competitor item states
  competitor_idle: "border-border hover:border-primary/50 transition-colors",
  competitor_active: "border-primary ring-1 ring-primary/20",
  competitor_completed: "border-green-500 bg-green-50/50",
  competitor_error: "border-destructive bg-destructive/5",

  // Button states
  button_primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  button_secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  button_destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  button_success: "bg-green-600 text-white hover:bg-green-700",

  // Input states
  input_valid: "border-green-500 focus:ring-green-500",
  input_invalid: "border-destructive focus:ring-destructive",
  input_pending: "border-orange-400 focus:ring-orange-400",
} as const;

/**
 * Keyboard shortcuts for competitor research workflow
 * Enhances productivity with keyboard navigation
 */
export const KEYBOARD_SHORTCUTS = {
  // Global shortcuts
  SAVE_ALL: ["ctrl+s", "cmd+s"],
  ADD_COMPETITOR: ["ctrl+n", "cmd+n"],

  // Item-specific shortcuts
  COPY_INSTRUCTION: ["ctrl+c", "cmd+c"],
  DELETE_COMPETITOR: ["Delete", "Backspace"],
  SUBMIT_RESPONSE: ["ctrl+enter", "cmd+enter"],

  // Navigation
  NEXT_ITEM: ["Tab"],
  PREV_ITEM: ["shift+Tab"],
  ESCAPE: ["Escape"],
} as const;

/**
 * Enhanced error messages for various validation scenarios
 * Updated with JSON validation specific errors
 */
export const ERROR_MESSAGES = {
  // URL validation errors
  URL_REQUIRED: "URL address is required",
  URL_INVALID_FORMAT:
    "Enter a valid URL address (starting with http:// or https://)",
  URL_TOO_SHORT: `URL must contain at least ${URL_VALIDATION_RULES.MIN_LENGTH} characters`,
  URL_TOO_LONG: `URL must not exceed ${URL_VALIDATION_RULES.MAX_LENGTH} characters`,
  URL_DUPLICATE: "This URL is already added to the research list",
  URL_BLOCKED_DOMAIN: "This domain is blocked for research",

  // AI response validation errors
  AI_RESPONSE_REQUIRED:
    "AI model response is required to complete the research",
  AI_RESPONSE_TOO_SHORT: `Response must contain at least ${AI_RESPONSE_VALIDATION_RULES.MIN_LENGTH} characters`,
  AI_RESPONSE_TOO_LONG: `Response must not exceed ${AI_RESPONSE_VALIDATION_RULES.MAX_LENGTH} characters`,
  AI_RESPONSE_INVALID_JSON:
    "Response must be in valid JSON format matching CompetitorAnalysis structure",
  AI_RESPONSE_MISSING_REQUIRED_FIELDS:
    "JSON response is missing required fields",
  AI_RESPONSE_INVALID_STRUCTURE:
    "JSON structure does not match CompetitorAnalysis format",

  // General errors
  MAX_COMPETITORS_REACHED: `You can research a maximum of ${COMPETITOR_UI_CONFIG.MAX_COMPETITORS} competitors`,
  MIN_COMPETITORS_REQUIRED: `Add at least ${COMPETITOR_UI_CONFIG.MIN_COMPETITORS_FOR_SAVE} competitor to save`,
  SAVE_FAILED: "Failed to save research results",
  COPY_FAILED: "Failed to copy instruction to clipboard",
  NETWORK_ERROR: "Network error. Check your internet connection",

  // Page data errors
  PAGE_NOT_FOUND: "Page data not found",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions for editing",
  UPDATE_IN_PROGRESS: "Please wait for the current update to complete",
} as const;

/**
 * Success messages for positive user feedback
 * Provides consistent, encouraging success messaging
 */
export const SUCCESS_MESSAGES = {
  COMPETITOR_ADDED: "Competitor successfully added to research",
  COMPETITOR_REMOVED: "Competitor removed from research",
  INSTRUCTION_COPIED: "System instruction copied to clipboard",
  INSTRUCTION_GENERATED: "System instruction ready to copy",
  AI_RESPONSE_SAVED: "AI model response saved and validated",
  AI_RESPONSE_PARSED: "JSON response successfully parsed and validated",
  RESEARCH_COMPLETED: "Competitor research completed",
  ALL_RESEARCH_SAVED: "All research results successfully saved",
  STEP_COMPLETED: "Competitor research step completed",
} as const;

/**
 * Helper function to get workflow state configuration
 */
export const getWorkflowStateConfig = (
  state: keyof typeof WORKFLOW_STATES_CONFIG
) => {
  return WORKFLOW_STATES_CONFIG[state];
};

/**
 * Helper function to validate competitor URL
 */
export const isValidCompetitorUrl = (url: string): boolean => {
  if (!url || url.length < URL_VALIDATION_RULES.MIN_LENGTH) return false;
  if (url.length > URL_VALIDATION_RULES.MAX_LENGTH) return false;

  return URL_VALIDATION_RULES.URL_PATTERN.test(url.trim());
};

/**
 * Helper function to extract competitor name from URL
 */
export const extractCompetitorNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url.trim());
    const hostname = urlObj.hostname;
    // Remove www. prefix if present
    const cleanHostname = hostname.replace(/^www\./, "");
    // Take the domain name part (before first dot for subdomains)
    const domainParts = cleanHostname.split(".");
    return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
  } catch {
    return "Unknown Competitor";
  }
};

/**
 * Enhanced system instruction generator with proper variable substitution
 */
export const generateSystemInstruction = (
  competitorUrl: string,
  competitorName: string
): string => {
  return SYSTEM_INSTRUCTION_TEMPLATE.replace(
    /{competitorUrl}/g,
    competitorUrl
  ).replace(/{competitorName}/g, competitorName);
};

/**
 * Enhanced JSON validation function using Zod schema for consistency
 */
export const validateCompetitorAnalysisJson = (
  jsonString: string
): {
  isValid: boolean;
  error?: string;
  parsedData?: any;
} => {
  try {
    const parsed = JSON.parse(jsonString);

    // Use Zod schema for validation to ensure consistency
    const result = CompetitorAnalysisSchema.safeParse(parsed);

    if (result.success) {
      return {
        isValid: true,
        parsedData: result.data,
      };
    } else {
      // Format Zod errors for user-friendly display
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("; ");

      return {
        isValid: false,
        error: `Validation failed: ${errorMessages}`,
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid JSON format: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};

/**
 * List of predefined competitor categories for quick access
 * Can be used for grouping or filtering competitors
 */
export const COMPETITOR_CATEGORIES = [
  { value: "direct", label: "Direct Competitors", color: "text-red-600" },
  {
    value: "indirect",
    label: "Indirect Competitors",
    color: "text-orange-600",
  },
  {
    value: "aspirational",
    label: "Aspirational Brands",
    color: "text-purple-600",
  },
  { value: "substitute", label: "Substitute Products", color: "text-blue-600" },
  { value: "niche", label: "Niche Players", color: "text-green-600" },
] as const;
