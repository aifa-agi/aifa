// @/app/integrations/api/external-ai-assiatant/utils/build-available-menu.ts

import { prisma } from "@/lib/db";

/**
 * Interface for menu category structure
 */
interface MenuCategory {
  name: string;
  products: MenuProduct[];
  order?: number;
}

/**
 * Interface for menu product structure
 */
interface MenuProduct {
  productId: string;
  name: string;
  description?: string;
  price?: number;
  calories?: number;
  weight?: string;
  tags: string[];
  category?: string;
  order?: number;
}

/**
 * Type guard to check if a value is a non-null object
 */
function isObject(value: any): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * НОВАЯ ФУНКЦИЯ: Получение короткого идентификатора для меню
 * Использует первые 6 символов от product_id для компактного отображения
 * @param productId - Полный идентификатор продукта
 * @returns Короткий идентификатор (первые 6 символов)
 */
function getShortProductId(productId: string): string {
  if (!productId || typeof productId !== "string") {
    return "UNKNOWN";
  }

  // Возвращаем первые 6 символов, если длина меньше 6 - возвращаем как есть
  return productId.length >= 6 ? productId.substring(0, 6) : productId;
}

/**
 * Helper function to safely extract product name from productInfo
 */
function getProductName(productInfo: any, fallbackId: string): string {
  let rawName = "";

  if (isObject(productInfo)) {
    if (typeof productInfo.name === "string" && productInfo.name.trim()) {
      rawName = productInfo.name;
    } else if (
      typeof productInfo.title === "string" &&
      productInfo.title.trim()
    ) {
      rawName = productInfo.title;
    } else if (
      typeof productInfo.displayName === "string" &&
      productInfo.displayName.trim()
    ) {
      rawName = productInfo.displayName;
    }
  }

  if (!rawName) {
    rawName = fallbackId;
  }

  // Применяем нормализацию к названию
  return normalizeProductName(rawName);
}

/**
 * Helper function to safely extract product description
 */
function getProductDescription(productInfo: any): string {
  if (isObject(productInfo)) {
    if (
      typeof productInfo.description === "string" &&
      productInfo.description.trim()
    ) {
      return productInfo.description;
    }
    if (typeof productInfo.desc === "string" && productInfo.desc.trim()) {
      return productInfo.desc;
    }
  }
  return "";
}

/**
 * Helper function to safely extract product price
 * Returns undefined instead of null to match optional property type
 */
function getProductPrice(productInfo: any): number | undefined {
  if (isObject(productInfo)) {
    if (typeof productInfo.price === "number" && productInfo.price > 0) {
      return productInfo.price;
    }
    if (typeof productInfo.cost === "number" && productInfo.cost > 0) {
      return productInfo.cost;
    }
  }
  return undefined;
}

/**
 * Helper function to safely extract product calories
 */
function getProductCalories(productInfo: any): number | undefined {
  if (isObject(productInfo)) {
    if (typeof productInfo.calories === "number" && productInfo.calories > 0) {
      return productInfo.calories;
    }
    if (typeof productInfo.kcal === "number" && productInfo.kcal > 0) {
      return productInfo.kcal;
    }
  }
  return undefined;
}

/**
 * Helper function to safely extract product weight/volume
 */
function getProductWeight(productInfo: any): string | undefined {
  if (isObject(productInfo)) {
    if (typeof productInfo.weight === "string" && productInfo.weight.trim()) {
      return productInfo.weight;
    }
    if (typeof productInfo.volume === "string" && productInfo.volume.trim()) {
      return productInfo.volume;
    }
    if (typeof productInfo.size === "string" && productInfo.size.trim()) {
      return productInfo.size;
    }
  }
  return undefined;
}

/**
 * Helper function to safely extract product category
 */
function getProductCategory(productInfo: any): string {
  if (isObject(productInfo)) {
    if (
      typeof productInfo.category === "string" &&
      productInfo.category.trim()
    ) {
      return productInfo.category;
    }
    if (typeof productInfo.type === "string" && productInfo.type.trim()) {
      return productInfo.type;
    }
    if (typeof productInfo.section === "string" && productInfo.section.trim()) {
      return productInfo.section;
    }
  }
  return "Прочее";
}

/**
 * Helper function to safely extract display order
 */
function getProductOrder(productInfo: any): number {
  if (isObject(productInfo)) {
    if (typeof productInfo.order === "number") {
      return productInfo.order;
    }
    if (typeof productInfo.sort === "number") {
      return productInfo.sort;
    }
    if (typeof productInfo.position === "number") {
      return productInfo.position;
    }
  }
  return 999; // Default order for items without explicit order
}

/**
 * ОБНОВЛЕННАЯ ФУНКЦИЯ: Парсит available_products как массив строк
 * @param availableProducts - Массив ID продуктов или строка разделенная запятыми
 * @returns Array of product IDs
 */
