// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/publish-actions-dropdown/hooks/use-publish-logic.ts

import { useCallback, useEffect } from "react";
import { PublishMode, PublishState } from "../types";
import {
  getPublishState,
  getPublishMode,
  isDropdownInteractive,
  shouldAutoUnpublish,
} from "../publish-utils";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

interface UsePublishLogicProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

interface UsePublishLogicReturn {
  publishState: PublishState;
  publishMode: PublishMode;
  isInteractive: boolean;
  handlePublishMode: (mode: PublishMode) => void;
}

/**
 * Custom hook to handle publish logic and automatic state management
 */
export function usePublishLogic({
  singlePage,
  categoryTitle,
  setCategories,
}: UsePublishLogicProps): UsePublishLogicReturn {
  const publishState = getPublishState(singlePage);
  const publishMode = getPublishMode(singlePage.isPublished);
  const isInteractive = isDropdownInteractive(publishState);

  // Auto-unpublish if content becomes incomplete
  useEffect(() => {
    if (shouldAutoUnpublish(singlePage)) {
      console.log(
        "Auto-unpublishing page due to missing content:",
        singlePage.id
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((page) =>
                  page.id !== singlePage.id
                    ? page
                    : {
                        ...page,
                        isPublished: false,
                      }
                ),
              }
        )
      );
    }
  }, [singlePage, categoryTitle, setCategories]);

  const handlePublishMode = useCallback(
    (mode: PublishMode) => {
      // Only allow mode change if dropdown is interactive
      if (!isInteractive) {
        console.warn("Cannot change publish mode: content not ready");
        return;
      }

      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((page) =>
                  page.id !== singlePage.id
                    ? page
                    : {
                        ...page,
                        isPublished: mode === "published",
                      }
                ),
              }
        )
      );

      console.log("PUBLISH MODE CHANGED", singlePage.id, mode);
    },
    [singlePage.id, categoryTitle, setCategories, isInteractive]
  );

  return {
    publishState,
    publishMode,
    isInteractive,
    handlePublishMode,
  };
}
