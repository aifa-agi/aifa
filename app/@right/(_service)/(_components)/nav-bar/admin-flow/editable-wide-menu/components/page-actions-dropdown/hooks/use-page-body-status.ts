// @/app/(_service)/components/nav-bar/admin-flow/page-actions-dropdown/hooks/use-page-body-status.ts

import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { useMemo } from "react";

interface UsePageBodyStatusProps {
  currentPageData: PageData | null;
  dataStatus: {
    hasTitleData: boolean;
    hasDescriptionData: boolean;
    hasKeywordsData: boolean;
    hasImagesData: boolean;
  };
  hasUnsavedChanges?: boolean; // New prop for dirty state
}

export type PageBodyStatus = "inactive" | "ready" | "complete" | "blocked";

export function usePageBodyStatus({
  currentPageData,
  dataStatus,
  hasUnsavedChanges = false,
}: UsePageBodyStatusProps) {
  const pageBodyStatus: PageBodyStatus = useMemo(() => {
    if (!currentPageData) {
      return "inactive";
    }

    const { hasTitleData, hasDescriptionData, hasKeywordsData, hasImagesData } =
      dataStatus;
    const hasAllBasicData =
      hasTitleData && hasDescriptionData && hasKeywordsData && hasImagesData;

    if (!hasAllBasicData) {
      return "inactive";
    }

    // Block navigation if there are unsaved changes
    if (hasUnsavedChanges) {
      return "blocked";
    }

    const hasSections =
      (currentPageData.sections && currentPageData.sections.length > 0)|| currentPageData?.isPreviewComplited

    return hasSections ? "complete" : "ready";
  }, [currentPageData, dataStatus, hasUnsavedChanges]);

  const isClickable =
    pageBodyStatus === "ready" || pageBodyStatus === "complete";
  const isBlocked = pageBodyStatus === "blocked";

  const getIndicatorColorClass = () => {
    switch (pageBodyStatus) {
      case "complete":
        return "bg-green-500";
      case "ready":
        return "bg-orange-500";
      case "blocked":
        return "bg-yellow-500"; // Different color for blocked state
      case "inactive":
      default:
        return "bg-gray-400";
    }
  };

  const getButtonMessage = () => {
    switch (pageBodyStatus) {
      case "complete":
        return "Edit Page Body";
      case "ready":
        return "Create Page Body";
      case "blocked":
        return "Save changes first";
      case "inactive":
      default:
        return "Page Body";
    }
  };

  return {
    pageBodyStatus,
    isClickable,
    isBlocked,
    getIndicatorColorClass,
    getButtonMessage,
  };
}
