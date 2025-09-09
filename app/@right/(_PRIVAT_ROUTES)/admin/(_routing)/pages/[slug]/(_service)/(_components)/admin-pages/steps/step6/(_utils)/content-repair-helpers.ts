// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_utils)/content-repair-helpers.ts

import {
  RootContentStructure,
  ContentStructure,
  TechnicalTag,
} from "@/app/@right/(_service)/(_types)/page-types";

/**
 * ✅ FIXED: Root-level content structure type with H2 enforcement
 * Can only be used at the root level with tag: "h2"
 */
export type RootContentStructureType = {
  id?: string;
  order?: string;
  classification?: "semantic" | "technical" | "hybrid";
  tag: "h2"; // ✅ ENFORCED: Only H2 allowed at root level
  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  attention?: string;
  audiences?: string;
  selfPrompt?: string;
  designDescription?: string;
  connectedDesignSectionId?: string;
  linksToSource?: string[];
  additionalData: {
    minWords: number;
    maxWords: number;
    actualContent: string;
    position?: {
      order?: number;
      depth?: number;
      parentTag?: "h1"; // ✅ Root elements can have page title (H1) as parent
    };
  };
  realContentStructure?: NestedContentStructureType[]; // ✅ Only nested elements allowed
};

/**
 * ✅ FIXED: Nested content structure type without H1/H2
 * Can only be used in nested structures with H3/H4+ tags
 */
export type NestedContentStructureType = {
  id?: string;
  order?: string;
  classification?: "semantic" | "technical" | "hybrid";
  tag?:
    | "h3" // ✅ Only H3+ allowed in nested structures
    | "h4"
    | "p"
    | "ul"
    | "ol"
    | "li"
    | "blockquote"
    | "code"
    | "table"
    | "thead"
    | "tbody"
    | "tr"
    | "td"
    | "th"
    | "img";
  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  attention?: string;
  audiences?: string;
  selfPrompt?: string;
  designDescription?: string;
  connectedDesignSectionId?: string;
  linksToSource?: string[];
  additionalData: {
    minWords: number;
    maxWords: number;
    actualContent: string;
    position?: {
      order?: number;
      depth?: number;
      parentTag?: TechnicalTag; // ✅ Can reference any valid technical tag as parent
    };
  };
  realContentStructure?: NestedContentStructureType[]; // ✅ Recursive nested structure
};

/**
 * ✅ NEW: Union type for repair operations
 */
export type ContentStructureTypeUnion =
  | RootContentStructureType
  | NestedContentStructureType;

/**
 * ✅ UPDATED: Enhanced confidence calculation with H2 compliance checking
 */
export function calculateContentRepairConfidence(
  repairedData: RootContentStructureType[],
  originalData: string
): number {
  let confidence = 0.4;

  if (Array.isArray(repairedData) && repairedData.length > 0) {
    confidence += 0.2;
  }

  // ✅ NEW: Bonus for H2 compliance at root level
  const h2CompliantElements = repairedData.filter((item) => item.tag === "h2");
  const h2ComplianceRatio = h2CompliantElements.length / repairedData.length;
  confidence += h2ComplianceRatio * 0.15; // Significant bonus for H2 compliance

  const validElements = repairedData.filter((item) => {
    return (
      item.additionalData &&
      typeof item.additionalData.actualContent === "string" &&
      typeof item.additionalData.minWords === "number" &&
      typeof item.additionalData.maxWords === "number"
    );
  });

  const validElementsRatio = validElements.length / repairedData.length;
  confidence += validElementsRatio * 0.2;

  const elementsWithIntent = repairedData.filter((item) => item.intent).length;
  const elementsWithKeywords = repairedData.filter(
    (item) => item.keywords?.length && item.keywords.length > 0
  ).length;
  const elementsWithSelfPrompt = repairedData.filter(
    (item) => item.selfPrompt
  ).length;

  if (elementsWithIntent > 0) confidence += 0.05;
  if (elementsWithKeywords > 0) confidence += 0.05;
  if (elementsWithSelfPrompt > 0) confidence += 0.05;

  const logicalWordCounts = validElements.filter(
    (item) =>
      item.additionalData.minWords <= item.additionalData.maxWords &&
      item.additionalData.minWords > 0 &&
      item.additionalData.maxWords > 0
  ).length;

  if (logicalWordCounts === validElements.length && validElements.length > 0) {
    confidence += 0.1;
  }

  // ✅ NEW: Check for nested structure compliance (no H1/H2 in nested)
  const nestedCompliance = validateNestedStructureCompliance(repairedData);
  if (nestedCompliance.isCompliant) {
    confidence += 0.1;
  } else {
    confidence -= nestedCompliance.violations * 0.02;
  }

  const originalWordCount = originalData.split(/\s+/).length;
  if (originalWordCount > 100) confidence += 0.05;
  if (originalWordCount > 500) confidence += 0.05;

  return Math.min(confidence, 1.0);
}

