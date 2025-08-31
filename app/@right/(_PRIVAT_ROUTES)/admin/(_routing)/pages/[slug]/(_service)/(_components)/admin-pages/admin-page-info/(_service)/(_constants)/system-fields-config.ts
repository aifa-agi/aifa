// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_constants)/system-fields-config.ts

import {
  Target,
  BookOpen,
  AlertTriangle,
  Users,
  FileText,
  Hash,
  Type,
  type LucideIcon,
} from "lucide-react";
import {
  SystemFieldConfig,
  EditableSystemField,
  KeywordsFieldConfig,
  EditableKeywordsField,
} from "../(_types)/admin-page-types";

/**
 * Configuration for editable system instruction fields
 * Extended to include title, description, and keywords
 * Defines UI properties, validation rules, and metadata for each field
 */
export const SYSTEM_FIELDS_CONFIG: Record<
  EditableSystemField,
  SystemFieldConfig
> = {
  // Basic page information fields
  title: {
    field: "title",
    title: "Page Title",
    icon: Type,
    placeholder: "Enter a clear and descriptive page title...",
    description:
      "The main title displayed in the browser tab and page header. Should be concise and descriptive.",
    fieldType: "input",
    isRequired: true,
  },
  description: {
    field: "description",
    title: "Page Description",
    icon: FileText,
    placeholder:
      "Provide a brief description of the page content and purpose...",
    description:
      "A summary of the page content used for SEO meta descriptions and page previews. Keep it informative and engaging.",
    fieldType: "textarea",
    isRequired: false,
  },

  // System instruction fields (existing)
  intent: {
    field: "intent",
    title: "Intent",
    icon: Target,
    placeholder: "Describe the primary purpose and goal of this page...",
    description:
      "Define what users should achieve when visiting this page. Focus on the main objective and intended outcome.",
    fieldType: "textarea",
    isRequired: false,
  },
  taxonomy: {
    field: "taxonomy",
    title: "Taxonomy",
    icon: BookOpen,
    placeholder: "Categorize and classify the content structure...",
    description:
      "Organize the page content within your information architecture. Define how this content relates to other pages.",
    fieldType: "textarea",
    isRequired: false,
  },
  attention: {
    field: "attention",
    title: "Attention",
    icon: AlertTriangle,
    placeholder: "Highlight key points that require special focus...",
    description:
      "Specify critical information, warnings, or important details that users must notice.",
    fieldType: "textarea",
    isRequired: false,
  },
  audiences: {
    field: "audiences",
    title: "Audiences",
    icon: Users,
    placeholder: "Define target user groups and personas...",
    description:
      "Identify who this content is designed for. Include user types, skill levels, and demographics.",
    fieldType: "textarea",
    isRequired: false,
  },
} as const;

/**
 * Configuration for keywords field management
 */
export const KEYWORDS_FIELD_CONFIG: Record<
  EditableKeywordsField,
  KeywordsFieldConfig
> = {
  keywords: {
    field: "keywords",
    title: "Content Keywords",
    icon: Hash,
    placeholder: "Enter keyword and press Enter to add...",
    description:
      "SEO keywords and tags that describe the page content. Used for search optimization and content categorization.",
    maxKeywords: 20,
    minKeywordLength: 2,
    maxKeywordLength: 50,
  },
} as const;

/**
 * List of all editable system fields in display order
 * Updated to include basic information fields first
 */
export const EDITABLE_SYSTEM_FIELDS: EditableSystemField[] = [
  "title",
  "description",
  "intent",
  "taxonomy",
  "attention",
  "audiences",
] as const;

/**
 * List of editable keywords fields
 */
export const EDITABLE_KEYWORDS_FIELDS: EditableKeywordsField[] = [
  "keywords",
] as const;

/**
 * Validation constraints for system fields
 * Updated with specific rules for different field types
 */
export const FIELD_VALIDATION_RULES = {
  // General rules
  MIN_LENGTH: 3, // Reduced from 10 for title field
  MAX_LENGTH: 1000,
  REQUIRED_FIELDS: ["title"] as EditableSystemField[], // Only title is required
  TRIM_WHITESPACE: true,

  // Field-specific rules
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
    REQUIRED: true,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 300,
    REQUIRED: false,
  },
  TEXTAREA_FIELDS: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
} as const;

/**
 * Validation constraints for keywords field
 * FIXED: Added support for Cyrillic characters and other Unicode letters
 */
export const KEYWORDS_VALIDATION_RULES = {
  MAX_KEYWORDS: 20,
  MIN_KEYWORD_LENGTH: 2,
  MAX_KEYWORD_LENGTH: 50,
  // FIXED: Updated regex to support Cyrillic, Latin, and other Unicode letters
  // \p{L} matches any Unicode letter (Latin, Cyrillic, Arabic, Chinese, etc.)
  // \p{N} matches any Unicode digit
  // \s matches whitespace
  // \- matches hyphen
  // _ matches underscore
  ALLOWED_CHARS: /^[\p{L}\p{N}\s\-_]+$/u,
  TRIM_WHITESPACE: true,
  REMOVE_DUPLICATES: true,
  CASE_INSENSITIVE_DUPLICATES: true,
} as const;

