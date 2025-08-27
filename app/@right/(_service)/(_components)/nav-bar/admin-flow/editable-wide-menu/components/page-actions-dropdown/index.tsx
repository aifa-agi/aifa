// @/app/(_service)/components/nav-bar/admin-flow/page-actions-dropdown/index.tsx
// Comments: Moved all hooks before conditional checks to follow React hooks rules

"use client";

import { FileCode2 } from "lucide-react";

import { PageActionsDropdownProps } from "./types";

import { PageActionsMenu } from "./components/page-actions-menu";
import { PageTypeMenu } from "./components/page-type-menu";
import { HomeActionsMenu } from "./components/home-actions-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIconStatus } from "./hooks/use-icon-status";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { usePageData } from "./hooks/use-page-data";
import { usePageActions } from "./hooks/use-page-actions";

export function PageActionsDropdown({
  singlePage,
  categoryTitle,
  categories,
  setCategories,
}: PageActionsDropdownProps) {
  // Все хуки должны быть вызваны ДО любых условных проверок
  const { dirty: hasUnsavedChanges } = useNavigationMenu();

  const { currentPageData, dataStatus, getCurrentPageData } = usePageData({
    singlePage,
    categoryTitle: categoryTitle || "", // Provide fallback to avoid undefined
    categories: categories || [], // Provide fallback to avoid undefined
  });

  const pageActions = usePageActions({
    singlePage,
    categoryTitle: categoryTitle || "",
    categories: categories || [],
    setCategories,
    getCurrentPageData,
  });

  const { iconStatus } = useIconStatus({
    currentPageData,
    dataStatus,
  });

  // Теперь проверяем условия ПОСЛЕ вызова всех хуков
  if (!categoryTitle || !categories) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <h3 className="font-bold text-red-800">Configuration Error</h3>
        <p className="text-red-700">
          Missing required props:
          {!categoryTitle && " categoryTitle"}
          {!categories && " categories"}
        </p>
        <p className="text-sm text-red-600 mt-2">
          Check parent component prop passing
        </p>
      </div>
    );
  }

  const getIconColorClass = () => {
    switch (iconStatus) {
      case "complete":
        return "text-green-600 hover:text-green-700";
      case "partial":
        return "text-orange-500 hover:text-orange-600";
      case "default":
      default:
        return "text-primary hover:text-primary/80";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex items-center justify-center w-8 h-8 rounded transition hover:bg-accent/60"
          tabIndex={-1}
        >
          <FileCode2
            className={cn("w-4 h-4 transition-colors", getIconColorClass())}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[190px]">
        {categoryTitle !== "home" ? (
          <PageActionsMenu
            {...dataStatus}
            {...pageActions}
            currentPageData={currentPageData}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        ) : (
          <HomeActionsMenu
            {...dataStatus}
            {...pageActions}
            currentPageData={currentPageData}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        )}
        {categoryTitle !== "home" && (
          <PageTypeMenu
            onSetPageType={pageActions.handleSetPageType}
            isPageTypeActive={pageActions.isPageTypeActive}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type { PageActionsDropdownProps } from "./types";
