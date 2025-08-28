// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/add-to-prompt-actions-dropdown/hooks/use-add-to-prompt-logic.ts

import { useCallback, useEffect } from "react";
import { AddToPromptMode, AddToPromptState } from "../types";
import {
  getAddToPromptState,
  getAddToPromptMode,
  isDropdownInteractive,
  shouldAutoRemoveFromPrompt,
} from "../add-to-prompt-utils";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

interface UseAddToPromptLogicProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

interface UseAddToPromptLogicReturn {
  addToPromptState: AddToPromptState;
  addToPromptMode: AddToPromptMode;
  isInteractive: boolean;
  handleAddToPromptMode: (mode: AddToPromptMode) => void;
}

/**
 * Custom hook to handle add to prompt logic and automatic state management
 */
export function useAddToPromptLogic({
  singlePage,
  categoryTitle,
  setCategories,
}: UseAddToPromptLogicProps): UseAddToPromptLogicReturn {
  const addToPromptState = getAddToPromptState(singlePage);
  const addToPromptMode = getAddToPromptMode(singlePage.isAddedToPrompt);
  const isInteractive = isDropdownInteractive(addToPromptState);

  // Auto-remove from prompt if content becomes incomplete
  useEffect(() => {
    if (shouldAutoRemoveFromPrompt(singlePage)) {
      console.log(
        "Auto-removing from prompt due to missing content:",
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
                        isAddedToPrompt: false,
                      }
                ),
              }
        )
      );
    }
  }, [singlePage, categoryTitle, setCategories]);

  const handleAddToPromptMode = useCallback(
    (mode: AddToPromptMode) => {
      // Only allow mode change if dropdown is interactive
      if (!isInteractive) {
        console.warn("Cannot change add to prompt mode: content not ready");
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
                        isAddedToPrompt: mode === "AddToPromptOn",
                      }
                ),
              }
        )
      );

      console.log("ADD TO PROMPT MODE CHANGED", singlePage.id, mode);
    },
    [singlePage.id, categoryTitle, setCategories, isInteractive]
  );

  return {
    addToPromptState,
    addToPromptMode,
    isInteractive,
    handleAddToPromptMode,
  };
}
