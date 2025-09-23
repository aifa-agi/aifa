// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_utils)/data-cleanup-utils.ts

/**
 * Data Cleanup Utilities:
 * Functions for cleaning pageData - removing temporary fields, 
 * preserving only essential data, setting completion flags.
 * 
 * Understanding of the task (step-by-step):
 * 1) Remove temporary fields from PageData while preserving essential data
 * 2) Set isPreviewComplited = true to mark process completion
 * 3) Validate data integrity before and after cleanup
 * 4) Create CleanedPageData object from source PageData
 * 5) Check field existence status for UI display
 * 6) Provide rollback capability in case of errors
 */

import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import type { 
  CleanedPageData, 
  FieldStatus, 
  FieldExistenceStatus, 
  CleanupTargetField 
} from "../(_types)/step13-types";

/**
 * List of temporary fields that should be removed during cleanup
 */
const TEMPORARY_FIELDS: CleanupTargetField[] = [
  "sections",
  "tempMDXContent", 
  "draftResults",
  "analysisData",
  "tempCategories",
  "workflowState",
  "generationMetrics",
  "validationErrors"
];

/**
 * Extended temporary fields from PageData structure
 */
const EXTENDED_TEMPORARY_FIELDS: (keyof PageData)[] = [
  "competitorAnalysis",
  "aiRecommendContentStructure", 
  "knowledgeSettings",
  "isReadyPromptForPerplexity",
  "draftContentStructure",
  "isReadyDraftForPerplexity", 
  "draftContentResult",
  "draftReport",
  "finalContentStructure",
  "finalContentResult",
  "sections",
  "metadata",
  "tags",
  "authors",
  "summary",
  "intent",
  "taxonomy", 
  "attention",
  "audiences",
  "semanticCapabilities",
  "semanticLibrary",
  "design",
  "linkConfiguration",
  "createdAt",
  "updatedAt",
];

/**
 * Required fields that must be preserved after cleanup
 */
const REQUIRED_FIELDS: (keyof CleanedPageData)[] = [
  "id",
  "linkName", // FIXED: Added linkName as required
  "roles", 
  "isPublished",
  "isVectorConnected",
  "isAddedToPrompt",
  "isChatSynchronized",
  "type",
  "isPreviewComplited"
];

/**
 * Optional fields that may be preserved if they exist
 */
const OPTIONAL_FIELDS: (keyof CleanedPageData)[] = [
  "title",
  "description", 
  "images",
  "keywords",
  "href",
  "hasBadge",
  "badgeName",
  "badgeLink",
  "finalReport"
];

/**
 * Validates that required fields are present in PageData
 */
