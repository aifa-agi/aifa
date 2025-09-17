// @/contexts/right-sidebar-context.tsx
"use client";

import { useMediaQuery } from "@/app/@right/(_service)/hooks/use-media-query";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface RightSidebarContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const RightSidebarContext = createContext<RightSidebarContextType | undefined>(
  undefined
);

// Custom hook for context access
export const useRightSidebar = () => {
  const context = useContext(RightSidebarContext);
  if (context === undefined) {
    throw new Error(
      "useRightSidebar must be used within a RightSidebarProvider"
    );
  }
  return context;
};

export const RightSidebarProvider = ({ children }: { children: ReactNode }) => {
  const { isMobile, device } = useMediaQuery();

  // SSR-safe: do not render children until device is detected
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    if (device !== null) {
      setIsOpen(isMobile);
    }
  }, [device, isMobile]);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  // Optionally, show loader or nothing until device is detected
  if (isOpen === null) return null;

  return (
    <RightSidebarContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
    </RightSidebarContext.Provider>
  );
};
