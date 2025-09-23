// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/chat-synchronise-action-dropdown/chat-sync-utils.ts

import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { ChatSyncState, ChatSyncMode } from "./types";

export const chatSyncColors: Record<ChatSyncState, string> = {
  inactive: "text-muted-foreground", // Gray - content not ready
  pending: "text-orange-400", // Orange - ready but not synchronized
  active: "text-green-500", // Green - synchronized
};

/**
 * Check if page has all required content for chat synchronization
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
    console.log("Chat sync content check:", {
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
 * Determine chat sync state based on page data and content availability
 */
export function getChatSyncState(page: PageData): ChatSyncState {
  const hasContent = hasPageContent(page);

  // If no content, always inactive regardless of isChatSynchronized flag
  if (!hasContent) {
    return "inactive";
  }

  // If has content and synchronized, show as active
  if (page.isChatSynchronized) {
    return "active";
  }

  // If has content but not synchronized, show as pending (ready for sync)
  return "pending";
}

/**
 * Check if dropdown should be interactive based on chat sync state
 * Only pending and active states allow interaction
 */
export function isDropdownInteractive(chatSyncState: ChatSyncState): boolean {
  return chatSyncState === "pending" || chatSyncState === "active";
}

/**
 * Get chat sync mode from boolean state
 */
export function getChatSyncMode(isSynchronized: boolean): ChatSyncMode {
  return isSynchronized ? "ChatSyncOn" : "ChatSyncOff";
}

/**
 * Determine if page should be automatically desynchronized due to missing content
 */
export function shouldAutoDesynchronize(page: PageData): boolean {
  return page.isChatSynchronized && !hasPageContent(page);
}
