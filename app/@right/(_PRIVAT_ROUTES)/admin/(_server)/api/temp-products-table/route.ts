// @/app/@right/(_PRIVAT_ROUTES)/admin/(_server)/api/temp-products-table/route.ts
// API маршрут для получения данных продуктов
// Возвращает только productId и tags для оптимизации производительности

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
/**
 * GET /api/temp-products-table
 * Получение списка всех продуктов с полями productId и tags
 */
export async function GET() {
  try {
    // Получаем продукты из базы данных, выбирая только нужные поля
    const products = await prisma.product.findMany({
      select: {
        productId: true,
        tags: true,
      },
      orderBy: {
        createdAt: "desc", // Сортировка по дате создания (новые первыми)
      },
    });

    // Возвращаем успешный ответ
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    // Логируем ошибку для отладки
    console.error("Ошибка при получении продуктов:", error);

    // Возвращаем ошибку клиенту
    return NextResponse.json(
      {
        success: false,
        error: "Не удалось получить данные продуктов",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * Опциональный POST метод для будущих операций
 * Можно добавить позже для создания продуктов
 */
export async function POST() {
  return NextResponse.json(
    { error: "Метод POST не реализован" },
    { status: 405 }
  );
}
