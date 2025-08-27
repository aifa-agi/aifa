// @/app/(_service)/contexts/dialogs/components/input-fields.tsx

"use client";

import React from "react";
import { DialogState, PageImages } from "../types";
import { ImagesInput } from "./images-input";
import { KeywordsInput } from "./keywords-input";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
interface InputFieldsProps {
  dialog: DialogState & { open: true };
  input: string;
  setInput: (value: string) => void;
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
  onConfirm: () => void;
}

export function InputFields({
  dialog,
  input,
  setInput,
  keywords,
  images,
  onConfirm,
}: InputFieldsProps) {
  // Компонент для работы с изображениями
  if (dialog.inputType === "images") {
    return (
      <ImagesInput images={images} isLoading={dialog.confirmLoading ?? false} />
    );
  }

  // Компонент для работы с ключевыми словами
  if (dialog.inputType === "keywords") {
    return (
      <KeywordsInput
        keywords={keywords}
        isLoading={dialog.confirmLoading ?? false}
      />
    );
  }

  // Общие свойства для обычных полей ввода
  const commonProps = {
    autoFocus: true,
    value: input,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setInput(e.currentTarget.value),
    placeholder:
      dialog.placeholder ||
      (dialog.type === "create" ? "Enter new value..." : "Edit value..."),
    disabled: dialog.confirmLoading ?? false,
  };

  // Многострочное текстовое поле
  if (dialog.inputType === "textarea") {
    return (
      <Textarea
        {...commonProps}
        className="min-h-[100px] resize-none"
        onKeyDown={(e) => {
          // Сохранение по Ctrl+Enter
          if (
            e.key === "Enter" &&
            e.ctrlKey &&
            input.trim() &&
            !(dialog.confirmLoading ?? false)
          ) {
            onConfirm();
          }
        }}
      />
    );
  }

  // Обычное однострочное поле ввода (по умолчанию)
  return (
    <Input
      {...commonProps}
      onKeyDown={(e) => {
        // Сохранение по Enter
        if (
          e.key === "Enter" &&
          input.trim() &&
          !(dialog.confirmLoading ?? false)
        ) {
          onConfirm();
        }
      }}
    />
  );
}
