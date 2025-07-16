// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/(_service)/(_db-queries)/user-queries.ts

import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";

/**
 * Получает одного пользователя по его уникальному ID.
 * @param id - Уникальный идентификатор пользователя.
 * @returns Объект пользователя или null, если не найден.
 */
export async function getUserById(
  id: string,
  options: {
    retries?: number;
    timeout?: number;
    throwOnError?: boolean;
  } = {}
): Promise<User | null> {
  const { retries = 2, timeout = 5000, throwOnError = false } = options;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      // Создаем promise с timeout
      const userPromise = prisma.user.findUnique({
        where: { id },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Database timeout")), timeout)
      );

      return await Promise.race([userPromise, timeoutPromise]);
    } catch (error) {
      const isLastAttempt = attempt === retries + 1;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // console.error(`getUserById attempt ${attempt}/${retries + 1} failed:`, {
      //   error: errorMessage,
      //   userId: id,
      //   isLastAttempt,
      // });

      if (isLastAttempt) {
        if (throwOnError) {
          throw error;
        }
        return null;
      }

      // Экспоненциальная задержка: 500ms, 1s, 2s
      const delay = Math.min(500 * Math.pow(2, attempt - 1), 2000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return null;
}

/**
 * Получает одного пользователя по его email.
 * @param email - Email пользователя.
 * @returns Объект пользователя или null, если не найден.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Failed to get user by email from database", error);
    return null;
  }
}
