// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/link-actions-dropdown/components/link-actions-dropdown.tsx

"use client";

import React from "react";

import { LinkActionsDropdownProps } from "../types";
import { LinkTriggerButton } from "./link-trigger-button";
import { LinkDropdownContent } from "./link-dropdown-content";
import { useLinkLogic } from "../hook/use-link-logic";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Main link actions dropdown component with conditional interaction
 * Only opens dropdown when content is ready for link management
 * Parent icon turns green only when all three link types are active
 */
export function LinksActionsDropdown({
  singlePage,
  categoryTitle,
  setCategories,
}: LinkActionsDropdownProps) {
  const { linkState, linkConfiguration, isInteractive, handleLinkToggle } =
    useLinkLogic({
      singlePage,
      categoryTitle,
      setCategories,
    });

  // If not interactive, render just the trigger button without dropdown functionality
  if (!isInteractive) {
    return <LinkTriggerButton linkState={linkState} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <LinkTriggerButton linkState={linkState} />
      </DropdownMenuTrigger>

      <LinkDropdownContent
        linkConfiguration={linkConfiguration}
        onLinkToggle={handleLinkToggle}
      />
    </DropdownMenu>
  );
}
