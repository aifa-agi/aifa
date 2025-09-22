// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/badges-actions-dropdown/badges-utils.ts

import { BadgeName } from "@/config/pages-config/badges/badge-config";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { UserType } from "@prisma/client";

/**
 * Colors for status indicators
 */
export const badgeIndicatorColors = {
  active: "bg-green-500",
  inactive: "bg-muted-foreground",
};

/**
 * Check if role is active for the page
 */
export function isRoleActive(page: PageData, role: UserType): boolean {
  return Boolean(page.roles?.includes(role));
}

/**
 * Check if badge is active for the page
 */
export function isBadgeActive(page: PageData, badge: BadgeName): boolean {
  return Boolean(page.hasBadge && page.badgeName === badge);
}

/**
 * Get indicator color class based on active state
 */
export function getIndicatorColorClass(isActive: boolean): string {
  return isActive ? badgeIndicatorColors.active : badgeIndicatorColors.inactive;
}
