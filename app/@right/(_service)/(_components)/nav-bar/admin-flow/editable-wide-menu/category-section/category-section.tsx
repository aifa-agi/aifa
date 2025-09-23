// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/category-section/category-section.tsx

"use client";

import React from "react";
import { CategoryList } from "./category-list";
import { ActionButtons } from "../action-buttons/action-buttons";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

interface CategorySectionProps {
  categories: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  activeCategoryTitle: string | null;
  onCategoryClick: (title: string | null) => void;
  onCategoryDragEnd: (activeId: string, overId: string) => void;
  onAddCategory: () => void;
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

export function CategorySection({
  categories,
  setCategories,
  activeCategoryTitle,
  onCategoryClick,
  onCategoryDragEnd,
  onAddCategory,
  dirty,
  loading,
  onUpdate,
  onRetry,
  canRetry,
  retryCount,
  lastError,
}: CategorySectionProps) {
  return (
    <div className="bg-gray-900 p-8 flex flex-col">
      <h3 className="text-gray-400 text-sm font-semibold mb-2 tracking-wider">
        CATEGORIES
      </h3>

      <CategoryList
        categories={categories}
        setCategories={setCategories}
        activeCategoryTitle={activeCategoryTitle}
        onCategoryClick={onCategoryClick}
        onCategoryDragEnd={onCategoryDragEnd}
        onAddCategory={onAddCategory}
      />

      <ActionButtons
        dirty={dirty}
        loading={loading}
        onUpdate={onUpdate}
        onRetry={onRetry}
        canRetry={canRetry}
        retryCount={retryCount}
        lastError={lastError}
      />
    </div>
  );
}
