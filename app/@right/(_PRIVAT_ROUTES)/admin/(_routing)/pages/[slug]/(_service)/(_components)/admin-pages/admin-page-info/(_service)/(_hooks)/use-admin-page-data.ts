// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_hooks)/use-admin-page-data.ts

"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { UserType } from "@prisma/client";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { UseAdminPageDataReturn } from "../(_types)/admin-page-types";

/**
 * Helper function to find page by slug in categories
 * @param categories - Array of menu categories
 * @param targetSlug - Slug to search for
 * @returns Found page data with category or null
 */
const findPageBySlug = (
  categories: any[],
  targetSlug: string
): { page: PageData; category: { title: string } } | null => {
  for (const category of categories) {
    const page = category.pages.find(
      (page: PageData) => page.linkName === targetSlug
    );
    if (page) {
      return { page, category };
    }
  }
  return null;
};

/**
 * Custom hook that extracts page data for admin components
 * Uses existing NavigationMenuProvider to avoid duplication and maintain consistency
 *
 * Key features:
 * - Integrates with existing navigation context
 * - Provides type-safe page data access
 * - Includes user role information
 * - Handles loading and error states
 * - Memoized for performance optimization
 *
 * @param slug - The page slug to find data for
 * @returns Object containing page data, loading states, and user role
 */
export function useAdminPageData(slug: string): UseAdminPageDataReturn {
  const { categories, loading, initialized } = useNavigationMenu();
  const { data: session } = useSession();
  const userRole: UserType = session?.user?.type || "guest";

  /**
   * Memoized computation of page data to avoid unnecessary recalculations
   * Uses the existing navigation menu data instead of fetching separately
   */
  const pageData = useMemo(() => {
    // Return loading state if navigation data is not ready
    if (loading || !initialized) {
      return {
        page: null,
        category: null,
        error: null,
      };
    }

    // Search for page in navigation categories
    const searchResult = findPageBySlug(categories, slug);

    if (!searchResult) {
      return {
        page: null,
        category: null,
        error: `Page with slug "${slug}" not found in navigation data`,
      };
    }

    // Extract page and category data
    const { page, category } = searchResult;

    // Validate page data structure
    if (!page.id || !page.linkName) {
      return {
        page: null,
        category: null,
        error: `Invalid page data structure for slug "${slug}"`,
      };
    }

    console.log(`Found admin page data for slug: ${slug}`, {
      pageId: page.id,
      categoryTitle: category.title,
      pageType: page.type,
    });

    return {
      page,
      category,
      error: null,
    };
  }, [categories, loading, initialized, slug]);

  // Log current state for debugging
  console.log(`useAdminPageData hook state:`, {
    slug,
    loading,
    initialized,
    categoriesCount: categories?.length || 0,
    hasPageData: !!pageData.page,
    userRole,
  });

  return {
    slug,
    page: pageData.page,
    category: pageData.category,
    loading,
    initialized,
    error: pageData.error,
    userRole,
  };
}
