"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6">
      <h1 className="text-foreground text-xl font-semibold whitespace-pre-wrap m-2 text-center">
        Welcome to the Ai-First user interface concept
      </h1>
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full flex justify-center">
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
        Open Chat GPT
      </Button>
    </div>
  );
}
