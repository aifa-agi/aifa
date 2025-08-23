// @/app/integrations/api/external-ai-assiatant/utils/analyze-purchase-history.ts

import { prisma } from "@/lib/db";

/**
 * Interface for purchase history item from the API request
 */
interface PurchaseHistoryItem {
  quantity: number;
  price?: number;
  date?: string;
  [key: string]: any; // Allow additional fields
}

/**
 * Interface for aggregated purchase data
 */
interface ProductPurchaseStats {
  productId: string;
  totalQuantity: number;
  totalOrders: number;
  productInfo?: any;
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
 * Helper function to safely extract product description from productInfo
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
 * Helper function to safely extract product price from productInfo
 */
function getProductPrice(productInfo: any): number | null {
  if (isObject(productInfo)) {
    if (typeof productInfo.price === "number" && productInfo.price > 0) {
      return productInfo.price;
    }
    if (typeof productInfo.cost === "number" && productInfo.cost > 0) {
      return productInfo.cost;
    }
  }
  return null;
}

/**
 * Analyzes user's purchase history and creates a markdown document
 * with products sorted by purchase frequency
 *
 * @param purchaseHistory - Array of purchase history items from API request
 * @param availableProductIds - Array of currently available product IDs
 * @returns Promise<string> - Markdown formatted document with purchase preferences
 */
export async function analyzePurchasePreferences(
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

    // Get all products from database to have product information
    const allProducts = await prisma.product.findMany({
      select: {
        productId: true,
        productInfo: true,
        tags: true,
      },
    });

    // Create a map for quick product lookup
    const productMap = new Map(
      allProducts.map((product) => [product.productId, product])
    );

    // Aggregate purchase statistics
    const purchaseStats = new Map<string, ProductPurchaseStats>();

    // Process each purchase history item
    purchaseHistory.forEach((item) => {
      const productId = item.product_id;
      const quantity = item.quantity || 1;

      if (!productId) return; // Skip items without product_id

      // Get existing stats or create new ones
      const existing = purchaseStats.get(productId) || {
        productId,
        totalQuantity: 0,
        totalOrders: 0,
        productInfo: productMap.get(productId)?.productInfo,
      };

      // Update statistics
      existing.totalQuantity += quantity;
      existing.totalOrders += 1;

      purchaseStats.set(productId, existing);
    });

    // Convert to array and sort by total quantity (descending)
    const sortedStats = Array.from(purchaseStats.values()).sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    );

    // Filter only available products if list provided
    const filteredStats =
      availableProductIds.length > 0
        ? sortedStats.filter((stat) =>
            availableProductIds.includes(stat.productId)
          )
        : sortedStats;

    // Return empty string if no relevant products found
    if (filteredStats.length === 0) {
      return "";
    }

    // Build markdown document
    let markdown = "ПРЕДПОЧТЕНИЯ КЛИЕНТА НА ОСНОВЕ ИСТОРИИ ПОКУПОК:\n\n";

    filteredStats.forEach((stat, index) => {
      const productName = getProductName(stat.productInfo) || stat.productId;
      const description = getProductDescription(stat.productInfo);
      const price = getProductPrice(stat.productInfo);

      markdown += `${index + 1}. **${productName}** (ID: ${stat.productId})\n`;
      markdown += `   • Всего заказано: ${stat.totalQuantity} штук\n`;
      markdown += `   • Количество заказов: ${stat.totalOrders}\n`;

      // Add product description if available
      if (description) {
        markdown += `   • Описание: ${description}\n`;
      }

      // Add price if available
      if (price !== null) {
        markdown += `   • Цена: ${price} руб.\n`;
      }

      markdown += "\n";
    });

    return markdown;
  } catch (error) {
    console.error("Error analyzing purchase preferences:", error);

    // Return fallback message on error
    return "ПРЕДПОЧТЕНИЯ КЛИЕНТА: информация временно недоступна\n\n";
  }
}

/**
 * Helper function to validate purchase history item structure
 */
export function isValidPurchaseItem(item: any): item is PurchaseHistoryItem {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof item.product_id === "string" &&
    item.product_id.length > 0 &&
    (typeof item.quantity === "number" || typeof item.quantity === "undefined")
  );
}

/**
 * Helper function to sanitize purchase history array
 */
export function sanitizePurchaseHistory(
  purchaseHistory: any[] | null | undefined
): PurchaseHistoryItem[] {
  if (!Array.isArray(purchaseHistory)) {
    return [];
  }

  return purchaseHistory.filter(isValidPurchaseItem);
}
