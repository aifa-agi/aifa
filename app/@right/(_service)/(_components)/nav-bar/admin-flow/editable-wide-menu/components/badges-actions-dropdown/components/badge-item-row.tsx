// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/badges-actions-dropdown/components/badge-item-row.tsx

"use client";

import React from "react";
import { BadgeItemRowProps } from "../types";
import { BadgesStatusIndicator } from "./badges-status-indicator";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

/**
 * Individual badge item row with toggle functionality
 */
export function BadgeItemRow({ badge, isActive, onToggle }: BadgeItemRowProps) {
  return (
    <DropdownMenuItem onClick={onToggle} className="cursor-pointer select-none">
      <BadgesStatusIndicator isActive={isActive} />
      <span className="capitalize">{badge}</span>
    </DropdownMenuItem>
  );
}
