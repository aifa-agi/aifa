// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/(_service)/(_libs)/translation.ts

import translations from "../(_translations)/translations.json";
import {
  DEFAULT_LANGUAGE,
  SupportedLanguage,
} from "@/config/translations.config";
import { useLanguage } from "@/app/@left/(_public)/(_AUTH)/(auth)/(_service)/(_contexts)/language-context";

type TranslationEntry = {
  [K in SupportedLanguage]?: string;
};

type Translations = {
  [key: string]: TranslationEntry;
};

const typedTranslations: Translations = translations;

export function useTranslation() {
  const { language } = useLanguage();

  function t(key: string): string {
    const entry = typedTranslations[key];
    if (!entry) return key;
    return entry[language] || entry[DEFAULT_LANGUAGE] || key;
  }

  return { t };
}
