// @/app\@left\(_public)\(_AUTH-FRACTAL)\(auth)\(_service)\(_db-queries)\delete-user-with-blob.ts

import { prisma } from "@/lib/db";
import { del } from "@vercel/blob";

/**
 * Удаляет пользователя и все его файлы из Blob Storage и базы.
 */
export async function deleteUserWithFiles(userId: string) {
  // Получаем все файлы пользователя
  const files = await prisma.file.findMany({ where: { userId } });

  // Удаляем файлы из Blob Storage
  if (files.length > 0) {
    const urls = files.map((f) => f.url); // Или f.pathname, если требуется
    await del(urls); // Удаляет все файлы из Blob Storage[9][11]
  }

  // Удаляем все записи файлов из базы
  await prisma.file.deleteMany({ where: { userId } });

  // Удаляем остальные связанные данные (чаты, документы и т.д.)
  await prisma.suggestion.deleteMany({ where: { userId } });
  await prisma.document.deleteMany({ where: { userId } });
  await prisma.chat.deleteMany({ where: { userId } });

  // Удаляем пользователя
  await prisma.user.delete({ where: { id: userId } });
}
