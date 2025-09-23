// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_utils)/step13-helpers.ts

/**
 * Step 13 Helper Utilities:
 * Supporting functions for data formatting, animations, user messages,
 * navigation, reports, timing, and status formatting.
 * 
 * Understanding of the task (step-by-step):
 * 1) Format data for UI display and user feedback
 * 2) Handle animation timing and sequencing
 * 3) Generate contextual user messages
 * 4) Manage navigation to admin/vercel-deploy
 * 5) Process report data and status
 * 6) Calculate and format timing information
 * 7) Create status messages for different states
 */

import { useRouter } from "next/navigation";
import type { 
  CleanupAnimationPhase, 
  FieldStatus, 
  ReportItem, 
  CleanupTargetField 
} from "../(_types)/step13-types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Animation timing constants (in milliseconds)
 */
export const ANIMATION_TIMINGS = {
  FIELD_APPEARING: 0,        // Immediate
  FIELD_DELETING: 500,       // 500ms delay
  DELETING_DISPLAY: 250,     // Show "deleting" for 250ms
  DELETED_DISPLAY: 200,      // Show "deleted" for 200ms
  BETWEEN_FIELDS: 100,       // Delay between field animations
} as const;

/**
 * Creates animation delay for cleanup sequence
 */
export function calculateAnimationDelay(
  fieldIndex: number, 
  phase: CleanupAnimationPhase
): number {
  const baseDelay = fieldIndex * (
    ANIMATION_TIMINGS.FIELD_DELETING + 
    ANIMATION_TIMINGS.DELETING_DISPLAY + 
    ANIMATION_TIMINGS.DELETED_DISPLAY +
    ANIMATION_TIMINGS.BETWEEN_FIELDS
  );

  switch (phase) {
    case "appearing":
      return baseDelay;
    case "deleting":
      return baseDelay + ANIMATION_TIMINGS.FIELD_DELETING;
    case "deleted":
      return baseDelay + ANIMATION_TIMINGS.FIELD_DELETING + ANIMATION_TIMINGS.DELETING_DISPLAY;
    default:
      return 0;
  }
}

/**
 * Formats field name for display (converts camelCase to readable format)
 */
export function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Formats field status for UI display
 */
export function formatFieldStatus(status: FieldStatus): {
  displayName: string;
  statusText: string;
  statusColor: string;
  icon: string;
} {
  const displayName = formatFieldName(status.fieldName);
  const statusText = status.status === "exists" ? "Exists" : "Not Exists";
  
  const statusColor = status.status === "exists" 
    ? "text-green-600 dark:text-green-400"
    : "text-gray-500 dark:text-gray-400";
    
  const icon = status.status === "exists" ? "✓" : "○";

  return {
    displayName,
    statusText, 
    statusColor,
    icon
  };
}

/**
 * Generates user-friendly progress message for cleanup
 */
export function generateProgressMessage(
  currentIndex: number, 
  totalFields: number,
  currentFieldName?: string
): string {
  const progress = Math.round((currentIndex / totalFields) * 100);
  
  if (currentFieldName) {
    const formattedName = formatFieldName(currentFieldName);
    return `Cleaning ${formattedName}... (${currentIndex}/${totalFields} - ${progress}%)`;
  }
  
  return `Processing cleanup... (${currentIndex}/${totalFields} - ${progress}%)`;
}

/**
 * Calculates estimated cleanup duration based on field count
 */
export function estimateCleanupDuration(fieldCount: number): {
  totalMs: number;
  displayText: string;
} {
  const totalMs = fieldCount * (
    ANIMATION_TIMINGS.FIELD_DELETING +
    ANIMATION_TIMINGS.DELETING_DISPLAY + 
    ANIMATION_TIMINGS.DELETED_DISPLAY +
    ANIMATION_TIMINGS.BETWEEN_FIELDS
  );
  
  const seconds = Math.ceil(totalMs / 1000);
  const displayText = seconds <= 1 ? "Less than 1 second" : `About ${seconds} seconds`;
  
  return { totalMs, displayText };
}

/**
 * Navigation helper for Vercel deploy page
 */
export function createNavigateToDeployPage() {
  return (router: ReturnType<typeof useRouter>) => {
    const targetUrl = "/admin/vercel-deploy";
    
    try {
      // Soft routing using router.push
      router.push(targetUrl);
      return { success: true, url: targetUrl };
    } catch (error) {
      console.error("Navigation error:", error);
      return { 
        success: false, 
        error: "Failed to navigate to deploy page",
        url: targetUrl 
      };
    }
  };
}

