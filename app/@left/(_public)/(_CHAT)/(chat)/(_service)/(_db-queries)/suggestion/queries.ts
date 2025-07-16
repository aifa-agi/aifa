// @/app/@left/(_CHAT-FRACTAL)/(chat)/(_service)/(_db-queries)/suggestion/queries.ts

import { prisma } from "@/lib/db";
import type { Suggestion, Prisma } from "@prisma/client";

/**
 * Сохраняет массив предложений (suggestions) в базе данных.
 * Использует createMany для эффективной вставки нескольких записей.
 * @param suggestions - Массив объектов предложений для сохранения.
 */
export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Prisma.SuggestionCreateManyInput[];
}): Promise<void> {
  console.log("Executing saveSuggestions query with:", suggestions);
  try {
    await prisma.suggestion.createMany({
      data: suggestions,
      skipDuplicates: true, // Пропускать создание дубликатов
    });
  } catch (error) {
    console.error("Failed to save suggestions in database", error);
    throw error;
  }
}

/**
 * Получает все предложения, связанные с определенным документом.
 * @param documentId - Идентификатор документа, для которого нужно найти предложения.
 * @returns Массив объектов предложений.
 */
export async function getSuggestionsByDocumentId(
  documentId: string
): Promise<Suggestion[]> {
  console.log(
    "Executing getSuggestionsByDocumentId query for documentId:",
    documentId
  );
  try {
    return await prisma.suggestion.findMany({
      where: { documentId },
    });
  } catch (error) {
    console.error(
      "Failed to get suggestions by document id from database",
      error
    );
    throw error;
  }
}
