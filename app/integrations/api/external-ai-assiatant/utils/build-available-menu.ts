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
  price?: number; // undefined, не null
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
 * Helper function to safely extract product name from productInfo
 */
function getProductName(productInfo: any, fallbackId: string): string {
  if (isObject(productInfo)) {
    if (typeof productInfo.name === "string" && productInfo.name.trim()) {
      return productInfo.name;
    }
    if (typeof productInfo.title === "string" && productInfo.title.trim()) {
      return productInfo.title;
    }
    if (
      typeof productInfo.displayName === "string" &&
      productInfo.displayName.trim()
    ) {
      return productInfo.displayName;
    }
  }
  return fallbackId;
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
  return undefined; // Изменено с null на undefined
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
  return undefined; // Изменено с null на undefined
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
  return undefined; // Изменено с пустой строки на undefined
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
 * Parses available items string into array
 * @param availableItems - Comma-separated string or array of product IDs
 * @returns Array of product IDs
 */
function parseAvailableItems(
  availableItems: string | string[] | null | undefined
): string[] {
  if (!availableItems) return [];

  if (Array.isArray(availableItems)) {
    return availableItems.filter(
      (item) => typeof item === "string" && item.trim().length > 0
    );
  }

  if (typeof availableItems === "string") {
    return availableItems
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

/**
 * Builds available menu markdown document from database products
 * filtered by available product IDs
 *
 * @param availableItems - Comma-separated string or array of available product IDs
 * @returns Promise<string> - Markdown formatted menu document
 */
export async function buildAvailableMenu(
  availableItems: string | string[] | null | undefined
): Promise<string> {
  try {
    // Parse available items
    const productIds = parseAvailableItems(availableItems);

    if (productIds.length === 0) {
      return "";
    }

    // Get available products from database
    const availableProducts = await prisma.product.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
      select: {
        productId: true,
        productInfo: true,
        tags: true,
      },
    });

    if (availableProducts.length === 0) {
      return "";
    }

    // Transform database products into menu products
    const menuProducts: MenuProduct[] = availableProducts.map((dbProduct) => {
      const productInfo = dbProduct.productInfo;

      return {
        productId: dbProduct.productId,
        name: getProductName(productInfo, dbProduct.productId),
        description: getProductDescription(productInfo) || undefined,
        price: getProductPrice(productInfo), // Теперь возвращает undefined, не null
        calories: getProductCalories(productInfo),
        weight: getProductWeight(productInfo),
        tags: dbProduct.tags || [],
        category: getProductCategory(productInfo),
        order: getProductOrder(productInfo),
      };
    });

    // Group products by category
    const categoriesMap = new Map<string, MenuProduct[]>();

    menuProducts.forEach((product) => {
      const category = product.category || "Прочее";
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, []);
      }
      categoriesMap.get(category)!.push(product);
    });

    // Sort products within each category
    categoriesMap.forEach((products) => {
      products.sort((a, b) => {
        // First by order, then by name
        if (a.order !== b.order) {
          return (a.order || 999) - (b.order || 999);
        }
        return a.name.localeCompare(b.name, "ru");
      });
    });

    // Convert to array and sort categories
    const categories = Array.from(categoriesMap.entries()).map(
      ([name, products]) => ({
        name,
        products,
      })
    );

    // Sort categories (you can customize this logic)
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

    // Build markdown document
    let markdown = "АКТУАЛЬНОЕ МЕНЮ РЕСТОРАНА:\n\n";

    categories.forEach((category) => {
      // Category header
      markdown += `## ${category.name}\n\n`;

      category.products.forEach((product) => {
        // Product name and ID
        markdown += `### ${product.name}`;
        if (product.productId !== product.name) {
          markdown += ` (${product.productId})`;
        }
        markdown += `\n`;

        // Description
        if (product.description) {
          markdown += `*${product.description}*\n\n`;
        }

        // Product details
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

    // Add summary statistics
    const totalProducts = menuProducts.length;
    const totalCategories = categories.length;

    markdown += `---\n\n`;
    markdown += `**Всего позиций в меню:** ${totalProducts}  \n`;
    markdown += `**Категорий:** ${totalCategories}\n\n`;

    return markdown;
  } catch (error) {
    console.error("Error building available menu:", error);

    // Return fallback message on error
    return "АКТУАЛЬНОЕ МЕНЮ: информация временно недоступна\n\n";
  }
}

/**
 * Helper function to get menu statistics
 */
export async function getMenuStatistics(
  availableItems: string | string[] | null | undefined
): Promise<{
  totalProducts: number;
  totalCategories: number;
  categoriesBreakdown: Record<string, number>;
}> {
  try {
    const productIds = parseAvailableItems(availableItems);

    if (productIds.length === 0) {
      return {
        totalProducts: 0,
        totalCategories: 0,
        categoriesBreakdown: {},
      };
    }

    const availableProducts = await prisma.product.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
      select: {
        productInfo: true,
      },
    });

    const categoriesBreakdown: Record<string, number> = {};

    availableProducts.forEach((product) => {
      const category = getProductCategory(product.productInfo);
      categoriesBreakdown[category] = (categoriesBreakdown[category] || 0) + 1;
    });

    return {
      totalProducts: availableProducts.length,
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
 * Helper function to validate that all requested products exist in database
 */
export async function validateAvailableProducts(
  availableItems: string | string[] | null | undefined
): Promise<{
  existingProducts: string[];
  missingProducts: string[];
}> {
  try {
    const requestedIds = parseAvailableItems(availableItems);

    if (requestedIds.length === 0) {
      return {
        existingProducts: [],
        missingProducts: [],
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

    return {
      existingProducts: existingIds,
      missingProducts: missingIds,
    };
  } catch (error) {
    console.error("Error validating available products:", error);
    return {
      existingProducts: [],
      missingProducts: [],
    };
  }
}