export function validateRequiredFields(pageData: PageData): {
  isValid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];
  
  REQUIRED_FIELDS.forEach(field => {
    if (field === "isPreviewComplited") return; // Will be set during cleanup
    
    if (pageData[field as keyof PageData] === undefined || pageData[field as keyof PageData] === null) {
      missingFields.push(field);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Creates CleanedPageData from source PageData by removing temporary fields
 * and setting isPreviewComplited = true
 */
export function cleanupPageData(pageData: PageData): CleanedPageData {
  const cleanedData: CleanedPageData = {
    // Required fields
    id: pageData.id,
    linkName: pageData.linkName, // FIXED: Include linkName
    roles: pageData.roles,
    isPublished: pageData.isPublished,
    isVectorConnected: pageData.isVectorConnected, 
    isAddedToPrompt: pageData.isAddedToPrompt,
    isChatSynchronized: pageData.isChatSynchronized,
    type: pageData.type,
    isPreviewComplited: true, // Mark as completed
    
    // Optional fields (only include if they exist)
    ...(pageData.title && { title: pageData.title }),
    ...(pageData.description && { description: pageData.description }),
    ...(pageData.images && { images: pageData.images }),
    ...(pageData.keywords && { keywords: pageData.keywords }),
    ...(pageData.href && { href: pageData.href }),
    ...(pageData.hasBadge !== undefined && { hasBadge: pageData.hasBadge }),
    ...(pageData.badgeName && { badgeName: pageData.badgeName }),
    ...(pageData.badgeLink && { badgeLink: pageData.badgeLink }),
    ...(pageData.finalReport && { finalReport: pageData.finalReport }),
  };

  return cleanedData;
}

/**
 * Checks existence status of fields in PageData for UI display
 */
export function getFieldStatuses(pageData: PageData): FieldStatus[] {
  const statuses: FieldStatus[] = [];
  
  // Check required fields
  REQUIRED_FIELDS.forEach(field => {
    const exists = pageData[field as keyof PageData] !== undefined && 
                  pageData[field as keyof PageData] !== null;
    
    statuses.push({
      fieldName: field,
      status: exists ? "exists" : "not_exists",
      isRequired: true
    });
  });
  
  // Check optional fields  
  OPTIONAL_FIELDS.forEach(field => {
    const exists = pageData[field as keyof PageData] !== undefined && 
                  pageData[field as keyof PageData] !== null;
    
    statuses.push({
      fieldName: field,
      status: exists ? "exists" : "not_exists", 
      isRequired: false
    });
  });

  return statuses;
}

/**
 * Checks if field exists in PageData
 */
export function checkFieldExists(pageData: PageData, fieldName: string): FieldExistenceStatus {
  const value = pageData[fieldName as keyof PageData];
  
  if (value === undefined || value === null) {
    return "not_exists";
  }
  
  // Check for empty arrays or objects
  if (Array.isArray(value) && value.length === 0) {
    return "not_exists";
  }
  
  if (typeof value === "string" && value.trim() === "") {
    return "not_exists"; 
  }
  
  return "exists";
}

/**
 * Gets list of temporary fields that will be removed
 */
export function getTemporaryFieldsList(): string[] {
  return [...EXTENDED_TEMPORARY_FIELDS];
}

/**
 * Calculates how many fields will be cleaned
 */
export function getCleanupFieldsCount(pageData: PageData): number {
  return EXTENDED_TEMPORARY_FIELDS.filter(field => 
    checkFieldExists(pageData, field) === "exists"
  ).length;
}

/**
 * Validates cleaned data integrity
 */
export function validateCleanedData(cleanedData: CleanedPageData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check required fields
  REQUIRED_FIELDS.forEach(field => {
    if (cleanedData[field] === undefined || cleanedData[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Validate specific field constraints
  if (!cleanedData.id || cleanedData.id.trim() === "") {
    errors.push("ID cannot be empty");
  }
  
  if (!cleanedData.linkName || cleanedData.linkName.trim() === "") {
    errors.push("LinkName cannot be empty");
  }
  
  if (!Array.isArray(cleanedData.roles) || cleanedData.roles.length === 0) {
    errors.push("Roles array cannot be empty");
  }
  
  if (!cleanedData.isPreviewComplited) {
    errors.push("isPreviewComplited must be true after cleanup");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Creates a backup of PageData before cleanup for rollback
 */
export function createDataBackup(pageData: PageData): PageData {
  return JSON.parse(JSON.stringify(pageData)) as PageData;
}

/**
 * Restores PageData from backup
 */
export function restoreFromBackup(backup: PageData): PageData {
  return JSON.parse(JSON.stringify(backup)) as PageData;
}

/**
 * Checks if data has been cleaned (isPreviewComplited = true and no temp fields)
 */
export function isDataCleaned(pageData: PageData): boolean {
  if (!pageData.isPreviewComplited) {
    return false;
  }
  
  // Check if any temporary fields still exist
  const hasTemporaryData = EXTENDED_TEMPORARY_FIELDS.some(field => 
    checkFieldExists(pageData, field) === "exists"
  );
  
  return !hasTemporaryData;
}

/**
 * Gets summary of fields that will be preserved vs removed
 */
export function getCleanupSummary(pageData: PageData): {
  preserved: string[];
  removed: string[];
  totalPreserved: number;
  totalRemoved: number;
} {
  const preserved: string[] = [];
  const removed: string[] = [];
  
  // Check preserved fields
  [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].forEach(field => {
    if (checkFieldExists(pageData, field) === "exists") {
      preserved.push(field);
    }
  });
  
  // Check removed fields
  EXTENDED_TEMPORARY_FIELDS.forEach(field => {
    if (checkFieldExists(pageData, field) === "exists") {
      removed.push(field);
    }
  });
  
  return {
    preserved,
    removed,
    totalPreserved: preserved.length,
    totalRemoved: removed.length
  };
}
