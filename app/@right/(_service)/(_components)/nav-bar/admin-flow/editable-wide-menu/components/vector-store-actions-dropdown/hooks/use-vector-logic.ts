// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/vector-store-actions-dropdown/hooks/use-vector-logic.ts

import { useCallback, useEffect } from "react";
import { VectorStoreMode, VectorStoreState } from "../types";
import {
  getVectorStoreState,
  getVectorStoreMode,
  isDropdownInteractive,
  shouldAutoDisconnect,
} from "../vector-utils";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

interface UseVectorLogicProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

interface UseVectorLogicReturn {
  vectorStoreState: VectorStoreState;
  vectorStoreMode: VectorStoreMode;
  isInteractive: boolean;
  handleVectorStoreMode: (mode: VectorStoreMode) => void;
}

/**
 * Custom hook to handle vector store logic and automatic state management
 */
export function useVectorLogic({
  singlePage,
  categoryTitle,
  setCategories,
}: UseVectorLogicProps): UseVectorLogicReturn {
  const vectorStoreState = getVectorStoreState(singlePage);
  const vectorStoreMode = getVectorStoreMode(singlePage.isVectorConnected);
  const isInteractive = isDropdownInteractive(vectorStoreState);

  // Auto-disconnect if content becomes incomplete
  useEffect(() => {
    if (shouldAutoDisconnect(singlePage)) {
      console.log(
        "Auto-disconnecting vector store due to missing content:",
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
                        isVectorConnected: false,
                      }
                ),
              }
        )
      );
    }
  }, [singlePage, categoryTitle, setCategories]);

  const handleVectorStoreMode = useCallback(
    (mode: VectorStoreMode) => {
      // Only allow mode change if dropdown is interactive
      if (!isInteractive) {
        console.warn("Cannot change vector store mode: content not ready");
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
                        isVectorConnected: mode === "VectorStoreOn",
                      }
                ),
              }
        )
      );

      console.log("VECTOR STORE MODE CHANGED", singlePage.id, mode);
    },
    [singlePage.id, categoryTitle, setCategories, isInteractive]
  );

  return {
    vectorStoreState,
    vectorStoreMode,
    isInteractive,
    handleVectorStoreMode,
  };
}
