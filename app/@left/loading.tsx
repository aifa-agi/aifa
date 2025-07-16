// @/app/@left/loading.tsx

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {/* Иллюстрация */}
      <Image
        src={
          isDark
            ? "/_static/illustrations/idea-launch.svg"
            : "/_static/illustrations/success.svg"
        }
        alt="Work from Home Illustration"
        width={400}
        height={400}
        priority
        className="pointer-events-none mb-5 mt-6 dark:invert"
      />
      {/* Приветственный текст */}
      <h1 className="text-foreground text-2xl font-semibold whitespace-pre-wrap mx-4 text-center">
        Welcome to AIFA with Chat GPT
      </h1>
      <p className="text-muted-foreground text-xl mt-4">Loading ...</p>
    </div>
  );
}