/**
 * UI behavior constants
 * Updated with configuration for different input types
 */
export const FIELD_UI_CONFIG = {
  // Input field configuration
  INPUT_MIN_HEIGHT: "40px",

  // Textarea configuration
  TEXTAREA_MIN_ROWS: 3,
  TEXTAREA_MAX_ROWS: 8,

  // Keywords field configuration
  KEYWORDS_INPUT_HEIGHT: "40px",
  KEYWORDS_MAX_DISPLAY: 10, // Show max 10 keywords before scrolling

  // General UI timing
  AUTO_SAVE_DELAY: 2000, // ms
  DEBOUNCE_DELAY: 300, // ms
  SUCCESS_TOAST_DURATION: 3000, // ms
  ERROR_TOAST_DURATION: 5000, // ms

  // Animation durations
  TRANSITION_DURATION: 200, // ms
  FOCUS_TRANSITION: 150, // ms
} as const;

/**
 * Field update operation timeouts
 */
export const OPERATION_TIMEOUTS = {
  FIELD_UPDATE: 10000, // 10 seconds
  KEYWORDS_UPDATE: 15000, // 15 seconds (array operations may take longer)
  VALIDATION: 1000, // 1 second
  AUTOSAVE: 5000, // 5 seconds
} as const;

/**
 * CSS classes for field states
 * Enhanced with more granular state management
 */
export const FIELD_STATES_CLASSES = {
  editing: "ring-2 ring-primary ring-offset-2",
  saving: "opacity-50 pointer-events-none",
  error: "ring-2 ring-destructive ring-offset-2",
  success: "ring-2 ring-green-500 ring-offset-2",
  idle: "",
  required: "after:content-['*'] after:text-destructive after:ml-1",
  optional: "",
} as const;

/**
 * CSS classes for keywords management
 * IMPROVED: Enhanced responsive design and full width usage
 */
export const KEYWORDS_STATES_CLASSES = {
  container:
    "flex flex-wrap gap-2 p-3 border rounded-md min-h-[100px] bg-background w-full", // FIXED: Added w-full and increased padding
  keyword:
    "inline-flex items-center gap-1 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm font-medium", // FIXED: Increased padding for better touch targets
  keywordRemove:
    "hover:bg-destructive hover:text-destructive-foreground rounded-full p-1 ml-1 transition-colors duration-200", // FIXED: Added margin and transition
  input: "border-none outline-none bg-transparent flex-1 min-w-[140px] text-sm", // FIXED: Increased min-width and added text-sm
  addButton: "shrink-0 ml-2 transition-colors duration-200", // FIXED: Added transition
  editing: "ring-2 ring-primary ring-offset-2",
  saving: "opacity-50 pointer-events-none",
} as const;

/**
 * Keyboard shortcuts for field editing
 */
export const KEYBOARD_SHORTCUTS = {
  SAVE: ["ctrl+s", "cmd+s"],
  CANCEL: ["Escape"],
  EDIT: ["Enter"],
  ADD_KEYWORD: ["Enter", "Tab", ","], // Multiple ways to add keywords
  REMOVE_KEYWORD: ["Backspace"], // When input is empty
} as const;

/**
 * Field grouping for UI organization
 */
export const FIELD_GROUPS = {
  BASIC_INFO: {
    title: "Basic Information",
    description: "Essential page information visible to users",
    fields: ["title", "description"] as EditableSystemField[],
    icon: FileText,
  },
  SYSTEM_INSTRUCTIONS: {
    title: "System Instructions",
    description: "AI and system guidance for content processing",
    fields: [
      "intent",
      "taxonomy",
      "attention",
      "audiences",
    ] as EditableSystemField[],
    icon: Target,
  },
  METADATA: {
    title: "Metadata & SEO",
    description: "Keywords and search optimization",
    fields: ["keywords"] as EditableKeywordsField[],
    icon: Hash,
  },
} as const;

/**
 * Helper function to get validation rules for a specific field
 */
export const getFieldValidationRules = (field: EditableSystemField) => {
  switch (field) {
    case "title":
      return FIELD_VALIDATION_RULES.TITLE;
    case "description":
      return FIELD_VALIDATION_RULES.DESCRIPTION;
    default:
      return FIELD_VALIDATION_RULES.TEXTAREA_FIELDS;
  }
};

/**
 * Helper function to check if field is required
 */
export const isFieldRequired = (field: EditableSystemField): boolean => {
  return FIELD_VALIDATION_RULES.REQUIRED_FIELDS.includes(field);
};

/**
 * Helper function to get appropriate input component type
 */
export const getFieldInputType = (
  field: EditableSystemField
): "input" | "textarea" => {
  return SYSTEM_FIELDS_CONFIG[field].fieldType;
};
