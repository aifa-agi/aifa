// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_types)/admin-page-types.ts

import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { LucideIcon } from "lucide-react";

/**
 * Props interface for AdminPageInfo component
 */
export interface AdminPageInfoProps {
  slug: string;
}

/**
 * Editable fields for page system instructions and basic information
 * Extended to include title, description, and keywords
 */
export type EditableSystemField =
  | "intent"
  | "taxonomy"
  | "attention"
  | "audiences"
  | "title"
  | "description";

/**
 * Special field type for keywords array management
 */
export type EditableKeywordsField = "keywords";

/**
 * Combined editable field types
 */
export type EditableField = EditableSystemField | EditableKeywordsField;

/**
 * Interface for system field update operations
 */
export interface SystemFieldUpdate {
  field: EditableSystemField;
  value: string;
}

/**
 * Interface for keywords field update operations
 */
export interface KeywordsFieldUpdate {
  field: EditableKeywordsField;
  value: string[];
}

/**
 * Hook return type for system fields editing
 */
export interface UseSystemFieldsReturn {
  editingField: EditableSystemField | null;
  editingValue: string;
  isUpdating: boolean;
  startEditing: (field: EditableSystemField, currentValue: string) => void;
  cancelEditing: () => void;
  saveField: () => Promise<boolean>;
  updateValue: (value: string) => void;
  canEdit: boolean;
}

/**
 * Hook return type for keywords fields editing
 */
export interface UseKeywordsFieldReturn {
  editingKeywords: boolean;
  keywordsList: string[];
  newKeyword: string;
  isUpdating: boolean;
  startEditingKeywords: () => void;
  cancelEditingKeywords: () => void;
  saveKeywords: () => Promise<boolean>;
  addKeyword: (keyword: string) => void;
  removeKeyword: (index: number) => void;
  updateNewKeyword: (value: string) => void;
  canEdit: boolean;
}

/**
 * System field configuration for UI rendering
 */
export interface SystemFieldConfig {
  field: EditableSystemField;
  title: string;
  icon: LucideIcon;
  placeholder: string;
  description: string;
  fieldType: "textarea" | "input"; // Added to distinguish between input types
  isRequired?: boolean; // Added for validation
}

/**
 * Keywords field configuration for UI rendering
 */
export interface KeywordsFieldConfig {
  field: EditableKeywordsField;
  title: string;
  icon: LucideIcon;
  placeholder: string;
  description: string;
  maxKeywords?: number;
  minKeywordLength?: number;
  maxKeywordLength?: number;
}

/**
 * Page update operation result
 */
export interface PageUpdateResult {
  success: boolean;
  error?: string;
  updatedPage?: PageData;
}

/**
 * Field validation result
 */
export interface FieldValidation {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

/**
 * Keywords validation result
 */
export interface KeywordsValidation {
  isValid: boolean;
  error?: string;
  sanitizedKeywords?: string[];
}

/**
 * Keyword item interface for individual keyword management
 */
export interface KeywordItem {
  id: string;
  value: string;
  isNew?: boolean;
}
