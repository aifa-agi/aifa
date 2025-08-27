// @/app/(_service)/contexts/dialogs/components/keywords-input.tsx

"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface KeywordsInputProps {
  keywords: {
    keywordsList: string[];
    handleAddKeyword: () => void;
    handleRemoveKeyword: (index: number) => void;
    handleKeywordChange: (index: number, value: string) => void;
  };
  isLoading?: boolean;
}

export function KeywordsInput({
  keywords,
  isLoading = false,
}: KeywordsInputProps) {
  return (
    <div className="space-y-3">
      {/* Заголовок с кнопкой добавления */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Keywords</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={keywords.handleAddKeyword}
          disabled={isLoading}
          className="h-8 px-2"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add More
        </Button>
      </div>

      {/* Прокручиваемый список полей ввода ключевых слов */}
      <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
        {keywords.keywordsList.map((keyword, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* Поле ввода ключевого слова */}
            <Input
              value={keyword}
              onChange={(e) =>
                keywords.handleKeywordChange(index, e.target.value)
              }
              placeholder={`Keyword ${index + 1}...`}
              disabled={isLoading}
              className="flex-1"
            />

            {/* Кнопка удаления (показывается только если больше одного поля) */}
            {keywords.keywordsList.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => keywords.handleRemoveKeyword(index)}
                disabled={isLoading}
                className="h-10 w-10 p-0 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Подсказка для пользователя */}
      {keywords.keywordsList.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Empty fields will be automatically removed when saving
        </p>
      )}
    </div>
  );
}
