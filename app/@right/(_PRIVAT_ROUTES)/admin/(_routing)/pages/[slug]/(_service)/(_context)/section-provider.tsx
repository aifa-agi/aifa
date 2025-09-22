// @/app/(_service)/contexts/section-provider.tsx

"use client";

import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";

interface SectionState {
  sections: Record<string, ExtendedSection[]>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  lastLoaded: Record<string, number>;
}

type SectionAction =
  | { type: "LOAD_START"; href: string }
  | { type: "LOAD_SUCCESS"; href: string; sections: ExtendedSection[] }
  | { type: "LOAD_ERROR"; href: string; error: string }
  | { type: "UPDATE_SECTIONS"; href: string; sections: ExtendedSection[] }
  | { type: "CLEAR_CACHE"; href?: string }
  | { type: "INVALIDATE_CACHE"; href: string }
  | { type: "CLEAR_ERROR"; href: string };

interface SectionContextValue {
  sections: Record<string, ExtendedSection[]>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  loadSections: (
    href: string,
    force?: boolean
  ) => Promise<ExtendedSection[] | null>;
  updateSections: (href: string, sections: ExtendedSection[]) => void;
  getSections: (href: string) => ExtendedSection[] | null;
  clearCache: (href?: string) => void;
  invalidateCache: (href: string) => void;
  clearError: (href: string) => void;
  isSectionsLoaded: (href: string) => boolean;
  isLoading: (href: string) => boolean;
  hasError: (href: string) => boolean;
  getError: (href: string) => string | null;
  getCacheTimestamp: (href: string) => number | null;
}

// ✅ СОХРАНЯЕМ: тот же интерфейс ответа API
interface ApiReadResponse {
  success: boolean;
  message: string;
  sections?: ExtendedSection[];
  debug?: {
    fileExists: boolean;
    fileContent?: string;
    matchFound: boolean;
    sectionsCode?: string;
    parsedSectionsCount?: number;
  };
}

const initialState: SectionState = {
  sections: {},
  loading: {},
  errors: {},
  lastLoaded: {},
};

// ✅ СОХРАНЯЕМ: тот же reducer без изменений
function sectionReducer(
  state: SectionState,
  action: SectionAction
): SectionState {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        loading: { ...state.loading, [action.href]: true },
        errors: { ...state.errors, [action.href]: null },
      };

    case "LOAD_SUCCESS":
      return {
        ...state,
        sections: { ...state.sections, [action.href]: action.sections },
        loading: { ...state.loading, [action.href]: false },
        errors: { ...state.errors, [action.href]: null },
        lastLoaded: { ...state.lastLoaded, [action.href]: Date.now() },
      };

    case "LOAD_ERROR":
      return {
        ...state,
        loading: { ...state.loading, [action.href]: false },
        errors: { ...state.errors, [action.href]: action.error },
      };

    case "UPDATE_SECTIONS":
      return {
        ...state,
        sections: { ...state.sections, [action.href]: action.sections },
        lastLoaded: { ...state.lastLoaded, [action.href]: Date.now() },
        errors: { ...state.errors, [action.href]: null },
      };

    case "CLEAR_CACHE":
      if (action.href) {
        const newState = { ...state };
        delete newState.sections[action.href];
        delete newState.loading[action.href];
        delete newState.errors[action.href];
        delete newState.lastLoaded[action.href];
        return newState;
      } else {
        return initialState;
      }

    case "INVALIDATE_CACHE":
      const newState = { ...state };
      delete newState.lastLoaded[action.href];
      return newState;

    case "CLEAR_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.href]: null },
      };

    default:
      return state;
  }
}

const SectionContext = createContext<SectionContextValue | undefined>(
  undefined
);

interface SectionProviderProps {
  children: React.ReactNode;
  cacheTimeout?: number;
  debug?: boolean;
}

