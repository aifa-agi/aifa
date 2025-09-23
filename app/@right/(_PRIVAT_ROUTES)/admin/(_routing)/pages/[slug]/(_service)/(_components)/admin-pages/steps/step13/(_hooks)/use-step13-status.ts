// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_hooks)/use-step13-status.ts

/**
 * Step 13 Status Hook:
 * Tracks pageData field states, generates FieldStatus lists for dropdowns,
 * checks field existence (Exists/Not Exists), calculates field statistics.
 * 
 * Understanding of the task (step-by-step):
 * 1) Monitor pageData field existence status in real-time
 * 2) Generate FieldStatus array for dropdown UI display
 * 3) Calculate statistics (required vs optional fields)
 * 4) Provide reactive updates when pageData changes
 * 5) Format field information for user interface
 * 6) Track data completeness and quality metrics
 */

import * as React from "react";
import type { 
  FieldStatus, 
  FieldExistenceStatus,
  CleanedPageData 
} from "../(_types)/step13-types";
import { 
  getFieldStatuses,
  checkFieldExists,
  isDataCleaned,
  validateRequiredFields
} from "../(_utils)/data-cleanup-utils";
import { 
  formatFieldName,
  formatFieldStatus
} from "../(_utils)/step13-helpers";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface UseStep13StatusProps {
  pageData: PageData | null;
}

interface UseStep13StatusReturn {
  // Field Status Data
  fieldStatuses: FieldStatus[];
  formattedStatuses: ReturnType<typeof formatFieldStatus>[];
  
  // Statistics
  stats: {
    totalFields: number;
    requiredFields: number;
    optionalFields: number;
    existingFields: number;
    missingFields: number;
    requiredExisting: number;
    requiredMissing: number;
    optionalExisting: number;
    optionalMissing: number;
  };
  
  // Status Flags
  hasRequiredFields: boolean;
  hasAllRequiredFields: boolean;
  hasOptionalFields: boolean;
  isDataComplete: boolean;
  isAlreadyCleaned: boolean;
  
  // Utilities
  getFieldStatus: (fieldName: string) => FieldExistenceStatus;
  getFieldDisplayName: (fieldName: string) => string;
  isFieldRequired: (fieldName: string) => boolean;
  
  // Validation
  validationResult: {
    isValid: boolean;
    missingFields: string[];
  };
}

/**
 * Required fields for validation
 */
const REQUIRED_FIELD_NAMES = [
  "id",
  "linkName",
  "roles",
  "isPublished", 
  "isVectorConnected",
  "isAddedToPrompt",
  "isChatSynchronized",
  "type"
];

/**
 * Optional fields that may be present
 */
