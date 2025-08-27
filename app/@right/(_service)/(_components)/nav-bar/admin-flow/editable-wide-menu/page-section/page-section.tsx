// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/page-section.tsx

"use client";

import React from "react";
import { PageList } from "./page-list";
import { AddPageButton } from "./add-page-button";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { humanize } from "@/app/@right/(_service)/(_libs)/humanize";

interface PageSectionProps {
  activeCategory: MenuCategory | null;
  setIsOpen: (open: boolean) => void;
  categories: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  onAddPage: (category: MenuCategory) => void;
  onPageDragEnd: (activeId: string, overId: string) => void;
}

export function PageSection({
  activeCategory,
  categories,
  setIsOpen,
  setCategories,
  onAddPage,
  onPageDragEnd,
}: PageSectionProps) {
  return (
    <div className="flex-1 p-8 pb-12 flex flex-col custom-scrollbar">
      {activeCategory ? (
        <div className="relative flex-1 flex flex-col h-full min-h-0">
          <div
            className="sticky top-0 left-0 right-0 z-10 bg-black/90 backdrop-blur-sm pb-2 mb-2"
            style={{ paddingBottom: 12, marginBottom: 8 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400 text-base font-semibold tracking-wider border-b border-gray-700 pb-1">
                {humanize(activeCategory.title)}
              </h3>
              <AddPageButton
                category={activeCategory}
                onAddPage={onAddPage}
                className="ml-2"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <PageList
              pages={activeCategory.pages}
              categoryTitle={activeCategory.title}
              categories={categories}
              setCategories={setCategories}
              onPageDragEnd={onPageDragEnd}
              setIsOpen={setIsOpen}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-600 italic">
          Select a category to view its pages
        </div>
      )}
    </div>
  );
}
