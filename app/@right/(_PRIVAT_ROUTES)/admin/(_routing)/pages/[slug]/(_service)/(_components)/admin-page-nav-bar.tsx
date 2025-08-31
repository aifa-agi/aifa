"use client";

import { Button } from "@/components/ui/button";
import {
  AdminPageTab,
  useAdminPagesNav,
} from "../(_context)/admin-pages-nav-context";
import {
  ADMIN_PAGES_TABS,
  IndicatorStatus,
} from "../(_config)/admin-pages-config";

const getIndicatorColor = (status: IndicatorStatus): string => {
  switch (status) {
    case "gray":
      return "bg-gray-400";
    case "orange":
      return "bg-orange-500";
    case "green":
      return "bg-green-500";
    default:
      return "bg-gray-400";
  }
};

export default function AdminPagesNavBar() {
  const { activeTab, setActiveTab, getIndicatorStatus, displayMode } =
    useAdminPagesNav();

  // Фильтрация табов в зависимости от режима отображения
  const getFilteredTabs = () => {
    if (displayMode === "required") {
      // Показать только Required шаги + Info
      return ADMIN_PAGES_TABS.filter(
        (tab) => tab.stepType === "required" || tab.key === "info"
      );
    }
    // Показать все табы
    return ADMIN_PAGES_TABS;
  };

  // Получение правильного label в зависимости от режима отображения
  const getTabLabel = (tab: (typeof ADMIN_PAGES_TABS)[0]): string => {
    if (displayMode === "required" && tab.titleForRequired) {
      return tab.titleForRequired;
    }
    return tab.label;
  };

  const handleTabClick = (tabKey: AdminPageTab) => {
    const indicatorStatus = getIndicatorStatus(tabKey);

    // Allow click only if:
    // 1. Tab is "info" (always accessible)
    // 2. Tab has green indicator (completed)
    // 3. Tab has orange indicator (ready to activate)
    // Prevent click if tab has gray indicator (not ready)
    if (
      tabKey === "info" ||
      indicatorStatus === "green" ||
      indicatorStatus === "orange"
    ) {
      setActiveTab(tabKey);
    }
  };

  const filteredTabs = getFilteredTabs();

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="flex justify-end flex-row gap-1 min-w-max pb-2">
          {filteredTabs.map((tab) => {
            const indicatorStatus = getIndicatorStatus(tab.key);
            const isClickable =
              tab.key === "info" ||
              indicatorStatus === "green" ||
              indicatorStatus === "orange";

            const tabLabel = getTabLabel(tab);

            return (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "outline"}
                onClick={() => handleTabClick(tab.key)}
                disabled={!isClickable}
                title={
                  !isClickable
                    ? `${tab.description} - Complete dependencies first to access`
                    : tab.description
                }
                className={`
                  whitespace-nowrap shrink-0 relative
                  ${tab.hasIndicator ? "pl-8" : ""}
                  ${
                    activeTab === tab.key
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                  ${!isClickable ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {tab.hasIndicator && indicatorStatus && (
                  <div
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 size-1 rounded-full ${getIndicatorColor(indicatorStatus)}`}
                  />
                )}
                {tabLabel}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
