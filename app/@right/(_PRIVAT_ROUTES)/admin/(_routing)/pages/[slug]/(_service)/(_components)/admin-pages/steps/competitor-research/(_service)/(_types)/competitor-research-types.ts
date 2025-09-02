// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/competitor-research/(_service)/(_types)/competitor-research-types.ts

import {
  PageData,
  CompetitorAnalysis,
} from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Props interface for CompetitorResearch component
 */
export interface CompetitorResearchProps {
  slug: string;
}

/**
 * Individual competitor research item
 */
export interface CompetitorResearchItem {
  id: string;
  url: string;
  competitorName: string;
  instructionGenerated: boolean;
  instructionCopied: boolean;
  aiResponseRaw: string; // Raw response from Perplexity Pro
  isCompleted: boolean;
  createdAt: string;
}

/**
 * Props for useCompetitorResearch hook
 */
export interface UseCompetitorResearchProps {
  page: PageData | null;
  categoryTitle: string;
  slug: string;
}

/**
 * НОВЫЙ интерфейс для локального состояния сохранения
 */
export interface LocalSaveState {
  hasLocalChanges: boolean;
  localCompetitorAnalysis: CompetitorAnalysis[] | null;
  pendingServerUpload: boolean;
  lastLocalSaveAt: string | null;
}

/**
 * Validation result for competitor URL
 */
export interface UrlValidation {
  isValid: boolean;
  error?: string;
  sanitizedUrl?: string;
  extractedName?: string;
}

/**
 * Validation result for AI response
 */
export interface AiResponseValidation {
  isValid: boolean;
  error?: string;
  sanitizedResponse?: string;
}

/**
 * Competitor research operation result
 */
export interface CompetitorResearchUpdateResult {
  success: boolean;
  error?: string;
  updatedData?: CompetitorResearchItem[];
}

/**
 * System instruction template data
 */
export interface SystemInstructionData {
  competitorUrl: string;
  competitorName: string;
  instructionText: string;
}

/**
 * Competitor research workflow states
 */
export type CompetitorWorkflowState =
  | "url_added"
  | "instruction_generated"
  | "instruction_copied"
  | "analysis_provided"
  | "completed";

/**
 * Props for individual competitor item components
 */
export interface CompetitorItemProps {
  item: CompetitorResearchItem;
  onUpdate: (id: string, updates: Partial<CompetitorResearchItem>) => void;
  onRemove: (id: string) => void;
  onGenerateInstruction: (id: string) => string;
  onMarkInstructionCopied: (id: string) => void;
  onUpdateAiResponse: (id: string, response: string) => void;
  canEdit: boolean;
  isUpdating: boolean;
}

/**
 * Props for URL input component
 */
export interface UrlInputProps {
  onAddCompetitor: (url: string) => void;
  canEdit: boolean;
  isUpdating: boolean;
  existingUrls: string[];
}

/**
 * Props for system instruction generator component
 */
export interface SystemInstructionProps {
  competitorUrl: string;
  competitorName: string;
  onInstructionCopied: () => void;
  canEdit: boolean;
}

/**
 * Props for AI response input component
 */
export interface AiResponseInputProps {
  competitorId: string;
  currentResponse: string;
  onResponseUpdate: (response: string) => void;
  canEdit: boolean;
  isUpdating: boolean;
}

/**
 * Competitor research step completion data
 */
export interface CompetitorResearchStepData {
  competitors: CompetitorResearchItem[];
  completedAt: string;
  totalCompetitors: number;
  completedCompetitors: number;
}

/**
 * ОБНОВЛЕННЫЙ интерфейс возвращаемого значения хука useCompetitorResearch
 * Включает разделенное сохранение
 */
export interface UseCompetitorResearchReturn {
  // Основные данные
  competitors: CompetitorResearchItem[];
  isUpdating: boolean;
  canEdit: boolean;

  // Управление конкурентами
  addCompetitor: (url: string) => void;
  updateCompetitor: (
    id: string,
    updates: Partial<CompetitorResearchItem>
  ) => void;
  removeCompetitor: (id: string) => void;

  // Генерация инструкций
  generateInstruction: (competitorId: string) => string;
  markInstructionCopied: (competitorId: string) => void;
  updateAiResponse: (competitorId: string, response: string) => void;

  // НОВОЕ: Разделенное сохранение
  saveCompetitorsLocally: () => Promise<boolean>;
  uploadToServer: () => Promise<boolean>;

  // Состояния сохранения
  canSaveResults: boolean;
  hasUnsavedChanges: boolean;
  hasLocalChanges: boolean;
  pendingServerUpload: boolean;
  isServerUploading: boolean;
}
