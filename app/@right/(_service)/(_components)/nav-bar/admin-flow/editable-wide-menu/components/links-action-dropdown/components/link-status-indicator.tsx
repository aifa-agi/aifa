// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/link-actions-dropdown/components/link-status-indicator.tsx

"use client";

import React from "react";
import { LinkStatusIndicatorProps } from "../types";
import { linkItemColors } from "../link-utils";
import { cn } from "@/lib/utils";

export function LinkStatusIndicator({ state }: LinkStatusIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-block align-middle rounded-full border border-black/30 mr-3",
        linkItemColors[state]
      )}
      style={{ width: 4, height: 4, minWidth: 4, minHeight: 4 }}
    />
  );
}
