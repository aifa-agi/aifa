// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/category-actions-dropdown.tsx

"use client";

import React from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { normalizeText } from "@/app/@right/(_service)/(_libs)/normalize-text";
import { transliterate } from "@/lib/utils/transliterate";

interface CategoryActionsDropdownProps {
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

// Список защищенных категорий, для которых нельзя показывать действия
const PROTECTED_CATEGORIES = ["root", "admin", "home"];

export function CategoryActionsDropdown({
  categoryTitle,
  setCategories,
}: CategoryActionsDropdownProps) {
  const dialogs = useDialogs();

  // Проверяем, является ли категория защищенной
  const isProtectedCategory = PROTECTED_CATEGORIES.includes(
    categoryTitle.toLowerCase()
  );

  // Если категория защищенная, не показываем дропдаун
  if (isProtectedCategory) {
    return null;
  }

  // Обработчик переименования категории
  const handleRename = () => {
    dialogs.show({
      type: "edit",
      title: "Rename category",
      description: "Enter new category name",
      value: categoryTitle,
      confirmLabel: "Rename",
      cancelLabel: "Cancel",
      onConfirm: (value) => {
        const newTitle = value?.trim();
        if (!newTitle) {
          toast.error("Category name cannot be empty");
          return;
        }

        setCategories((prev) => {
          const exists = prev.some(
            (cat) =>
              cat.title !== categoryTitle &&
              cat.title.toLowerCase() === newTitle.toLowerCase()
          );

          if (exists) {
            toast.error("Category with this name already exists");
            return prev;
          }

          const newHref = "/" + transliterate(newTitle);

          // Обновляем категорию и все страницы внутри неё
          const updatedCategories = prev.map((cat) => {
            if (cat.title !== categoryTitle) return cat;

            // Обновить href каждой страницы, заменяя старый href категории на новый
            const oldCategoryHref = cat.href ?? "/" + transliterate(cat.title);

            const updatedPages = cat.pages.map((page) => {
              const pageSlug = page.href?.split("/").pop() ?? transliterate(page.title ?? page.linkName);
              return {
                ...page,
                href: `${newHref}/${pageSlug}`,
              };
            });

            return {
              ...cat,
              title: newTitle,
              href: newHref,
              pages: updatedPages,
            };
          });

          toast.success("Category renamed successfully");
          return updatedCategories;
        });
      },
      onCancel: () => { },
    });
  };

  const handleDelete = () => {
    dialogs.show({
      type: "delete",
      title: "Delete category",
      description: `Are you sure you want to delete category "${categoryTitle}"? All pages in this category will also be deleted. This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: () => {
        setCategories((prev) => {
          const filteredCategories = prev.filter(
            (cat) => cat.title !== categoryTitle
          );
          toast.success("Category deleted successfully");
          return filteredCategories;
        });
      },
      onCancel: () => { },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-accent/60"
          onClick={(e) => {
            e.stopPropagation(); // Предотвращаем срабатывание клика по карточке
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open category menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {/* Переименование */}
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleRename();
          }}
          className="cursor-pointer"
        >
          <Edit className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Удаление */}
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
