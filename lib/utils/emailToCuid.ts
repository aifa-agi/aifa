// @/lib/utils/emailToCuid.ts

import crypto from "crypto";

/**
 * Преобразует email в детерминированный "cuid-подобный" идентификатор.
 * @param email string
 * @returns string
 */
export function emailToCuid(email: string): string {
  // Получаем sha256 хеш от email
  const hash = crypto
    .createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex");
  // Обрезаем и переводим в base36 для компактности
  const base36 = BigInt("0x" + hash).toString(36);
  // Добавляем префикс "c" (как у cuid)
  return "c" + base36.slice(0, 24); // 25 символов, как у cuid
}
