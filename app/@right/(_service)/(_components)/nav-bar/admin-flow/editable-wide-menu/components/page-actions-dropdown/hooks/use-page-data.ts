// @/app/(_service)/components/nav-bar/admin-flow/page-actions-dropdown/hooks/use-page-data.ts

import { useMemo } from "react";
import { PageDataStatus } from "../types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

interface UsePageDataProps {
  singlePage: PageData;
  categoryTitle: string;
  categories?: MenuCategory[];
}

export function usePageData({
  singlePage,
  categoryTitle,
  categories,
}: UsePageDataProps) {
  // Get current page data from categories or fallback to singlePage
  const getCurrentPageData = (): PageData => {
    if (!categoryTitle || !categories || categories.length === 0) {
      return singlePage;
    }

    try {
      const currentCategory = categories.find(
        (cat) => cat.title === categoryTitle
      );

      if (!currentCategory) {
        return singlePage;
      }

      const currentPage = currentCategory.pages.find(
        (page) => page.id === singlePage.id
      );

      return currentPage || singlePage;
    } catch (error) {
      return singlePage;
    }
  };

  // Memoized current page data
  const currentPageData = useMemo(
    () => getCurrentPageData(),
    [singlePage, categoryTitle, categories]
  );

  // Calculate data status
  const dataStatus: PageDataStatus = useMemo(
    () => ({
      hasTitleData: Boolean(currentPageData.title?.trim()),
      hasDescriptionData: Boolean(currentPageData.description?.trim()),
      hasKeywordsData: Boolean(currentPageData.keywords?.length),
      hasImagesData: Boolean(currentPageData.images?.length),
    }),
    [currentPageData]
  );

  return {
    currentPageData,
    dataStatus,
    getCurrentPageData,
  };
}
