// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_libs)/validate-translations.ts
import translations from "../(_translations)/translations.json";
import { SUPPORTED_LANGUAGES } from "@/config/translations.config";

export function validateTranslations() {
  Object.entries(translations).forEach(([key, entry]) => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      if (!(lang in entry)) {
        console.error(
          `[i18n] Missing translation: key="${key}" lang="${lang}"`
        );
      }
    });
  });
}
