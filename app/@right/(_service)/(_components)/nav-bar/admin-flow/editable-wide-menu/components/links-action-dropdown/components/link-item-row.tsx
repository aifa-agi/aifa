// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/link-actions-dropdown/components/link-item-row.tsx

"use client";

import React from "react";
import { LinkItemRowProps } from "../types";
import { LinkStatusIndicator } from "./link-status-indicator";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

/**
 * Individual link item row with 4px indicator and toggle functionality
 */
export function LinkItemRow({
  linkType,
  state,
  onToggle,
  label,
}: LinkItemRowProps) {
  return (
    <DropdownMenuItem onClick={onToggle}>
      <span className="flex items-center">
        <LinkStatusIndicator state={state} />
        {label}
      </span>
    </DropdownMenuItem>
  );
}
