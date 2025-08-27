// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/chat-synchronise-action-dropdown/components/chat-sync-actions-dropdown.tsx

"use client";

import React from "react";

import { ChatSynchroniseActionDropdownProps } from "../types";
import { ChatSyncTriggerButton } from "./chat-sync-trigger-button";
import { ChatSyncDropdownContent } from "./chat-sync-dropdown-content";
import { useChatSyncLogic } from "../hooks/use-chat-sync-logic";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Main chat synchronization actions dropdown component with conditional interaction
 * Only opens dropdown when content is ready for chat synchronization
 */
export function ChatSynchroniseActionDropdown({
  singlePage,
  categoryTitle,
  setCategories,
}: ChatSynchroniseActionDropdownProps) {
  const { chatSyncState, chatSyncMode, isInteractive, handleChatSyncMode } =
    useChatSyncLogic({
      singlePage,
      categoryTitle,
      setCategories,
    });

  // If not interactive, render just the trigger button without dropdown functionality
  if (!isInteractive) {
    return <ChatSyncTriggerButton chatSyncState={chatSyncState} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ChatSyncTriggerButton chatSyncState={chatSyncState} />
      </DropdownMenuTrigger>

      <ChatSyncDropdownContent
        currentMode={chatSyncMode}
        onModeChange={handleChatSyncMode}
      />
    </DropdownMenu>
  );
}
