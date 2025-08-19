// @/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/tools/api/api-product-recommendations.ts

import { z } from "zod";
import { Session } from "next-auth";
import { DataStreamWriter, streamObject, tool } from "ai";
import { myProvider } from "../providers";
interface ApiProductRecommendationsProps {
  session: Session;
  dataStream: DataStreamWriter;
}

/**
 * Product recommendation from base model
 */
interface ProductRecommendation {
  product_id: string;
  name: string;
  price: number;
  description?: string;
  reasoning?: string;
}

/**
 * Main AI tool for product recommendations - delegates to base model and formats output
 */
export const apiProductRecommendations = ({
  session,
  dataStream,
}: ApiProductRecommendationsProps) =>
  tool({
    description:
      "Request product recommendations from base model and format them for dataStream parts",
    parameters: z.object({
      conversationContext: z
        .string()
        .describe(
          "Current conversation context for contextual recommendations"
        ),
      requestedCount: z
        .number()
        .min(1)
        .max(3)
        .default(3)
        .describe("Number of product recommendations (max 3, default: 3)"),
    }),
    execute: async ({ conversationContext, requestedCount = 3 }) => {
      const userId = session.user?.id;
      if (!userId) {
        return { error: "User not authenticated" };
      }

      try {
        // Request recommendations from base model using existing menu and user data
        const { elementStream } = streamObject({
          model: myProvider.languageModel("api-chat-support"),
          system: `Ты AI-ассистент ресторана. Используй уже загруженные данные меню (380+ блюд с UUID) и информацию о клиенте для рекомендаций.

ВАЖНО:
- Используй только РЕАЛЬНЫЕ product_id из загруженного меню
- НЕ создавай новые UUID или продукты
- Анализируй предпочтения клиента из истории покупок
- Учитывай контекст беседы

Верни ${requestedCount} наиболее подходящих блюд с их реальными данными.`,
          prompt: `На основе контекста беседы: "${conversationContext}" 
          
Рекомендуй ${requestedCount} блюд из доступного меню, используя:
- Историю покупок клиента
- Предпочтения по тегам  
- Контекст текущей беседы
- Данные о клиенте

Верни ТОЛЬКО существующие продукты с их реальными UUID из загруженного меню.`,
          output: "array",
          schema: z.object({
            product_id: z
              .string()
              .describe("Real UUID from existing menu data"),
            name: z.string().describe("Product name from menu"),
            price: z.number().describe("Product price"),
            reasoning: z.string().describe("Why this product is recommended"),
          }),
        });

        // Process recommendations and send to dataStream
        let processedCount = 0;
        for await (const element of elementStream) {
          if (processedCount >= requestedCount) break;

          // Send product recommendation via dataStream in hardcode format
          dataStream.writeData({
            type: "data-product",
            id: `product-${processedCount + 1}`,
            data: {
              product_id: element.product_id,
            },
          });

          processedCount++;
        }

        return {
          success: true,
          recommendationsGenerated: processedCount,
          message: `Generated ${processedCount} product recommendations using existing menu data`,
          context: {
            requestedCount,
            conversationContext: conversationContext.substring(0, 100),
            userId,
          },
        };
      } catch (error) {
        console.error("Error in apiProductRecommendations:", error);
        return {
          error: "Failed to generate product recommendations",
          details: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  });
