// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/category-section/category-card.tsx

"use client";

import React from "react";
import { GripVertical } from "lucide-react";
import { CategoryActionsDropdown } from "../category-actions-dropdown";
import { useSortable } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { humanize } from "@/app/@right/(_service)/(_libs)/humanize";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  category: MenuCategory;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  isActive: boolean;
  onClick: () => void;
}

export function CategoryCard({
  category,
  setCategories,
  isActive,
  onClick,
}: CategoryCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.title });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 20 : 1,
      }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      aria-selected={isActive}
    >
      <Card
        className={cn(
          "bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer h-[60px]",
          isActive ? "ring-2 ring-white" : ""
        )}
      >
        <CardContent className="flex items-center justify-between p-0 h-full">
          <h4 className="text-white font-semibold text-base line-clamp-1 whitespace-nowrap overflow-hidden">
            {humanize(category.title)}
          </h4>
          <div className="flex items-center gap-1 ml-3">
            <CategoryActionsDropdown
              categoryTitle={category.title}
              setCategories={setCategories}
            />
            <span
              className="flex items-center justify-center w-8 h-8 cursor-grab rounded hover:bg-accent/60"
              tabIndex={-1}
            >
              <GripVertical className="w-4 h-4 text-primary/80" />
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
