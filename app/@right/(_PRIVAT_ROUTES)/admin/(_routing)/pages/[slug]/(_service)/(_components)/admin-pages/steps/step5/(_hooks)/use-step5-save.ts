"use client";

/**
 * Step 5 - Save hook for draftContentStructure
 * Based on Step 8 save patterns with optimistic updates
 */

import * as React from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import type { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import type {
  PageData,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";

function deepCloneCategories(src: MenuCategory[]): MenuCategory[] {
  return JSON.parse(JSON.stringify(src)) as MenuCategory[];
}

function replacePageInCategories(
  categories: MenuCategory[],
  updatedPage: PageData
): MenuCategory[] {
  let replaced = false;
  const nextCategories = categories.map((cat) => {
    const pages = Array.isArray(cat.pages) ? cat.pages : [];
    const newPages = pages.map((p) => {
      if (p?.id === updatedPage.id) {
        replaced = true;
        return { ...updatedPage, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    return { ...cat, pages: newPages };
  });

  return replaced ? nextCategories : categories;
}

export function useStep5Save() {
  const { categories, setCategories, updateCategories } = useNavigationMenu();

  const saveDraftContentStructure = React.useCallback(
    async (
      page: PageData,
      draftStructure: RootContentStructure[]
    ): Promise<boolean> => {
      if (!page?.id) {
        toast.error("Save failed", {
          id: "step5-save-error",
          description: "Page not found for saving.",
        });
        return false;
      }

      // Snapshot for rollback
      const prevCategories = deepCloneCategories(categories);

      // Build updated page
      const updatedPage: PageData = {
        ...page,
        draftContentStructure: draftStructure,
      };

      // Compute next categories
      const nextCategories = replacePageInCategories(categories, updatedPage);

      // Optimistic patch
      setCategories(nextCategories);

      // Persist
      const error = await updateCategories();

      if (error) {
        // Rollback
        setCategories(prevCategories);

        toast.error("Save failed", {
          id: "step5-save-error",
          description: "Could not save draft structure. Changes reverted.",
        });
        toast.warning("Rolled back", {
          id: "step5-rollback",
          description: "Last change was reverted due to persistence error.",
        });

        return false;
      }

      toast.success("Saved", {
        id: "step5-save-success",
        description: "Draft content structure saved successfully.",
      });

      return true;
    },
    [categories, setCategories, updateCategories]
  );

  return {
    saveDraftContentStructure,
  };
}
