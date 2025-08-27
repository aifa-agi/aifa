// @/app/(_service)/contexts/dialogs/components/dialog-content.tsx

"use client";

import React from "react";
import { DialogState, DialogType, InputType, PageImages } from "../types";
import { InputFields } from "./input-fields";
import {
  DialogContent as ShadcnDialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogContentProps {
  dialog: DialogState;
  input: string;
  setInput: (value: string) => void;
  onClose: () => void;
  onConfirm: (
    onConfirm?: (
      value?: string,
      keywords?: string[],
      images?: PageImages[]
    ) => void,
    type?: DialogType,
    inputType?: InputType,
    value?: string,
    keywords?: string[],
    images?: PageImages[]
  ) => void;
  keywords: {
    keywordsList: string[];
    handleAddKeyword: () => void;
    handleRemoveKeyword: (index: number) => void;
    handleKeywordChange: (index: number, value: string) => void;
  };
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
}

export function DialogContent({
  dialog,
  input,
  setInput,
  onClose,
  onConfirm,
  keywords,
  images,
}: DialogContentProps) {
  if (!dialog.open) return null;

  const handleConfirm = () => {
    onConfirm(
      dialog.onConfirm,
      dialog.type,
      dialog.inputType,
      input,
      keywords.keywordsList,
      images.imagesList
    );
  };

  const isFormValid = () => {
    if (dialog.type === "delete") return true;

    if (dialog.inputType === "keywords") {
      return keywords.keywordsList.some((keyword) => keyword.trim().length > 0);
    }

    if (dialog.inputType === "images") {
      return images.imagesList.some(
        (image) => image.alt?.trim() || image.href?.trim()
      );
    }

    return input.trim().length > 0;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <ShadcnDialogContent
        className={`${
          dialog.inputType === "images"
            ? "sm:max-w-[600px]"
            : "sm:max-w-[425px]"
        } ${dialog.type === "delete" ? "border-2 border-red-600" : ""}`}
      >
        <DialogHeader>
          <DialogTitle>{dialog.title}</DialogTitle>
          {dialog.description && (
            <DialogDescription>{dialog.description}</DialogDescription>
          )}
        </DialogHeader>

        {dialog.type !== "delete" && (
          <div className="grid gap-4 py-2">
            <InputFields
              dialog={dialog}
              input={input}
              setInput={setInput}
              keywords={keywords}
              images={images}
              onConfirm={handleConfirm}
            />
            {dialog.inputType === "textarea" && (
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to save
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={dialog.confirmLoading}
              onClick={dialog.onCancel || onClose}
            >
              {dialog.cancelLabel || "Cancel"}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={dialog.type === "delete" ? "destructive" : "default"}
            disabled={dialog.confirmLoading || !isFormValid()}
            onClick={handleConfirm}
          >
            {dialog.confirmLabel ||
              (dialog.type === "delete"
                ? "Delete"
                : dialog.type === "edit"
                  ? "Save changes"
                  : "Create")}
          </Button>
        </DialogFooter>
      </ShadcnDialogContent>
    </Dialog>
  );
}
