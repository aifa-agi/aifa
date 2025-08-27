// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/vector-store-actions-dropdown/components/vector-status-indicator.tsx

"use client";

import React from "react";
import { VectorStoreStatusIndicatorProps } from "../types";
import { cn } from "@/lib/utils";

/**
 * Status indicator circle for vector store mode selection
 */
export function VectorStoreStatusIndicator({
  mode,
  isActive,
}: VectorStoreStatusIndicatorProps) {
  const getIndicatorColor = () => {
    if (!isActive) return "bg-muted-foreground";

    switch (mode) {
      case "VectorStoreOn":
        return "bg-green-500";
      case "VectorStoreOff":
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