const OPTIONAL_FIELD_NAMES = [
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

export function useStep13Status({ pageData }: UseStep13StatusProps): UseStep13StatusReturn {
  
  // Memoized field statuses calculation
  const fieldStatuses = React.useMemo((): FieldStatus[] => {
    if (!pageData) return [];
    return getFieldStatuses(pageData);
  }, [pageData]);

  // Memoized formatted statuses for UI display
  const formattedStatuses = React.useMemo(() => {
    return fieldStatuses.map(status => formatFieldStatus(status));
  }, [fieldStatuses]);

  // Memoized statistics calculation
  const stats = React.useMemo(() => {
    const requiredStatuses = fieldStatuses.filter(s => s.isRequired);
    const optionalStatuses = fieldStatuses.filter(s => !s.isRequired);
    
    const existingStatuses = fieldStatuses.filter(s => s.status === "exists");
    const missingStatuses = fieldStatuses.filter(s => s.status === "not_exists");
    
    const requiredExisting = requiredStatuses.filter(s => s.status === "exists");
    const requiredMissing = requiredStatuses.filter(s => s.status === "not_exists");
    const optionalExisting = optionalStatuses.filter(s => s.status === "exists");
    const optionalMissing = optionalStatuses.filter(s => s.status === "not_exists");

    return {
      totalFields: fieldStatuses.length,
      requiredFields: requiredStatuses.length,
      optionalFields: optionalStatuses.length,
      existingFields: existingStatuses.length,
      missingFields: missingStatuses.length,
      requiredExisting: requiredExisting.length,
      requiredMissing: requiredMissing.length,
      optionalExisting: optionalExisting.length,
      optionalMissing: optionalMissing.length,
    };
  }, [fieldStatuses]);

  // Memoized status flags
  const statusFlags = React.useMemo(() => {
    const hasRequiredFields = stats.requiredFields > 0;
    const hasAllRequiredFields = stats.requiredMissing === 0 && stats.requiredFields > 0;
    const hasOptionalFields = stats.optionalFields > 0;
    const isDataComplete = hasAllRequiredFields && stats.totalFields > 0;
    const isAlreadyCleaned = pageData ? isDataCleaned(pageData) : false;

    return {
      hasRequiredFields,
      hasAllRequiredFields,
      hasOptionalFields,
      isDataComplete,
      isAlreadyCleaned,
    };
  }, [stats, pageData]);

  // Memoized validation result
  const validationResult = React.useMemo(() => {
    if (!pageData) {
      return { isValid: false, missingFields: ["No page data available"] };
    }
    return validateRequiredFields(pageData);
  }, [pageData]);

  // Utility functions
  const getFieldStatus = React.useCallback((fieldName: string): FieldExistenceStatus => {
    if (!pageData) return "not_exists";
    return checkFieldExists(pageData, fieldName);
  }, [pageData]);

  const getFieldDisplayName = React.useCallback((fieldName: string): string => {
    return formatFieldName(fieldName);
  }, []);

  const isFieldRequired = React.useCallback((fieldName: string): boolean => {
    return REQUIRED_FIELD_NAMES.includes(fieldName);
  }, []);

  return {
    // Field Status Data
    fieldStatuses,
    formattedStatuses,
    
    // Statistics
    stats,
    
    // Status Flags
    ...statusFlags,
    
    // Utilities
    getFieldStatus,
    getFieldDisplayName,
    isFieldRequired,
    
    // Validation
    validationResult,
  };
}

/**
 * Hook variant for specific field monitoring
 */
export function useFieldStatus(pageData: PageData | null, fieldName: string) {
  return React.useMemo(() => {
    if (!pageData) {
      return {
        status: "not_exists" as FieldExistenceStatus,
        exists: false,
        displayName: formatFieldName(fieldName),
        isRequired: REQUIRED_FIELD_NAMES.includes(fieldName),
      };
    }

    const status = checkFieldExists(pageData, fieldName);
    
    return {
      status,
      exists: status === "exists",
      displayName: formatFieldName(fieldName), 
      isRequired: REQUIRED_FIELD_NAMES.includes(fieldName),
    };
  }, [pageData, fieldName]);
}

/**
 * Hook for monitoring data completeness
 */
export function useDataCompleteness(pageData: PageData | null) {
  return React.useMemo(() => {
    if (!pageData) {
      return {
        completeness: 0,
        isComplete: false,
        missingRequired: [],
        presentOptional: [],
      };
    }

    const requiredPresent = REQUIRED_FIELD_NAMES.filter(field => 
      checkFieldExists(pageData, field) === "exists"
    );
    
    const optionalPresent = OPTIONAL_FIELD_NAMES.filter(field =>
      checkFieldExists(pageData, field) === "exists"  
    );

    const missingRequired = REQUIRED_FIELD_NAMES.filter(field =>
      checkFieldExists(pageData, field) === "not_exists"
    );

    const totalFields = REQUIRED_FIELD_NAMES.length + OPTIONAL_FIELD_NAMES.length;
    const presentFields = requiredPresent.length + optionalPresent.length;
    const completeness = Math.round((presentFields / totalFields) * 100);
    
    return {
      completeness,
      isComplete: missingRequired.length === 0,
      missingRequired,
      presentOptional: optionalPresent,
      requiredPresent,
      totalRequired: REQUIRED_FIELD_NAMES.length,
      totalOptional: OPTIONAL_FIELD_NAMES.length,
    };
  }, [pageData]);
}

/**
 * Hook for grouped field status (by category)
 */
export function useGroupedFieldStatus(pageData: PageData | null) {
  return React.useMemo(() => {
    if (!pageData) {
      return {
        required: [],
        optional: [],
        groups: { required: [], optional: [] }
      };
    }

    const fieldStatuses = getFieldStatuses(pageData);
    const required = fieldStatuses.filter(s => s.isRequired);
    const optional = fieldStatuses.filter(s => !s.isRequired);

    return {
      required,
      optional,
      groups: {
        required: required.map(s => formatFieldStatus(s)),
        optional: optional.map(s => formatFieldStatus(s)),
      }
    };
  }, [pageData]);
}
