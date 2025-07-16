// @/app/@left/(_CHAT-FRACTAL)/(chat)/(_service)/(_db-queries)/document/queries.ts

import { prisma } from "@/lib/db";
import type { Document } from "@prisma/client";
import type { ArtifactKind } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/artifact";

/**
 * Saves a new document to the database.
 * @param id - The unique identifier for the document (can be shared across versions).
 * @param title - The title of the document.
 * @param kind - The type of artifact.
 * @param content - The content of the document.
 * @param userId - The ID of the user creating the document.
 * @returns The created document object.
 */
export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}): Promise<Document> {
  console.log("Executing saveDocument query for id:", id);
  try {
    return await prisma.document.create({
      data: {
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to save document in database", error);
    throw error;
  }
}

/**
 * Gets all versions of a document by its shared ID, ordered by creation date.
 * @param id - The shared identifier of the document.
 * @returns An array of document objects.
 */
export async function getDocumentsById(id: string): Promise<Document[]> {
  console.log("Executing getDocumentsById query for id:", id);
  try {
    return await prisma.document.findMany({
      where: { id },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Failed to get documents by id from database", error);
    throw error;
  }
}

/**
 * Gets the latest version of a document by its shared ID.
 * @param id - The shared identifier of the document.
 * @returns The most recent document object or null if not found.
 */
export async function getDocumentById(id: string): Promise<Document | null> {
  console.log("Executing getDocumentById query for id:", id);
  try {
    const docs = await prisma.document.findMany({
      where: { id },
      orderBy: { createdAt: "desc" },
      take: 1,
    });
    return docs[0] ?? null;
  } catch (error) {
    console.error("Failed to get latest document by id from database", error);
    throw error;
  }
}

/**
 * Deletes all versions of a document and its related suggestions created after a specific timestamp.
 * This is useful for cleaning up after a document editing session.
 * @param id - The shared identifier of the document.
 * @param timestamp - The cutoff date. Documents and suggestions created after this will be deleted.
 * @returns The number of deleted documents.
 */
export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}): Promise<number> {
  console.log("Executing deleteDocumentsByIdAfterTimestamp query for id:", id);
  try {
    // First, delete related suggestions to maintain referential integrity.
    await prisma.suggestion.deleteMany({
      where: {
        documentId: id,
        documentCreatedAt: { gt: timestamp },
      },
    });

    // Then, delete the documents themselves.
    const deleted = await prisma.document.deleteMany({
      where: {
        id,
        createdAt: { gt: timestamp },
      },
    });

    return deleted.count;
  } catch (error) {
    console.error(
      "Failed to delete documents by id after timestamp from database",
      error
    );
    throw error;
  }
}