function parseAvailableProducts(
  availableProducts: string[] | string | null | undefined
): string[] {
  if (!availableProducts) return [];

  // Если уже массив - возвращаем отфильтрованный массив
  if (Array.isArray(availableProducts)) {
    return availableProducts.filter(
      (item) => typeof item === "string" && item.trim().length > 0
    );
  }

  // Если строка - парсим через запятую (для совместимости)
  if (typeof availableProducts === "string") {
    return availableProducts
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

/**
 * ГЛАВНАЯ ФУНКЦИЯ: Построение меню на основе доступных продуктов из базы данных
 * Фильтрует продукты по массиву available_products
 * ОБНОВЛЕНО: Использует короткие идентификаторы (первые 6 символов) для отображения в меню
 *
 * @param availableProducts - Массив ID доступных продуктов
 * @returns Promise<string> - Markdown форматированный документ меню
 */
export async function buildAvailableMenu(
  availableProducts: string[] | string | null | undefined
): Promise<string> {
  try {
    // Парсим доступные продукты
    const productIds = parseAvailableProducts(availableProducts);
    console.log("Available product IDs:", productIds);

    if (productIds.length === 0) {
      return "";
    }

    // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Получаем только продукты, которые есть в available_products
    const availableProductsFromDb = await prisma.product.findMany({
      where: {
        productId: {
          in: productIds, // Фильтруем по available_products
        },
      },
      select: {
        productId: true,
        productInfo: true,
        tags: true,
      },
    });

    console.log(
      "Products found in database:",
      availableProductsFromDb.length,
      "out of",
      productIds.length,
      "requested"
    );

    if (availableProductsFromDb.length === 0) {
      return "АКТУАЛЬНОЕ МЕНЮ: запрашиваемые продукты не найдены в базе данных\n\n";
    }

    // Трансформируем продукты из базы данных в продукты меню
    const menuProducts: MenuProduct[] = availableProductsFromDb.map(
      (dbProduct) => {
        const productInfo = dbProduct.productInfo;

        return {
          productId: dbProduct.productId,
          name: getProductName(productInfo, dbProduct.productId),
          description: getProductDescription(productInfo) || undefined,
          price: getProductPrice(productInfo),
          calories: getProductCalories(productInfo),
          weight: getProductWeight(productInfo),
          tags: dbProduct.tags || [],
          category: getProductCategory(productInfo),
          order: getProductOrder(productInfo),
        };
      }
    );

    // Группируем продукты по категориям
    const categoriesMap = new Map<string, MenuProduct[]>();

    menuProducts.forEach((product) => {
      const category = product.category || "Прочее";
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, []);
      }
      categoriesMap.get(category)!.push(product);
    });

    // Сортируем продукты внутри каждой категории
    categoriesMap.forEach((products) => {
      products.sort((a, b) => {
        // Сначала по order, затем по имени
        if (a.order !== b.order) {
          return (a.order || 999) - (b.order || 999);
        }
        return a.name.localeCompare(b.name, "ru");
      });
    });

    // Конвертируем в массив и сортируем категории
    const categories = Array.from(categoriesMap.entries()).map(
      ([name, products]) => ({
        name,
        products,
      })
    );

    // Сортируем категории
    const categoryOrder = [
      "Закуски",
      "Салаты",
      "Супы",
      "Горячие блюда",
      "Основные блюда",
      "Мясо",
      "Рыба",
      "Пицца",
      "Паста",
      "Гарниры",
      "Десерты",
      "Напитки",
      "Алкогольные напитки",
      "Прочее",
    ];

    categories.sort((a, b) => {
      const orderA = categoryOrder.indexOf(a.name);
      const orderB = categoryOrder.indexOf(b.name);

      if (orderA !== -1 && orderB !== -1) {
        return orderA - orderB;
      } else if (orderA !== -1) {
        return -1;
      } else if (orderB !== -1) {
        return 1;
      } else {
        return a.name.localeCompare(b.name, "ru");
      }
    });

    // Строим markdown документ
    let markdown = "АКТУАЛЬНОЕ МЕНЮ РЕСТОРАНА:\n\n";

    categories.forEach((category) => {
      // Заголовок категории
      markdown += `## ${category.name}\n\n`;

      category.products.forEach((product) => {
        // Название продукта
        markdown += `### Name: ${product.name}`;
        markdown += `\n`;

        // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Используем короткий идентификатор (первые 6 символов)
        markdown += `### Id: ${getShortProductId(product.productId)}`;
        markdown += `\n`;

        // Описание
        if (product.description) {
          markdown += `*${product.description}*\n\n`;
        }

        // Детали продукта
        const details: string[] = [];

        if (product.price !== undefined) {
          details.push(`**Цена:** ${product.price} руб.`);
        }

        if (product.weight) {
          details.push(`**Объем/Вес:** ${product.weight}`);
        }

        if (product.calories !== undefined) {
          details.push(`**Калории:** ${product.calories} ккал`);
        }

        if (product.tags.length > 0) {
          details.push(`**Характеристики:** ${product.tags.join(", ")}`);
        }

        if (details.length > 0) {
          markdown += details.join("  \n") + "\n\n";
        } else {
          markdown += "\n";
        }
      });
    });

    // Добавляем сводную статистику
    const totalProducts = menuProducts.length;
    const totalCategories = categories.length;

    markdown += `---\n\n`;
    markdown += `**Всего позиций в меню:** ${totalProducts}  \n`;
    markdown += `**Категорий:** ${totalCategories}\n\n`;

    // ДОБАВЛЯЕМ ПРИМЕЧАНИЕ О КОРОТКИХ ИДЕНТИФИКАТОРАХ
    markdown += `*Примечание: Id показан в сокращенном виде (первые 6 символов) для удобства отображения*\n\n`;

    return markdown;
  } catch (error) {
    console.error("Error building available menu:", error);

    // Возвращаем fallback сообщение при ошибке
    return "АКТУАЛЬНОЕ МЕНЮ: информация временно недоступна\n\n";
  }
}

