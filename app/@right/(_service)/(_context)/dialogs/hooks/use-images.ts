// @/app/(_service)/contexts/dialogs/hooks/use-images.ts

import { useState, useEffect, useCallback } from "react";
import { PageImages } from "../types";
import { generateCuid } from "@/lib/utils/generateCuid";

export function useImages(initialImages?: PageImages[]) {
  const [imagesList, setImagesList] = useState<PageImages[]>([]);
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    setImagesList(initialImages ?? [{ id: generateCuid(), alt: "", href: "" }]);
  }, [initialImages]);

  const validateImagesBeforeAdd = useCallback((): boolean => {
    const hasIncompleteImages = imagesList.some(
      (image) => !image.alt?.trim() || !image.href?.trim()
    );

    if (hasIncompleteImages) {
      setValidationError(
        "Please fill both Alt description and Image URL for all existing images before adding new ones"
      );
      return false;
    }

    setValidationError("");
    return true;
  }, [imagesList]);

  const handleAddImage = useCallback(() => {
    if (!validateImagesBeforeAdd()) return;

    setImagesList((prev) => [
      ...prev,
      {
        id: generateCuid(),
        alt: "",
        href: "",
      },
    ]);
  }, [validateImagesBeforeAdd]);

  const handleRemoveImage = useCallback((index: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
    setValidationError("");
  }, []);

  const handleImageChange = useCallback(
    (index: number, field: "alt" | "href", value: string) => {
      setImagesList((prev) =>
        prev.map((image, i) =>
          i === index ? { ...image, [field]: value } : image
        )
      );
      setValidationError("");
    },
    []
  );

  const reset = () => {
    setImagesList([]);
    setValidationError("");
  };

  return {
    imagesList,
    setImagesList,
    validationError,
    handleAddImage,
    handleRemoveImage,
    handleImageChange,
    reset,
  };
}
