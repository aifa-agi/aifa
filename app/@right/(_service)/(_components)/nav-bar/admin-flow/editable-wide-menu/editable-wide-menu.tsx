// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/editable-wide-menu.tsx

"use client";

import React from "react";
import { CategorySection } from "./category-section/category-section";
import { PageSection } from "./page-section/page-section";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { useMenuOperations } from "./hooks/use-menu-operations";

interface WideMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  categories: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  dirty: boolean;
  loading: boolean;
  onUpdate: () => Promise<void>;
  onRetry?: () => Promise<void>;
  canRetry?: boolean;
  retryCount?: number;
  lastError?: {
    status: string;
    message: string;
    canRetry: boolean;
  } | null;
}

export default function EditableWideMenu({
  isOpen,
  setIsOpen,
  categories,
  setCategories,
  dirty,
  loading,
  onUpdate,
  onRetry,
  canRetry = false,
  retryCount = 0,
  lastError,
}: WideMenuProps) {
  const menuOperations = useMenuOperations(categories, setCategories);

  if (!isOpen) return null;

  return (
    <div
      className="absolute bg-black text-white rounded-lg shadow-2xl overflow-hidden z-50 border"
      style={{
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        top: "120px",
        height: "432px",
      }}
    >
      <div className="flex h-full">

        <div className="flex-1 overflow-x-auto min-w-0 p-4">
          <PageSection
            activeCategory={menuOperations.activeCategory}
            categories={categories}
            setCategories={setCategories}
            onAddPage={menuOperations.handleAddPage}
            onPageDragEnd={menuOperations.handlePageDragEnd}
            setIsOpen={setIsOpen}
          />
        </div>



        <div className="w-px bg-gray-700 h-full"></div>



        <div className="flex-shrink-0 w-72 overflow-y-auto">

          <CategorySection
            categories={categories}
            setCategories={setCategories}
            activeCategoryTitle={menuOperations.activeCategoryTitle}
            onCategoryClick={menuOperations.setActiveCategoryTitle}
            onCategoryDragEnd={menuOperations.handleCategoryDragEnd}
            onAddCategory={menuOperations.handleAddCategory}
            dirty={dirty}
            loading={loading}
            onUpdate={onUpdate}
            onRetry={onRetry}
            canRetry={canRetry}
            retryCount={retryCount}
            lastError={lastError}
          />
        </div>
      </div>
    </div>
  );
}
