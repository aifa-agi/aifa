// @/app/integrations/api/external-ai-assiatant/utils/analyze-tag-preferences.ts

import { prisma } from "@/lib/db";

/**
 * Interface for purchase history item from the API request
 */
interface PurchaseHistoryItem {
  product_id: string;
  quantity: number;
  price?: number;
  date?: string;
  [key: string]: any;
}

/**
 * Interface for tag statistics
 */
interface TagStats {
  tag: string;
  totalPurchases: number;
  totalQuantity: number;
  relatedProducts: Array<{
    productId: string;
    quantity: number;
    productName?: string;
  }>;
}

/**
 * Type guard to check if a value is a non-null object
 */
function isObject(value: any): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Helper function to safely extract product name from productInfo
 * @param productInfo - The JSON productInfo field from database
 * @returns string - The product name or empty string if not found
 */
function getProductName(productInfo: any): string {
  if (isObject(productInfo)) {
    // Try different possible name fields
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
  return "";
}

/**
 * Analyzes user's purchase history to extract tag preferences
 * based on products they've purchased and their associated tags
 *
 * @param purchaseHistory - Array of purchase history items from API request
 * @param availableProductIds - Array of currently available product IDs for filtering
 * @returns Promise<string> - Markdown formatted document with tag preferences
 */
export async function analyzeTagPreferences(
  purchaseHistory: PurchaseHistoryItem[] | null | undefined,
  availableProductIds: string[] = []
): Promise<string> {
  try {
    // Return empty string if no purchase history provided
    if (
      !purchaseHistory ||
      !Array.isArray(purchaseHistory) ||
      purchaseHistory.length === 0
    ) {
      return "";
    }

    // Get all products from database with their tags
    const allProducts = await prisma.product.findMany({
      select: {
        productId: true,
        tags: true,
        productInfo: true,
      },
    });

    // Create a map for quick product lookup
    const productMap = new Map(
      allProducts.map((product) => [product.productId, product])
    );

    // Map to store tag statistics
    const tagStats = new Map<string, TagStats>();

    // Process each purchase history item
    purchaseHistory.forEach((item) => {
      const productId = item.product_id;
      const quantity = item.quantity || 1;

      if (!productId) return; // Skip items without product_id

      // Get product information from database
      const product = productMap.get(productId);
      if (!product || !product.tags || product.tags.length === 0) {
        return; // Skip products without tags
      }

      // Get product name for display
      const productName = getProductName(product.productInfo) || productId;

      // Process each tag for this product
      product.tags.forEach((tag) => {
        // Get existing tag stats or create new ones
        const existing = tagStats.get(tag) || {
          tag,
          totalPurchases: 0,
          totalQuantity: 0,
          relatedProducts: [],
        };

        // Update tag statistics
        existing.totalPurchases += 1;
        existing.totalQuantity += quantity;

        // Find existing product in related products or add new one
        const existingProduct = existing.relatedProducts.find(
          (p) => p.productId === productId
        );
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          existing.relatedProducts.push({
            productId,
            quantity,
            productName,
          });
        }

        tagStats.set(tag, existing);
      });
    });

    // Convert to array and sort by total quantity (descending)
    const sortedTagStats = Array.from(tagStats.values()).sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    );

    // Filter tags that have products in available list (if provided)
    const filteredTagStats =
      availableProductIds.length > 0
        ? sortedTagStats.filter((tagStat) =>
            tagStat.relatedProducts.some((product) =>
              availableProductIds.includes(product.productId)
            )
          )
        : sortedTagStats;

    // Return empty string if no relevant tags found
    if (filteredTagStats.length === 0) {
      return "";
    }

    // Build markdown document
    let markdown = "ПРЕДПОЧТЕНИЯ КЛИЕНТА ПО ХАРАКТЕРИСТИКАМ ПРОДУКТОВ:\n\n";

    filteredTagStats.forEach((tagStat, index) => {
      markdown += `${index + 1}. **${tagStat.tag}**\n`;
      markdown += `   • Всего покупок с этим тегом: ${tagStat.totalQuantity} штук\n`;
      markdown += `   • Количество различных заказов: ${tagStat.totalPurchases}\n`;

      // List related products (limit to top 3 for readability)
      const topProducts = tagStat.relatedProducts
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 3);

      if (topProducts.length > 0) {
        markdown += `   • Популярные продукты с этим тегом:\n`;
        topProducts.forEach((product) => {
          markdown += `     - ${product.productName} (${product.quantity} штук)\n`;
        });
      }

      markdown += "\n";
    });

    // Add summary section if there are many tags
    if (filteredTagStats.length > 5) {
      const topTags = filteredTagStats
        .slice(0, 3)
        .map((t) => t.tag)
        .join(", ");
      markdown += `**Основные предпочтения:** ${topTags}\n\n`;
    }

    return markdown;
  } catch (error) {
    console.error("Error analyzing tag preferences:", error);

    // Return fallback message on error
    return "ПРЕДПОЧТЕНИЯ ПО ХАРАКТЕРИСТИКАМ: информация временно недоступна\n\n";
  }
}

/**
 * Helper function to get unique tags from purchase history
 * Useful for debugging and analytics
 */
export async function getUniqueTagsFromPurchaseHistory(
  purchaseHistory: PurchaseHistoryItem[]
): Promise<string[]> {
  try {
    const productIds = purchaseHistory
      .map((item) => item.product_id)
      .filter(Boolean);

    if (productIds.length === 0) return [];

    const products = await prisma.product.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
      select: {
        tags: true,
      },
    });

    // Flatten and deduplicate tags
    const allTags = products.flatMap((product) => product.tags || []);
    return [...new Set(allTags)];
  } catch (error) {
    console.error("Error getting unique tags:", error);
    return [];
  }
}

/**
 * Helper function to validate if tags exist in database
 */
export async function validateTagsExist(tags: string[]): Promise<boolean> {
  try {
    const productsWithTags = await prisma.product.findMany({
      where: {
        tags: {
          hasSome: tags,
        },
      },
      select: {
        id: true,
      },
    });

    return productsWithTags.length > 0;
  } catch (error) {
    console.error("Error validating tags:", error);
    return false;
  }
}
