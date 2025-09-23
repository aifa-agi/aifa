// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/vector-store-actions-dropdown/vector-utils.ts

import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { VectorStoreState, VectorStoreMode } from "./types";

export const vectorStoreColors: Record<VectorStoreState, string> = {
  inactive: "text-muted-foreground", // Gray - content not ready
  pending: "text-orange-400", // Orange - ready but not connected
  active: "text-green-500", // Green - connected to vector store
};

/**
 * Check if page has all required content for vector store connection
 * Must have: title, description, images, keywords, sections
 */
export function hasPageContent(page: PageData): boolean {
  // Check title
  const hasTitle = Boolean(page.title && page.title.trim().length > 0);

  // Check description
  const hasDescription = Boolean(
    page.description && page.description.trim().length > 0
  );

  // Check images (must have at least one)
  const hasImages = Boolean(page.images && page.images.length > 0);

  // Check keywords (must have at least one)
  const hasKeywords = Boolean(page.keywords && page.keywords.length > 0);

  // Check sections (must have at least one)
  const hasSections = Boolean(page.sections && page.sections.length > 0);
  
  const hasDeployedPreview = Boolean(page.isPreviewComplited)
  const hasAllContent =
    (hasTitle && hasDescription && hasImages && hasKeywords && hasSections) || hasDeployedPreview;

  // Debug logging to help identify missing content
  if (!hasAllContent) {
    console.log("Vector store content check:", {
      hasTitle,
      hasDescription,
      hasImages,
      hasKeywords,
      hasSections,
      pageId: page.id,
    });
  }

  return hasAllContent;
}

/**
 * Determine vector store state based on page data and content availability
 */
export function getVectorStoreState(page: PageData): VectorStoreState {
  const hasContent = hasPageContent(page);

  // If no content, always inactive regardless of isVectorConnected flag
  if (!hasContent) {
    return "inactive";
  }

  // If has content and connected, show as active
  if (page.isVectorConnected) {
    return "active";
  }

  // If has content but not connected, show as pending (ready for connection)
  return "pending";
}

/**
 * Check if dropdown should be interactive based on vector store state
 * Only pending and active states allow interaction
 */
export function isDropdownInteractive(
  vectorStoreState: VectorStoreState
): boolean {
  return vectorStoreState === "pending" || vectorStoreState === "active";
}

/**
 * Get vector store mode from boolean state
 */
export function getVectorStoreMode(isConnected: boolean): VectorStoreMode {
  return isConnected ? "VectorStoreOn" : "VectorStoreOff";
}

/**
 * Determine if page should be automatically disconnected due to missing content
 */
export function shouldAutoDisconnect(page: PageData): boolean {
  return page.isVectorConnected && !hasPageContent(page);
}
