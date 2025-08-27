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
      className="fixed inset-x-0 mx-auto bg-black text-white rounded-lg shadow-2xl overflow-hidden z-50"
      style={{ maxWidth: "80vw", top: "120px", height: "432px" }}
    >
      <div className="flex h-full">
        <PageSection
          activeCategory={menuOperations.activeCategory}
          categories={categories}
          setCategories={setCategories}
          onAddPage={menuOperations.handleAddPage}
          onPageDragEnd={menuOperations.handlePageDragEnd}
          setIsOpen={setIsOpen}
        />

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
  );
}
