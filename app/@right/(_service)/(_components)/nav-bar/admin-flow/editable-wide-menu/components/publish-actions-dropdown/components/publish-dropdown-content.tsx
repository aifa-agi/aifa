// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/publish-actions-dropdown/components/publish-dropdown-content.tsx

"use client";

import React from "react";

import { PublishDropdownContentProps } from "../types";
import { PublishStatusIndicator } from "./publish-status-indicator";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/**
 * Dropdown menu content with publish/draft options
 */

export function PublishDropdownContent({
  currentMode,
  onModeChange,
}: PublishDropdownContentProps) {
  return (
    <DropdownMenuContent align="end" className="min-w-[190px]">
      <DropdownMenuItem onClick={() => onModeChange("published")}>
        <span className="flex items-center">
          <PublishStatusIndicator
            mode="published"
            isActive={currentMode === "published"}
          />
          Publish
        </span>
      </DropdownMenuItem>

      <DropdownMenuItem onClick={() => onModeChange("draft")}>
        <span className="flex items-center">
          <PublishStatusIndicator
            mode="draft"
            isActive={currentMode === "draft"}
          />
          Draft
        </span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
