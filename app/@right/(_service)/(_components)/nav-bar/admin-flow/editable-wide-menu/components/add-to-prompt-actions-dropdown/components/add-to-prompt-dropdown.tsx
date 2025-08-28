// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/add-to-prompt-actions-dropdown/components/add-to-prompt-dropdown.tsx

"use client";

import React from "react";

import { AddToPromptActionsDropdownProps } from "../types";
import { AddToPromptTriggerButton } from "./add-to-prompt-trigger-button";
import { AddToPromptDropdownContent } from "./add-to-prompt-dropdown-content";
import { useAddToPromptLogic } from "../hooks/use-add-to-prompt-logic";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Main add to prompt actions dropdown component with conditional interaction
 * Only opens dropdown when content is ready for add to prompt functionality
 */
export function AddToPromptActionsDropdown({
  singlePage,
  categoryTitle,
  setCategories,
}: AddToPromptActionsDropdownProps) {
  const {
    addToPromptState,
    addToPromptMode,
    isInteractive,
    handleAddToPromptMode,
  } = useAddToPromptLogic({
    singlePage,
    categoryTitle,
    setCategories,
  });

  // If not interactive, render just the trigger button without dropdown functionality
  if (!isInteractive) {
    return <AddToPromptTriggerButton addToPromptState={addToPromptState} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AddToPromptTriggerButton addToPromptState={addToPromptState} />
      </DropdownMenuTrigger>

      <AddToPromptDropdownContent
        currentMode={addToPromptMode}
        onModeChange={handleAddToPromptMode}
      />
    </DropdownMenu>
  );
}
