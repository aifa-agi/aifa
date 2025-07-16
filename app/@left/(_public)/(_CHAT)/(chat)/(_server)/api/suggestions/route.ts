// @/app/@left/(_public)/(_CHAT)/(chat)/(_server)/api/suggestions/route.ts

import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import { getSuggestionsByDocumentId } from "../../../(_service)/(_db-queries)/suggestion/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const suggestions = await getSuggestionsByDocumentId(documentId);

  const [suggestion] = suggestions;

  if (!suggestion) {
    return Response.json([], { status: 200 });
  }

  if (suggestion.userId !== session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  return Response.json(suggestions, { status: 200 });
}
