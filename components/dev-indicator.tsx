// @/components/dev-indicator.tsx

"use client";

import { useAppContext } from "@/contexts/app-context";

export function DevIndicator() {
  const { activeInteraction } = useAppContext();
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-1 right-1 z-50 flex items-center space-x-2 rounded-lg bg-gray-800 p-2 font-mono text-xs text-white shadow-lg">
      <div className="flex size-6 items-center justify-center rounded-full bg-gray-600 font-bold">
        <div className="block sm:hidden">xs</div>
        <div className="hidden sm:block md:hidden">sm</div>
        <div className="hidden md:block lg:hidden">md</div>
        <div className="hidden lg:block xl:hidden">lg</div>
        <div className="hidden xl:block 2xl:hidden">xl</div>
        <div className="hidden 2xl:block">2xl</div>
      </div>

      {activeInteraction && (
        <div className="flex flex-col px-2 border-l border-gray-600 ">
          <span className="text-gray-400">
            Page:{" "}
            <span className="text-white font-semibold">
              {activeInteraction.pageName}
            </span>
          </span>
          <span className="text-gray-400">
            ID:{" "}
            <span className="text-white font-semibold">
              {activeInteraction.elementId}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
