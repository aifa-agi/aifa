// @/app/not-found.tsx

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  // Можно показать заглушку или просто ничего
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">Error in Right Slot</h1>
      <p className="mt-8 text-2xl">Check Code...</p>
    </div>
  );
}
