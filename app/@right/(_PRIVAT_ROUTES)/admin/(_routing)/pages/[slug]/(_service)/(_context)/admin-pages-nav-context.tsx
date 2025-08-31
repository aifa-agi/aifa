"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  ADMIN_PAGES_CONFIG,
  ADMIN_PAGES_TABS,
  IndicatorStatus,
  canActivateStep,
} from "../(_config)/admin-pages-config";

export type AdminPageTab =
  | "info"
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "step5"
  | "step6"
  | "step7"
  | "step8"
  | "step9"
  | "step10"
  | "step11"
  | "preview"
  | "deploy";

export type DisplayMode = "all" | "required";

type IndicatorStatuses = {
  [K in AdminPageTab]?: IndicatorStatus;
};

interface AdminPagesNavContextType {
  activeTab: AdminPageTab;
  setActiveTab: (tab: AdminPageTab) => void;
  slug: string;
  indicatorStatuses: IndicatorStatuses;
  setIndicatorStatus: (tab: AdminPageTab, status: IndicatorStatus) => void;
  getIndicatorStatus: (tab: AdminPageTab) => IndicatorStatus | undefined;
  completedSteps: AdminPageTab[];
  markStepAsCompleted: (step: AdminPageTab) => void;
  canActivateStep: (step: AdminPageTab) => boolean;
  isStepCompleted: (step: AdminPageTab) => boolean;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

const AdminPagesNavContext = createContext<
  AdminPagesNavContextType | undefined
>(undefined);

interface AdminPagesNavBarProviderProps {
  children: ReactNode;
  slug: string;
  defaultTab?: AdminPageTab;
}

export function AdminPagesNavBarProvider({
  children,
  slug,
  defaultTab = ADMIN_PAGES_CONFIG.defaultTab,
}: AdminPagesNavBarProviderProps) {
  const [activeTab, setActiveTab] = useState<AdminPageTab>(defaultTab);
  const [completedSteps, setCompletedSteps] = useState<AdminPageTab[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("required");

  // Инициализация начальных статусов
  const initialStatuses: IndicatorStatuses = {};
  ADMIN_PAGES_TABS.forEach((tab) => {
    if (tab.hasIndicator && tab.defaultIndicatorStatus) {
      initialStatuses[tab.key] = tab.defaultIndicatorStatus;
    }
  });

  const [indicatorStatuses, setIndicatorStatuses] =
    useState<IndicatorStatuses>(initialStatuses);

  // Автоматическое обновление цветов индикаторов при изменении completedSteps
  useEffect(() => {
    const newStatuses: IndicatorStatuses = { ...indicatorStatuses };

    ADMIN_PAGES_TABS.forEach((tab) => {
      if (tab.hasIndicator) {
        if (completedSteps.includes(tab.key)) {
          // Шаг завершен - зеленый
          newStatuses[tab.key] = "green";
        } else if (canActivateStep(tab.key, completedSteps)) {
          // Шаг готов к выполнению - оранжевый
          newStatuses[tab.key] = "orange";
        } else {
          // Шаг недоступен - серый
          newStatuses[tab.key] = "gray";
        }
      }
    });

    setIndicatorStatuses(newStatuses);
  }, [completedSteps]);

  const setIndicatorStatus = (tab: AdminPageTab, status: IndicatorStatus) => {
    setIndicatorStatuses((prev) => ({
      ...prev,
      [tab]: status,
    }));
  };

  const getIndicatorStatus = (
    tab: AdminPageTab
  ): IndicatorStatus | undefined => {
    return indicatorStatuses[tab];
  };

  const markStepAsCompleted = (step: AdminPageTab) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
    }
  };

  const canActivateStepLocal = (step: AdminPageTab): boolean => {
    return canActivateStep(step, completedSteps);
  };

  const isStepCompleted = (step: AdminPageTab): boolean => {
    return completedSteps.includes(step);
  };

  const value = {
    activeTab,
    setActiveTab,
    slug,
    indicatorStatuses,
    setIndicatorStatus,
    getIndicatorStatus,
    completedSteps,
    markStepAsCompleted,
    canActivateStep: canActivateStepLocal,
    isStepCompleted,
    displayMode,
    setDisplayMode,
  };

  return (
    <AdminPagesNavContext.Provider value={value}>
      {children}
    </AdminPagesNavContext.Provider>
  );
}

export function useAdminPagesNav() {
  const context = useContext(AdminPagesNavContext);

  if (context === undefined) {
    throw new Error(
      "useAdminPagesNav must be used within an AdminPagesNavBarProvider"
    );
  }

  return context;
}
