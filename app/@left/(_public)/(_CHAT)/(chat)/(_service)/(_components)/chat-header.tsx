// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_components)/chat-header.tsx

"use client";

import { ModelSelector } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/model-selector";
import { SidebarToggle } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/sidebar-toggle";
import { memo } from "react";
import { type VisibilityType, VisibilitySelector } from "./visibility-selector";
import type { Session } from "next-auth";

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
  session,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  session: Session;
}) {
  return (
    <header className="flex sticky top-0 z-20 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

      {!isReadonly && (
        <ModelSelector
          session={session}
          selectedModelId={selectedModelId}
          className="order-1 md:order-2"
        />
      )}

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          className="order-1 md:order-3"
        />
      )}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
