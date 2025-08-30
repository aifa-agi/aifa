// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_utils)/page-helpers.ts
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

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