// ✅ СОХРАНЯЕМ: те же названия и интерфейсы
export function SectionProvider({
  children,
  cacheTimeout = 5 * 60 * 1000,
  debug = false,
}: SectionProviderProps) {
  const [state, dispatch] = useReducer(sectionReducer, initialState);
  const { categories } = useNavigationMenu();

  // ✅ СОХРАНЯЕМ: та же логика getFilePath
  const getFilePath = useCallback((href: string): string => {
    const cleanHref = href.startsWith("/") ? href.slice(1) : href;
    const parts = cleanHref.split("/").filter((part) => part.length > 0);

    if (parts.length < 2) {
      throw new Error(`Invalid href format: ${href}`);
    }

    const [firstPart, secondPart] = parts;
    return `${firstPart}/${secondPart}`;
  }, []);

  // ✅ СОХРАНЯЕМ: та же логика кэширования
  const isCacheValid = useCallback(
    (href: string): boolean => {
      const lastLoaded = state.lastLoaded[href];
      if (!lastLoaded) return false;
      return Date.now() - lastLoaded < cacheTimeout;
    },
    [state.lastLoaded, cacheTimeout]
  );

  // ✅ ОБНОВЛЕНО: только внутренняя логика, интерфейс остался тем же
  const loadSections = useCallback(
    async (
      href: string,
      force: boolean = false
    ): Promise<ExtendedSection[] | null> => {
      // ✅ СОХРАНЯЕМ: та же логика кэша и загрузки
      if (!force && state.sections[href] && isCacheValid(href)) {
        return state.sections[href];
      }

      if (state.loading[href]) {
        return null;
      }

      try {
        dispatch({ type: "LOAD_START", href });

        const filePath = getFilePath(href);

        // ✅ ОБНОВЛЕНО: используем тот же endpoint, но он теперь читает из page.tsx
        const response = await fetch(`/api/sections/read`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filePath }),
        });

        if (!response.ok) {
          const errorMessage = `HTTP ${response.status}: ${response.statusText}`;

          if (response.status === 404 || response.status === 400) {
            dispatch({ type: "LOAD_SUCCESS", href, sections: [] });
            return [];
          }

          throw new Error(errorMessage);
        }

        // ✅ СОХРАНЯЕМ: тот же формат ответа
        const result: ApiReadResponse = await response.json();

        if (!result.success) {
          dispatch({ type: "LOAD_SUCCESS", href, sections: [] });
          return [];
        }

        const sections: ExtendedSection[] = result.sections || [];

        if (debug) {
          console.log(`SectionProvider: Loaded ${sections.length} sections for ${href}`, {
            source: (result as any).source,
            environment: (result as any).environment
          });
        }

        dispatch({ type: "LOAD_SUCCESS", href, sections });
        return sections;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        if (debug) {
          console.error(`SectionProvider: Error loading sections for ${href}:`, error);
        }

        if (
          errorMessage.includes("HTTP 400") ||
          errorMessage.includes("HTTP 404")
        ) {
          dispatch({ type: "LOAD_SUCCESS", href, sections: [] });
          return [];
        } else {
          dispatch({ type: "LOAD_ERROR", href, error: errorMessage });
          return null;
        }
      }
    },
    [state.sections, state.loading, isCacheValid, getFilePath, debug]
  );

  // ✅ СОХРАНЯЕМ: все остальные методы без изменений
  const updateSections = useCallback(
    (href: string, sections: ExtendedSection[]) => {
      if (!Array.isArray(sections)) {
        return;
      }

      dispatch({ type: "UPDATE_SECTIONS", href, sections });
    },
    []
  );

  const getSections = useCallback(
    (href: string): ExtendedSection[] | null => {
      return state.sections[href] || null;
    },
    [state.sections]
  );

  const clearCache = useCallback((href?: string) => {
    dispatch({ type: "CLEAR_CACHE", href });
  }, []);

  const invalidateCache = useCallback((href: string) => {
    dispatch({ type: "INVALIDATE_CACHE", href });
  }, []);

  const clearError = useCallback((href: string) => {
    dispatch({ type: "CLEAR_ERROR", href });
  }, []);

  const isSectionsLoaded = useCallback(
    (href: string): boolean => {
      return !!state.sections[href] && isCacheValid(href);
    },
    [state.sections, isCacheValid]
  );

  const isLoading = useCallback(
    (href: string): boolean => {
      return !!state.loading[href];
    },
    [state.loading]
  );

  const hasError = useCallback(
    (href: string): boolean => {
      return !!state.errors[href];
    },
    [state.errors]
  );

  const getError = useCallback(
    (href: string): string | null => {
      return state.errors[href] || null;
    },
    [state.errors]
  );

  const getCacheTimestamp = useCallback(
    (href: string): number | null => {
      return state.lastLoaded[href] || null;
    },
    [state.lastLoaded]
  );

  // ✅ СОХРАНЯЕМ: та же логика очистки кэша
  useEffect(() => {
    if (cacheTimeout <= 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const hrefs = Object.keys(state.lastLoaded);

      hrefs.forEach((href) => {
        const age = now - state.lastLoaded[href];
        if (age > cacheTimeout * 2) {
          clearCache(href);
        }
      });
    }, cacheTimeout);

    return () => clearInterval(interval);
  }, [state.lastLoaded, cacheTimeout, clearCache]);

  // ✅ СОХРАНЯЕМ: тот же контекст
  const contextValue: SectionContextValue = {
    sections: state.sections,
    loading: state.loading,
    errors: state.errors,
    loadSections,
    updateSections,
    getSections,
    clearCache,
    invalidateCache,
    clearError,
    isSectionsLoaded,
    isLoading,
    hasError,
    getError,
    getCacheTimestamp,
  };

  return (
    <SectionContext.Provider value={contextValue}>
      {children}
    </SectionContext.Provider>
  );
}

