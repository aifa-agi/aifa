// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/add-to-prompt-actions-dropdown/components/add-to-prompt-trigger-button.tsx

"use client";

import React, { forwardRef } from "react";
import { WandSparkles } from "lucide-react";
import { AddToPromptTriggerButtonProps } from "../types";
import {
  addToPromptColors,
  isDropdownInteractive,
} from "../add-to-prompt-utils";
import { cn } from "@/lib/utils";

export const AddToPromptTriggerButton = forwardRef<
  HTMLButtonElement,
  AddToPromptTriggerButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ addToPromptState, className, ...props }, ref) => {
  const interactive = isDropdownInteractive(addToPromptState);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded transition relative z-10",
        addToPromptColors[addToPromptState],
        interactive
          ? "hover:bg-accent/60 cursor-pointer"
          : "cursor-not-allowed opacity-60",
        className
      )}
      tabIndex={interactive ? 0 : -1}
      aria-label={
        interactive
          ? "Toggle add to prompt options"
          : "Content not ready for add to prompt"
      }
      title={
        interactive
          ? "Click to toggle add to prompt options"
          : "Content not ready for add to prompt"
      }
      disabled={!interactive}
      {...props}
    >
      <WandSparkles className="w-4 h-4" />
    </button>
  );
});

AddToPromptTriggerButton.displayName = "AddToPromptTriggerButton";
