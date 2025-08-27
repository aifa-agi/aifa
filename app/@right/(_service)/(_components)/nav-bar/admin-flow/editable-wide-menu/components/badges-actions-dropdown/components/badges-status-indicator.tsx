// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/badges-actions-dropdown/components/badges-status-indicator.tsx

"use client";

import React from "react";
import { BadgesStatusIndicatorProps } from "../types";
import { getIndicatorColorClass } from "../badges-utils";
import { cn } from "@/lib/utils";

/**
 * Status indicator circle for badges and roles
 */
export function BadgesStatusIndicator({
  isActive,
}: BadgesStatusIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-block mr-3 align-middle rounded-full border border-black/30",
        getIndicatorColorClass(isActive)
      )}
      style={{ width: 4, height: 4, minWidth: 4, minHeight: 4 }}
    />
  );
}
