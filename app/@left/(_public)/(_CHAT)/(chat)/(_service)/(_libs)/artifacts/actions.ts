// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_libs)/artifacts/actions.ts
"use server";

import { getSuggestionsByDocumentId } from "../../(_db-queries)/suggestion/queries";

export async function getSuggestions({ documentId }: { documentId: string }) {
  const suggestions = await getSuggestionsByDocumentId(documentId);
  return suggestions ?? [];
}
