// @/app/integrations/lib/api/ai-text-transformer.ts

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/db";

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
 * НОВАЯ ФУНКЦИЯ: Проверка является ли ID коротким (6 символов)
 * @param productId - ID продукта для проверки
 * @returns boolean - true если ID короткий (6 символов)
 */
function isShortProductId(productId: string): boolean {
  return typeof productId === "string" && productId.length === 6;
}

/**
 * НОВАЯ ФУНКЦИЯ: Поиск полного product_id в базе данных по короткому идентификатору
 * @param shortId - Короткий идентификатор (6 символов)
 * @returns Promise<string | null> - Полный product_id или null если не найден
 */
async function findFullProductIdInDb(shortId: string): Promise<string | null> {
  try {
    if (!shortId || shortId.length !== 6) {
      console.warn(`⚠️ Invalid short ID format: "${shortId}"`);
      return null;
    }

    console.log(`🔍 Searching for full product ID with short ID: ${shortId}`);

    // Ищем продукт, у которого productId начинается с shortId
    const product = await prisma.product.findFirst({
      where: {
        productId: {
          startsWith: shortId,
        },
      },
      select: {
        productId: true,
      },
    });

    if (product) {
      console.log(
        `✅ Found full product ID: ${shortId} -> ${product.productId}`
      );
      return product.productId;
    } else {
      console.warn(`❌ No product found for short ID: ${shortId}`);
      return null;
    }
  } catch (error) {
    console.error("❌ Error searching for full product ID:", error);
    return null;
  }
}

/**
 * НОВАЯ ФУНКЦИЯ: Массовый поиск полных product_id для оптимизации запросов
 * @param shortIds - Массив коротких идентификаторов
 * @returns Promise<Map<string, string>> - Карта сопоставлений shortId -> fullId
 */
async function findMultipleFullProductIds(
  shortIds: string[]
): Promise<Map<string, string>> {
  try {
    if (shortIds.length === 0) {
      return new Map();
    }

    console.log(
      `🔍 Bulk searching for ${shortIds.length} short product IDs:`,
      shortIds
    );

    // Получаем все продукты, которые начинаются с любого из коротких ID
    const products = await prisma.product.findMany({
      where: {
        OR: shortIds.map((shortId) => ({
          productId: {
            startsWith: shortId,
          },
        })),
      },
      select: {
        productId: true,
      },
    });

    // Создаем карту сопоставлений
    const mapping = new Map<string, string>();

    products.forEach((product) => {
      const fullId = product.productId;
      // Находим соответствующий короткий ID (первые 6 символов)
      const matchingShortId = shortIds.find((shortId) =>
        fullId.startsWith(shortId)
      );

      if (matchingShortId) {
        mapping.set(matchingShortId, fullId);
      }
    });

    console.log(
      `✅ Found ${mapping.size} full product IDs out of ${shortIds.length} requested`
    );

    return mapping;
  } catch (error) {
    console.error("❌ Error in bulk product ID search:", error);
    return new Map();
  }
}

/**
 * НОВАЯ ФУНКЦИЯ: Обработка и замена коротких product_id в parts
 * @param parts - Массив частей сообщения
 * @returns Promise<MessagePart[]> - Обработанный массив с полными product_id
 */
async function resolveProductIds(parts: MessagePart[]): Promise<MessagePart[]> {
  // Собираем все короткие product_id из data-product parts
  const shortProductIds: string[] = [];

  parts.forEach((part) => {
    if (
      part.type === "data-product" &&
      isShortProductId(part.data.product_id)
    ) {
      shortProductIds.push(part.data.product_id);
    }
  });

  if (shortProductIds.length === 0) {
    // Нет коротких ID для обработки
    return parts;
  }

  // Массовый поиск полных ID
  const idMapping = await findMultipleFullProductIds(shortProductIds);

  // Заменяем короткие ID на полные в parts
  return parts.map((part) => {
    if (
      part.type === "data-product" &&
      isShortProductId(part.data.product_id)
    ) {
      const fullId = idMapping.get(part.data.product_id);

      if (fullId) {
        console.log(
          `🔄 Replacing short product ID: ${part.data.product_id} -> ${fullId}`
        );
        return {
          ...part,
          data: {
            ...part.data,
            product_id: fullId,
          },
        };
      } else {
        console.warn(
          `⚠️ Could not resolve short product ID: ${part.data.product_id}`
        );
        // Возвращаем исходную part с коротким ID как fallback
        return part;
      }
    }

    return part;
  });
}

/**
 * Transform raw text data containing mixed content and JSON fragments
 * into properly structured StreamingMessage format using OpenAI GPT-4.1
 * ОБНОВЛЕНО: Теперь автоматически находит полные product_id в базе данных для коротких идентификаторов
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

ВАЖНО: Если в product_id встречается короткий идентификатор (6 символов), сохрани его как есть - система автоматически найдет полный ID в базе данных.

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
          "product_id": "4901ab"
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

    // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Обрабатываем короткие product_id и заменяем их на полные
    console.log("🔄 Processing product IDs...");
    result.object.message.parts = await resolveProductIds(
      result.object.message.parts
    );

    console.log(
      "✅ AI Text Transformer: успешно преобразовано в StreamingMessage с полными product_id"
    );

    return result.object;
  } catch (error) {
    console.error("❌ AI Text Transformer error:", error);

    // Fallback: обработка без AI с правильным порядком и разрешением product_id
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
        let orderedParts = [...textParts, ...productParts, ...suggestionParts];

        // ОБРАБАТЫВАЕМ product_id в fallback режиме
        try {
          orderedParts = await resolveProductIds(orderedParts);
          console.log("✅ Fallback: обработаны product_id");
        } catch (resolveError) {
          console.warn(
            "⚠️ Fallback: не удалось обработать product_id:",
            resolveError
          );
          // Продолжаем с исходными parts
        }

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

/**
 * НОВАЯ ЭКСПОРТИРУЕМАЯ ФУНКЦИЯ: Утилита для ручного поиска полного product_id
 * Может использоваться в других частях приложения
 * @param shortId - Короткий идентификатор продукта
 * @returns Promise<string | null> - Полный product_id или null
 */
export async function resolveFullProductId(
  shortId: string
): Promise<string | null> {
  return await findFullProductIdInDb(shortId);
}
