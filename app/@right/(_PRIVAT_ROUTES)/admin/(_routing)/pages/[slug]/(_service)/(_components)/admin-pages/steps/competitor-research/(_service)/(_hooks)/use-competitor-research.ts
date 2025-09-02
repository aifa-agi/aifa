"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import {
  PageData,
  CompetitorAnalysis,
} from "@/app/@right/(_service)/(_types)/page-types";
import {
  CompetitorResearchItem,
  UseCompetitorResearchProps,
  UseCompetitorResearchReturn,
  LocalSaveState,
  UrlValidation,
  AiResponseValidation,
} from "../(_types)/competitor-research-types";
import {
  URL_VALIDATION_RULES,
  AI_RESPONSE_VALIDATION_RULES,
  COMPETITOR_UI_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOCAL_SAVE_MESSAGES,
  isValidCompetitorUrl,
  extractCompetitorNameFromUrl,
  generateSystemInstruction,
  validateCompetitorAnalysisJson,
} from "../(_constants)/competitor-research-config";

const validateCompetitorUrl = (url: string): UrlValidation => {
  console.log("🔍 validateCompetitorUrl called with:", url);

  const sanitizedUrl = URL_VALIDATION_RULES.TRIM_WHITESPACE ? url.trim() : url;

  if (sanitizedUrl.length < URL_VALIDATION_RULES.MIN_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.URL_TOO_SHORT };
  }

  if (sanitizedUrl.length > URL_VALIDATION_RULES.MAX_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.URL_TOO_LONG };
  }

  if (!isValidCompetitorUrl(sanitizedUrl)) {
    return { isValid: false, error: ERROR_MESSAGES.URL_INVALID_FORMAT };
  }

  const extractedName = extractCompetitorNameFromUrl(sanitizedUrl);
  return { isValid: true, sanitizedUrl, extractedName };
};

const validateAiResponse = (response: string): AiResponseValidation => {
  const sanitizedResponse = AI_RESPONSE_VALIDATION_RULES.TRIM_WHITESPACE
    ? response.trim()
    : response;

  if (sanitizedResponse.length < AI_RESPONSE_VALIDATION_RULES.MIN_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.AI_RESPONSE_TOO_SHORT };
  }

  if (sanitizedResponse.length > AI_RESPONSE_VALIDATION_RULES.MAX_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.AI_RESPONSE_TOO_LONG };
  }

  if (AI_RESPONSE_VALIDATION_RULES.EXPECT_JSON_FORMAT) {
    const jsonValidation = validateCompetitorAnalysisJson(sanitizedResponse);
    if (!jsonValidation.isValid) {
      return {
        isValid: false,
        error: `${ERROR_MESSAGES.AI_RESPONSE_INVALID_JSON}: ${jsonValidation.error}`,
      };
    }
  }

  return { isValid: true, sanitizedResponse };
};

const convertJsonToCompetitorAnalysis = (
  jsonString: string
): CompetitorAnalysis | null => {
  try {
    const validation = validateCompetitorAnalysisJson(jsonString);
    if (!validation.isValid || !validation.parsedData) {
      return null;
    }

    const parsed = validation.parsedData;

    const competitorAnalysis: CompetitorAnalysis = {
      href: parsed.href,
      competitorName: parsed.competitorName,
      isSuitable: false,
      isAnalyzed: parsed.isAnalyzed,
      recommendationReason: parsed.recommendationReason,
      competitorStructure: parsed.competitorStructure || [],
      overallAnalysis: parsed.overallAnalysis,
    };

    return competitorAnalysis;
  } catch (error) {
    console.error("❌ Error converting JSON to CompetitorAnalysis:", error);
    return null;
  }
};

/**
 * Utility function to deeply compare two arrays of competitors
 * More reliable than JSON.stringify for complex objects
 */
const areCompetitorsEqual = (
  arr1: CompetitorResearchItem[],
  arr2: CompetitorResearchItem[]
): boolean => {
  if (arr1.length !== arr2.length) return false;

  return arr1.every((item1, index) => {
    const item2 = arr2[index];
    return (
      item1.id === item2.id &&
      item1.url === item2.url &&
      item1.competitorName === item2.competitorName &&
      item1.instructionGenerated === item2.instructionGenerated &&
      item1.instructionCopied === item2.instructionCopied &&
      item1.aiResponseRaw === item2.aiResponseRaw &&
      item1.isCompleted === item2.isCompleted
    );
  });
};

