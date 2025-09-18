"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { arrayMove } from "@dnd-kit/sortable";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import {
  ContentClassification,
  ContentStructure,
  PageType,
} from "@/app/@right/(_service)/(_types)/page-types";
import { generateCuid } from "@/lib/utils/generateCuid";
import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { normalizeText } from "@/app/@right/(_service)/(_libs)/normalize-text";
import { DEFAULT_CONTENT_STRUCTURE } from "@/config/default-page-structure-config";
import { transliterate } from "@/lib/utils/transliterate";

export function useMenuOperations(
  categories: MenuCategory[],
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>
) {
  const dialogs = useDialogs();
  const [activeCategoryTitle, setActiveCategoryTitle] = useState<string | null>(
    null
  );

  const activeCategory = useMemo(
    () => categories.find((cat) => cat.title === activeCategoryTitle) ?? null,
    [categories, activeCategoryTitle]
  );

  const handleCategoryDragEnd = (activeId: string, overId: string) => {
    if (activeId !== overId) {
      const oldIndex = categories.findIndex((c) => c.title === activeId);
      const newIndex = categories.findIndex((c) => c.title === overId);
      setCategories((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handlePageDragEnd = (activeId: string, overId: string) => {
    if (!activeCategory || activeId === overId) return;

    setCategories((cats) =>
      cats.map((cat) =>
        cat.title !== activeCategory.title
          ? cat
          : {
              ...cat,
              pages: arrayMove(
                cat.pages,
                cat.pages.findIndex((l) => l.id === activeId),
                cat.pages.findIndex((l) => l.id === overId)
              ),
            }
      )
    );
  };

  const handleAddCategory = () => {
    dialogs.show({
      type: "create",
      title: "New category",
      description: "Enter a category name",
      value: "",
      confirmLabel: "Create",
      onConfirm: (value) => {
        const normalizedTitle = value?.trim();
        if (!normalizedTitle) {
          toast.error("Category name cannot be empty");
          return;
        }

        const exists = categories.some(
          (cat) => cat.title.toLowerCase() === normalizedTitle.toLowerCase()
        );

        if (exists) {
          toast.error("Category with this name already exists");
          return;
        }

        const maxOrder = categories.length
          ? Math.max(...categories.map((c) => c.order ?? 0))
          : 0;

        // Генерация href из title
        const href = "/" + transliterate(normalizedTitle);

        setCategories((prev) => [
          ...prev,
          {
            title: normalizedTitle,
            href,
            pages: [],
            order: maxOrder + 1,
          },
        ]);
      },
    });
  };

  const handleAddPage = (category: MenuCategory) => {
    dialogs.show({
      type: "create",
      title: "New page",
      description: `Enter link name for "${category.title}"`,
      value: "",
      confirmLabel: "Create",
      onConfirm: (value) => {
        const normalizedTitle = value?.trim();
        if (!normalizedTitle) return;

        // Формируем slug/href для страницы: категория + транслит
        const pageSlug = transliterate(normalizedTitle);
        const categoryHref = category.href || "/" + transliterate(category.title);

        setCategories((prev) =>
          prev.map((cat) =>
            cat.title === category.title
              ? {
                  ...cat,
                  pages: [
                    ...cat.pages,
                    {
                      id: generateCuid(),
                      title: normalizedTitle,
                      linkName: normalizedTitle, // оставить для обратной совместимости
                      href: `${categoryHref}/${pageSlug}`,
                      roles: ["guest"],
                      hasBadge: false,
                      type: "blog",
                      aiRecommendContentStructure: DEFAULT_CONTENT_STRUCTURE,
                      isPublished: false,
                      isAddedToPrompt: false,
                      isVectorConnected: false,
                      isChatSynchronized: false,
                      order:
                        cat.pages.length > 0
                          ? Math.max(...cat.pages.map((l) => l.order ?? 0)) + 1
                          : 1,
                    },
                  ],
                }
              : cat
          )
        );
      },
    });
  };

  return {
    activeCategoryTitle,
    setActiveCategoryTitle,
    activeCategory,
    handleCategoryDragEnd,
    handlePageDragEnd,
    handleAddCategory,
    handleAddPage,
  };
}
