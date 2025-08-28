
// @/app/(_routing)/admin/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-sections/utils/page-helpers.ts

import { MenuCategory } from "@/app/(_service)/types/menu-types";

export const findPageBySlug = (
  categories: MenuCategory[],
  targetSlug: string
) => {
  for (const category of categories) {
    const page = category.pages.find((page) => page.linkName === targetSlug);
    if (page) {
      return { page, category };
    }
  }
  return null;
};
