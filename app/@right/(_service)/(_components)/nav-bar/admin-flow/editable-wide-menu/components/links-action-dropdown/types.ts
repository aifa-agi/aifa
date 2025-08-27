// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/link-actions-dropdown/types.ts

import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Link management states
 * inactive - content not ready (gray)
 * pending - content ready but links not all configured (orange)
 * active - content ready and all links configured (green)
 */
export type LinkState = "inactive" | "pending" | "active";

/**
 * Individual link types that can be managed
 */
export type LinkType = "outgoing" | "incoming" | "external";

/**
 * Individual link item state
 */
export type LinkItemState = "pending" | "active";

/**
 * Link configuration status for each type
 */
export interface LinkConfiguration {
  outgoing: LinkItemState;
  incoming: LinkItemState;
  external: LinkItemState;
}

/**
 * Props for main link actions dropdown component
 */
export interface LinkActionsDropdownProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

/**
 * Props for link trigger button
 */
export interface LinkTriggerButtonProps {
  linkState: LinkState;
}

/**
 * Props for link dropdown content
 */
export interface LinkDropdownContentProps {
  linkConfiguration: LinkConfiguration;
  onLinkToggle: (linkType: LinkType) => void;
}

/**
 * Props for link status indicator (4px circle)
 */
export interface LinkStatusIndicatorProps {
  state: LinkItemState;
  size?: "small" | "normal"; // small = 4px, normal = 12px
}

/**
 * Props for individual link item row
 */
export interface LinkItemRowProps {
  linkType: LinkType;
  state: LinkItemState;
  onToggle: () => void;
  label: string;
}

/**
 * Extended PageData interface for link management
 * These properties should be added to your existing PageData type
 */
export interface LinkPageData extends PageData {
  linkConfiguration?: LinkConfiguration;
}
