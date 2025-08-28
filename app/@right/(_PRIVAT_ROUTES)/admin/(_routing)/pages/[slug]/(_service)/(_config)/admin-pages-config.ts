// @/app/admin/pages/[slug]/(_service)/(_config)/admin-pages-config.ts

import { AdminPageTab } from "../(_context)/admin-pages-nav-context";

/**
 * Configuration for admin pages navigation tabs
 * Centralized place to manage tab settings and labels
 */
export interface AdminPageTabConfig {
  key: AdminPageTab;
  label: string;
  description: string; // Убираем optional, так как теперь всегда нужно описание
}

/**
 * Admin pages tabs configuration
 * Add new tabs here to extend functionality
 */
export const ADMIN_PAGES_TABS: AdminPageTabConfig[] = [
  {
    key: "info",
    label: "Info",
    description: "Basic page information and metadata",
  },
  {
    key: "structure",
    label: "Structure",
    description: "Page layout and content structure",
  },
];

/**
 * Page configuration settings
 */
export const ADMIN_PAGES_CONFIG = {
  pageTitle: "Page Administration",
  defaultTab: "info" as AdminPageTab,
} as const;
