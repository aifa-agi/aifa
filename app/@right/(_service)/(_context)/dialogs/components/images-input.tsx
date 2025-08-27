// @/app/(_service)/contexts/dialogs/components/images-input.tsx

"use client";

import React from "react";
import { Plus, AlertCircle } from "lucide-react";
import { PageImages } from "../types";
import { ImageItem } from "./image-item";
import { Button } from "@/components/ui/button";

interface ImagesInputProps {
  images: {
    imagesList: PageImages[];
    validationError: string;
    handleAddImage: () => void;
    handleRemoveImage: (index: number) => void;
    handleImageChange: (
      index: number,
      field: "alt" | "href",
      value: string
    ) => void;
  };
  isLoading?: boolean;
}

export function ImagesInput({ images, isLoading = false }: ImagesInputProps) {
  // Check if more images can be added (all fields must be filled)
  const canAddMore = images.imagesList.every(
    (image) => image.alt?.trim() && image.href?.trim()
  );

  return (
    <div className="space-y-3">
      {/* Header with add button */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Images</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={images.handleAddImage}
          disabled={isLoading || !canAddMore}
          className="h-8 px-2"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add More
        </Button>
      </div>

      {/* Scrollable container with images list */}
      <div className="h-[250px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {images.imagesList.map((image, index) => {
          const hasValidationIssue = !image.alt?.trim() || !image.href?.trim();

          return (
            <ImageItem
              key={image.id}
              image={image}
              index={index}
              onImageChange={images.handleImageChange}
              onRemoveImage={images.handleRemoveImage}
              hasValidationIssue={hasValidationIssue}
              isLoading={isLoading}
              canDelete={images.imagesList.length > 1}
              validationError={images.validationError}
            />
          );
        })}
      </div>

      {/* Validation error message */}
      {images.validationError && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{images.validationError}</span>
        </div>
      )}

      {/* User instructions */}
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>
          <strong>
            Use maximally detailed descriptions for images so artificial
            intelligence can make decisions about which area of the site this
            image will be most useful.
          </strong>
        </p>
        <p>
          Both Alt description and Image URL are required. Images without both
          fields will be automatically removed when saving.
        </p>
      </div>
    </div>
  );
}
