// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/add-page-button.tsx

"use client";

import React from "react";
import { Plus } from "lucide-react";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { Button } from "@/components/ui/button";

interface AddPageButtonProps {
  // The category to add a page to
  category: MenuCategory;
  // Callback function when button is clicked
  onAddPage: (category: MenuCategory) => void;
  // Optional custom className for additional styling
  className?: string;
  // Optional button size variant
  size?: "default" | "sm" | "lg" | "icon";
  // Optional button variant
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  // Optional custom title for accessibility
  title?: string;
}

export function AddPageButton({
  category,
  onAddPage,
  className = "",
  size = "icon",
  variant = "outline",
  title = "Add page",
}: AddPageButtonProps) {
  // Hide button if category is "home"
  if (category.title.toLowerCase() === "home") {
    return null;
  }

  // Handle button click and pass the category to the callback
  const handleClick = () => {
    onAddPage(category);
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={`border-green-500 border-2 rounded-full hover:bg-green-950/30 text-green-400 focus-visible:ring-green-400 ${className}`}
      onClick={handleClick}
      title={title}
    >
      <Plus className="w-4 h-4" />
    </Button>
  );
}
