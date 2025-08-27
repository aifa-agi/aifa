// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/page-list.tsx

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
import { PageListItem } from "./page-list-item";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

interface PageListProps {
  pages: PageData[];
  categoryTitle: string;
  setIsOpen: (open: boolean) => void;
  categories: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  onPageDragEnd: (activeId: string, overId: string) => void;
}

export function PageList({
  pages,
  categoryTitle,
  categories,
  setIsOpen,
  setCategories,
  onPageDragEnd,
}: PageListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && over?.id) {
      onPageDragEnd(active.id as string, over.id as string);
    }
  };

  if (!pages.length) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500 italic">
        <p>No pages in this category</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={pages.map((page) => page.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-0 pr-1">
          {pages.map((page) => (
            <PageListItem
              key={page.id}
              page={page}
              categoryTitle={categoryTitle}
              categories={categories}
              setCategories={setCategories}
              setIsOpen={setIsOpen}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
