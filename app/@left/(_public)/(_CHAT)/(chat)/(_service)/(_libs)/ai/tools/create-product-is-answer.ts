// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_libs)/ai/tools/create-document.ts

import { generateCuid } from "@/lib/utils/generateCuid";
import { DataStreamWriter, tool } from "ai";
import { z } from "zod";
import { Session } from "next-auth";

interface CreateProductIdAnswerProps {
  session: Session;
  dataStream: DataStreamWriter;
}

// Интерфейс для возвращаемого результата tool
interface ProductResult {
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
    description: "Create product recommendation with hardcoded product ID",
    parameters: z.object({
      title: z.string().describe("Title for the product recommendation"),
    }),
    execute: async ({ title }) => {
      const id = generateCuid();

      console.log("createProductIdAnswer executing");

      // Создаем product data
      const productResult: ProductResult = {
        type: "data-product",
        id: `product-${id}`,
        data: {
          product_id: "58c9bc26-b411-47cc-ae4d-dd2bfb4207da",
        },
      };

      console.log("Product recommendation: ", productResult);

      // ✅ НОВЫЙ ПОДХОД: Возвращаем данные через tool result
      // AI SDK v5 автоматически обработает это
      return {
        id,
        title,
        content: `Product recommendation: ${title}`,
        productData: productResult, // Возвращаем как часть результата
      };
    },
  });
