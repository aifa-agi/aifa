// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_libs)/ai/tools/file-search-vector-store.ts

import { OpenAI } from "openai";
import { tool } from "ai";
import { z } from "zod";

const vectorStoreId = process.env.OPENAI_API_VECTOR_STORE_ID!;

export const fileSearchVectorStore = tool({
  description:
    "Search files in vector store and return actual matched documents.",
  parameters: z.object({
    query: z.string().describe("Text query to search in vector store"),
  }),
  execute: async ({ query }) => {
    const openai = new OpenAI();
    console.log("start call // @/lib/ai/tools/file-search-vector-store.ts ");
    try {
      const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: query,
        tools: [
          {
            type: "file_search",
            vector_store_ids: [vectorStoreId],
          },
        ],
      });

      console.log(
        "// @/lib/ai/tools/file-search-vector-store.ts response:",
        response.output_text ?? ""
      );

      // Возвращаем только текст из output_text
      return {
        text: response.output_text ?? "",
      };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
});
