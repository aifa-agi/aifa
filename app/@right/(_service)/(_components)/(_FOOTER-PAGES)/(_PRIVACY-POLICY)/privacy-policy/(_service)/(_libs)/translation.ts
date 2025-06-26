import { useChatLanguage } from "@/contexts/language-context";
import translations from "../(_translations)/translations.json";
import {
  DEFAULT_LANGUAGE,
  SupportedLanguage,
} from "@/config/translations.config";

type TranslationEntry = {
  [K in SupportedLanguage]?: string;
};

type Translations = {
  [key: string]: TranslationEntry;
};

const typedTranslations: Translations = translations;

export function useTranslation() {
  const { language } = useChatLanguage();

  function t(key: string): string {
    const entry = typedTranslations[key];
    if (!entry) return key;
    return entry[language] || entry[DEFAULT_LANGUAGE] || key;
  }

  return { t };
}
