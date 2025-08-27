// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/category-section/category-list.tsx

"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CategoryCard } from "./category-card";
import { AddCategoryCard } from "./add-category-card";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

interface CategoryListProps {
  categories: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  activeCategoryTitle: string | null;
  onCategoryClick: (title: string | null) => void;
  onCategoryDragEnd: (activeId: string, overId: string) => void;
  onAddCategory: () => void;
}

export function CategoryList({
  categories,
  setCategories,
  activeCategoryTitle,
  onCategoryClick,
  onCategoryDragEnd,
  onAddCategory,
}: CategoryListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && over?.id) {
      onCategoryDragEnd(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={categories.map((cat) => cat.title)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto space-y-2 px-2 pt-2 custom-scrollbar">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              category={category}
              setCategories={setCategories}
              isActive={activeCategoryTitle === category.title}
              onClick={() =>
                onCategoryClick(
                  activeCategoryTitle === category.title ? null : category.title
                )
              }
            />
          ))}

          <AddCategoryCard onClick={onAddCategory} />
        </div>
      </SortableContext>
    </DndContext>
  );
}
