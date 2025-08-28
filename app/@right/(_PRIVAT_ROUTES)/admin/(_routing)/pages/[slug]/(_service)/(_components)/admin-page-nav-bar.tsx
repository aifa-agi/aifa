// @/app/admin/pages/[slug]/(_service)/(_components)/admin-page-nav-bar.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useAdminPagesNav } from "../(_context)/admin-pages-nav-context";
import { ADMIN_PAGES_TABS } from "../(_config)/admin-pages-config";

/**
 * Navigation bar component for admin pages
 * Uses centralized configuration for tab settings
 */
export default function AdminPagesNavBar() {
  const { activeTab, setActiveTab } = useAdminPagesNav();

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="flex justify-end flex-row gap-1 min-w-max pb-2">
          {ADMIN_PAGES_TABS.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              onClick={() => setActiveTab(tab.key)}
              title={tab.description} // Добавляем tooltip с описанием
              className={`
                whitespace-nowrap shrink-0
                ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              `}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
