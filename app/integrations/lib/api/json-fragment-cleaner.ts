// @/app/integrations/lib/api/json-fragment-cleaner.ts

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
 * Find matching closing bracket for arrays considering strings and escaping
 */
function findMatchingBracket(text: string, startIndex: number): number {
  let bracketCount = 0;
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
      if (char === "[") {
        bracketCount++;
      } else if (char === "]") {
        bracketCount--;
        if (bracketCount === 0) {
          return i;
        }
      }
    }
  }

  return -1; // No matching bracket found
}

/**
 * Remove ALL JSON fragments for streaming (including incomplete ones)
 * This is used during streaming to show clean text without any JSON noise
 */
export function removeAllJsonFragments(text: string): string {
  let cleanText = "";
  let currentIndex = 0;

  // Step 1: Remove JSON code blocks first
  let workingText = text.replace(/``````/g, "");

  // Step 2: Remove incomplete JSON code blocks (without closing ```
  workingText = workingText.replace(/```json[\s\S]*$/g, "");

  // Step 3: Remove empty or malformed JSON arrays
  workingText = workingText.replace(/\[\s*(?:,\s*)*\s*\]/g, "");

  // Step 4: Remove arrays with only commas and whitespace
  workingText = workingText.replace(/\[\s*,+\s*\]/g, "");

  // Step 5: Process JSON objects using existing logic
  while (currentIndex < workingText.length) {
    const openBraceIndex = workingText.indexOf("{", currentIndex);

    if (openBraceIndex === -1) {
      // No more JSON fragments, add remaining text
      const remainingText = workingText.substring(currentIndex);
      cleanText += remainingText;
      break;
    }

    // Add text before JSON fragment
    const textBefore = workingText.substring(currentIndex, openBraceIndex);
    cleanText += textBefore;

    // Find matching closing brace
    const closeBraceIndex = findMatchingBrace(workingText, openBraceIndex);

    if (closeBraceIndex === -1) {
      // Incomplete JSON - remove everything from { to end for clean streaming
      break; // Stop here, don't add the incomplete JSON
    }

    // Skip the complete JSON fragment (don't add to cleanText)
    currentIndex = closeBraceIndex + 1;
  }

  // Step 6: Clean up excessive whitespace and newlines
  cleanText = cleanText
    // Remove multiple consecutive newlines
    .replace(/\n{3,}/g, "\n\n")
    // Remove trailing spaces at end of lines
    .replace(/[ \t]+$/gm, "")
    // Remove multiple spaces (but keep single spaces)
    .replace(/  +/g, " ")
    // Clean up any remaining empty JSON structures
    .replace(/\{\s*\}/g, "")
    .replace(/\[\s*\]/g, "");

  return cleanText.trim();
}

/**
 * Alternative function for more aggressive cleaning if needed
 */
export function removeAllJsonFragmentsAggressive(text: string): string {
  let cleanedText = text;

  // Remove all JSON code blocks (complete and incomplete)
  cleanedText = cleanedText.replace(/``````/g, "");
  cleanedText = cleanedText.replace(/```/g, "");

  // Remove JSON objects with data-product or data-suggestion
  cleanedText = cleanedText.replace(
    /\{[^}]*"type":\s*"data-(?:product|suggestion)"[^}]*\}/g,
    ""
  );

  // Remove any JSON-like structures
  cleanedText = cleanedText.replace(/\{[^}]*\}/g, "");
  cleanedText = cleanedText.replace(/$$[^$$]*$$/g, "");

  // Clean whitespace
  cleanedText = cleanedText.replace(/\n{3,}/g, "\n\n");
  cleanedText = cleanedText.replace(/[ \t]+$/gm, "");

  return cleanedText.trim();
}

/**
 * Utility function to check if text contains JSON fragments
 */
export function hasJsonFragments(text: string): boolean {
  return (
    text.includes("{") ||
    text.includes("```json") ||
    text.includes('"type":"data-') ||
    /\[\s*(?:,\s*)*\s*\]/.test(text)
  );
}

/**
 * Debug function to show what was removed
 */
export function debugJsonFragmentRemoval(text: string): {
  original: string;
  cleaned: string;
  removedFragments: string[];
} {
  const originalText = text;
  const cleanedText = removeAllJsonFragments(text);

  // Find what was removed (simplified detection)
  const jsonMatches = [
    ...Array.from(text.matchAll(/``````/g)),
    ...Array.from(text.matchAll(/\{[^}]*"type":\s*"data-[^}]*\}/g)),
    ...Array.from(text.matchAll(/\[\s*(?:,\s*)*\s*\]/g)),
  ];

  const removedFragments = jsonMatches.map((match) => match[0]);

  return {
    original: originalText,
    cleaned: cleanedText,
    removedFragments,
  };
}
