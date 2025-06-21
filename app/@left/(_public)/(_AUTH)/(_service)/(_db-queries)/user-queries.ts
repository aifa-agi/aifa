// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/(_service)/(_db-queries)/user-queries.ts

import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";

/**
 * Получает одного пользователя по его уникальному ID.
 * @param id - Уникальный идентификатор пользователя.
 * @returns Объект пользователя или null, если не найден.
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to get user by id from database", error);
    return null;
  }
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
