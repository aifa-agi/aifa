// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_utils)/content-structure-validator.ts

import {
  ContentStructure,
  RootContentStructure,
  TechnicalTag,
} from "@/app/@right/(_service)/(_types)/page-types";
import {
  ContentValidationError,
  ContentValidationResult,
} from "../(_types)/content-repair-types";

/**
 * Enhanced validator for ContentStructure arrays with H2 semantic hierarchy enforcement
 * Enforces strict heading distribution: H1(page) → H2(root) → H3+(nested)
 */
export class ContentStructureValidator {
  private static readonly REQUIRED_FIELDS = ["additionalData"] as const;

  private static readonly REQUIRED_ADDITIONAL_DATA_FIELDS = [
    "minWords",
    "maxWords",
    "actualContent",
  ] as const;

  // ✅ FIXED: Removed H1/H2 from nested element validation
  private static readonly VALID_NESTED_TAGS: TechnicalTag[] = [
    "h3", // ✅ Third-level headings only
    "h4", // ✅ Fourth-level headings only
    "p",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
    "img",
  ];

  // ✅ NEW: Root element tag validation (H2 only)
  private static readonly VALID_ROOT_TAG = "h2" as const;

  /**
   * ✅ NEW: Validate RootContentStructure array with H2 enforcement
   */
  public static validateRootContentStructure(
    data: any
  ): ContentValidationResult & {
    validRootStructure?: RootContentStructure[];
    fixedViolations?: string[];
  } {
    const errors: ContentValidationError[] = [];
    const warnings: ContentValidationError[] = [];
    const fixedViolations: string[] = [];

    if (!Array.isArray(data)) {
      errors.push({
        field: "root",
        message: "Data must be an array of RootContentStructure objects",
        severity: "error",
      });
      return {
        isValid: false,
        errors,
        warnings,
        elementsCount: 0,
      };
    }

    if (data.length === 0) {
      warnings.push({
        field: "root",
        message: "Empty RootContentStructure array",
        severity: "warning",
      });
    }

    // Validate and fix each root element
    const validRootStructure: RootContentStructure[] = [];

    data.forEach((item, index) => {
      const itemResult = this.validateAndFixRootElement(item, index);
      errors.push(...itemResult.errors);
      warnings.push(...itemResult.warnings);

      if (itemResult.fixedElement) {
        validRootStructure.push(itemResult.fixedElement);
        if (itemResult.violations.length > 0) {
          fixedViolations.push(...itemResult.violations);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      elementsCount: data.length,
      validRootStructure:
        validRootStructure.length > 0 ? validRootStructure : undefined,
      fixedViolations: fixedViolations.length > 0 ? fixedViolations : undefined,
    };
  }

  /**
   * ✅ NEW: Validate and fix individual root element with H2 enforcement
   */
  private static validateAndFixRootElement(
    item: any,
    index: number
  ): {
    errors: ContentValidationError[];
    warnings: ContentValidationError[];
    fixedElement?: RootContentStructure;
    violations: string[];
  } {
    const errors: ContentValidationError[] = [];
    const warnings: ContentValidationError[] = [];
    const violations: string[] = [];

    if (!item || typeof item !== "object") {
      errors.push({
        field: `[${index}]`,
        message: "Root element must be an object",
        index,
        severity: "error",
      });
      return { errors, warnings, violations };
    }

    let fixedItem = { ...item };

    // ✅ CRITICAL: Enforce H2 tag for root elements
    if (!fixedItem.tag || fixedItem.tag !== this.VALID_ROOT_TAG) {
      const originalTag = fixedItem.tag || "undefined";
      fixedItem.tag = this.VALID_ROOT_TAG;
      violations.push(
        `Root element [${index}]: tag "${originalTag}" fixed to "h2"`
      );
      warnings.push({
        field: `[${index}].tag`,
        message: `Root element tag enforced to "h2" (was: "${originalTag}")`,
        index,
        severity: "warning",
      });
    }

    // Check required fields
    this.REQUIRED_FIELDS.forEach((field) => {
      if (!(field in fixedItem)) {
        errors.push({
          field: `[${index}].${field}`,
          message: `Required field '${field}' is missing`,
          index,
          severity: "error",
        });
      }
    });

    // Validate additionalData
    if (fixedItem.additionalData) {
      const additionalDataResult = this.validateAdditionalData(
        fixedItem.additionalData,
        index
      );
      errors.push(...additionalDataResult);
    } else {
      // Create default additionalData if missing
      fixedItem.additionalData = {
        minWords: 100,
        maxWords: 300,
        actualContent: `Section content for ${fixedItem.taxonomy || "content"}`,
      };
      violations.push(
        `Root element [${index}]: missing additionalData created`
      );
    }

    // Validate keywords array
    if (fixedItem.keywords && !Array.isArray(fixedItem.keywords)) {
      fixedItem.keywords = [];
      violations.push(`Root element [${index}]: keywords converted to array`);
    }

    // Validate string fields
    const stringFields = [
      "intent",
      "taxonomy",
      "attention",
      "audiences",
      "selfPrompt",
    ];
    stringFields.forEach((field) => {
      if (fixedItem[field] && typeof fixedItem[field] !== "string") {
        errors.push({
          field: `[${index}].${field}`,
          message: `Field '${field}' must be a string`,
          index,
          severity: "error",
        });
      }
    });

    // ✅ CRITICAL: Validate nested structure (must not contain H1/H2)
    if (fixedItem.realContentStructure) {
      if (!Array.isArray(fixedItem.realContentStructure)) {
        errors.push({
          field: `[${index}].realContentStructure`,
          message: "realContentStructure must be an array",
          index,
          severity: "error",
        });
      } else {
        const nestedResult = this.validateNestedStructure(
          fixedItem.realContentStructure,
          `[${index}].realContentStructure`
        );
        errors.push(...nestedResult.errors);
        warnings.push(...nestedResult.warnings);
        fixedItem.realContentStructure = nestedResult.fixedStructure;
        violations.push(...nestedResult.violations);
      }
    }

    const typedFixedItem: RootContentStructure =
      fixedItem as RootContentStructure;

    return {
      errors,
      warnings,
      fixedElement: errors.length === 0 ? typedFixedItem : undefined,
      violations,
    };
  }

  /**
   * ✅ NEW: Validate nested structure ensuring no H1/H2 tags
   */
  private static validateNestedStructure(
    structure: ContentStructure[],
    path: string
  ): {
    errors: ContentValidationError[];
    warnings: ContentValidationError[];
    fixedStructure: ContentStructure[];
    violations: string[];
  } {
    const errors: ContentValidationError[] = [];
    const warnings: ContentValidationError[] = [];
    const violations: string[] = [];
    const fixedStructure: ContentStructure[] = [];

    structure.forEach((item, index) => {
      if (!item || typeof item !== "object") {
        errors.push({
          field: `${path}[${index}]`,
          message: "Nested element must be an object",
          severity: "error",
        });
        return;
      }

      let fixedItem = { ...item };

      // ✅ CRITICAL: Fix forbidden H1/H2 tags in nested structure
      if (fixedItem.tag && ["h1", "h2"].includes(fixedItem.tag)) {
        const originalTag = fixedItem.tag;
        fixedItem.tag = "h3"; // Convert H1/H2 to H3 in nested structure
        violations.push(
          `${path}[${index}]: forbidden tag "${originalTag}" fixed to "h3"`
        );
        warnings.push({
          field: `${path}[${index}].tag`,
          message: `Forbidden tag "${originalTag}" in nested structure, fixed to "h3"`,
          severity: "warning",
        });
      }

      // Validate tag is in allowed nested tags
      if (
        fixedItem.tag &&
        !this.VALID_NESTED_TAGS.includes(fixedItem.tag as TechnicalTag)
      ) {
        warnings.push({
          field: `${path}[${index}].tag`,
          message: `Invalid nested tag '${fixedItem.tag}'. Allowed: ${this.VALID_NESTED_TAGS.join(", ")}`,
          severity: "warning",
        });
      }

      // Validate additionalData
      if (fixedItem.additionalData) {
        const additionalDataErrors = this.validateAdditionalData(
          fixedItem.additionalData,
          index,
          path
        );
        errors.push(...additionalDataErrors);
      }

      // Recursively validate deeper nesting
      if (fixedItem.realContentStructure) {
        if (Array.isArray(fixedItem.realContentStructure)) {
          const deeperResult = this.validateNestedStructure(
            fixedItem.realContentStructure,
            `${path}[${index}].realContentStructure`
          );
          errors.push(...deeperResult.errors);
          warnings.push(...deeperResult.warnings);
          fixedItem.realContentStructure = deeperResult.fixedStructure;
          violations.push(...deeperResult.violations);
        }
      }

      fixedStructure.push(fixedItem);
    });

    return { errors, warnings, fixedStructure, violations };
  }

  /**
   * ✅ UPDATED: Enhanced additionalData validation
   */
  private static validateAdditionalData(
    additionalData: any,
    parentIndex: number,
    pathPrefix?: string
  ): ContentValidationError[] {
    const errors: ContentValidationError[] = [];
    const fieldPath = pathPrefix
      ? `${pathPrefix}[${parentIndex}]`
      : `[${parentIndex}]`;

    if (!additionalData || typeof additionalData !== "object") {
      errors.push({
        field: `${fieldPath}.additionalData`,
        message: "additionalData must be an object",
        index: parentIndex,
        severity: "error",
      });
      return errors;
    }

    // Check required fields
    this.REQUIRED_ADDITIONAL_DATA_FIELDS.forEach((field) => {
      if (!(field in additionalData)) {
        errors.push({
          field: `${fieldPath}.additionalData.${field}`,
          message: `Required field '${field}' is missing in additionalData`,
          index: parentIndex,
          severity: "error",
        });
      }
    });

    // Type validation
    if (typeof additionalData.minWords !== "number") {
      errors.push({
        field: `${fieldPath}.additionalData.minWords`,
        message: "minWords must be a number",
        index: parentIndex,
        severity: "error",
      });
    }

    if (typeof additionalData.maxWords !== "number") {
      errors.push({
        field: `${fieldPath}.additionalData.maxWords`,
        message: "maxWords must be a number",
        index: parentIndex,
        severity: "error",
      });
    }

    if (typeof additionalData.actualContent !== "string") {
      errors.push({
        field: `${fieldPath}.additionalData.actualContent`,
        message: "actualContent must be a string",
        index: parentIndex,
        severity: "error",
      });
    }

    // Logical validation
    if (
      typeof additionalData.minWords === "number" &&
      typeof additionalData.maxWords === "number" &&
      additionalData.minWords > additionalData.maxWords
    ) {
      errors.push({
        field: `${fieldPath}.additionalData`,
        message: "minWords cannot be greater than maxWords",
        index: parentIndex,
        severity: "error",
      });
    }

    // Validate position if exists
    if (additionalData.position) {
      const positionErrors = this.validatePosition(
        additionalData.position,
        parentIndex,
        fieldPath
      );
      errors.push(...positionErrors);
    }

    return errors;
  }

  /**
   * ✅ UPDATED: Enhanced position validation
   */
  private static validatePosition(
    position: any,
    parentIndex: number,
    pathPrefix: string
  ): ContentValidationError[] {
    const errors: ContentValidationError[] = [];

    if (!position || typeof position !== "object") {
      errors.push({
        field: `${pathPrefix}.additionalData.position`,
        message: "position must be an object",
        index: parentIndex,
        severity: "error",
      });
      return errors;
    }

    if (position.order !== undefined && typeof position.order !== "number") {
      errors.push({
        field: `${pathPrefix}.additionalData.position.order`,
        message: "order must be a number",
        index: parentIndex,
        severity: "error",
      });
    }

    if (position.depth !== undefined && typeof position.depth !== "number") {
      errors.push({
        field: `${pathPrefix}.additionalData.position.depth`,
        message: "depth must be a number",
        index: parentIndex,
        severity: "error",
      });
    }

    // ✅ FIXED: Only validate against nested tags (no H1/H2)
    if (
      position.parentTag &&
      !this.VALID_NESTED_TAGS.includes(position.parentTag)
    ) {
      errors.push({
        field: `${pathPrefix}.additionalData.position.parentTag`,
        message: `Invalid parentTag '${position.parentTag}'. Must be one of: ${this.VALID_NESTED_TAGS.join(", ")}`,
        index: parentIndex,
        severity: "warning",
      });
    }

    return errors;
  }

  /**
   * ✅ NEW: Convert ContentStructure[] to RootContentStructure[] with H2 enforcement
   */
  public static convertToRootStructure(data: ContentStructure[]): {
    rootStructure: RootContentStructure[];
    violations: string[];
  } {
    const violations: string[] = [];

    const rootStructure: RootContentStructure[] = data.map((item, index) => {
      const fixedItem = { ...item };

      // Force H2 tag for root elements
      if (!fixedItem.tag || fixedItem.tag !== "h2") {
        const originalTag = fixedItem.tag || "undefined";
        fixedItem.tag = "h2";
        violations.push(
          `Element [${index}]: tag "${originalTag}" enforced to "h2" for root structure`
        );
      }

      // Ensure required additionalData exists
      if (!fixedItem.additionalData) {
        fixedItem.additionalData = {
          minWords: 100,
          maxWords: 300,
          actualContent: `H2 section content`,
        };
        violations.push(`Element [${index}]: created missing additionalData`);
      }

      return fixedItem as RootContentStructure;
    });

    return { rootStructure, violations };
  }

  /**
   * ✅ UPDATED: Auto-fix with H2 enforcement
   */
  public static autoFixContentStructure(data: any[]): {
    fixed: RootContentStructure[];
    fixedCount: number;
    violations: string[];
  } {
    const fixed: RootContentStructure[] = [];
    const violations: string[] = [];
    let fixedCount = 0;

    data.forEach((item, index) => {
      const fixedItem = { ...item };

      // ✅ CRITICAL: Force H2 tag for all root elements
      if (!fixedItem.tag || fixedItem.tag !== "h2") {
        const originalTag = fixedItem.tag || "undefined";
        fixedItem.tag = "h2";
        violations.push(
          `Element [${index}]: tag "${originalTag}" enforced to "h2"`
        );
        fixedCount++;
      }

      // Fix missing additionalData
      if (!fixedItem.additionalData) {
        fixedItem.additionalData = {
          minWords: 100,
          maxWords: 300,
          actualContent: fixedItem.actualContent || "H2 section content",
        };
        violations.push(`Element [${index}]: created missing additionalData`);
        fixedCount++;
      }

      // Fix types in additionalData
      if (fixedItem.additionalData) {
        if (typeof fixedItem.additionalData.minWords !== "number") {
          fixedItem.additionalData.minWords = 100;
          fixedCount++;
        }
        if (typeof fixedItem.additionalData.maxWords !== "number") {
          fixedItem.additionalData.maxWords = 300;
          fixedCount++;
        }
        if (typeof fixedItem.additionalData.actualContent !== "string") {
          fixedItem.additionalData.actualContent = "H2 section content";
          fixedCount++;
        }
      }

      // Fix keywords array
      if (fixedItem.keywords && !Array.isArray(fixedItem.keywords)) {
        fixedItem.keywords = [];
        fixedCount++;
      }

      fixed.push(fixedItem as RootContentStructure);
    });

    return { fixed, violations, fixedCount };
  }

  /**
   * ✅ UPDATED: Enhanced error summary with H2 compliance info
   */
  public static getErrorSummary(result: ContentValidationResult): string {
    if (result.isValid) {
      return `✅ H2-compliant validation successful: ${result.elementsCount} root elements validated`;
    }

    const errorCount = result.errors.length;
    const warningCount = result.warnings.length;

    return `❌ H2 validation failed: ${errorCount} errors, ${warningCount} warnings in ${result.elementsCount} elements`;
  }

  /**
   * ✅ NEW: Type guard for RootContentStructure
   */
  public static isValidRootElement(item: any): item is RootContentStructure {
    return (
      item &&
      typeof item === "object" &&
      item.tag === "h2" &&
      item.additionalData &&
      typeof item.additionalData.actualContent === "string"
    );
  }

  /**
   * ✅ NEW: Validate semantic hierarchy compliance
   */
  public static validateSemanticHierarchy(structure: any[]): {
    isCompliant: boolean;
    violations: string[];
    suggestions: string[];
  } {
    const violations: string[] = [];
    const suggestions: string[] = [];

    structure.forEach((item, index) => {
      // Root level must be H2
      if (!item.tag || item.tag !== "h2") {
        violations.push(
          `Root element [${index}]: must have tag "h2" (found: "${item.tag || "undefined"}")`
        );
        suggestions.push(`Set tag to "h2" for root element [${index}]`);
      }

      // Check nested structure
      if (
        item.realContentStructure &&
        Array.isArray(item.realContentStructure)
      ) {
        this.checkNestedHierarchy(
          item.realContentStructure,
          `root[${index}].nested`,
          violations,
          suggestions
        );
      }
    });

    return {
      isCompliant: violations.length === 0,
      violations,
      suggestions,
    };
  }

  /**
   * ✅ NEW: Check nested hierarchy compliance
   */
  private static checkNestedHierarchy(
    structure: any[],
    path: string,
    violations: string[],
    suggestions: string[]
  ): void {
    structure.forEach((item, index) => {
      if (item.tag && ["h1", "h2"].includes(item.tag)) {
        violations.push(
          `${path}[${index}]: forbidden tag "${item.tag}" in nested structure`
        );
        suggestions.push(
          `Change tag from "${item.tag}" to "h3" in ${path}[${index}]`
        );
      }

      if (
        item.realContentStructure &&
        Array.isArray(item.realContentStructure)
      ) {
        this.checkNestedHierarchy(
          item.realContentStructure,
          `${path}[${index}].nested`,
          violations,
          suggestions
        );
      }
    });
  }
}
