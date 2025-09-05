"use client";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/config/appConfig";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DefaultPage() {
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const currentIllustration = isDark
    ? appConfig.illustrations.loading.dark
    : appConfig.illustrations.loading.light;

  return (
    <div className="flex flex-col min-h-svh items-center justify-center p-6">
      {/* Логотип с адаптивным размером */}
      <div className="flex items-center justify-center w-full px-4 mt-20">
        <Image
          src={appConfig.logo}
          alt={`${appConfig.short_name} logo`}
          width={0}
          height={150}
          sizes="calc(100vw - 32px)"
          priority
          className="h-auto max-h-[150px] w-auto max-w-[calc(100%-32px)] object-contain"
          style={{
            width: "auto",
            height: "auto",
            maxHeight: "150px",
            maxWidth: "calc(100vw - 32px)",
          }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full flex justify-center">
          <Image
            src={currentIllustration}
            alt="Work from Home Illustration"
            width={400}
            height={400}
            priority
            className="pointer-events-none my-5 max-h-[40vh] size-auto dark:invert"
          />
        </div>
      </div>

      <Button
        className="text-xl w-full mt-auto mb-2"
        onClick={() =>
          router.push("/", {
            scroll: false,
          })
        }
      >
        Chat GPT
      </Button>
    </div>
  );
}
