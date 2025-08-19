// @/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/tools/api/api-suggestions-generator.ts

import { z } from "zod";
import { Session } from "next-auth";
import { DataStreamWriter, streamObject, tool } from "ai";
import { myProvider } from "../providers";

interface ApiSuggestionsGeneratorProps {
  session: Session;
  dataStream: DataStreamWriter;
}

/**
 * Suggestion from base model
 */
interface SuggestionRecommendation {
  suggestion_id: string;
  category: string;
  reasoning?: string;
}

/**
 * Main AI tool for suggestions generation - delegates to base model and formats output
 */
export const apiSuggestionsGenerator = ({
  session,
  dataStream,
}: ApiSuggestionsGeneratorProps) =>
  tool({
    description:
      "Request contextual suggestions from base model and format them for dataStream parts",
    parameters: z.object({
      conversationContext: z
        .string()
        .describe("Current conversation context and recent messages"),
      requestedCount: z
        .number()
        .min(1)
        .max(5)
        .default(3)
        .describe("Number of suggestions to generate (default: 3)"),
    }),
    execute: async ({ conversationContext, requestedCount = 3 }) => {
      const userId = session.user?.id;
      if (!userId) {
        return { error: "User not authenticated" };
      }

      try {
        // Request suggestions from base model using existing conversation context and user data
        const { elementStream } = streamObject({
          model: myProvider.languageModel("api-chat-support"),
          system: `Ты AI-ассистент ресторана. Используй уже загруженную информацию о клиенте и контекст беседы для генерации suggestions.

ВАЖНО:
- Анализируй стадию диалога на основе контекста
- Учитывай тип клиента (новый/постоянный) из загруженных данных
- Генерируй уместные кнопки-предложения (3-5 слов максимум)
- Используй естественные, дружелюбные формулировки

Верни ${requestedCount} наиболее подходящих предложений для текущего контекста беседы.`,
          prompt: `На основе контекста беседы: "${conversationContext}"

Проанализируй:
- Стадию диалога (приветствие/изучение/принятие решения/заказ/завершение)
- Информацию о клиенте из загруженных данных
- Доступность меню
- Предыдущие сообщения

Сгенерируй ${requestedCount} contextual suggestions (кнопки) которые помогут клиенту продолжить диалог.
Каждая кнопка должна быть краткой (3-5 слов) и естественной.`,
          output: "array",
          schema: z.object({
            suggestion_id: z.string().describe("Short button text (3-5 words)"),
            category: z
              .string()
              .describe("Category: navigation/preference/action/inquiry"),
            reasoning: z.string().describe("Why this suggestion is relevant"),
          }),
        });

        // Process suggestions and send to dataStream
        let processedCount = 0;
        for await (const element of elementStream) {
          if (processedCount >= requestedCount) break;

          // Send suggestion via dataStream in hardcode format
          dataStream.writeData({
            type: "data-suggestion",
            id: `suggestion-${processedCount + 1}`,
            data: {
              suggestion_id: element.suggestion_id,
            },
          });

          processedCount++;
        }

        return {
          success: true,
          suggestionsGenerated: processedCount,
          message: `Generated ${processedCount} contextual suggestions using conversation context`,
          context: {
            requestedCount,
            conversationContext: conversationContext.substring(0, 100),
            userId,
          },
        };
      } catch (error) {
        console.error("Error in apiSuggestionsGenerator:", error);
        return {
          error: "Failed to generate suggestions",
          details: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  });
