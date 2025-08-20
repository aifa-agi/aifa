// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_libs)/ai/tools/create-document.ts

import { generateCuid } from "@/lib/utils/generateCuid";
import { DataStreamWriter, tool } from "ai";
import { z } from "zod";
import { Session } from "next-auth";

interface CreateProductIdAnswerProps {
  session: Session;
  dataStream: DataStreamWriter;
}

// Минимальные TypeScript интерфейсы для ProductPart
interface ProductPart {
  type: "data-product";
  id: string;
  data: {
    product_id: string;
  };
}

export const createProductIdAnswer = ({
  session,
  dataStream,
}: CreateProductIdAnswerProps) =>
  tool({
    description:
      "Create product recommendation which return custom data-parts for chat",
    parameters: z.object({
      title: z.string().describe("Title for the product recommendation"),
    }),
    execute: async ({ title }) => {
      const id = generateCuid();

      console.log("createProductIdAnswer executing");

      // Жестко закодированные данные продукта
      const productPart: ProductPart = {
        type: "data-product",
        id: `product-${id}`,
        data: {
          product_id: "58c9bc26-b411-47cc-ae4d-dd2bfb4207da",
        },
      };

      console.log("Product recommendation: ", productPart);

      // ✅ КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Записываем данные в dataStream
      dataStream.writeData({
        type: "data", // Важно: тип должен быть "data"
        content: JSON.stringify(productPart), // Отправляем как JSON строку
      });

      // Возвращаем результат (этот результат не попадает в поток напрямую)
      return {
        id,
        title,
        content: `Product recommendation: ${title}`,
        // parts здесь не нужны, так как мы уже записали в dataStream
      };
    },
  });
