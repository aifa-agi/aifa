// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_libs)/ai/tools/file-search-declarative.ts

import { tool } from "ai";
import { z } from "zod";

/**
 * Это декларативный инструмент. У него нет блока `execute`.
 * Он нужен только для того, чтобы передать модели OpenAI описание и схему параметров.
 * Vercel AI SDK распознает инструмент по имени 'file_search' и обработает его вызов автоматически.
 */
export const fileSearchDeclarative = tool({
  description:
    "Search files in the user's private vector store and return relevant document snippets. Use this for questions about uploaded documents.",
  parameters: z.object({
    // Модель ожидает увидеть параметр 'query' для поиска
    query: z
      .string()
      .describe(
        "The search query to find relevant information in the documents."
      ),
  }),
});