/**
 * Formats report count for display
 */
export function formatReportCount(reports: ReportItem[]): {
  count: number;
  displayText: string;
  hasReports: boolean;
} {
  const count = reports.length;
  const hasReports = count > 0;
  
  let displayText: string;
  if (count === 0) {
    displayText = "No reports available";
  } else if (count === 1) {
    displayText = "1 report available";
  } else {
    displayText = `${count} reports available`;
  }
  
  return { count, displayText, hasReports };
}

/**
 * Filters and sorts reports by status and date
 */
export function processReports(reports: ReportItem[]): {
  available: ReportItem[];
  processing: ReportItem[];
  errors: ReportItem[];
  sorted: ReportItem[];
} {
  const available = reports.filter(r => r.status === "available");
  const processing = reports.filter(r => r.status === "processing");
  const errors = reports.filter(r => r.status === "error");
  
  // Sort by creation date (newest first)
  const sorted = [...reports].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return { available, processing, errors, sorted };
}

/**
 * Generates contextual success message based on cleanup results
 */
export function generateSuccessMessage(
  preservedCount: number,
  removedCount: number
): string {
  if (removedCount === 0) {
    return "No temporary data found to clean.";
  }
  
  if (preservedCount === 0) {
    return `Cleaned ${removedCount} temporary ${removedCount === 1 ? 'field' : 'fields'}.`;
  }
  
  return `Successfully cleaned ${removedCount} temporary ${removedCount === 1 ? 'field' : 'fields'} while preserving ${preservedCount} essential ${preservedCount === 1 ? 'field' : 'fields'}.`;
}

/**
 * Creates deploy timing estimate message
 */
export function getDeployTimingMessage(pageCount?: number): string {
  if (!pageCount || pageCount <= 0) {
    return "Depending on the number of pages, this process can take from 3 minutes to several hours.";
  }
  
  if (pageCount <= 10) {
    return "With your current page count, deployment should complete in 3-15 minutes.";
  }
  
  if (pageCount <= 50) {
    return "With your current page count, deployment may take 15 minutes to 2 hours.";
  }
  
  return "With your large page count, deployment may take 2-6 hours to complete.";
}

/**
 * Validates slug format for navigation
 */
export function validateSlugFormat(slug: string): {
  isValid: boolean;
  error?: string;
} {
  if (!slug || slug.trim() === "") {
    return { isValid: false, error: "Slug cannot be empty" };
  }
  
  // Check for valid slug characters (alphanumeric, hyphens, underscores)
  const validSlugPattern = /^[a-zA-Z0-9-_]+$/;
  if (!validSlugPattern.test(slug)) {
    return { 
      isValid: false, 
      error: "Slug contains invalid characters" 
    };
  }
  
  return { isValid: true };
}

/**
 * Creates field list for animation display
 */
export function createFieldAnimationList(pageData: PageData): {
  fieldName: string;
  displayName: string;
  hasData: boolean;
}[] {
  const fields: CleanupTargetField[] = [
    "sections",
    "tempMDXContent", 
    "draftResults",
    "analysisData",
    "tempCategories",
    "workflowState",
    "generationMetrics",
    "validationErrors"
  ];
  
  return fields.map(fieldName => ({
    fieldName,
    displayName: formatFieldName(fieldName),
    hasData: !!(pageData as any)[fieldName]
  })).filter(field => field.hasData);
}

/**
 * Formats date for report display
 */
export function formatReportDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return "Invalid date";
  }
}

/**
 * Gets appropriate status badge color for report
 */
export function getReportStatusColor(status: ReportItem['status']): {
  background: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "available":
      return {
        background: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300", 
        border: "border-green-200 dark:border-green-800"
      };
    case "processing":
      return {
        background: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800" 
      };
    case "error":
      return {
        background: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-300",
        border: "border-red-200 dark:border-red-800"
      };
    default:
      return {
        background: "bg-gray-100 dark:bg-gray-900/30", 
        text: "text-gray-800 dark:text-gray-300",
        border: "border-gray-200 dark:border-gray-800"
      };
  }
}

/**
 * Debounce utility for button clicks and animations
 */
export function createDebouncer(delay: number) {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return function debounce<T extends (...args: any[]) => any>(
    func: T,
    ...args: Parameters<T>
  ): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}
