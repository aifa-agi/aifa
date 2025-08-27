// @/app/(_service)/contexts/dialogs/components/image-item.tsx

import React, { memo } from "react";
import { X } from "lucide-react";
import { ImagePreview } from "./image-preview";
import { PageImages } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageItemProps {
  image: PageImages;
  index: number;
  onImageChange: (index: number, field: "alt" | "href", value: string) => void;
  onRemoveImage: (index: number) => void;
  hasValidationIssue: boolean;
  isLoading: boolean;
  canDelete: boolean;
  validationError: string;
}

export const ImageItem = memo(
  ({
    image,
    index,
    onImageChange,
    onRemoveImage,
    hasValidationIssue,
    isLoading,
    canDelete,
    validationError,
  }: ImageItemProps) => {
    // Handle uploaded image URL update
    const handleImageUploaded = (url: string) => {
      onImageChange(index, "href", url);
    };

    return (
      <div className="space-y-2">
        <div className="flex items-start gap-3 p-3 border border-border rounded-lg bg-background">
          {/* Image preview with upload functionality */}
          <div className="flex-shrink-0">
            <ImagePreview
              href={image.href}
              alt={image.alt}
              onImageUploaded={handleImageUploaded}
              disabled={isLoading}
            />
          </div>

          {/* Input fields for alt text and URL */}
          <div className="flex-1 space-y-2">
            <Input
              value={image.alt || ""}
              onChange={(e) => onImageChange(index, "alt", e.target.value)}
              placeholder="Detailed alt description for AI optimization..."
              disabled={isLoading}
              className={`text-sm ${hasValidationIssue && validationError ? "border-red-300 focus:border-red-500" : ""}`}
            />
            <Input
              value={image.href || ""}
              onChange={(e) => onImageChange(index, "href", e.target.value)}
              placeholder="Image URL..."
              disabled={isLoading}
              className={`text-sm ${hasValidationIssue && validationError ? "border-red-300 focus:border-red-500" : ""}`}
            />
          </div>

          {/* Delete button (only shown when multiple images exist) */}
          {canDelete && (
            <div className="w-8 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemoveImage(index)}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ImageItem.displayName = "ImageItem";