/**
 * ✅ NEW: Validate nested structure compliance
 */
function validateNestedStructureCompliance(data: RootContentStructureType[]): {
  isCompliant: boolean;
  violations: number;
} {
  let violations = 0;

  const checkNested = (items: NestedContentStructureType[] | undefined) => {
    if (!items) return;

    items.forEach((item) => {
      // Check for forbidden H1/H2 tags in nested structure
      if (item.tag && ["h1", "h2"].includes(item.tag)) {
        violations++;
      }

      // Recursively check deeper nesting
      if (item.realContentStructure) {
        checkNested(item.realContentStructure);
      }
    });
  };

  data.forEach((rootItem) => {
    // Root level should be H2 (this is enforced by type)
    if (rootItem.tag !== "h2") {
      violations++;
    }

    // Check nested structure
    if (rootItem.realContentStructure) {
      checkNested(rootItem.realContentStructure);
    }
  });

  return {
    isCompliant: violations === 0,
    violations,
  };
}

/**
 * ✅ UPDATED: Enhanced validation with H2 enforcement and hierarchy checking
 */
export function validateRepairedContentStructure(data: any): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  hierarchyViolations: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const hierarchyViolations: string[] = [];

  if (!Array.isArray(data)) {
    errors.push("Data must be an array of RootContentStructure objects");
    return { isValid: false, errors, warnings, hierarchyViolations };
  }

  if (data.length === 0) {
    warnings.push("Empty RootContentStructure array");
    return { isValid: false, errors, warnings, hierarchyViolations };
  }

  data.forEach((item: any, index: number) => {
    // ✅ CRITICAL: Check H2 enforcement at root level
    if (!item.tag || item.tag !== "h2") {
      hierarchyViolations.push(
        `Root element ${index}: must have tag "h2" (found: "${item.tag || "undefined"}")`
      );
      errors.push(`Root element ${index}: missing required H2 tag`);
    }

    // Validate required additionalData
    if (!item.additionalData) {
      errors.push(`Element ${index}: missing additionalData`);
    } else {
      if (typeof item.additionalData.actualContent !== "string") {
        errors.push(`Element ${index}: actualContent must be string`);
      }
      if (typeof item.additionalData.minWords !== "number") {
        errors.push(`Element ${index}: minWords must be number`);
      }
      if (typeof item.additionalData.maxWords !== "number") {
        errors.push(`Element ${index}: maxWords must be number`);
      }
      if (item.additionalData.minWords > item.additionalData.maxWords) {
        errors.push(
          `Element ${index}: minWords cannot be greater than maxWords`
        );
      }
    }

    // ✅ NEW: Validate nested structure compliance
    if (item.realContentStructure && Array.isArray(item.realContentStructure)) {
      const nestedViolations = validateNestedHierarchy(
        item.realContentStructure,
        `root[${index}].nested`
      );
      hierarchyViolations.push(...nestedViolations);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    hierarchyViolations,
  };
}

/**
 * ✅ NEW: Validate nested hierarchy compliance
 */
function validateNestedHierarchy(structure: any[], path: string): string[] {
  const violations: string[] = [];

  structure.forEach((item, index) => {
    if (item.tag && ["h1", "h2"].includes(item.tag)) {
      violations.push(
        `${path}[${index}]: forbidden tag "${item.tag}" in nested structure`
      );
    }

    // Recursively check deeper nesting
    if (item.realContentStructure && Array.isArray(item.realContentStructure)) {
      const deeperViolations = validateNestedHierarchy(
        item.realContentStructure,
        `${path}[${index}].nested`
      );
      violations.push(...deeperViolations);
    }
  });

  return violations;
}

/**
 * ✅ NEW: Convert ContentStructure array to RootContentStructure with H2 enforcement
 */
export function convertToRootContentStructure(data: ContentStructure[]): {
  rootStructure: RootContentStructureType[];
  violations: string[];
  fixedCount: number;
} {
  const violations: string[] = [];
  let fixedCount = 0;

  const rootStructure: RootContentStructureType[] = data.map((item, index) => {
    let fixedItem = { ...item };

    // ✅ CRITICAL: Enforce H2 tag for root elements
    if (!fixedItem.tag || fixedItem.tag !== "h2") {
      const originalTag = fixedItem.tag || "undefined";
      fixedItem.tag = "h2" as const;
      violations.push(
        `Element [${index}]: tag "${originalTag}" enforced to "h2"`
      );
      fixedCount++;
    }

    // Ensure required additionalData exists
    if (!fixedItem.additionalData) {
      fixedItem.additionalData = {
        minWords: 100,
        maxWords: 300,
        actualContent: `H2 section content`,
      };
      violations.push(`Element [${index}]: created missing additionalData`);
      fixedCount++;
    }

    // Fix nested structure if exists
    if (
      fixedItem.realContentStructure &&
      Array.isArray(fixedItem.realContentStructure)
    ) {
      const nestedResult = convertNestedStructure(
        fixedItem.realContentStructure,
        `[${index}]`
      );
      fixedItem.realContentStructure = nestedResult.nestedStructure;
      violations.push(...nestedResult.violations);
      fixedCount += nestedResult.fixedCount;
    }

    return fixedItem as RootContentStructureType;
  });

  return { rootStructure, violations, fixedCount };
}

/**
 * ✅ NEW: Convert nested ContentStructure removing H1/H2 tags
 */
function convertNestedStructure(
  data: ContentStructure[],
  pathPrefix: string
): {
  nestedStructure: NestedContentStructureType[];
  violations: string[];
  fixedCount: number;
} {
  const violations: string[] = [];
  let fixedCount = 0;

  const nestedStructure: NestedContentStructureType[] = data.map(
    (item, index) => {
      let fixedItem = { ...item };

      // ✅ CRITICAL: Fix H1/H2 tags in nested structure
      if (fixedItem.tag && ["h1", "h2"].includes(fixedItem.tag)) {
        const originalTag = fixedItem.tag;
        fixedItem.tag = "h3" as const; // Convert to H3
        violations.push(
          `${pathPrefix}.nested[${index}]: forbidden tag "${originalTag}" fixed to "h3"`
        );
        fixedCount++;
      }

      // Recursively fix deeper nesting
      if (
        fixedItem.realContentStructure &&
        Array.isArray(fixedItem.realContentStructure)
      ) {
        const deeperResult = convertNestedStructure(
          fixedItem.realContentStructure,
          `${pathPrefix}.nested[${index}]`
        );
        fixedItem.realContentStructure = deeperResult.nestedStructure;
        violations.push(...deeperResult.violations);
        fixedCount += deeperResult.fixedCount;
      }

      return fixedItem as NestedContentStructureType;
    }
  );

  return { nestedStructure, violations, fixedCount };
}

/**
 * ✅ NEW: Type guards for structure validation
 */
export function isRootContentStructure(
  item: any
): item is RootContentStructureType {
  return (
    item &&
    typeof item === "object" &&
    item.tag === "h2" &&
    item.additionalData &&
    typeof item.additionalData.actualContent === "string"
  );
}

export function isNestedContentStructure(
  item: any
): item is NestedContentStructureType {
  return (
    item &&
    typeof item === "object" &&
    (!item.tag || (item.tag !== "h1" && item.tag !== "h2")) &&
    item.additionalData
  );
}

/**
 * ✅ NEW: Generate compliance report for repair results
 */
export function generateH2ComplianceReport(data: RootContentStructureType[]): {
  isFullyCompliant: boolean;
  rootElementsCount: number;
  h2CompliantCount: number;
  nestedViolationsCount: number;
  summary: string;
  violations: string[];
} {
  const violations: string[] = [];
  const rootElementsCount = data.length;
  const h2CompliantCount = data.filter((item) => item.tag === "h2").length;

  let nestedViolationsCount = 0;

  // Check for nested violations
  const checkNestedViolations = (
    items: NestedContentStructureType[] | undefined,
    path: string
  ) => {
    if (!items) return;

    items.forEach((item, index) => {
      if (item.tag && ["h1", "h2"].includes(item.tag)) {
        violations.push(
          `${path}[${index}]: forbidden "${item.tag}" tag in nested structure`
        );
        nestedViolationsCount++;
      }

      if (item.realContentStructure) {
        checkNestedViolations(
          item.realContentStructure,
          `${path}[${index}].nested`
        );
      }
    });
  };

  data.forEach((rootItem, index) => {
    if (rootItem.tag !== "h2") {
      violations.push(
        `Root element [${index}]: should have "h2" tag (has: "${rootItem.tag}")`
      );
    }

    if (rootItem.realContentStructure) {
      checkNestedViolations(
        rootItem.realContentStructure,
        `root[${index}].nested`
      );
    }
  });

  const isFullyCompliant = violations.length === 0;
  const summary = isFullyCompliant
    ? `✅ Fully H2-compliant: ${rootElementsCount} root elements, all with H2 tags`
    : `⚠️ H2 violations found: ${violations.length} issues in structure hierarchy`;

  return {
    isFullyCompliant,
    rootElementsCount,
    h2CompliantCount,
    nestedViolationsCount,
    summary,
    violations,
  };
}

/**
 * ✅ NEW: Auto-fix structure to ensure H2 compliance
 */
export function autoFixH2Compliance(data: any[]): {
  fixed: RootContentStructureType[];
  violations: string[];
  fixedCount: number;
  complianceReport: ReturnType<typeof generateH2ComplianceReport>;
} {
  const result = convertToRootContentStructure(data);
  const complianceReport = generateH2ComplianceReport(result.rootStructure);

  return {
    fixed: result.rootStructure,
    violations: result.violations,
    fixedCount: result.fixedCount,
    complianceReport,
  };
}

// ✅ DEPRECATED: Legacy type for backward compatibility
// @deprecated Use RootContentStructureType instead
export type ContentStructureType = RootContentStructureType;
