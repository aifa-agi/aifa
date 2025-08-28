// @/app/admin/pages/[slug]/(_service)/(_context)/admin-pages-nav-context.tsx

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ADMIN_PAGES_CONFIG } from "../(_config)/admin-pages-config";

// Определяем возможные типы вкладок
export type AdminPageTab = "info" | "structure";

// Интерфейс для контекста
interface AdminPagesNavContextType {
  activeTab: AdminPageTab;
  setActiveTab: (tab: AdminPageTab) => void;
  slug: string;
}

// Создаём контекст
const AdminPagesNavContext = createContext<
  AdminPagesNavContextType | undefined
>(undefined);

// Props для провайдера
interface AdminPagesNavBarProviderProps {
  children: ReactNode;
  slug: string;
  defaultTab?: AdminPageTab;
}

/**
 * Provider component for managing admin page navigation state
 * Handles active tab switching and provides slug to child components
 */
export function AdminPagesNavBarProvider({
  children,
  slug,
  defaultTab = ADMIN_PAGES_CONFIG.defaultTab,
}: AdminPagesNavBarProviderProps) {
  // Состояние для активной вкладки, используем конфиг для значения по умолчанию
  const [activeTab, setActiveTab] = useState<AdminPageTab>(defaultTab);

  const value = {
    activeTab,
    setActiveTab,
    slug,
  };

  return (
    <AdminPagesNavContext.Provider value={value}>
      {children}
    </AdminPagesNavContext.Provider>
  );
}

/**
 * Custom hook to access admin pages navigation context
 * Throws error if used outside of provider
 */
export function useAdminPagesNav() {
  const context = useContext(AdminPagesNavContext);

  if (context === undefined) {
    throw new Error(
      "useAdminPagesNav must be used within an AdminPagesNavBarProvider"
    );
  }

  return context;
}
