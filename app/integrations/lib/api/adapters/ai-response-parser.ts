import { prisma } from "@/lib/db";

/**
 * Streaming message interface for AI responses
 */
interface StreamingMessage {
  type: "append-message" | "update-message";
  message: {
    id: string;
    role: "assistant";
    createdAt: string; // ISO 8601
    parts: MessagePart[];
  };
}

/**
 * Message part types
 */
type MessagePart = TextPart | ProductPart | SuggestionPart;

interface TextPart {
  type: "text";
  text: string;
}

interface ProductPart {
  type: "data-product";
  id: string;
  data: {
    product_id: string;
  };
}

interface SuggestionPart {
  type: "data-suggestion";
  id: string;
  data: {
    suggestion_id: string;
  };
}

/**
 * Internal types for processing (before database enrichment)
 */
export type CustomDataPart =
  | {
      type: "data-product";
      id: string;
      data: {
        product_name: string;
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
  dataParts: CustomDataPart[]; // Extracted and validated data parts
}

/**
 * DB-only logging utility
 */
function logDB(message: string, data?: any) {
  if (data) {
    console.log(`🔥 DB: ${message}`, data);
  } else {
    console.log(`🔥 DB: ${message}`);
  }
}

/**
 * Utility function to validate product name
 */
function isValidProductName(str: string): boolean {
  return (
    typeof str === "string" && str.trim().length > 0 && str.trim().length <= 200
  );
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

  return -1;
}

/**
 * Convert JSON data to data part with validation
 */
function convertToDataPart(data: any): CustomDataPart | null {
  // Handle new format: {"type": "data-product", "data": {"product_name": "..."}}
  if (
    data.type === "data-product" &&
    data.data?.product_name &&
    typeof data.data.product_name === "string"
  ) {
    if (!isValidProductName(data.data.product_name)) {
      return null;
    }

    return {
      type: "data-product",
      id:
        data.id ||
        `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data: { product_name: data.data.product_name.trim() },
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

  // Backward compatibility: old format {"product_name": "..."}
  if (data.product_name && typeof data.product_name === "string") {
    if (!isValidProductName(data.product_name)) {
      return null;
    }

    return {
      type: "data-product",
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data: { product_name: data.product_name.trim() },
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

  return null;
}

/**
 * Get product ID from database by product name
 */
async function getProductIdByName(productName: string): Promise<string | null> {
  try {
    const trimmedName = productName.trim();

    if (!trimmedName) {
      return null;
    }

    logDB(`Query: "${trimmedName}"`);

    const product = await prisma.product.findFirst({
      where: {
        productInfo: {
          path: ["name"],
          equals: trimmedName,
        },
      },
      select: {
        id: true,
      },
    });

    if (product) {
      logDB(`Found: "${trimmedName}" → ${product.id}`);
      return product.id;
    } else {
      logDB(`Not found: "${trimmedName}"`);
      return null;
    }
  } catch (error) {
    logDB(`Error: "${productName}"`, error);
    return null;
  }
}

/**
 * Get multiple product IDs optimized
 */
async function getProductIdsByNames(
  productNames: string[]
): Promise<Map<string, string>> {
  try {
    const trimmedNames = productNames
      .map((name) => name.trim())
      .filter(Boolean);

    if (trimmedNames.length === 0) {
      return new Map();
    }

    logDB(`Bulk query: ${trimmedNames.length} products`);

    const products = await prisma.product.findMany({
      where: {
        OR: trimmedNames.map((name) => ({
          productInfo: {
            path: ["name"],
            equals: name,
          },
        })),
      },
      select: {
        id: true,
        productInfo: true,
      },
    });

    const nameToIdMap = new Map<string, string>();

    products.forEach((product) => {
      const productName = (product.productInfo as any)?.name;
      if (productName) {
        nameToIdMap.set(productName, product.id);
      }
    });

    logDB(`Bulk result: ${nameToIdMap.size}/${trimmedNames.length} found`, {
      found: Array.from(nameToIdMap.keys()),
      missing: trimmedNames.filter((name) => !nameToIdMap.has(name)),
    });

    return nameToIdMap;
  } catch (error) {
    logDB("Bulk query error", error);
    return new Map();
  }
}

/**
 * Convert CustomDataPart to MessagePart with database enrichment
 */
async function convertToMessageParts(
  dataParts: CustomDataPart[]
): Promise<MessagePart[]> {
  if (dataParts.length === 0) {
    return [];
  }

  // Separate product and suggestion parts
  const productParts = dataParts.filter((part) => part.type === "data-product");
  const suggestionParts = dataParts.filter(
    (part) => part.type === "data-suggestion"
  );

  // Get product IDs from database
  const productNames = productParts.map((part) => part.data.product_name);
  const nameToIdMap = await getProductIdsByNames(productNames);

  // Convert to MessagePart array
  const messageParts: MessagePart[] = [];

  // Process all data parts in original order
  for (const part of dataParts) {
    if (part.type === "data-product") {
      const productId = nameToIdMap.get(part.data.product_name);

      if (productId) {
        messageParts.push({
          type: "data-product",
          id: part.id,
          data: {
            product_id: productId,
          },
        });
        logDB(`Converted: "${part.data.product_name}" → ${productId}`);
      } else {
        logDB(`Skipped: "${part.data.product_name}" (not found)`);
      }
    } else if (part.type === "data-suggestion") {
      messageParts.push({
        type: "data-suggestion",
        id: part.id,
        data: {
          suggestion_id: part.data.suggestion_id,
        },
      });
    }
  }

  return messageParts;
}

/**
 * Remove ALL JSON fragments for streaming
 */
export function removeAllJsonFragments(text: string): string {
  let cleanText = "";
  let currentIndex = 0;

  if (!text.includes("{")) {
    return text.trim();
  }

  while (currentIndex < text.length) {
    const openBraceIndex = text.indexOf("{", currentIndex);

    if (openBraceIndex === -1) {
      const remainingText = text.substring(currentIndex);
      cleanText += remainingText;
      break;
    }

    const textBefore = text.substring(currentIndex, openBraceIndex);
    cleanText += textBefore;

    const closeBraceIndex = findMatchingBrace(text, openBraceIndex);

    if (closeBraceIndex === -1) {
      break;
    }

    currentIndex = closeBraceIndex + 1;
  }

  return cleanText.trim();
}

/**
 * Parse complete text and extract JSON fragments
 */
export function parseAccumulatedText(text: string): ParseResult {
  let cleanText = "";
  const dataParts: CustomDataPart[] = [];
  let currentIndex = 0;

  if (!text.includes("{")) {
    return { cleanText: text.trim(), dataParts: [] };
  }

  while (currentIndex < text.length) {
    const openBraceIndex = text.indexOf("{", currentIndex);

    if (openBraceIndex === -1) {
      const remainingText = text.substring(currentIndex);
      cleanText += remainingText;
      break;
    }

    const textBefore = text.substring(currentIndex, openBraceIndex);
    cleanText += textBefore;

    const closeBraceIndex = findMatchingBrace(text, openBraceIndex);

    if (closeBraceIndex === -1) {
      const incompleteJson = text.substring(openBraceIndex);
      cleanText += incompleteJson;
      break;
    }

    const jsonStr = text.substring(openBraceIndex, closeBraceIndex + 1);

    try {
      const jsonData = JSON.parse(jsonStr);
      const dataPart = convertToDataPart(jsonData);

      if (dataPart) {
        dataParts.push(dataPart);
      } else {
        cleanText += jsonStr;
      }
    } catch (error) {
      cleanText += jsonStr;
    }

    currentIndex = closeBraceIndex + 1;
  }

  return { cleanText: cleanText.trim(), dataParts };
}

/**
 * Main function: Create streaming message from AI response text
 */
export async function createStreamingMessage(
  messageId: string,
  text: string,
  messageType: "append-message" | "update-message" = "update-message"
): Promise<StreamingMessage> {
  // Parse the accumulated text to extract data parts
  const parseResult = parseAccumulatedText(text);

  // Convert data parts to message parts with database enrichment
  const dataParts = await convertToMessageParts(parseResult.dataParts);

  // Create message parts array
  const messageParts: MessagePart[] = [];

  // Add text part if there's clean text
  if (parseResult.cleanText) {
    messageParts.push({
      type: "text",
      text: parseResult.cleanText,
    });
  }

  // Add data parts
  messageParts.push(...dataParts);

  // Create streaming message
  const streamingMessage: StreamingMessage = {
    type: messageType,
    message: {
      id: messageId,
      role: "assistant",
      createdAt: new Date().toISOString(),
      parts: messageParts,
    },
  };

  // Only log final DB summary
  if (dataParts.length > 0) {
    logDB(`Final result: ${messageParts.length} parts created`, {
      text: messageParts.filter((p) => p.type === "text").length,
      products: messageParts.filter((p) => p.type === "data-product").length,
      suggestions: messageParts.filter((p) => p.type === "data-suggestion")
        .length,
    });
  }

  return streamingMessage;
}

/**
 * Utility function for streaming text only (no database calls)
 */
export function createStreamingTextMessage(
  messageId: string,
  text: string,
  messageType: "append-message" | "update-message" = "update-message"
): StreamingMessage {
  // Remove JSON fragments for clean streaming
  const cleanText = removeAllJsonFragments(text);

  const messageParts: MessagePart[] = [];

  if (cleanText) {
    messageParts.push({
      type: "text",
      text: cleanText,
    });
  }

  return {
    type: messageType,
    message: {
      id: messageId,
      role: "assistant",
      createdAt: new Date().toISOString(),
      parts: messageParts,
    },
  };
}

/**
 * Generate unique data part ID
 */
export function generateDataPartId(type: "product" | "suggestion"): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Cleanup function for Prisma
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
