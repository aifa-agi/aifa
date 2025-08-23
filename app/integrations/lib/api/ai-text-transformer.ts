// @/app/integrations/lib/api/ai-text-transformer.ts

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

/**
 * AI SDK v5 compatible streaming message format with custom parts
 */
interface StreamingMessage {
  type: "append-message" | "update-message";
  message: {
    id: string;
    role: "assistant";
    createdAt: string;
    parts: MessagePart[];
  };
}

type MessagePart = TextPart | ProductPart | SuggestionPart;

interface TextPart {
  type: "text";
  text: string;
}

interface ProductPart {
  type: "data-product";
  id: string;
  data: {
    product_id: string;
  };
}

interface SuggestionPart {
  type: "data-suggestion";
  id: string;
  data: {
    suggestion_id: string;
  };
}

/**
 * Zod schema for validation of AI-generated output
 */
const MessagePartSchema = z.union([
  z.object({
    type: z.literal("text"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("data-product"),
    id: z.string(),
    data: z.object({
      product_id: z.string(),
    }),
  }),
  z.object({
    type: z.literal("data-suggestion"),
    id: z.string(),
    data: z.object({
      suggestion_id: z.string(),
    }),
  }),
]);

const StreamingMessageSchema = z.object({
  type: z.enum(["append-message", "update-message"]),
  message: z.object({
    id: z.string(),
    role: z.literal("assistant"),
    createdAt: z.string(),
    parts: z.array(MessagePartSchema),
  }),
});

/**
 * Transform raw text data containing mixed content and JSON fragments
 * into properly structured StreamingMessage format using OpenAI GPT-4.1
 */
export async function transformTextToStreamingMessage(
  rawTextData: string
): Promise<StreamingMessage | null> {
  try {
    const prompt = `
Проанализируй следующий текстовый фрагмент из streaming chat API и преобразуй его в правильный структурированный формат StreamingMessage.

ВХОДНЫЕ ДАННЫЕ:
${rawTextData}

ЗАДАЧА:
1. Извлеки основной текст ответа (убери вложенные JSON фрагменты из текста)
2. Найди и извлеки JSON фрагменты типа "data-product" и "data-suggestion"
3. Преобразуй найденные данные в правильный формат parts

🚨 СТРОГИЕ ПРАВИЛА ПОРЯДКА В МАССИВЕ PARTS:
ОБЯЗАТЕЛЬНО СОБЛЮДАЙ СТРОГУЮ ПОСЛЕДОВАТЕЛЬНОСТЬ:
1. ПЕРВЫМ всегда должен быть объект с type: "text" (основной текст)
2. ВТОРЫМИ идут все объекты с type: "data-product" (если есть)
3. ПОСЛЕДНИМИ идут все объекты с type: "data-suggestion" (если есть)

ПРАВИЛА ПРЕОБРАЗОВАНИЯ:
- Для data-product: создай объект с type: "data-product", уникальным id (например "product-1", "product-2"), и в data.product_id значение из исходного JSON
- Для data-suggestion: создай объект с type: "data-suggestion", уникальным id (например "suggestion-1", "suggestion-2"), и в data.suggestion_id значение из исходного JSON
- Основной текст помести в part с type: "text" - он должен быть ПЕРВЫМ в массиве
- Сохрани исходные значения id, createdAt и type сообщения

ОБЯЗАТЕЛЬНАЯ СТРУКТУРА МАССИВА PARTS:
[
  { "type": "text", ... },           // ВСЕГДА ПЕРВЫЙ
  { "type": "data-product", ... },   // ВТОРЫЕ (если есть)
  { "type": "data-product", ... },   // (если несколько продуктов)
  { "type": "data-suggestion", ... }, // ПОСЛЕДНИЕ (если есть)
  { "type": "data-suggestion", ... }  // (если несколько предложений)
]

ПРИМЕР ПРАВИЛЬНОГО РЕЗУЛЬТАТА:
{
  "type": "update-message",
  "message": {
    "id": "msg_def456",
    "role": "assistant",
    "createdAt": "2025-08-13T12:00:00.000Z",
    "parts": [
      {
        "type": "text",
        "text": "Основной текст без JSON фрагментов"
      },
      {
        "type": "data-product",
        "id": "product-1",
        "data": {
          "product_id": "4901950180232"
        }
      },
      {
        "type": "data-suggestion",
        "id": "suggestion-1",
        "data": {
          "suggestion_id": "Сладкое"
        }
      },
      {
        "type": "data-suggestion",
        "id": "suggestion-2",
        "data": {
          "suggestion_id": "Напитки"
        }
      }
    ]
  }
}

Верни только структурированный JSON результат без дополнительных комментариев.
КРИТИЧЕСКИ ВАЖНО: Строго соблюдай порядок parts: text → data-product → data-suggestion
`;

    const result = await generateObject({
      model: openai("gpt-4.1"),
      schema: StreamingMessageSchema,
      prompt: prompt,
      temperature: 0.1, // Низкая температура для точности
    });

    // Проверяем порядок parts после генерации AI
    const isOrderCorrect = validatePartsOrder(result.object.message.parts);
    if (!isOrderCorrect) {
      console.warn(
        "⚠️ AI сгенерировал неправильный порядок parts, исправляем..."
      );
      result.object.message.parts = reorderParts(result.object.message.parts);
    }

    console.log(
      "✅ AI Text Transformer: успешно преобразовано в StreamingMessage"
    );

    return result.object;
  } catch (error) {
    console.error("❌ AI Text Transformer error:", error);

    // Fallback: обработка без AI с правильным порядком
    try {
      const parsedData = JSON.parse(rawTextData);
      if (parsedData.message && parsedData.message.parts) {
        const textParts: MessagePart[] = [];
        const productParts: MessagePart[] = [];
        const suggestionParts: MessagePart[] = [];

        for (const part of parsedData.message.parts) {
          if (part.type === "text") {
            const cleanText = part.text
              .replace(/\{\"type\":\s*\"data-product\"[^}]*\}/g, "")
              .replace(/\{\"type\":\s*\"data-suggestion\"[^}]*\}/g, "")
              .trim();
            if (cleanText) {
              textParts.push({
                type: "text",
                text: cleanText,
              });
            }
          } else if (part.type === "data-product") {
            productParts.push(part as ProductPart);
          } else if (part.type === "data-suggestion") {
            suggestionParts.push(part as SuggestionPart);
          }
        }

        // Объединяем в правильном порядке: text → data-product → data-suggestion
        const orderedParts = [
          ...textParts,
          ...productParts,
          ...suggestionParts,
        ];

        console.log("✅ Fallback: применен правильный порядок parts");

        return {
          type: parsedData.type || "update-message",
          message: {
            id: parsedData.message.id,
            role: "assistant",
            createdAt: parsedData.message.createdAt,
            parts: orderedParts,
          },
        };
      }
    } catch (fallbackError) {
      console.error("❌ Fallback parsing также failed:", fallbackError);
    }

    return null;
  }
}

/**
 * Validate that parts are in correct order: text → data-product → data-suggestion
 */
export function validatePartsOrder(parts: MessagePart[]): boolean {
  let currentStage = 0; // 0: text, 1: data-product, 2: data-suggestion

  for (const part of parts) {
    if (part.type === "text" && currentStage > 0) {
      return false; // text should come first
    }
    if (part.type === "data-product") {
      if (currentStage === 0) currentStage = 1;
      if (currentStage > 1) return false; // data-product after data-suggestion
    }
    if (part.type === "data-suggestion") {
      currentStage = 2;
    }
  }

  return true;
}

/**
 * Reorder parts to correct sequence: text → data-product → data-suggestion
 */
export function reorderParts(parts: MessagePart[]): MessagePart[] {
  const textParts: MessagePart[] = [];
  const productParts: MessagePart[] = [];
  const suggestionParts: MessagePart[] = [];

  for (const part of parts) {
    if (part.type === "text") {
      textParts.push(part);
    } else if (part.type === "data-product") {
      productParts.push(part);
    } else if (part.type === "data-suggestion") {
      suggestionParts.push(part);
    }
  }

  return [...textParts, ...productParts, ...suggestionParts];
}

/**
 * Utility function to validate StreamingMessage structure
 */
export function validateStreamingMessage(
  data: unknown
): data is StreamingMessage {
  try {
    StreamingMessageSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clean text from embedded JSON fragments (fallback function)
 */
export function cleanTextFromJsonFragments(text: string): string {
  return text
    .replace(/\{\"type\":\s*\"data-product\"[^}]*\}/g, "")
    .replace(/\{\"type\":\s*\"data-suggestion\"[^}]*\}/g, "")
    .trim();
}
