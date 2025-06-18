// @/contexts/right-sidebar-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface RightSidebarContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const RightSidebarContext = createContext<RightSidebarContextType | undefined>(
  undefined
);

// Кастомный хук для удобного доступа к контексту
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
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return (
    <RightSidebarContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
    </RightSidebarContext.Provider>
  );
};
