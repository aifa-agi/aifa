// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/add-to-prompt-actions-dropdown/components/add-to-prompt-status-indicator.tsx

"use client";

import React from "react";
import { AddToPromptStatusIndicatorProps } from "../types";
import { cn } from "@/lib/utils";

/**
 * Status indicator circle for add to prompt mode selection
 */
export function AddToPromptStatusIndicator({
  mode,
  isActive,
}: AddToPromptStatusIndicatorProps) {
  const getIndicatorColor = () => {
    if (!isActive) return "bg-muted-foreground";

    switch (mode) {
      case "AddToPromptOn":
        return "bg-green-500";
      case "AddToPromptOff":
        return "bg-orange-500";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <span
      className={cn(
        "inline-block mr-3 align-middle rounded-full border border-black/30",
        getIndicatorColor()
      )}
      style={{
        width: 4,
        height: 4,
        minWidth: 4,
        minHeight: 4,
      }}
    />
  );
}
