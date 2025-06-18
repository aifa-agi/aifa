// @/lib/translation/index.ts

import translationsJson from "../translations.json";

type TranslationEntry = {
  original: string;
  translations: Record<string, string>;
};

const translations: TranslationEntry[] = translationsJson as TranslationEntry[];

// Example: get user's locale – simplified:
function getLocale() {
  if (typeof navigator !== "undefined") {
    return navigator.language.split("-")[0] || "ru";
  }
  return "ru";
}

export function __(original: string): string {
  const locale = getLocale();
  const entry = translations.find((t) => t.original === original);
  if (entry) {
    if (entry.translations[locale]) {
      return entry.translations[locale];
    }
    if (entry.translations["en"]) {
      return entry.translations["en"];
    }
    // fallback to original if no translations found
    return original;
  }
  return original;
}
