// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/category-section/add-category-card.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface AddCategoryCardProps {
  onClick: () => void;
}

export function AddCategoryCard({ onClick }: AddCategoryCardProps) {
  const handleClick = () => {
    onClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div className="p-1 mt-1">
      <Card
        className={cn(
          "bg-black border-2 border-green-500 p-4 rounded-lg cursor-pointer",
          "flex items-center justify-center h-[60px] min-h-[60px]",
          "hover:bg-green-950/40 focus:bg-green-950/40",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Add ne category"
        style={{ borderStyle: "dashed" }}
      >
        <CardContent className="flex items-center justify-center p-0 h-full w-full">
          <span className="text-green-400 font-semibold text-base select-none">
            Add category
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
