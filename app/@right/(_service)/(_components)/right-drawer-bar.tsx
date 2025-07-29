// @/app/@right/(components)/right-drawer-bar.tsx
"use client";

import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose, // Импортируем SheetClose для правильного закрытия
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GlobeIcon, MessageIcon } from "@/components/shared/icons"; // Импортируем обе иконки
import { useRightSidebar } from "@/contexts/right-sidebar-context";

export default function RightDrawerBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, openDrawer, closeDrawer } = useRightSidebar();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      openDrawer();
    } else {
      closeDrawer();
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button
            aria-label="AIFA content"
            className="fixed top-3 right-4 z-50 flex items-center justify-center md:hidden h-[34px]"
          >
            <GlobeIcon size={16} />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-full p-0 md:hidden [&>[data-dialog-close]]:hidden  [&>button]:hidden [&>button[aria-label='Close']]:block"
        >
          <SheetHeader>
            <SheetTitle className="hidden">
              Build something with AIFA
            </SheetTitle>
          </SheetHeader>

          <SheetClose asChild>
            <Button
              size="sm"
              className="absolute top-3 right-2 h-[34px]"
              aria-label="Close"
            >
              <MessageIcon size={16} />
            </Button>
          </SheetClose>

          <div className="overflow-hidden h-screen">{children}</div>
        </SheetContent>
      </Sheet>

      {/* Десктопная версия остается без изменений */}
      <div className="hidden md:flex border-l border-gray-300 min-w-[200px] md:w-[480px] 2xl:w-[600px] h-screen overflow-y-auto">
        {children}
      </div>
    </>
  );
}
