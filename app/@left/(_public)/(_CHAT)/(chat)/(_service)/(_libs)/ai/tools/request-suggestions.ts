// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_libs)/ai/tools/request-suggestions.ts
import { z } from "zod";
import { Session } from "next-auth";
import { DataStreamWriter, streamObject, tool } from "ai";
import type { Prisma } from "@prisma/client";

import { generateCuid } from "@/lib/utils/generateCuid";
import { myProvider } from "../providers";
import { getDocumentById } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_db-queries)/document/queries";
import { saveSuggestions } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_db-queries)/suggestion/queries";

interface RequestSuggestionsProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const requestSuggestions = ({
  session,
  dataStream,
}: RequestSuggestionsProps) =>
  tool({
    description: "Request suggestions for a document",
    parameters: z.object({
      documentId: z
        .string()
        .describe("The ID of the document to request edits"),
    }),
    execute: async ({ documentId }) => {
      const userId = session.user?.id;
      if (!userId) {
        return { error: "User not authenticated" };
      }

      const document = await getDocumentById(documentId);
      if (!document || !document.content) {
        return { error: "Document not found" };
      }

      const suggestionsToSave: Prisma.SuggestionCreateManyInput[] = [];

      const { elementStream } = streamObject({
        model: myProvider.languageModel("artifact-model"),
        system:
          "You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.",
        prompt: document.content,
        // --- ИСПРАВЛЕНИЕ: ВОТ НЕДОСТАЮЩАЯ СТРОКА ---
        output: "array",
        // ------------------------------------------
        schema: z.object({
          originalSentence: z.string().describe("The original sentence"),
          suggestedSentence: z.string().describe("The suggested sentence"),
          description: z.string().describe("The description of the suggestion"),
        }),
      });

      // Теперь elementStream будет иметь правильный тип, и ошибка исчезнет
      for await (const element of elementStream) {
        const newSuggestion = {
          id: generateCuid(),
          documentId: document.id,
          documentCreatedAt: document.createdAt,
          userId: userId,
          originalText: element.originalSentence,
          suggestedText: element.suggestedSentence,
          description: element.description,
          isResolved: false,
          createdAt: new Date(),
        };

        dataStream.writeData({
          type: "suggestion",
          content: {
            ...newSuggestion,
            documentCreatedAt: newSuggestion.documentCreatedAt.toISOString(),
            createdAt: newSuggestion.createdAt.toISOString(),
          },
        });

        suggestionsToSave.push(newSuggestion);
      }

      if (suggestionsToSave.length > 0) {
        await saveSuggestions({
          suggestions: suggestionsToSave,
        });
      }

      return {
        id: documentId,
        title: document.title,
        kind: document.kind,
        message: "Suggestions have been added to the document",
      };
    },
  });
