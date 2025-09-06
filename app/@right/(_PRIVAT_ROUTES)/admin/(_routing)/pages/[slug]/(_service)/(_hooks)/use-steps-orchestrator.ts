// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_hooks)/use-steps-orchestrator.ts

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";

/**
 * Hook-orchestrator for managing admin steps workflow
 * Integrates with existing NavigationMenuProvider to get real page data
 * Provides real-time data management, loading states, and step completion tracking
 */
export const useStepsOrchestrator = (slug: string) => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ ИСПРАВЛЕНО: Используем существующий NavigationMenuProvider
  const {
    categories,
    loading: categoriesLoading,
    refreshCategories,
  } = useNavigationMenu();

  // ✅ ИСПРАВЛЕНО: Находим страницу по slug в существующих категориях
  const currentPage = useMemo(() => {
    if (!categories || !slug) return null;

    for (const category of categories) {
      const page = category.pages?.find((page) => page.linkName === slug);
      if (page) {
        return page as PageData;
      }
    }
    return null;
  }, [categories, slug]);

  // ✅ ИСПРАВЛЕНО: Обновляем pageData когда находим страницу
  useEffect(() => {
    if (currentPage) {
      setPageData(currentPage);
      setError(null);
    } else if (categories.length > 0) {
      // Категории загружены, но страница не найдена
      setError(`Page with slug "${slug}" not found`);
    }
  }, [currentPage, categories, slug]);

  // ✅ ИСПРАВЛЕНО: Синхронизируем loading состояние
  useEffect(() => {
    setIsLoading(categoriesLoading);
  }, [categoriesLoading]);

  // ✅ ИСПРАВЛЕНО: Функция обновления через существующую систему
  const refreshPageData = useCallback(async () => {
    console.log(
      "🎭 Steps Orchestrator: Refreshing page data via NavigationMenuProvider"
    );
    setError(null);
    await refreshCategories();
  }, [refreshCategories]);

  // ✅ ИСПРАВЛЕНО: Обновление конкретного поля страницы
  const updatePageDataField = useCallback(
    <K extends keyof PageData>(field: K, value: PageData[K]) => {
      if (!pageData) {
        console.warn(
          "🎭 Steps Orchestrator: Cannot update field - no page data"
        );
        return;
      }

      const updatedData = {
        ...pageData,
        [field]: value,
      };

      setPageData(updatedData);

      console.log(`🎭 Steps Orchestrator: Updated ${String(field)}`, {
        slug,
        newValue: value,
      });
    },
    [pageData, slug]
  );

  // ✅ ИСПРАВЛЕНО: Полное обновление данных страницы
  const updatePageData = useCallback(
    (updater: (current: PageData | null) => PageData | null) => {
      const updated = updater(pageData);
      if (updated) {
        setPageData(updated);
        console.log(
          "🎭 Steps Orchestrator: Page data updated via updater function",
          {
            slug,
            updatedFields: Object.keys(updated),
          }
        );
      }
    },
    [pageData, slug]
  );

  // ✅ ИСПРАВЛЕНО: Синхронизация с сервером (заглушка - можно расширить)
  const syncPageDataToServer = useCallback(
    async (updates: Partial<PageData>) => {
      if (!slug) return false;

      try {
        console.log(
          "🎭 Steps Orchestrator: Would sync to server (not implemented yet)",
          {
            slug,
            updates: Object.keys(updates),
          }
        );

        // TODO: Здесь можно добавить реальную синхронизацию с сервером
        // Пока что просто обновляем локальное состояние
        if (pageData) {
          const updatedData = { ...pageData, ...updates };
          setPageData(updatedData);
        }

        return true;
      } catch (err) {
        console.error("🎭 Steps Orchestrator: Error syncing to server:", err);
        setError(err instanceof Error ? err.message : "Sync error");
        return false;
      }
    },
    [slug, pageData]
  );

  // ✅ ИСПРАВЛЕНО: Статус оркестратора
  const getOrchestratorStatus = useCallback(() => {
    return {
      isReady: !isLoading && !error && !!pageData,
      dataAge: null, // Данные всегда свежие из NavigationMenuProvider
      hasData: !!pageData,
      slug,
      error,
      source: "NavigationMenuProvider",
    };
  }, [isLoading, error, pageData, slug]);

  return {
    // Core data
    pageData,
    isLoading,
    error,

    // Data management functions
    refreshPageData,
    updatePageData,
    updatePageDataField,
    syncPageDataToServer,

    // Orchestrator metadata
    getOrchestratorStatus,
    lastFetchTime: Date.now(), // Всегда актуальное время

    // Legacy compatibility
    setPageData,
  };
};