/**
 * ОБНОВЛЕННАЯ функция для получения статистики меню
 */
export async function getMenuStatistics(
  availableProducts: string[] | string | null | undefined
): Promise<{
  totalProducts: number;
  totalCategories: number;
  categoriesBreakdown: Record<string, number>;
}> {
  try {
    const productIds = parseAvailableProducts(availableProducts);
    console.log("Product IDs for statistics:", productIds);

    if (productIds.length === 0) {
      return {
        totalProducts: 0,
        totalCategories: 0,
        categoriesBreakdown: {},
      };
    }

    const availableProductsFromDb = await prisma.product.findMany({
      where: {
        productId: {
          in: productIds, // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: фильтруем по available_products
        },
      },
      select: {
        productInfo: true,
      },
    });

    const categoriesBreakdown: Record<string, number> = {};

    availableProductsFromDb.forEach((product) => {
      const category = getProductCategory(product.productInfo);
      categoriesBreakdown[category] = (categoriesBreakdown[category] || 0) + 1;
    });

    return {
      totalProducts: availableProductsFromDb.length,
      totalCategories: Object.keys(categoriesBreakdown).length,
      categoriesBreakdown,
    };
  } catch (error) {
    console.error("Error getting menu statistics:", error);
    return {
      totalProducts: 0,
      totalCategories: 0,
      categoriesBreakdown: {},
    };
  }
}

/**
 * ОБНОВЛЕННАЯ функция для валидации доступных продуктов
 */
export async function validateAvailableProducts(
  availableProducts: string[] | string | null | undefined
): Promise<{
  existingProducts: string[];
  missingProducts: string[];
  shortIdMapping: Record<string, string>; // Добавлено: маппинг коротких ID к полным
}> {
  try {
    const requestedIds = parseAvailableProducts(availableProducts);

    if (requestedIds.length === 0) {
      return {
        existingProducts: [],
        missingProducts: [],
        shortIdMapping: {},
      };
    }

    const existingProducts = await prisma.product.findMany({
      where: {
        productId: {
          in: requestedIds,
        },
      },
      select: {
        productId: true,
      },
    });

    const existingIds = existingProducts.map((p) => p.productId);
    const missingIds = requestedIds.filter((id) => !existingIds.includes(id));

    // НОВОЕ: Создаем маппинг коротких ID к полным
    const shortIdMapping: Record<string, string> = {};
    existingIds.forEach((fullId) => {
      const shortId = getShortProductId(fullId);
      shortIdMapping[shortId] = fullId;
    });

    return {
      existingProducts: existingIds,
      missingProducts: missingIds,
      shortIdMapping,
    };
  } catch (error) {
    console.error("Error validating available products:", error);
    return {
      existingProducts: [],
      missingProducts: [],
      shortIdMapping: {},
    };
  }
}

/**
 * НОВАЯ ФУНКЦИЯ: Поиск полного ID продукта по короткому ID
 * @param shortId - Короткий идентификатор (первые 6 символов)
 * @param availableProducts - Массив доступных продуктов для поиска
 * @returns Promise<string | null> - Полный ID продукта или null если не найден
 */
export async function findFullProductId(
  shortId: string,
  availableProducts: string[] | string | null | undefined
): Promise<string | null> {
  try {
    const productIds = parseAvailableProducts(availableProducts);

    if (productIds.length === 0 || !shortId) {
      return null;
    }

    // Ищем полный ID, который начинается с короткого ID
    const matchingId = productIds.find((fullId) =>
      fullId.toLowerCase().startsWith(shortId.toLowerCase())
    );

    return matchingId || null;
  } catch (error) {
    console.error("Error finding full product ID:", error);
    return null;
  }
}

/**
 * НОВАЯ ФУНКЦИЯ: Нормализация названий продуктов
 * Приводит к нижнему регистру и заменяет специальные русские буквы
 * @param name - Исходное название продукта
 * @returns Нормализованное название
 */
function normalizeProductName(name: string): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  return name
    .toLowerCase() // Приводим к нижнему регистру
    .replace(/ё/g, "е") // Заменяем ё на е
    .replace(/Ё/g, "е") // Заменяем Ё на е (хотя после toLowerCase уже будет ё)
    .trim(); // Убираем лишние пробелы по краям
}

// Экспортируем функции для использования в других частях приложения
export { normalizeProductName, getShortProductId };
