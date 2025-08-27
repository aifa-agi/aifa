// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/link-actions-dropdown/components/link-trigger-button.tsx

"use client";

import React, { forwardRef } from "react";
import { Link2 } from "lucide-react";
import { LinkTriggerButtonProps } from "../types";
import { linkStateColors, isDropdownInteractive } from "../link-utils";
import { cn } from "@/lib/utils";

export const LinkTriggerButton = forwardRef<
  HTMLButtonElement,
  LinkTriggerButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ linkState, className, ...props }, ref) => {
  const interactive = isDropdownInteractive(linkState);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded transition relative z-10",
        linkStateColors[linkState],
        interactive
          ? "hover:bg-accent/60 cursor-pointer"
          : "cursor-not-allowed opacity-60",
        className
      )}
      tabIndex={interactive ? 0 : -1}
      aria-label={
        interactive
          ? "Toggle link management options"
          : "Content not ready for link management"
      }
      title={
        interactive
          ? "Click to manage page links"
          : "Content not ready for link management"
      }
      disabled={!interactive}
      {...props}
    >
      <Link2 className="w-4 h-4" />
      <span className="sr-only">Link builder</span>
    </button>
  );
});

LinkTriggerButton.displayName = "LinkTriggerButton";