export function useCompetitorResearch({
  page,
  categoryTitle,
  slug,
}: UseCompetitorResearchProps): UseCompetitorResearchReturn {
  console.log("🔄 useCompetitorResearch hook initialized", {
    pageId: page?.id,
    categoryTitle,
    slug,
    timestamp: Date.now(),
  });

  const { categories, setCategories, updateCategories } = useNavigationMenu();

  const [competitors, setCompetitors] = useState<CompetitorResearchItem[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [generatingInstructions, setGeneratingInstructions] = useState(
    new Set<string>()
  );

  const [localSaveState, setLocalSaveState] = useState<LocalSaveState>({
    hasLocalChanges: false,
    localCompetitorAnalysis: null,
    pendingServerUpload: false,
    lastLocalSaveAt: null,
  });
  const [isServerUploading, setIsServerUploading] = useState(false);

  const originalCompetitorsRef = useRef<CompetitorResearchItem[]>([]);

  const isPageValid = Boolean(page && page.id);
  const canEdit: boolean = !isUpdating && !isServerUploading && isPageValid;

  /**
   * ИСПРАВЛЕНО: Инициализация конкурентов из данных страницы
   */
  useEffect(() => {
    if (page?.competitorAnalysis) {
      const loadedCompetitors: CompetitorResearchItem[] =
        page.competitorAnalysis.map((analysis: CompetitorAnalysis) => ({
          id: analysis.href,
          url: analysis.href,
          competitorName: analysis.competitorName,
          instructionGenerated: false,
          instructionCopied: false,
          aiResponseRaw: JSON.stringify(analysis, null, 2),
          isCompleted: analysis.isAnalyzed || false,
          createdAt: new Date().toISOString(),
        }));

      setCompetitors(loadedCompetitors);
      originalCompetitorsRef.current = [...loadedCompetitors];

      // Сброс локального состояния при загрузке новой страницы
      setLocalSaveState({
        hasLocalChanges: false,
        localCompetitorAnalysis: null,
        pendingServerUpload: false,
        lastLocalSaveAt: null,
      });

      console.log("✅ Competitors loaded from page data:", {
        count: loadedCompetitors.length,
        pageId: page.id,
      });
    }
  }, [page?.id, page?.competitorAnalysis]);

  /**
   * НОВОЕ: Отслеживание изменений в массиве конкурентов
   * Это ключевое исправление для правильного отображения кнопок
   */
  useEffect(() => {
    const hasChanges = !areCompetitorsEqual(
      competitors,
      originalCompetitorsRef.current
    );

    console.log("🔍 Tracking competitors changes:", {
      hasChanges,
      currentCount: competitors.length,
      originalCount: originalCompetitorsRef.current.length,
      currentLocalChanges: localSaveState.hasLocalChanges,
    });

    if (hasChanges !== localSaveState.hasLocalChanges) {
      setLocalSaveState((prev) => ({
        ...prev,
        hasLocalChanges: hasChanges,
      }));

      console.log("🔄 Updated hasLocalChanges:", hasChanges);
    }
  }, [competitors, localSaveState.hasLocalChanges]);

  /**
   * ИСПРАВЛЕНО: Добавление конкурента с правильным обновлением состояния
   */
  const addCompetitor = useCallback(
    (url: string) => {
      if (!isPageValid) {
        toast.warning(ERROR_MESSAGES.PAGE_NOT_FOUND);
        return;
      }

      if (isUpdating || isServerUploading) {
        toast.warning(ERROR_MESSAGES.UPDATE_IN_PROGRESS);
        return;
      }

      const validation = validateCompetitorUrl(url);
      if (!validation.isValid) {
        toast.error(validation.error || ERROR_MESSAGES.URL_INVALID_FORMAT);
        return;
      }

      if (competitors.some((comp) => comp.url === validation.sanitizedUrl)) {
        toast.error(ERROR_MESSAGES.URL_DUPLICATE);
        return;
      }

      if (competitors.length >= COMPETITOR_UI_CONFIG.MAX_COMPETITORS) {
        toast.error(ERROR_MESSAGES.MAX_COMPETITORS_REACHED);
        return;
      }

      const newCompetitor: CompetitorResearchItem = {
        id: nanoid(),
        url: validation.sanitizedUrl!,
        competitorName: validation.extractedName!,
        instructionGenerated: false,
        instructionCopied: false,
        aiResponseRaw: "",
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };

      // Создаем новый массив (иммутабельное обновление)
      setCompetitors((prev) => {
        const newCompetitors = [...prev, newCompetitor];
        console.log("➕ Added competitor:", {
          id: newCompetitor.id,
          name: newCompetitor.competitorName,
          newCount: newCompetitors.length,
        });
        return newCompetitors;
      });

      toast.success(SUCCESS_MESSAGES.COMPETITOR_ADDED);
    },
    [isPageValid, isUpdating, isServerUploading, competitors]
  );

  /**
   * ИСПРАВЛЕНО: Обновление конкурента с правильным иммутабельным обновлением
   */
  const updateCompetitor = useCallback(
    (id: string, updates: Partial<CompetitorResearchItem>) => {
      setCompetitors((prev) => {
        const updated = prev.map((comp) =>
          comp.id === id ? { ...comp, ...updates } : comp
        );

        console.log("🔄 Updated competitor:", {
          id,
          updates,
          hasChanges: !areCompetitorsEqual(
            updated,
            originalCompetitorsRef.current
          ),
        });

        return updated;
      });
    },
    []
  );

  /**
   * ИСПРАВЛЕНО: Удаление конкурента с правильным иммутабельным обновлением
   */
  const removeCompetitor = useCallback(
    (id: string) => {
      if (isUpdating || isServerUploading) {
        toast.warning(ERROR_MESSAGES.UPDATE_IN_PROGRESS);
        return;
      }

      setCompetitors((prev) => {
        const filtered = prev.filter((comp) => comp.id !== id);
        console.log("➖ Removed competitor:", {
          id,
          newCount: filtered.length,
        });
        return filtered;
      });

      toast.success(SUCCESS_MESSAGES.COMPETITOR_REMOVED);
    },
    [isUpdating, isServerUploading]
  );

  const generateInstruction = useCallback(
    (competitorId: string): string => {
      if (generatingInstructions.has(competitorId)) {
        return "";
      }

      const competitor = competitors.find((comp) => comp.id === competitorId);
      if (!competitor) {
        return "";
      }

      if (competitor.instructionGenerated) {
        return generateSystemInstruction(
          competitor.url,
          competitor.competitorName
        );
      }

      setGeneratingInstructions((prev) => new Set(prev).add(competitorId));

      try {
        const instruction = generateSystemInstruction(
          competitor.url,
          competitor.competitorName
        );

        updateCompetitor(competitorId, { instructionGenerated: true });
        toast.success(SUCCESS_MESSAGES.INSTRUCTION_GENERATED);

        return instruction;
      } catch (error) {
        return "";
      } finally {
        setGeneratingInstructions((prev) => {
          const updated = new Set(prev);
          updated.delete(competitorId);
          return updated;
        });
      }
    },
    [competitors, updateCompetitor, generatingInstructions]
  );

  const markInstructionCopied = useCallback(
    (competitorId: string) => {
      updateCompetitor(competitorId, { instructionCopied: true });
      toast.success(SUCCESS_MESSAGES.INSTRUCTION_COPIED);
    },
    [updateCompetitor]
  );

  const updateAiResponse = useCallback(
    (competitorId: string, response: string) => {
      const validation = validateAiResponse(response);
      if (!validation.isValid) {
        toast.error(validation.error || ERROR_MESSAGES.AI_RESPONSE_REQUIRED);
        return;
      }

      const competitorAnalysis = convertJsonToCompetitorAnalysis(
        validation.sanitizedResponse!
      );
      if (!competitorAnalysis) {
        toast.error(ERROR_MESSAGES.AI_RESPONSE_INVALID_STRUCTURE);
        return;
      }

      updateCompetitor(competitorId, {
        aiResponseRaw: validation.sanitizedResponse!,
        isCompleted: true,
      });

      toast.success(SUCCESS_MESSAGES.AI_RESPONSE_PARSED);
    },
    [updateCompetitor]
  );

  /**
   * ИСПРАВЛЕНО: Локальное сохранение с правильным обновлением состояния
   */
  const saveCompetitorsLocally = useCallback(async (): Promise<boolean> => {
    console.log("💾 saveCompetitorsLocally called");

    if (!isPageValid || !page) {
      toast.error(ERROR_MESSAGES.PAGE_NOT_FOUND);
      return false;
    }

    if (competitors.length < COMPETITOR_UI_CONFIG.MIN_COMPETITORS_FOR_SAVE) {
      toast.error(ERROR_MESSAGES.MIN_COMPETITORS_REQUIRED);
      return false;
    }

    try {
      const updatedCompetitorAnalysis: CompetitorAnalysis[] = competitors.map(
        (comp) => {
          if (comp.isCompleted && comp.aiResponseRaw) {
            const parsedAnalysis = convertJsonToCompetitorAnalysis(
              comp.aiResponseRaw
            );
            if (parsedAnalysis) {
              return parsedAnalysis;
            }
          }

          return {
            href: comp.url,
            competitorName: comp.competitorName,
            isSuitable: true,
            isAnalyzed: comp.isCompleted,
            recommendationReason: `Competitor analysis for ${comp.competitorName}`,
            competitorStructure: [],
          };
        }
      );

      // Обновляем оригинальную версию, чтобы сбросить hasLocalChanges
      originalCompetitorsRef.current = [...competitors];

      setLocalSaveState({
        hasLocalChanges: false,
        localCompetitorAnalysis: updatedCompetitorAnalysis,
        pendingServerUpload: true,
        lastLocalSaveAt: new Date().toISOString(),
      });

      toast.success(LOCAL_SAVE_MESSAGES.LOCAL_SAVE_SUCCESS, {
        description: LOCAL_SAVE_MESSAGES.LOCAL_SAVE_DESCRIPTION,
        duration: 3000,
      });

      console.log("✅ Local save completed successfully");
      return true;
    } catch (error) {
      console.error("❌ Local save failed:", error);
      toast.error("Не удалось сохранить данные локально");
      return false;
    }
  }, [competitors, page, isPageValid]);

  /**
   * ИСПРАВЛЕНО: Выгрузка на сервер с правильным обновлением состояния
   */
  const uploadToServer = useCallback(async (): Promise<boolean> => {
    console.log("🚀 uploadToServer called");

    if (!localSaveState.localCompetitorAnalysis || !page) {
      toast.error(LOCAL_SAVE_MESSAGES.NO_LOCAL_DATA);
      return false;
    }

    if (!localSaveState.pendingServerUpload) {
      toast.warning("Нет данных, ожидающих выгрузки");
      return false;
    }

    setIsServerUploading(true);

    try {
      const updatedPage: PageData = {
        ...page,
        competitorAnalysis: localSaveState.localCompetitorAnalysis,
      };

      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((p) =>
                  p.id !== page.id ? p : updatedPage
                ),
              }
        )
      );

      const updateError = await updateCategories();

      if (updateError) {
        // Rollback при ошибке
        setCategories((prev) =>
          prev.map((cat) =>
            cat.title !== categoryTitle
              ? cat
              : {
                  ...cat,
                  pages: cat.pages.map((p) =>
                    p.id !== page.id
                      ? p
                      : {
                          ...p,
                          competitorAnalysis: page.competitorAnalysis,
                        }
                  ),
                }
          )
        );

        toast.error(
          `${LOCAL_SAVE_MESSAGES.SERVER_UPLOAD_FAILED}: ${updateError.userMessage}`
        );
        return false;
      }

      // ИСПРАВЛЕНО: Сброс всех состояний после успешной выгрузки
      setLocalSaveState({
        hasLocalChanges: false,
        localCompetitorAnalysis: null,
        pendingServerUpload: false,
        lastLocalSaveAt: null,
      });

      // Обновляем originalCompetitorsRef чтобы отразить новое "чистое" состояние
      originalCompetitorsRef.current = [...competitors];

      toast.success(LOCAL_SAVE_MESSAGES.SERVER_UPLOAD_SUCCESS, {
        duration: 4000,
      });

      console.log("✅ Server upload completed successfully");
      return true;
    } catch (error) {
      console.error("❌ Server upload failed:", error);
      toast.error(LOCAL_SAVE_MESSAGES.SERVER_UPLOAD_FAILED);
      return false;
    } finally {
      setIsServerUploading(false);
    }
  }, [
    localSaveState.localCompetitorAnalysis,
    localSaveState.pendingServerUpload,
    page,
    categoryTitle,
    setCategories,
    updateCategories,
    competitors,
  ]);

  const canSaveResults =
    competitors.length >= COMPETITOR_UI_CONFIG.MIN_COMPETITORS_FOR_SAVE;

  // ИСПРАВЛЕНО: Более точный расчет несохраненных изменений
  const hasUnsavedChanges = localSaveState.hasLocalChanges;

  // ДЕБАГ: Логирование состояний для диагностики
  console.log("🔍 useCompetitorResearch state debug:", {
    competitorsCount: competitors.length,
    hasLocalChanges: localSaveState.hasLocalChanges,
    pendingServerUpload: localSaveState.pendingServerUpload,
    hasUnsavedChanges,
    canSaveResults,
    canEdit,
  });

  return {
    // Основные данные
    competitors,
    isUpdating,
    canEdit,

    // Управление конкурентами
    addCompetitor,
    updateCompetitor,
    removeCompetitor,

    // Генерация инструкций
    generateInstruction,
    markInstructionCopied,
    updateAiResponse,

    // Разделенное сохранение
    saveCompetitorsLocally,
    uploadToServer,

    // Состояния сохранения
    canSaveResults,
    hasUnsavedChanges,
    hasLocalChanges: localSaveState.hasLocalChanges,
    pendingServerUpload: localSaveState.pendingServerUpload,
    isServerUploading,
  };
}
