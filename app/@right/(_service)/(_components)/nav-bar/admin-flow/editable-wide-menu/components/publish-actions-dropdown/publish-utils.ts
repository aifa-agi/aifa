// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/publish-actions-dropdown/publish-utils.ts

import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { PublishState, PublishMode } from "./types";

export const globeColors: Record<PublishState, string> = {
  inactive: "text-muted-foreground", // Gray - content not ready
  pending: "text-orange-400", // Orange - ready draft
  active: "text-green-500", // Green - published
};

/**
 * Check if page has all required content for publishing
 */
export function hasPageContent(page: PageData): boolean {
  const hasBasicContent = Boolean(
      (page.title &&
      page.title.trim().length > 0 &&
      page.description &&
      page.description.trim().length > 0 &&
      page.images &&
      page.images.length > 0 &&
      page.keywords &&
      page.keywords.length > 0 &&
      page.sections &&
      page.sections.length > 0) || page.isPreviewComplited
  );

  return hasBasicContent;
}

/**
 * Determine publish state based on page data and content availability
 */
export function getPublishState(page: PageData): PublishState {
  const hasContent = hasPageContent(page);

  // If no content, always inactive regardless of isPublished flag
  if (!hasContent) {
    return "inactive";
  }

  // If has content and published, show as active
  if (page.isPublished) {
    return "active";
  }

  // If has content but not published, show as pending (draft ready)
  return "pending";
}

/**
 * Check if dropdown should be interactive based on publish state
 */
export function isDropdownInteractive(publishState: PublishState): boolean {
  return publishState === "pending" || publishState === "active";
}

/**
 * Get publish mode from boolean state
 */
export function getPublishMode(isPublished: boolean): PublishMode {
  return isPublished ? "published" : "draft";
}

/**
 * Determine if page should be automatically unpublished due to missing content
 */
export function shouldAutoUnpublish(page: PageData): boolean {
  return page.isPublished && !hasPageContent(page);
}
