// @/app/(_service)/contexts/dialogs/hooks/use-keywords.ts

import { useState, useEffect } from "react";

export function useKeywords(initialKeywords?: string[]) {
  const [keywordsList, setKeywordsList] = useState<string[]>([]);

  useEffect(() => {
    setKeywordsList(initialKeywords ?? [""]);
  }, [initialKeywords]);

  const handleAddKeyword = () => {
    setKeywordsList(prev => [...prev, ""]);
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywordsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeywordChange = (index: number, value: string) => {
    setKeywordsList(prev => 
      prev.map((keyword, i) => i === index ? value : keyword)
    );
  };

  const reset = () => {
    setKeywordsList([]);
  };

  return {
    keywordsList,
    setKeywordsList,
    handleAddKeyword,
    handleRemoveKeyword,
    handleKeywordChange,
    reset
  };
}
