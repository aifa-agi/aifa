// @/contexts/publicContext.tsx

"use client";
import React, { createContext, useState, useContext } from "react";

export interface PublicProviderProps {
  title: string;
}

interface PublicContextType {
  publicData: PublicProviderProps;
  setPublicData: React.Dispatch<React.SetStateAction<PublicProviderProps>>;
}

// Создаём PublicContext с null по умолчанию
export const PublicContext = createContext<PublicContextType | null>(null);

// Провайдер PublicProvider
export const PublicProvider = ({ children }: { children: React.ReactNode }) => {
  const [publicData, setPublicData] = useState<PublicProviderProps>({
    title: "PublicUser",
  });

  return (
    <PublicContext.Provider value={{ publicData, setPublicData }}>
      {children}
    </PublicContext.Provider>
  );
};

// Пользовательский хук для более удобного и безопасного доступа к PublicContext
export function usePublicContext(): PublicContextType {
  const context = useContext(PublicContext);
  if (!context) {
    throw new Error("usePublicContext must be used within a PublicProvider");
  }
  return context;
}
