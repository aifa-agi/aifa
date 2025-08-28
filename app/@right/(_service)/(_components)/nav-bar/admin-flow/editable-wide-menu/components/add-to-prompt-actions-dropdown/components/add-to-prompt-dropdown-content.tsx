// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/add-to-prompt-actions-dropdown/components/add-to-prompt-dropdown-content.tsx

"use client";

import React from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AddToPromptDropdownContentProps } from "../types";
import { AddToPromptStatusIndicator } from "./add-to-prompt-status-indicator";

/**
 * Dropdown content for add to prompt mode selection
 * Allows switching between AddToPromptOn and AddToPromptOff modes
 */
export function AddToPromptDropdownContent({
  currentMode,
  onModeChange,
}: AddToPromptDropdownContentProps) {
  return (
    <DropdownMenuContent align="end" className="min-w-[200px]">
      <DropdownMenuItem
        onClick={() => onModeChange("AddToPromptOn")}
        className="cursor-pointer"
      >
        <AddToPromptStatusIndicator
          mode="AddToPromptOn"
          isActive={currentMode === "AddToPromptOn"}
        />
        <span className="text-sm">Add to Prompt</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => onModeChange("AddToPromptOff")}
        className="cursor-pointer"
      >
        <AddToPromptStatusIndicator
          mode="AddToPromptOff"
          isActive={currentMode === "AddToPromptOff"}
        />
        <span className="text-sm">Remove from Prompt</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
