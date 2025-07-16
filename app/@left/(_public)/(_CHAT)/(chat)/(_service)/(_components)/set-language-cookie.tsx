// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_components)/set-language-cookie.tsx
"use client";

import { useEffect } from "react";

export function SetLanguageCookie() {
  useEffect(() => {
    const lang = navigator.language?.split("-")[0] || "en";

    // Устанавливаем cookie с Secure и SameSite для HTTPS
    document.cookie = `app_lang=${lang}; path=/; max-age=31536000; Secure; SameSite=Lax`;
  }, []);

  return null;
}
