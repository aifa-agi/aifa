// @/app/(_service)/components/nav-bar/public-flow/static-nav-bar.tsx

"use client";
import { useEffect, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import WideMenu from "./wide-menu";
import MobileMenu from "./mobile-menu";
import { Button } from "@/components/ui/button";
import { useNavigationMenu } from "../../../(_context)/nav-bar-provider";

const HEADER_HEIGHT = 56;
const MOBILE_MENU_OFFSET = 40;

export default function StaticNavBar() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { categories } = useNavigationMenu();
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const mobileMenuTopOffset = `${MOBILE_MENU_OFFSET}px`;
  const handleButtonClick = () => setIsOpen((v) => !v);
  const handleOverlayClick = () => setIsOpen(false);

  const PROTECTED_CATEGORIES = ["home", "root", "admin"];

  const filtredCategories = categories.filter(
    (category) => !PROTECTED_CATEGORIES.includes(category.title.toLowerCase())
  );

  return (
    <>
      <div>
        <div
          className={`flex items-center px-4 h-[56px] ${
            isLargeScreen ? "justify-end w-full" : "justify-start w-1/2"
          }`}
          style={{ minHeight: HEADER_HEIGHT, maxHeight: HEADER_HEIGHT }}
        >
          {isLargeScreen ? (
            <Button
              variant="outline"
              onClick={handleButtonClick}
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap px-4"
            >
              <span>{isOpen ? "Close bar menu" : "Open bar menu"}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleButtonClick}
              className="flex items-center justify-center px-2"
              aria-label={isOpen ? "Close bar menu" : "Open bar menu"}
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
        </div>
        {isLargeScreen ? (
          <WideMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            categories={filtredCategories}
          />
        ) : (
          <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            categories={filtredCategories}
            topOffset={mobileMenuTopOffset}
          />
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-40"
          style={{ top: "64px" }}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
    </>
  );
}
