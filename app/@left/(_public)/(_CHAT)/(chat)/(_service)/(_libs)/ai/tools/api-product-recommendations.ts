// @/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/tools/api-product-recommendations.ts

import { z } from "zod";
import { Session } from "next-auth";
import { DataStreamWriter, streamObject, tool } from "ai";
import { myProvider } from "../providers";

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
 * Enhanced logging for tool execution
 */
function logToolExecution(step: string, data?: any) {
  console.log(`🔧 [ApiProductRecommendations] ${step}:`, data || "");
}

function logToolError(step: string, error: any) {
  console.error(`❌ [ApiProductRecommendations] ${step}:`, error);
}

/**
 * Factory function for creating product recommendations tool with session and dataStream
 */
export const createApiProductRecommendationsTool = ({
  session,
  dataStream,
}: {
  session: Session;
  dataStream: DataStreamWriter;
}) =>
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
      const executionId = Date.now().toString();
      logToolExecution("STARTED", {
        executionId,
        requestedCount,
        userId: session.user?.id,
      });

      const userId = session.user?.id;
      if (!userId) {
        logToolError("AUTH_FAILED", "User not authenticated");
        return { error: "User not authenticated" };
      }

      try {
        logToolExecution("CREATING_STREAM_OBJECT", {
          model: "api-chat-support",
        });

        // Добавляем timeout для streamObject
        const streamPromise = streamObject({
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
          }),
        });

        // Добавляем timeout защиту
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error("StreamObject timeout after 15 seconds")),
            15000
          );
        });

        const { elementStream } = (await Promise.race([
          streamPromise,
          timeoutPromise,
        ])) as any;

        logToolExecution("STREAM_CREATED", "ElementStream ready");

        // Process recommendations and send to dataStream
        let processedCount = 0;
        const maxIterations = requestedCount * 2; // Защита от бесконечного цикла
        let iterations = 0;

        try {
          for await (const element of elementStream) {
            iterations++;
            logToolExecution("PROCESSING_ELEMENT", {
              iteration: iterations,
              processedCount,
              element: element?.product_id
                ? "Valid element"
                : "Invalid element",
            });

            // Защита от бесконечного цикла
            if (iterations > maxIterations) {
              logToolError("MAX_ITERATIONS_EXCEEDED", {
                iterations,
                maxIterations,
              });
              break;
            }

            if (processedCount >= requestedCount) {
              logToolExecution("TARGET_COUNT_REACHED", {
                processedCount,
                requestedCount,
              });
              break;
            }

            // Валидация элемента
            if (
              !element ||
              !element.product_id ||
              !element.name ||
              !element.price
            ) {
              logToolError("INVALID_ELEMENT", element);
              continue;
            }

            try {
              // Send product recommendation via dataStream
              dataStream.writeData({
                type: "data-product",
                id: `product-${processedCount + 1}`,
                data: {
                  product_id: element.product_id,
                },
              });

              logToolExecution("DATA_WRITTEN", {
                productId: element.product_id,
                index: processedCount + 1,
              });

              processedCount++;
            } catch (writeError) {
              logToolError("DATASTREAM_WRITE_ERROR", writeError);
              // Продолжаем выполнение, не прерываем из-за одной ошибки записи
            }
          }
        } catch (streamError) {
          logToolError("STREAM_PROCESSING_ERROR", streamError);
          // Если обработка stream failed, возвращаем что успели обработать
        }

        logToolExecution("COMPLETED", {
          processedCount,
          iterations,
          executionId,
          duration: Date.now() - parseInt(executionId),
        });

        return {
          success: true,
          recommendationsGenerated: processedCount,
          message: `Generated ${processedCount} product recommendations using existing menu data`,
          context: {
            requestedCount,
            actualCount: processedCount,
            iterations,
            conversationContext: conversationContext.substring(0, 100),
            userId,
            executionId,
          },
        };
      } catch (error) {
        logToolError("EXECUTION_ERROR", {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
          executionId,
          duration: Date.now() - parseInt(executionId),
        });

        return {
          error: "Failed to generate product recommendations",
          details: error instanceof Error ? error.message : "Unknown error",
          context: {
            userId,
            executionId,
            requestedCount,
          },
        };
      }
    },
  });

// Простой экспорт для тестирования без dataStream зависимостей
export const apiProductRecommendations = tool({
  description:
    "Request product recommendations from base model (testing version)",
  parameters: z.object({
    conversationContext: z.string(),
    requestedCount: z.number().min(1).max(3).default(3),
  }),
  execute: async ({ conversationContext, requestedCount = 3 }) => {
    // Простая имитация без streamObject для тестирования
    return {
      success: true,
      recommendationsGenerated: requestedCount,
      message: `Mock: Generated ${requestedCount} recommendations`,
      recommendations: Array.from({ length: requestedCount }, (_, i) => ({
        product_id: `mock-uuid-${i + 1}`,
        name: `Mock Product ${i + 1}`,
        price: 100 + i * 50,
        reasoning: `Mock reasoning ${i + 1}`,
      })),
    };
  },
});
