// @app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_types)/content-repair-types.ts

// Comments are in English for clarity.
// This module defines types and safe normalization utilities for ContentStructure repair.

import { ContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Request to repair a ContentStructure JSON string
 */
export interface ContentRepairRequest {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
  originalInstruction?: string;
}

/**
 * Result of repairing ContentStructure JSON
 */
export interface ContentRepairResult {
  success: boolean;
  repairedData?: ContentStructure[];
  error?: string;
  repairMethod: "openai" | "manual" | "none";
  originalLength: number;
  repairedLength: number;
  confidence: number;
}

/**
 * UI state for the repair process
 */
export interface ContentRepairState {
  isRepairing: boolean;
  repairResult: ContentRepairResult | null;
  showRepairTool: boolean;
  repairAttempts: number;
}

/**
 * Available JSON repair methods
 */
export type ContentRepairMethod =
  | "openai-generate-object"
  | "openai-chat"
  | "manual";

/**
 * Server Action request
 */
export interface ContentRepairServerRequest {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
}

/**
 * Server Action response (server may return a wider shape before normalization)
 * Note: server can return a superset type; we normalize to ContentStructure[] client-side.
 */
export interface ContentRepairServerResult {
  success: boolean;
  // Server may return a broader type; we will normalize this to ContentStructure[].
  // Kept as unknown here if you want maximum safety, but we will define a helper type below.
  // Using ContentStructure[] here is OK if server already normalizes; otherwise we will still normalize.
  repairedData?: unknown;
  error?: string;
  originalLength: number;
  repairedLength: number;
  confidence: number;
}

/**
 * Repair configuration
 */
export interface ContentRepairConfig {
  maxAttempts: number;
  timeout: number;
  minConfidenceThreshold: number;
  openaiModel: string;
}

/**
 * Validation error for ContentStructure elements
 */
export interface ContentValidationError {
  field: string;
  message: string;
  index?: number;
  severity: "error" | "warning";
}

/**
 * Validation result for ContentStructure array
 */
export interface ContentValidationResult {
  isValid: boolean;
  errors: ContentValidationError[];
  warnings: ContentValidationError[];
  elementsCount: number;
}

/* ======================
   Normalization utilities
   ====================== */

// 1) Define the exact TechnicalTag domain (must match your ContentStructure)
export const TECHNICAL_TAGS = new Set([
  "p",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "code",
  "blockquote",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "img",
] as const);

/**
 * Infer TechnicalTag union from TECHNICAL_TAGS constant
 */
export type TechnicalTag = (typeof TECHNICAL_TAGS extends Set<infer T>
  ? T
  : never) &
  string;

/**
 * Type guard for TechnicalTag
 */
export function isTechnicalTag(value: unknown): value is TechnicalTag {
  return typeof value === "string" && TECHNICAL_TAGS.has(value as TechnicalTag);
}

/**
 * Server-side broader shape that may come back before normalization.
 * Adjust fields according to your server payload structure.
 * The key is that `tag` can be string | undefined and may be out of domain.
 */
export type ContentStructureServerItem = Partial<ContentStructure> & {
  id?: string;
  tag?: string | undefined;
  contentTag?: string | undefined;
};

/**
 * Normalize a single server item to a strict ContentStructure.
 * Rules:
 * - If id is missing, returns null to drop item (or generate id if desired).
 * - If tag is missing or invalid, defaults to "p".
 * - If contentTag exists and conflicts with tag, enforce tag = "p".
 */
export function normalizeContentStructureItem(
  item: ContentStructureServerItem
): ContentStructure | null {
  // Ensure item exists and has an id; otherwise skip
  if (!item || !item.id) return null;

  // Default tag to "p" when absent or invalid
  let tag: TechnicalTag = "p";
  if (isTechnicalTag(item.tag)) {
    tag = item.tag;
  } else {
    tag = "p";
  }

  // Business rule: if contentTag conflicts with tag, enforce "p"
  if (item.contentTag && item.tag && item.contentTag !== item.tag) {
    tag = "p";
  }

  // Build normalized object by copying known fields and enforcing tag
  const normalized: ContentStructure = {
    ...(item as ContentStructure),
    id: item.id, // keep original id
    tag, // enforce normalized tag
  };

  return normalized;
}

/**
 * Normalize a server array to ContentStructure[] safely.
 */
export function normalizeRepairedData(
  data: unknown
): ContentStructure[] | undefined {
  if (!Array.isArray(data)) return undefined;
  const result: ContentStructure[] = [];
  for (const raw of data as ContentStructureServerItem[]) {
    const norm = normalizeContentStructureItem(raw);
    if (norm) result.push(norm);
  }
  return result;
}

/**
 * Helper to build a ContentRepairResult from a server result,
 * ensuring repairedData is normalized to ContentStructure[].
 */
export function buildContentRepairResultFromServer(
  serverResult: ContentRepairServerResult,
  method: "openai" | "manual" | "none" = "openai"
): ContentRepairResult {
  const normalized = normalizeRepairedData(serverResult.repairedData);
  return {
    success: serverResult.success,
    repairedData: normalized,
    error: serverResult.error,
    repairMethod: method,
    originalLength: serverResult.originalLength,
    repairedLength: serverResult.repairedLength,
    confidence: serverResult.confidence,
  };
}
