// @/lib/normalize-text.ts

/**
 * Normalize a title or raw string: trim, collapse spaces, remove invisible chars.
 * Optionally, you can add sanitize logic (e.g. for URL).
 */
export function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^a-z0-9_-]/g, '')    
    .replace(/-+/g, '-')            
    .replace(/^-+/, '')             
    .replace(/-+$/, '');           
}
