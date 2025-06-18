// @/app\@right\error.tsx

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { __ } from "@/lib/translation";

interface LeftErrorProps {
  error: Error & { digest?: string }; // Error object with optional digest property
  reset: () => void;
}

export default function LeftError({ error, reset }: LeftErrorProps) {
  const router = useRouter();

  return (
    <div className="p-4 text-center text-red-600">
      <p>{error.message}</p>
      <Button
        className="mt-4 btn bg-red-500 text-white"
        onClick={() => {
          reset();
          router.refresh();
        }}
      >
        {__("Try again")}
      </Button>
    </div>
  );
}
