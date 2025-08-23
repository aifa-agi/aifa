// @/app/integrations/lib/json-fragment-cleaner.ts

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
 * Remove ALL JSON fragments for streaming (including incomplete ones)
 * This is used during streaming to show clean text without any JSON noise
 */
export function removeAllJsonFragments(text: string): string {
  let cleanText = "";
  let currentIndex = 0;

  // If no opening brace, return original text
  if (!text.includes("{")) {
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
      break; // Stop here, don't add the incomplete JSON
    }

    // Skip the complete JSON fragment (don't add to cleanText)
    currentIndex = closeBraceIndex + 1;
  }

  return cleanText.trim();
}
