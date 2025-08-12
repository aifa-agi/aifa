// @/app/integrations/api/external-ai-assistant/external-backend/store/route.ts

import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  apiResponse,
  successResponse,
  validationErrorResponse,
  unauthorizedResponse,
  conflictResponse,
  internalErrorResponse,
  payloadTooLargeResponse,
} from "@/app/integrations/lib/api/response";
import { StoreRequestSchema } from "../../_types/store";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Парсинг JSON из запроса
    const json = await req.json();
    console.log(
      "Store endpoint: Received request with products count:",
      json.products?.length || 0
    );

    // Валидация через zod схему
    const parse = StoreRequestSchema.safeParse(json);
    if (!parse.success) {
      console.error("Store endpoint: Validation failed:", parse.error.issues);
      return validationErrorResponse(parse.error.issues);
    }

    const { auth_secret, products } = parse.data;

    // Проверка аутентификации
    if (auth_secret !== process.env.NEXTAUTH_SECRET) {
      console.error("Store endpoint: Authentication failed");
      return unauthorizedResponse(
        "Unauthorized: invalid auth_secret",
        "Authentication failed - provided auth_secret is invalid"
      );
    }

    // Проверка на дублирующиеся product_id в запросе
    const productIds = products.map((p) => p.product_id);
    const uniqueIds = new Set(productIds);
    if (productIds.length !== uniqueIds.size) {
      const duplicates = productIds.filter(
        (id, index) => productIds.indexOf(id) !== index
      );
      console.error("Store endpoint: Duplicate product_ids found:", duplicates);

      return conflictResponse(
        "Data conflict detected",
        "Duplicate product_id found in request",
        {
          duplicate_ids: Array.from(new Set(duplicates)),
          conflicting_indices: duplicates.map((id) => productIds.indexOf(id)),
        }
      );
    }

    // Проверка на превышение лимитов
    if (products.length > 10000) {
      return payloadTooLargeResponse({
        max_products: 10000,
        received_products: products.length,
        max_size_mb: 50,
      });
    }

    // Генерация уникального ID операции для отслеживания
    const operationId = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log("Store endpoint: Starting operation:", operationId);

    // Транзакционное обновление каталога продуктов
    const result = await prisma.$transaction(async (tx) => {
      // Удаляем все существующие продукты
      const deletedCount = await tx.product.deleteMany();
      console.log(
        "Store endpoint: Deleted existing products:",
        deletedCount.count
      );

      // Подготавливаем данные для массовой вставки
      const productsToCreate = products.map((product) => ({
        productId: product.product_id,
        tags: product.tags || [], // Если tags не переданы, используем пустой массив
        productInfo: product.product_info,
      }));

      // Массовая вставка новых продуктов
      const createdProducts = await tx.product.createMany({
        data: productsToCreate,
        skipDuplicates: false, // Мы уже проверили на дубликаты выше
      });

      console.log(
        "Store endpoint: Created new products:",
        createdProducts.count
      );

      return {
        deletedCount: deletedCount.count,
        createdCount: createdProducts.count,
      };
    });

    const responseData = {
      total_products: result.createdCount,
      processed_products: result.createdCount,
      updated_at: new Date().toISOString(),
    };

    console.log(
      "Store endpoint: Operation completed successfully:",
      responseData
    );

    // Используем новую функцию с operation_id
    return successResponse(
      responseData,
      "Product catalog updated successfully",
      { operation_id: operationId }
    );
  } catch (error) {
    const operationId = `op_${Date.now()}_error_${Math.random().toString(36).substr(2, 6)}`;
    console.error("Store endpoint: Error in operation:", operationId, error);

    // Проверяем тип ошибки для более точного ответа
    if (error instanceof Error) {
      // Ошибка базы данных
      if (
        error.message.includes("database") ||
        error.message.includes("connection")
      ) {
        return internalErrorResponse("Database connection failed", operationId);
      }

      // Ошибка размера payload
      if (
        error.message.includes("too large") ||
        error.message.includes("payload")
      ) {
        return payloadTooLargeResponse({
          max_products: 10000,
          max_size_mb: 50,
        });
      }
    }

    return internalErrorResponse(
      error instanceof Error ? error.message : String(error),
      operationId
    );
  }
}

// GET метод остается без изменений
export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      select: {
        productId: true,
        tags: true,
        productInfo: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return successResponse(
      {
        products: products.map((p) => ({
          product_id: p.productId,
          tags: p.tags,
          product_info: p.productInfo,
        })),
        total_count: products.length,
        last_updated: products[0]?.updatedAt?.toISOString() || null,
      },
      "Product catalog retrieved successfully"
    );
  } catch (error) {
    console.error("Store endpoint GET: Error retrieving products:", error);
    return internalErrorResponse(
      error instanceof Error ? error.message : String(error),
      undefined,
      "Failed to retrieve product catalog"
    );
  }
}
