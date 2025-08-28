// @/app/admin/pages/[slug]/(_service)/(_components)/admin-page-dynamic-description.tsx

"use client";

import { useAdminPagesNav } from "../(_context)/admin-pages-nav-context";
import { ADMIN_PAGES_TABS } from "../(_config)/admin-pages-config";

/**
 * Component that displays dynamic description based on active tab
 * Updates description when user switches between tabs
 */
export function AdminPageDynamicDescription() {
  const { activeTab } = useAdminPagesNav();

  // Find the active tab configuration to get its description
  const activeTabConfig = ADMIN_PAGES_TABS.find((tab) => tab.key === activeTab);
  const description =
    activeTabConfig?.description || "Managing page content and settings";

  return <p className="text-muted-foreground">{description}</p>;
}
