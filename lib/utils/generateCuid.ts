// @/lib/utils/generateCuid.ts

import { createId } from "@paralleldrive/cuid2";

/**
 * Generate a new, secure CUID2 string.
 * @returns {string} - A valid CUID2 string.
 */
export function generateCuid(): string {
  // We use createId() from the new, secure package.
  return createId();
}
