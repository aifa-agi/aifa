// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/link-actions-dropdown/link-utils.ts

import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { LinkState, LinkConfiguration, LinkItemState, LinkType } from "./types";

export const linkStateColors: Record<LinkState, string> = {
  inactive: "text-muted-foreground", // Gray - content not ready
  pending: "text-orange-400", // Orange - ready but not all links configured
  active: "text-green-500", // Green - all links configured
};

export const linkItemColors: Record<LinkItemState, string> = {
  pending: "bg-orange-500", // Orange - ready for configuration
  active: "bg-green-500", // Green - configured
};

/**
 * Check if page has all required content for link management
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
    console.log("Link management content check:", {
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
 * Get default link configuration
 */
export function getDefaultLinkConfiguration(): LinkConfiguration {
  return {
    outgoing: "pending",
    incoming: "pending",
    external: "pending",
  };
}

/**
 * Get current link configuration from page data
 */
export function getLinkConfiguration(page: PageData): LinkConfiguration {
  // Assuming linkConfiguration is stored in page data
  // You may need to adjust this based on your actual PageData structure
  return (page as any).linkConfiguration || getDefaultLinkConfiguration();
}

/**
 * Check if all link types are active
 */
export function areAllLinksActive(
  linkConfiguration: LinkConfiguration
): boolean {
  return (
    linkConfiguration.outgoing === "active" &&
    linkConfiguration.incoming === "active" &&
    linkConfiguration.external === "active"
  );
}

/**
 * Determine link state based on page data and link configuration
 */
export function getLinkState(page: PageData): LinkState {
  const hasContent = hasPageContent(page);

  // If no content, always inactive
  if (!hasContent) {
    return "inactive";
  }

  const linkConfiguration = getLinkConfiguration(page);

  // If has content and all links are active, show as active
  if (areAllLinksActive(linkConfiguration)) {
    return "active";
  }

  // If has content but not all links are active, show as pending
  return "pending";
}

/**
 * Check if dropdown should be interactive based on link state
 * Only pending and active states allow interaction
 */
export function isDropdownInteractive(linkState: LinkState): boolean {
  return linkState === "pending" || linkState === "active";
}

/**
 * Get human-readable label for link type
 */
export function getLinkTypeLabel(linkType: LinkType): string {
  switch (linkType) {
    case "outgoing":
      return "Get Links";
    case "incoming":
      return "Create Links";
    case "external":
      return "External Links";
    default:
      return "";
  }
}

/**
 * Toggle link item state
 */
export function toggleLinkItemState(
  currentState: LinkItemState
): LinkItemState {
  return currentState === "pending" ? "active" : "pending";
}

/**
 * Update link configuration with new state for specific type
 */
export function updateLinkConfiguration(
  currentConfig: LinkConfiguration,
  linkType: LinkType,
  newState: LinkItemState
): LinkConfiguration {
  return {
    ...currentConfig,
    [linkType]: newState,
  };
}
