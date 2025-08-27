// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/badges-actions-dropdown/components/badges-trigger-button.tsx

"use client";

import React, { forwardRef } from "react";
import { Pencil } from "lucide-react";
import { BadgesTriggerButtonProps } from "../types";
import { cn } from "@/lib/utils";

export const BadgesTriggerButton = forwardRef<
  HTMLButtonElement,
  BadgesTriggerButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded transition hover:bg-accent/60",
        className
      )}
      tabIndex={-1}
      {...props}
    >
      <Pencil className="w-4 h-4 text-primary/80" />
    </button>
  );
});

BadgesTriggerButton.displayName = "BadgesTriggerButton";
