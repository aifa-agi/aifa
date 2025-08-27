// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/chat-synchronise-action-dropdown/hooks/use-chat-sync-logic.ts

import { useCallback, useEffect } from "react";
import { ChatSyncMode, ChatSyncState } from "../types";
import {
  getChatSyncState,
  getChatSyncMode,
  isDropdownInteractive,
  shouldAutoDesynchronize,
} from "../chat-sync-utils";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

interface UseChatSyncLogicProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

interface UseChatSyncLogicReturn {
  chatSyncState: ChatSyncState;
  chatSyncMode: ChatSyncMode;
  isInteractive: boolean;
  handleChatSyncMode: (mode: ChatSyncMode) => void;
}

/**
 * Custom hook to handle chat synchronization logic and automatic state management
 */
export function useChatSyncLogic({
  singlePage,
  categoryTitle,
  setCategories,
}: UseChatSyncLogicProps): UseChatSyncLogicReturn {
  const chatSyncState = getChatSyncState(singlePage);
  const chatSyncMode = getChatSyncMode(singlePage.isChatSynchronized);
  const isInteractive = isDropdownInteractive(chatSyncState);

  // Auto-desynchronize if content becomes incomplete
  useEffect(() => {
    if (shouldAutoDesynchronize(singlePage)) {
      console.log(
        "Auto-desynchronizing chat due to missing content:",
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
                        isChatSynchronized: false,
                      }
                ),
              }
        )
      );
    }
  }, [singlePage, categoryTitle, setCategories]);

  const handleChatSyncMode = useCallback(
    (mode: ChatSyncMode) => {
      // Only allow mode change if dropdown is interactive
      if (!isInteractive) {
        console.warn("Cannot change chat sync mode: content not ready");
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
                        isChatSynchronized: mode === "ChatSyncOn",
                      }
                ),
              }
        )
      );

      console.log("CHAT SYNC MODE CHANGED", singlePage.id, mode);
    },
    [singlePage.id, categoryTitle, setCategories, isInteractive]
  );

  return {
    chatSyncState,
    chatSyncMode,
    isInteractive,
    handleChatSyncMode,
  };
}
