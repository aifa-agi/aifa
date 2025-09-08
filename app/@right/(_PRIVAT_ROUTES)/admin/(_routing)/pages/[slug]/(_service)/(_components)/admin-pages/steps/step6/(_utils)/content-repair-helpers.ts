// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_utils)/content-repair-helpers.ts

export function calculateContentRepairConfidence(
  repairedData: ContentStructureType[],
  originalData: string
): number {
  let confidence = 0.4;

  if (Array.isArray(repairedData) && repairedData.length > 0) {
    confidence += 0.2;
  }

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

  const originalWordCount = originalData.split(/\s+/).length;
  if (originalWordCount > 100) confidence += 0.05;
  if (originalWordCount > 500) confidence += 0.05;

  return Math.min(confidence, 1.0);
}

/**
 * Валидация восстановленной ContentStructure
 */
export function validateRepairedContentStructure(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    errors.push("Data must be an array");
    return { isValid: false, errors };
  }

  if (data.length === 0) {
    errors.push("Array cannot be empty");
    return { isValid: false, errors };
  }

  data.forEach((item: any, index: number) => {
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
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export type ContentStructureType = {
  classification?: "semantic" | "technical" | "hybrid";
  tag?:
    | "h1"
    | "h2"
    | "h3"
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
      parentTag?:
        | "h1"
        | "h2"
        | "h3"
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
    };
  };
  realContentStructure?: ContentStructureType[];
};
