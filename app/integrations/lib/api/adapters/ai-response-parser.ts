// UUID validation utility
function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Custom data part types for AI SDK v5 compatibility
 */
export type OutputCustomDataPart =
  | {
      type: "data-product";
      id: string;
      data: {
        product_id: string;
      };
    }
  | {
      type: "data-suggestion";
      id: string;
      data: {
        suggestion_id: string;
      };
    };

export type InCommingCustomDataPart =
  | {
      type: "data-product";
      data: {
        product_id: string;
      };
    }
  | {
      type: "data-suggestion";
      id: string;
      data: {
        suggestion_id: string;
      };
    };

/**
 * Result of parsing accumulated text for JSON fragments
 */
export interface ParseResult {
  cleanText: string; // Text with JSON fragments removed
  dataParts: InCommingCustomDataPart[]; // Extracted and validated data parts
}

/**
 * Find matching closing brace considering strings and escaping
 */
function findMatchingBrace(text: string, startIndex: number): number {
  let braceCount = 0;
  let inString = false;
  let escaped = false;

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"' && !escaped) {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === "{") {
        braceCount++;
      } else if (char === "}") {
        braceCount--;
        if (braceCount === 0) {
          return i;
        }
      }
    }
  }

  return -1; // No matching brace found
}

/**
 * Convert JSON data to data part with validation
 */
function convertToDataPart(data: any): InCommingCustomDataPart | null {
  // Handle new format: {"type": "data-product", "data": {"product_id": "..."}}
  if (
    data.type === "data-product" &&
    data.data?.product_id &&
    typeof data.data.product_id === "string"
  ) {
    if (!isValidUUID(data.data.product_id)) {
      console.log(
        `❌ Invalid product_id format (not UUID): ${data.data.product_id}`
      );
      return null; // Invalid UUID format, don't create data part
    }

    return {
      type: "data-product",
      data: { product_id: data.data.product_id },
    };
  }

  // Handle new format: {"type": "data-suggestion", "data": {"suggestion_id": "..."}}
  if (
    data.type === "data-suggestion" &&
    data.data?.suggestion_id &&
    typeof data.data.suggestion_id === "string"
  ) {
    return {
      type: "data-suggestion",
      id:
        data.id ||
        `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data: { suggestion_id: data.data.suggestion_id },
    };
  }

  // Backward compatibility: old format {"product_id": "..."}
  if (data.product_id && typeof data.product_id === "string") {
    if (!isValidUUID(data.product_id)) {
      console.log(
        `❌ Invalid product_id format (not UUID): ${data.product_id}`
      );
      return null;
    }

    return {
      type: "data-product",
      data: { product_id: data.product_id },
    };
  }

  // Backward compatibility: old format {"suggestion_id": "..."}
  if (data.suggestion_id && typeof data.suggestion_id === "string") {
    return {
      type: "data-suggestion",
      id: `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data: { suggestion_id: data.suggestion_id },
    };
  }

  console.log(`⚠️ Unknown data format, keeping as text:`, data);
  return null;
}

/**
 * Remove ALL JSON fragments for streaming (including incomplete ones)
 * This is used during streaming to show clean text without any JSON noise
 */
export function removeAllJsonFragments(text: string): string {
  console.log(
    `🧹 Removing ALL JSON fragments from streaming text (${text.length} chars)`
  );

  let cleanText = "";
  let currentIndex = 0;

  // If no opening brace, return original text
  if (!text.includes("{")) {
    console.log(`✅ No JSON fragments found, returning original text`);
    return text.trim();
  }

  while (currentIndex < text.length) {
    const openBraceIndex = text.indexOf("{", currentIndex);

    if (openBraceIndex === -1) {
      // No more JSON fragments, add remaining text
      const remainingText = text.substring(currentIndex);
      cleanText += remainingText;
      break;
    }

    // Add text before JSON fragment
    const textBefore = text.substring(currentIndex, openBraceIndex);
    cleanText += textBefore;

    // Find matching closing brace
    const closeBraceIndex = findMatchingBrace(text, openBraceIndex);

    if (closeBraceIndex === -1) {
      // Incomplete JSON - remove everything from { to end for clean streaming
      console.log(
        `🗑️ Removing incomplete JSON fragment from position ${openBraceIndex}`
      );
      break; // Stop here, don't add the incomplete JSON
    }

    // Skip the complete JSON fragment (don't add to cleanText)
    const jsonStr = text.substring(openBraceIndex, closeBraceIndex + 1);
    console.log(
      `🗑️ Removing complete JSON fragment: "${jsonStr.substring(0, 50)}${jsonStr.length > 50 ? "..." : ""}"`
    );

    currentIndex = closeBraceIndex + 1;
  }

  const result = cleanText.trim();
  console.log(
    `🧹 JSON removal complete: ${text.length} → ${result.length} chars`
  );
  return result;
}

/**
 * Parse COMPLETE text and extract ONLY complete JSON fragments
 * This is used only in the final message when all text is accumulated
 */
export function parseAccumulatedText(text: string): ParseResult {
  console.log(
    `🔍 Final parsing: extracting data parts from complete text (${text.length} chars)`
  );

  let cleanText = "";
  const dataParts: InCommingCustomDataPart[] = [];
  let currentIndex = 0;

  // If no opening brace, return original text
  if (!text.includes("{")) {
    console.log(`✅ No JSON fragments found in final text`);
    return { cleanText: text.trim(), dataParts: [] };
  }

  while (currentIndex < text.length) {
    const openBraceIndex = text.indexOf("{", currentIndex);

    if (openBraceIndex === -1) {
      // No more JSON fragments, add remaining text
      const remainingText = text.substring(currentIndex);
      cleanText += remainingText;
      break;
    }

    // Add text before JSON fragment
    const textBefore = text.substring(currentIndex, openBraceIndex);
    cleanText += textBefore;

    // Find matching closing brace
    const closeBraceIndex = findMatchingBrace(text, openBraceIndex);

    if (closeBraceIndex === -1) {
      // Incomplete JSON - add as text in final parsing
      const incompleteJson = text.substring(openBraceIndex);
      cleanText += incompleteJson;
      console.log(
        `⚠️ Incomplete JSON in final text, keeping as text: "${incompleteJson.substring(0, 50)}${incompleteJson.length > 50 ? "..." : ""}"`
      );
      break;
    }

    // Extract and try to parse JSON substring
    const jsonStr = text.substring(openBraceIndex, closeBraceIndex + 1);

    try {
      const jsonData = JSON.parse(jsonStr);
      const dataPart = convertToDataPart(jsonData);

      if (dataPart) {
        dataParts.push(dataPart);

        // JSON successfully converted to data part, don't add to clean text
      } else {
        // Invalid data format, add as text
        cleanText += jsonStr;
        console.log(`⚠️ Invalid data part format, keeping as text`);
      }
    } catch (error) {
      // Invalid JSON, add as text
      cleanText += jsonStr;
      console.log(`❌ Invalid JSON format, keeping as text`);
    }

    currentIndex = closeBraceIndex + 1;
  }

  const result = {
    cleanText: cleanText.trim(),
    dataParts,
  };

  console.log(`🎯 Final parsing complete:`, {
    originalLength: text.length,
    cleanTextLength: result.cleanText.length,
    dataPartsFound: result.dataParts.length,
    dataPartTypes: result.dataParts.map((p) => p.type),
  });

  return result;
}

/**
 * Generate unique data part ID
 */
export function generateDataPartId(type: "product" | "suggestion"): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
