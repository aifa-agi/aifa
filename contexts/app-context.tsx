// @/app/contexts/app-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";

// Определяет форму состояния для явного взаимодействия пользователя
interface InteractionState {
  pageName: string | null;
  elementId: string | null;
}

// Определяет полный тип контекста
interface AppContextType {
  // Последний элемент, с которым пользователь решил взаимодействовать
  activeInteraction: InteractionState | null;
  // Функция для вызова при клике на иконку взаимодействия
  setInteractionContext: (pageName: string, elementId: string) => void;
  // Кастомная история навигации для правого слота
  navigationHistory: string[];
  // Функции для ручного управления историей
  navigateBack: () => string | null;
  navigateForward: () => string | null;
  canNavigateBack: boolean;
  canNavigateForward: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const MAX_HISTORY_LENGTH = 100;

export const AppProvider = ({ children }: AppProviderProps) => {
  const [activeInteraction, setActiveInteraction] =
    useState<InteractionState | null>(null);

  const [navigationHistory, setNavigationHistory] = useLocalStorage<string[]>(
    "rightSlotNavigationHistory",
    []
  );
  const [currentHistoryIndex, setCurrentHistoryIndex] = useLocalStorage<number>(
    "rightSlotHistoryIndex",
    -1
  );

  const pathname = usePathname();

  // Эффект для автоматического отслеживания навигации по страницам в правом слоте
  useEffect(() => {
    if (pathname && pathname !== navigationHistory[currentHistoryIndex]) {
      const newHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
      newHistory.push(pathname);

      const trimmedHistory =
        newHistory.length > MAX_HISTORY_LENGTH
          ? newHistory.slice(-MAX_HISTORY_LENGTH)
          : newHistory;

      setNavigationHistory(trimmedHistory);
      setCurrentHistoryIndex(trimmedHistory.length - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Функция для явной установки контекста взаимодействия по действию пользователя
  const setInteractionContext = useCallback(
    (pageName: string, elementId: string) => {
      const interaction = { pageName, elementId };

      setActiveInteraction(interaction);
    },
    []
  );

  // Функции навигации для кастомной истории
  const navigateBack = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      return navigationHistory[newIndex];
    }
    return null;
  }, [currentHistoryIndex, navigationHistory, setCurrentHistoryIndex]);

  const navigateForward = useCallback(() => {
    if (currentHistoryIndex < navigationHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      return navigationHistory[newIndex];
    }
    return null;
  }, [currentHistoryIndex, navigationHistory, setCurrentHistoryIndex]);

  // Мемоизация значения контекста для оптимизации производительности
  const value = useMemo(
    () => ({
      activeInteraction,
      setInteractionContext,
      navigationHistory,
      navigateBack,
      navigateForward,
      canNavigateBack: currentHistoryIndex > 0,
      canNavigateForward: currentHistoryIndex < navigationHistory.length - 1,
    }),
    [
      activeInteraction,
      setInteractionContext,
      navigationHistory,
      currentHistoryIndex,
      navigateBack,
      navigateForward,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Кастомный хук для удобного доступа к AppContext.
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
