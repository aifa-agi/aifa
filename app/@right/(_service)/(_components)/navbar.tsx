// @/app/@right/(_service)/(_components)/navbar.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, MoreVertical } from "lucide-react";
import { useScroll } from "@/hooks/use-scroll";
import { appConfig } from "@/config/appConfig";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import WideMenu from "./navigation-menu/wide-menu";
import MobileMenu from "./navigation-menu/mobile-menu";

interface NavBarProps {
  scroll?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScroll(50);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleButtonClick = () => setIsOpen((v) => !v);
  const handleOverlayClick = () => setIsOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 flex w-[calc(100%_-_48px)] md:w-full justify-start px-2 bg-black/20 backdrop-blur-xl transition-all z-50",
          scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
        )}
      >
        <div className="flex h-14  w-full items-center justify-between py-4 z-51 ">
          <Link href="/" className="flex items-center space-x-1.5">
            <Image
              src="/favicons/logo.png"
              alt={appConfig.name}
              width={32}
              height={32}
              className="min-h-8 min-w-8 rounded-md"
              priority
            />
          </Link>

          {isLargeScreen ? (
            <Button
              onClick={handleButtonClick}
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap px-4"
            >
              <span>{isOpen ? "Close Menu" : "Open Menu"}</span>
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </Button>
          ) : (
            <Button
              onClick={handleButtonClick}
              variant="outline"
              size="sm"
              className="flex items-center justify-center "
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <MoreVertical className="size-5" />
            </Button>
          )}
        </div>

        {isLargeScreen ? (
          <WideMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        ) : (
          <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            topOffset={"56px"}
          />
        )}
      </header>

      {isOpen && (
        <div
          className="absolute  size-full top-[56px] bg-black/50 backdrop-blur-sm z-20"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
    </>
  );
}
