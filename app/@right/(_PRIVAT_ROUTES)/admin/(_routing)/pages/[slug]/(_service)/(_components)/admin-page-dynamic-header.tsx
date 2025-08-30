// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-page-dynamic-header.tsx
"use client";

import { useAdminPagesNav } from "../(_context)/admin-pages-nav-context";
import {
  ADMIN_PAGES_TABS,
  ADMIN_PAGES_CONFIG,
} from "../(_config)/admin-pages-config";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Component that displays dynamic title and description based on active tab
 * Updates both title and description when user switches between tabs
 * Also shows step type (required/optional) with appropriate styling
 */
export function AdminPageDynamicHeader() {
  const { activeTab } = useAdminPagesNav();

  // Find the active tab configuration to get its title and description
  const activeTabConfig = ADMIN_PAGES_TABS.find((tab) => tab.key === activeTab);

  const title = activeTabConfig?.title || ADMIN_PAGES_CONFIG.fallbackTitle;
  const description =
    activeTabConfig?.description || "Managing page content and settings";

  // Get step type information
  const stepType = activeTabConfig?.stepType;
  const isRequired = stepType === "required";
  const etapNumber = activeTabConfig?.etapNumber;

  // Don't show step type for info page
  const showStepType = activeTab !== "info" && stepType;

  const getStepTypeDisplay = () => {
    if (!showStepType) return null;

    const icon = isRequired ? (
      <AlertCircle className="size-4 text-red-500" />
    ) : (
      <CheckCircle2 className="size-4 text-blue-500" />
    );

    const text = isRequired ? "Required Step" : "Optional Step";
    const badgeVariant = isRequired ? "destructive" : "secondary";

    return (
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          {icon}
          <Badge variant={badgeVariant} className="font-medium">
            {text}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6 pb-4 border-b w-[450px] min-w-[250px]">
      <h1 className="text-2xl font-bold mb-2 line-clamp-1">{title}</h1>
      <p className="text-muted-foreground line-clamp-2">{description}</p>

      {/* Step type information - displayed below description */}
      {getStepTypeDisplay()}
    </div>
  );
}
