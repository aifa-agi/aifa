// @/lib/utils/validateCuid.ts

export function isValidCuid(id: string): boolean {
  // cuid package имеет функцию isCuid, либо пишем регулярку
  return /^c[^\s-]{8,}$/i.test(id);
}
