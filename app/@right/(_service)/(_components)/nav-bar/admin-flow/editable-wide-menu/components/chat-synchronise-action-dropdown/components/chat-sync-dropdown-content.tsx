// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/chat-synchronise-action-dropdown/components/chat-sync-dropdown-content.tsx

"use client";

import React from "react";

import { ChatSyncDropdownContentProps } from "../types";
import { ChatSyncStatusIndicator } from "./chat-sync-status-indicator";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/**
 * Dropdown menu content with synchronize/unsynchronize options
 */
export function ChatSyncDropdownContent({
  currentMode,
  onModeChange,
}: ChatSyncDropdownContentProps) {
  return (
    <DropdownMenuContent align="end" className="min-w-[190px]">
      <DropdownMenuItem onClick={() => onModeChange("ChatSyncOn")}>
        <span className="flex items-center">
          <ChatSyncStatusIndicator
            mode="ChatSyncOn"
            isActive={currentMode === "ChatSyncOn"}
          />
          Synchronize
        </span>
      </DropdownMenuItem>

      <DropdownMenuItem onClick={() => onModeChange("ChatSyncOff")}>
        <span className="flex items-center">
          <ChatSyncStatusIndicator
            mode="ChatSyncOff"
            isActive={currentMode === "ChatSyncOff"}
          />
          Unsynchronize
        </span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
