// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_utils)/content-structure-validator.ts

import {
  ContentStructure,
  TechnicalTag,
} from "@/app/@right/(_service)/(_types)/page-types";
import {
  ContentValidationError,
  ContentValidationResult,
} from "../(_types)/content-repair-types";

/**
 * Валидатор для ContentStructure массивов
 * Проверяет соответствие структуры требованиям типизации
 */
export class ContentStructureValidator {
  private static readonly REQUIRED_FIELDS = ["additionalData"] as const;

  private static readonly REQUIRED_ADDITIONAL_DATA_FIELDS = [
    "minWords",
    "maxWords",
    "actualContent",
  ] as const;

  private static readonly VALID_TECHNICAL_TAGS: TechnicalTag[] = [
    "h2",
    "h3",
    "h4",
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

  /**
   * Основная функция валидации ContentStructure массива
   */
  public static validateContentStructure(data: any): ContentValidationResult {
    const errors: ContentValidationError[] = [];
    const warnings: ContentValidationError[] = [];

    // Проверка что это массив
    if (!Array.isArray(data)) {
      errors.push({
        field: "root",
        message: "Data must be an array of ContentStructure objects",
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
        message: "Empty ContentStructure array",
        severity: "warning",
      });
    }

    // Валидация каждого элемента
    data.forEach((item, index) => {
      const itemErrors = this.validateContentStructureItem(item, index);
      errors.push(...itemErrors.filter((e) => e.severity === "error"));
      warnings.push(...itemErrors.filter((e) => e.severity === "warning"));
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      elementsCount: data.length,
    };
  }

  /**
   * Валидация отдельного элемента ContentStructure
   */
  private static validateContentStructureItem(
    item: any,
    index: number
  ): ContentValidationError[] {
    const errors: ContentValidationError[] = [];

    if (!item || typeof item !== "object") {
      errors.push({
        field: `[${index}]`,
        message: "Item must be an object",
        index,
        severity: "error",
      });
      return errors;
    }

    // Проверка обязательных полей
    this.REQUIRED_FIELDS.forEach((field) => {
      if (!(field in item)) {
        errors.push({
          field: `[${index}].${field}`,
          message: `Required field '${field}' is missing`,
          index,
          severity: "error",
        });
      }
    });

    // Проверка additionalData
    if (item.additionalData) {
      const additionalDataErrors = this.validateAdditionalData(
        item.additionalData,
        index
      );
      errors.push(...additionalDataErrors);
    }

    // Проверка тега
    if (item.tag && !this.VALID_TECHNICAL_TAGS.includes(item.tag)) {
      errors.push({
        field: `[${index}].tag`,
        message: `Invalid tag '${item.tag}'. Must be one of: ${this.VALID_TECHNICAL_TAGS.join(", ")}`,
        index,
        severity: "warning",
      });
    }

    // Проверка keywords
    if (item.keywords && !Array.isArray(item.keywords)) {
      errors.push({
        field: `[${index}].keywords`,
        message: "Keywords must be an array of strings",
        index,
        severity: "error",
      });
    }

    // Проверка строковых полей
    const stringFields = [
      "intent",
      "taxonomy",
      "attention",
      "audiences",
      "selfPrompt",
    ];
    stringFields.forEach((field) => {
      if (item[field] && typeof item[field] !== "string") {
        errors.push({
          field: `[${index}].${field}`,
          message: `Field '${field}' must be a string`,
          index,
          severity: "error",
        });
      }
    });

    // Проверка вложенной структуры
    if (item.realContentStructure) {
      if (!Array.isArray(item.realContentStructure)) {
        errors.push({
          field: `[${index}].realContentStructure`,
          message: "realContentStructure must be an array",
          index,
          severity: "error",
        });
      } else {
        // Рекурсивная проверка
        const nestedErrors = this.validateContentStructure(
          item.realContentStructure
        );
        nestedErrors.errors.forEach((error) => {
          errors.push({
            ...error,
            field: `[${index}].realContentStructure.${error.field}`,
          });
        });
      }
    }

    return errors;
  }

  /**
   * Валидация поля additionalData
   */
  private static validateAdditionalData(
    additionalData: any,
    parentIndex: number
  ): ContentValidationError[] {
    const errors: ContentValidationError[] = [];

    if (!additionalData || typeof additionalData !== "object") {
      errors.push({
        field: `[${parentIndex}].additionalData`,
        message: "additionalData must be an object",
        index: parentIndex,
        severity: "error",
      });
      return errors;
    }

    // Проверка обязательных полей
    this.REQUIRED_ADDITIONAL_DATA_FIELDS.forEach((field) => {
      if (!(field in additionalData)) {
        errors.push({
          field: `[${parentIndex}].additionalData.${field}`,
          message: `Required field '${field}' is missing in additionalData`,
          index: parentIndex,
          severity: "error",
        });
      }
    });

    // Проверка типов
    if (typeof additionalData.minWords !== "number") {
      errors.push({
        field: `[${parentIndex}].additionalData.minWords`,
        message: "minWords must be a number",
        index: parentIndex,
        severity: "error",
      });
    }

    if (typeof additionalData.maxWords !== "number") {
      errors.push({
        field: `[${parentIndex}].additionalData.maxWords`,
        message: "maxWords must be a number",
        index: parentIndex,
        severity: "error",
      });
    }

    if (typeof additionalData.actualContent !== "string") {
      errors.push({
        field: `[${parentIndex}].additionalData.actualContent`,
        message: "actualContent must be a string",
        index: parentIndex,
        severity: "error",
      });
    }

    // Логические проверки
    if (
      typeof additionalData.minWords === "number" &&
      typeof additionalData.maxWords === "number" &&
      additionalData.minWords > additionalData.maxWords
    ) {
      errors.push({
        field: `[${parentIndex}].additionalData`,
        message: "minWords cannot be greater than maxWords",
        index: parentIndex,
        severity: "error",
      });
    }

    // Проверка position если существует
    if (additionalData.position) {
      const positionErrors = this.validatePosition(
        additionalData.position,
        parentIndex
      );
      errors.push(...positionErrors);
    }

    return errors;
  }

  /**
   * Валидация поля position
   */
  private static validatePosition(
    position: any,
    parentIndex: number
  ): ContentValidationError[] {
    const errors: ContentValidationError[] = [];

    if (!position || typeof position !== "object") {
      errors.push({
        field: `[${parentIndex}].additionalData.position`,
        message: "position must be an object",
        index: parentIndex,
        severity: "error",
      });
      return errors;
    }

    if (position.order !== undefined && typeof position.order !== "number") {
      errors.push({
        field: `[${parentIndex}].additionalData.position.order`,
        message: "order must be a number",
        index: parentIndex,
        severity: "error",
      });
    }

    if (position.depth !== undefined && typeof position.depth !== "number") {
      errors.push({
        field: `[${parentIndex}].additionalData.position.depth`,
        message: "depth must be a number",
        index: parentIndex,
        severity: "error",
      });
    }

    if (
      position.parentTag &&
      !this.VALID_TECHNICAL_TAGS.includes(position.parentTag)
    ) {
      errors.push({
        field: `[${parentIndex}].additionalData.position.parentTag`,
        message: `Invalid parentTag '${position.parentTag}'`,
        index: parentIndex,
        severity: "warning",
      });
    }

    return errors;
  }

  /**
   * Попытка автоматического исправления простых ошибок
   */
  public static autoFixContentStructure(data: any[]): {
    fixed: ContentStructure[];
    fixedCount: number;
  } {
    const fixed: ContentStructure[] = [];
    let fixedCount = 0;

    data.forEach((item) => {
      const fixedItem = { ...item };

      // Исправление отсутствующего additionalData
      if (!fixedItem.additionalData) {
        fixedItem.additionalData = {
          minWords: 0,
          maxWords: 100,
          actualContent: fixedItem.actualContent || "",
        };
        fixedCount++;
      }

      // Исправление типов в additionalData
      if (fixedItem.additionalData) {
        if (typeof fixedItem.additionalData.minWords !== "number") {
          fixedItem.additionalData.minWords = 0;
          fixedCount++;
        }
        if (typeof fixedItem.additionalData.maxWords !== "number") {
          fixedItem.additionalData.maxWords = 100;
          fixedCount++;
        }
        if (typeof fixedItem.additionalData.actualContent !== "string") {
          fixedItem.additionalData.actualContent = "";
          fixedCount++;
        }
      }

      // Исправление массива keywords
      if (fixedItem.keywords && !Array.isArray(fixedItem.keywords)) {
        fixedItem.keywords = [];
        fixedCount++;
      }

      fixed.push(fixedItem);
    });

    return {
      fixed,
      fixedCount,
    };
  }

  /**
   * Получение человекочитаемого описания ошибки
   */
  public static getErrorSummary(result: ContentValidationResult): string {
    if (result.isValid) {
      return `✅ Validation successful: ${result.elementsCount} elements validated`;
    }

    const errorCount = result.errors.length;
    const warningCount = result.warnings.length;

    return `❌ Validation failed: ${errorCount} errors, ${warningCount} warnings in ${result.elementsCount} elements`;
  }
}
