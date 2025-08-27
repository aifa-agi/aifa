// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/publish-actions-dropdown/components/publish-status-indicator.tsx

"use client";

import React from "react";
import { PublishStatusIndicatorProps } from "../types";
import { cn } from "@/lib/utils";

/**
 * Status indicator circle for publish mode selection
 */
export function PublishStatusIndicator({
  mode,
  isActive,
}: PublishStatusIndicatorProps) {
  const getIndicatorColor = () => {
    if (!isActive) return "bg-muted-foreground";

    switch (mode) {
      case "published":
        return "bg-green-500";
      case "draft":
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
