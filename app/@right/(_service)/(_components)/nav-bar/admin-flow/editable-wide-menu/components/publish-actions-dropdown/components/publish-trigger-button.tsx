// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/publish-actions-dropdown/components/publish-trigger-button.tsx

"use client";

import React, { forwardRef } from "react";
import { Globe } from "lucide-react";
import { PublishTriggerButtonProps } from "../types";
import { globeColors, isDropdownInteractive } from "../publish-utils";
import { cn } from "@/lib/utils";

export const PublishTriggerButton = forwardRef<
  HTMLButtonElement,
  PublishTriggerButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ publishState, onClick, className, ...props }, ref) => {
  const interactive = isDropdownInteractive(publishState);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!interactive) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded transition relative z-10",
        globeColors[publishState],
        interactive
          ? "hover:bg-accent/60 cursor-pointer"
          : "cursor-not-allowed opacity-60",
        className
      )}
      tabIndex={interactive ? 0 : -1}
      onClick={handleClick}
      aria-label={
        interactive
          ? "Toggle publish options"
          : "Content not ready for publishing"
      }
      title={
        interactive
          ? "Click to toggle publish options"
          : "Content not ready for publishing"
      }
      {...props}
    >
      <Globe className="w-4 h-4" />
    </button>
  );
});

PublishTriggerButton.displayName = "PublishTriggerButton";
