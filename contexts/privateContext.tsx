// @/contexts/privateContext.tsx

"use client";
import React, { createContext, useState, useContext } from "react";

export interface PrivateProviderProps {
  title: string;
}

interface PrivateContextType {
  privateData: PrivateProviderProps;
  setPrivateData: React.Dispatch<React.SetStateAction<PrivateProviderProps>>;
}

// Create PrivateContext with null default
export const PrivateContext = createContext<PrivateContextType | null>(null);

// PrivateProvider компонент
export const PrivateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [privateData, setPrivateData] = useState<PrivateProviderProps>({
    title: "PrivateUser",
  });

  return (
    <PrivateContext.Provider value={{ privateData, setPrivateData }}>
      {children}
    </PrivateContext.Provider>
  );
};

export function usePrivateContext(): PrivateContextType {
  const context = useContext(PrivateContext);
  if (!context) {
    throw new Error("usePrivateContext must be used within a PrivateProvider");
  }
  return context;
}