// ✅ СОХРАНЯЕМ: те же хуки и экспорты
export function useSections() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error("useSections must be used within a SectionProvider");
  }
  return context;
}

export function usePageSections(href?: string) {
  const context = useSections();
  const [autoLoaded, setAutoLoaded] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);

  React.useEffect(() => {
    if (!href) return;

    const shouldLoad =
      !autoLoaded &&
      !context.isSectionsLoaded(href) &&
      !context.isLoading(href);

    if (shouldLoad) {
      context
        .loadSections(href)
        .then((sections) => {
          setAutoLoaded(true);
        })
        .catch((error) => {
          if (retryCount < 3) {
            setTimeout(
              () => {
                setRetryCount((prev) => prev + 1);
              },
              1000 * (retryCount + 1)
            );
          }
        });
    }
  }, [href, context, autoLoaded, retryCount]);

  React.useEffect(() => {
    setAutoLoaded(false);
    setRetryCount(0);
  }, [href]);

  const reload = React.useCallback(() => {
    if (!href) return Promise.resolve();
    setAutoLoaded(false);
    return context.loadSections(href, true);
  }, [href, context]);

  const update = React.useCallback(
    (sections: ExtendedSection[]) => {
      if (!href) return;
      context.updateSections(href, sections);
    },
    [href, context]
  );

  const clearError = React.useCallback(() => {
    if (!href) return;
    context.clearError(href);
  }, [href, context]);

  return {
    sections: href ? context.getSections(href) : null,
    loading: href ? context.isLoading(href) : false,
    error: href ? context.getError(href) : null,
    hasError: href ? context.hasError(href) : false,
    isLoaded: href ? context.isSectionsLoaded(href) : false,
    lastLoaded: href ? context.getCacheTimestamp(href) : null,
    reload,
    update,
    clearError,
  };
}

export function useMultiPageSections(hrefs: string[]) {
  const context = useSections();

  const loadMultiple = React.useCallback(
    async (force = false) => {
      const promises = hrefs.map((href) => context.loadSections(href, force));
      return await Promise.allSettled(promises);
    },
    [hrefs, context]
  );

  const sectionsMap = React.useMemo(() => {
    const map: Record<string, ExtendedSection[] | null> = {};
    hrefs.forEach((href) => {
      map[href] = context.getSections(href);
    });
    return map;
  }, [hrefs, context]);

  const loadingMap = React.useMemo(() => {
    const map: Record<string, boolean> = {};
    hrefs.forEach((href) => {
      map[href] = context.isLoading(href);
    });
    return map;
  }, [hrefs, context]);

  const errorMap = React.useMemo(() => {
    const map: Record<string, string | null> = {};
    hrefs.forEach((href) => {
      map[href] = context.getError(href);
    });
    return map;
  }, [hrefs, context]);

  return {
    sectionsMap,
    loadingMap,
    errorMap,
    loadMultiple,
    isAnyLoading: Object.values(loadingMap).some(Boolean),
    hasAnyError: Object.values(errorMap).some(Boolean),
    totalSections: Object.values(sectionsMap).reduce(
      (sum, sections) => sum + (sections?.length || 0),
      0
    ),
  };
}

// ✅ СОХРАНЯЕМ: те же экспорты
export type { SectionContextValue, ExtendedSection };
