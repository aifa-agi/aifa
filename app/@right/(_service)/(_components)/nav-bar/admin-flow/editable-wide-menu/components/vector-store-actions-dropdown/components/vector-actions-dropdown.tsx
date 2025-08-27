// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/vector-store-actions-dropdown/components/vector-actions-dropdown.tsx

"use client";

import React from "react";

import { VectorStoreActionsDropdownProps } from "../types";
import { VectorStoreTriggerButton } from "./vector-trigger-button";
import { VectorStoreDropdownContent } from "./vector-dropdown-content";
import { useVectorLogic } from "../hooks/use-vector-logic";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Main vector store actions dropdown component with conditional interaction
 * Only opens dropdown when content is ready for vector store connection
 */
export function VectorStoreActionsDropdown({
  singlePage,
  categoryTitle,
  setCategories,
}: VectorStoreActionsDropdownProps) {
  const {
    vectorStoreState,
    vectorStoreMode,
    isInteractive,
    handleVectorStoreMode,
  } = useVectorLogic({
    singlePage,
    categoryTitle,
    setCategories,
  });

  // If not interactive, render just the trigger button without dropdown functionality
  if (!isInteractive) {
    return <VectorStoreTriggerButton vectorStoreState={vectorStoreState} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <VectorStoreTriggerButton vectorStoreState={vectorStoreState} />
      </DropdownMenuTrigger>

      <VectorStoreDropdownContent
        currentMode={vectorStoreMode}
        onModeChange={handleVectorStoreMode}
      />
    </DropdownMenu>
  );
}
