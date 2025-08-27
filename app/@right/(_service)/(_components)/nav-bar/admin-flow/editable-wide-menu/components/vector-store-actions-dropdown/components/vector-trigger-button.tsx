// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/vector-store-actions-dropdown/components/vector-trigger-button.tsx

"use client";

import React, { forwardRef } from "react";
import { Database } from "lucide-react";
import { VectorStoreTriggerButtonProps } from "../types";
import { vectorStoreColors, isDropdownInteractive } from "../vector-utils";
import { cn } from "@/lib/utils";

export const VectorStoreTriggerButton = forwardRef<
  HTMLButtonElement,
  VectorStoreTriggerButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ vectorStoreState, className, ...props }, ref) => {
  const interactive = isDropdownInteractive(vectorStoreState);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded transition relative z-10",
        vectorStoreColors[vectorStoreState],
        interactive
          ? "hover:bg-accent/60 cursor-pointer"
          : "cursor-not-allowed opacity-60",
        className
      )}
      tabIndex={interactive ? 0 : -1}
      aria-label={
        interactive
          ? "Toggle vector store options"
          : "Content not ready for vector store connection"
      }
      title={
        interactive
          ? "Click to toggle vector store options"
          : "Content not ready for vector store connection"
      }
      disabled={!interactive}
      {...props}
    >
      <Database className="w-4 h-4" />
    </button>
  );
});

VectorStoreTriggerButton.displayName = "VectorStoreTriggerButton";
