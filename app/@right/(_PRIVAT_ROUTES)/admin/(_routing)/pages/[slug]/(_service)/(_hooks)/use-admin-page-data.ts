// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_hooks)/use-admin-page-data.ts

"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { UserType } from "@prisma/client";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { findPageBySlug } from "../(_utils)/page-helpers";

/**
 * Interface for the admin page data hook return value
 */
export interface UseAdminPageDataReturn {
  slug: string;
  page: PageData | null;
  category: { title: string } | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  userRole: UserType;
}

/**
 * Custom hook that extracts page data for admin components
 * Uses existing NavigationMenuProvider instead of creating duplicate context
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
    if (loading || !initialized) {
      return {
        page: null,
        category: null,
        error: null,
      };
    }

    const searchResult = findPageBySlug(categories, slug);

    if (!searchResult) {
      return {
        page: null,
        category: null,
        error: `Page with slug "${slug}" not found`,
      };
    }

    // Handle different return types from findPageBySlug function
    let page: PageData;
    let category: { title: string };

    if (
      typeof searchResult === "object" &&
      "page" in searchResult &&
      "category" in searchResult
    ) {
      // If returns object with page and category
      page = searchResult.page as PageData;
      category = searchResult.category as { title: string };
    } else {
      // If returns only PageData, create mock category
      page = searchResult as PageData;
      category = { title: "Unknown Category" };
    }

    return {
      page,
      category,
      error: null,
    };
  }, [categories, loading, initialized, slug]);

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
