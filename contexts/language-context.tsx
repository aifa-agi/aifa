// @/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_contexts)/language-context.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  SupportedLanguage,
} from "@/config/translations.config";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
});

export const useChatLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const browserLang = navigator.language.split("-")[0];
      if (SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage)) {
        setLanguage(browserLang as SupportedLanguage);
      }
    }
  }, []);
  useEffect(() => {}, [language]);
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
