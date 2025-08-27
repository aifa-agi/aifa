// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/chat-synchronise-action-dropdown/components/chat-sync-trigger-button.tsx

"use client";

import React, { forwardRef } from "react";
import { ArrowLeftRight } from "lucide-react";
import { ChatSyncTriggerButtonProps } from "../types";
import { chatSyncColors, isDropdownInteractive } from "../chat-sync-utils";
import { cn } from "@/lib/utils";

export const ChatSyncTriggerButton = forwardRef<
  HTMLButtonElement,
  ChatSyncTriggerButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ chatSyncState, className, ...props }, ref) => {
  const interactive = isDropdownInteractive(chatSyncState);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded transition relative z-10",
        chatSyncColors[chatSyncState],
        interactive
          ? "hover:bg-accent/60 cursor-pointer"
          : "cursor-not-allowed opacity-60",
        className
      )}
      tabIndex={interactive ? 0 : -1}
      aria-label={
        interactive
          ? "Toggle chat synchronization options"
          : "Content not ready for chat synchronization"
      }
      title={
        interactive
          ? "Click to toggle chat synchronization options"
          : "Content not ready for chat synchronization"
      }
      disabled={!interactive}
      {...props}
    >
      <ArrowLeftRight className="w-4 h-4" />
    </button>
  );
});

ChatSyncTriggerButton.displayName = "ChatSyncTriggerButton";
