// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_types)/step13-types.ts

/**
 * Step 13 Types:
 * - CleanedPageData: Final minimal page structure after cleanup
 * - Field status tracking for data existence checking
 * - Animation states for cleanup process visualization
 * - Report management and deploy configuration types
 * 
 * Understanding of the task (step-by-step):
 * 1) Define CleanedPageData with only essential fields preserved after cleanup
 * 2) Create types for animated cleanup process (field removal with timing)
 * 3) Add field existence tracking (Exists/Not Exists dropdown states)
 * 4) Include report management types for future functionality
 * 5) Minimal sufficient typing - no over-engineering
 */

import { PageImages, PageType } from "@/app/@right/(_service)/(_types)/page-types";
import { BadgeName } from "@/config/pages-config/badges/badge-config";
import type { UserType,} from "@prisma/client";


/**
 * Cleaned PageData structure - only essential fields remain after step13 cleanup.
 * All temporary fields (sections, tempMDXContent, etc.) are removed.
 */
export interface CleanedPageData {
  id: string;
  linkName: string; // FIXED: Added required linkName field
  title?: string;
  description?: string;
  images?: PageImages[];
  keywords?: string[];
  href?: string;
  roles: UserType[];
  hasBadge?: boolean;
  badgeName?: BadgeName;
  badgeLink?: string;
  isPublished: boolean;
  isVectorConnected: boolean;
  isAddedToPrompt: boolean;
  isChatSynchronized: boolean;
  type: PageType;
  finalReport?: string[];
  isPreviewComplited: boolean; // Set to true after step13 completion
}

/**
 * Field existence status for data state tracking
 */
export type FieldExistenceStatus = "exists" | "not_exists";

/**
 * Individual field state for dropdown display
 */
export interface FieldStatus {
  fieldName: string;
  status: FieldExistenceStatus;
  isRequired: boolean;
}

/**
 * Cleanup animation phases for visual feedback
 */
export type CleanupAnimationPhase = 
  | "idle"           // No animation
  | "appearing"      // Field appears (immediate)
  | "deleting"       // "Deleting..." message (500ms delay)
  | "deleted";       // "Deleted" success message (250ms + 200ms)

/**
 * Individual field cleanup state during animation
 */
export interface FieldCleanupState {
  fieldName: string;
  phase: CleanupAnimationPhase;
  isCompleted: boolean;
}

/**
 * Overall cleanup process state
 */
export interface CleanupProcessState {
  isActive: boolean;
  currentFieldIndex: number;
  fields: FieldCleanupState[];
  totalFields: number;
  completedFields: number;
}

/**
 * Report item structure for future report management
 */
export interface ReportItem {
  id: string;
  createdAt: string;
  type: "draft" | "final" | "analysis";
  status: "available" | "processing" | "error";
}

/**
 * Deploy configuration for Vercel integration
 */
export interface DeployConfig {
  isEnabled: boolean;
  estimatedDuration: string; // "3 minutes to several hours"
  targetUrl: string; // "admin/vercel-deploy"
}

/**
 * Step13 main component props
 */
export interface Step13Props {
  slug: string;
}

/**
 * Data fields that will be cleaned (removed) during cleanup process
 */
export type CleanupTargetField = 
  | "sections"
  | "tempMDXContent"
  | "draftResults"
  | "analysisData"
  | "tempCategories"
  | "workflowState"
  | "generationMetrics"
  | "validationErrors";

/**
 * Step13 root state for context provider
 */
export interface Step13State {
  cleanupProcess: CleanupProcessState;
  fieldStatuses: FieldStatus[];
  availableReports: ReportItem[];
  deployConfig: DeployConfig;
  isDataCleaned: boolean;
}
