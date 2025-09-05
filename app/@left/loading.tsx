// @/app/@left/loading.tsx
"use client";
import { appConfig } from "@/config/appConfig";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Получаем настройки из конфига
  const { illustrations, messages } = appConfig;
  const currentIllustration = isDark
    ? illustrations.loading.dark
    : illustrations.loading.light;

  // Обрабатываем динамические переменные в тексте
  const getFormattedText = (text: string) => {
    return text.replace("{short_name}", appConfig.short_name);
  };

  const title = messages?.loading?.title
    ? getFormattedText(messages.loading.title)
    : `Welcome to ${appConfig.short_name} with Chat GPT`;

  const subtitle = messages?.loading?.subtitle || "Loading ...";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {/* Настраиваемая иллюстрация */}
      <Image
        src={currentIllustration}
        alt={`${appConfig.short_name} loading illustration`}
        width={400}
        height={400}
        priority
        className="pointer-events-none mb-5 mt-6 dark:invert"
      />

      {/* Настраиваемый приветственный текст */}
      <h1 className="text-foreground text-2xl font-semibold whitespace-pre-wrap mx-4 text-center">
        {title}
      </h1>

      <p className="text-muted-foreground text-xl mt-4">{subtitle}</p>
    </div>
  );
}
