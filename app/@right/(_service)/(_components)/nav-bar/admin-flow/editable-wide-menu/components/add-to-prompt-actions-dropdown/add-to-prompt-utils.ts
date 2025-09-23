// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/add-to-prompt-actions-dropdown/add-to-prompt-utils.ts

import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { AddToPromptState, AddToPromptMode } from "./types";

export const addToPromptColors: Record<AddToPromptState, string> = {
  inactive: "text-muted-foreground", // Gray - content not ready
  pending: "text-orange-400", // Orange - ready but not added to prompt
  active: "text-green-500", // Green - added to prompt
};

/**
 * Check if page has all required content for add to prompt functionality
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
    console.log("Add to prompt content check:", {
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
 * Determine add to prompt state based on page data and content availability
 */
export function getAddToPromptState(page: PageData): AddToPromptState {
  const hasContent = hasPageContent(page);

  // If no content, always inactive regardless of isAddedToPrompt flag
  if (!hasContent) {
    return "inactive";
  }

  // If has content and added to prompt, show as active
  if (page.isAddedToPrompt) {
    return "active";
  }

  // If has content but not added to prompt, show as pending (ready for addition)
  return "pending";
}

/**
 * Check if dropdown should be interactive based on add to prompt state
 * Only pending and active states allow interaction
 */
export function isDropdownInteractive(
  addToPromptState: AddToPromptState
): boolean {
  return addToPromptState === "pending" || addToPromptState === "active";
}

/**
 * Get add to prompt mode from boolean state
 */
export function getAddToPromptMode(isAddedToPrompt: boolean): AddToPromptMode {
  return isAddedToPrompt ? "AddToPromptOn" : "AddToPromptOff";
}

/**
 * Determine if page should be automatically removed from prompt due to missing content
 */
export function shouldAutoRemoveFromPrompt(page: PageData): boolean {
  return page.isAddedToPrompt && !hasPageContent(page);
}
