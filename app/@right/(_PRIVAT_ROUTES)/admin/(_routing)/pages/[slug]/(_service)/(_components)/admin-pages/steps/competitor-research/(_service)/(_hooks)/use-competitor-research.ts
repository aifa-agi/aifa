// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/competitor-research/(_service)/(_hooks)/use-competitor-research.ts
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
  UrlValidation,
  AiResponseValidation,
} from "../(_types)/competitor-research-types";
import {
  URL_VALIDATION_RULES,
  AI_RESPONSE_VALIDATION_RULES,
  COMPETITOR_UI_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  isValidCompetitorUrl,
  extractCompetitorNameFromUrl,
  generateSystemInstruction,
  validateCompetitorAnalysisJson,
} from "../(_constants)/competitor-research-config";

/**
 * Validates competitor URL according to business rules
 */
const validateCompetitorUrl = (url: string): UrlValidation => {
  console.log("🔍 validateCompetitorUrl called with:", url);

  const sanitizedUrl = URL_VALIDATION_RULES.TRIM_WHITESPACE ? url.trim() : url;

  if (sanitizedUrl.length < URL_VALIDATION_RULES.MIN_LENGTH) {
    console.log("❌ URL too short:", sanitizedUrl.length);
    return {
      isValid: false,
      error: ERROR_MESSAGES.URL_TOO_SHORT,
    };
  }

  if (sanitizedUrl.length > URL_VALIDATION_RULES.MAX_LENGTH) {
    console.log("❌ URL too long:", sanitizedUrl.length);
    return {
      isValid: false,
      error: ERROR_MESSAGES.URL_TOO_LONG,
    };
  }

  if (!isValidCompetitorUrl(sanitizedUrl)) {
    console.log("❌ Invalid URL format:", sanitizedUrl);
    return {
      isValid: false,
      error: ERROR_MESSAGES.URL_INVALID_FORMAT,
    };
  }

  const extractedName = extractCompetitorNameFromUrl(sanitizedUrl);
  console.log("✅ URL validation passed:", { sanitizedUrl, extractedName });

  return {
    isValid: true,
    sanitizedUrl,
    extractedName,
  };
};

/**
 * Enhanced AI response validation with JSON structure validation
 */
const validateAiResponse = (response: string): AiResponseValidation => {
  console.log("🔍 validateAiResponse called with length:", response.length);

  const sanitizedResponse = AI_RESPONSE_VALIDATION_RULES.TRIM_WHITESPACE
    ? response.trim()
    : response;

  if (sanitizedResponse.length < AI_RESPONSE_VALIDATION_RULES.MIN_LENGTH) {
    console.log("❌ AI response too short:", sanitizedResponse.length);
    return {
      isValid: false,
      error: ERROR_MESSAGES.AI_RESPONSE_TOO_SHORT,
    };
  }

  if (sanitizedResponse.length > AI_RESPONSE_VALIDATION_RULES.MAX_LENGTH) {
    console.log("❌ AI response too long:", sanitizedResponse.length);
    return {
      isValid: false,
      error: ERROR_MESSAGES.AI_RESPONSE_TOO_LONG,
    };
  }

  // Enhanced JSON validation for CompetitorAnalysis structure
  if (AI_RESPONSE_VALIDATION_RULES.EXPECT_JSON_FORMAT) {
    console.log("🔍 Validating JSON structure...");
    const jsonValidation = validateCompetitorAnalysisJson(sanitizedResponse);

    if (!jsonValidation.isValid) {
      console.log("❌ JSON validation failed:", jsonValidation.error);
      return {
        isValid: false,
        error: `${ERROR_MESSAGES.AI_RESPONSE_INVALID_JSON}: ${jsonValidation.error}`,
      };
    }

    console.log("✅ JSON structure validation passed");
  }

  console.log("✅ AI response validation passed");
  return {
    isValid: true,
    sanitizedResponse,
  };
};

/**
 * Convert validated JSON response to CompetitorAnalysis format
 */
const convertJsonToCompetitorAnalysis = (
  jsonString: string
): CompetitorAnalysis | null => {
  try {
    const validation = validateCompetitorAnalysisJson(jsonString);
    if (!validation.isValid || !validation.parsedData) {
      return null;
    }

    const parsed = validation.parsedData;

    // Convert to CompetitorAnalysis format
    const competitorAnalysis: CompetitorAnalysis = {
      href: parsed.href,
      competitorName: parsed.competitorName,
      isSuitable: parsed.isSuitable,
      isAnalyzed: parsed.isAnalyzed,
      recommendationReason: parsed.recommendationReason,
      competitorStructure: parsed.competitorStructure || [],
      overallAnalysis: parsed.overallAnalysis,
    };

    console.log("✅ Successfully converted JSON to CompetitorAnalysis format");
    return competitorAnalysis;
  } catch (error) {
    console.error("❌ Error converting JSON to CompetitorAnalysis:", error);
    return null;
  }
};

/**
 * Custom hook for managing competitor research workflow
 * Enhanced with improved JSON validation and CompetitorAnalysis conversion
 */
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

  const originalCompetitorsRef = useRef<CompetitorResearchItem[]>([]);

  // Check if page is valid for operations
  const isPageValid = Boolean(page && page.id);
  const canEdit: boolean = !isUpdating && isPageValid;

  console.log("🔄 Hook state:", {
    competitorsCount: competitors.length,
    isUpdating,
    isPageValid,
    canEdit,
    generatingInstructionsCount: generatingInstructions.size,
  });

  /**
   * Initialize competitors from page data on mount or page change
   */
  useEffect(() => {
    console.log("🔄 useEffect triggered for page initialization", {
      hasPage: !!page,
      hasCompetitorAnalysis: !!page?.competitorAnalysis,
      analysisLength: page?.competitorAnalysis?.length || 0,
    });

    if (page?.competitorAnalysis) {
      const loadedCompetitors: CompetitorResearchItem[] =
        page.competitorAnalysis.map((analysis: CompetitorAnalysis) => ({
          id: analysis.href, // Use href as ID for existing data
          url: analysis.href,
          competitorName: analysis.competitorName,
          instructionGenerated: false,
          instructionCopied: false,
          aiResponseRaw: JSON.stringify(analysis, null, 2), // Store as formatted JSON
          isCompleted: analysis.isAnalyzed || false,
          createdAt: new Date().toISOString(),
        }));

      console.log("✅ Loaded competitors from page:", loadedCompetitors);
      setCompetitors(loadedCompetitors);
      originalCompetitorsRef.current = [...loadedCompetitors];
    }
  }, [page?.id]);

  /**
   * Add new competitor URL with validation
   */
  const addCompetitor = useCallback(
    (url: string) => {
      console.log("🔍 addCompetitor called", {
        url,
        isPageValid,
        isUpdating,
        currentCompetitorsCount: competitors.length,
      });

      if (!isPageValid) {
        console.warn("⚠️ Cannot add competitor: page data is not available");
        toast.warning(ERROR_MESSAGES.PAGE_NOT_FOUND);
        return;
      }

      if (isUpdating) {
        console.warn("⚠️ Cannot add competitor: update in progress");
        toast.warning(ERROR_MESSAGES.UPDATE_IN_PROGRESS);
        return;
      }

      // Validate URL
      const validation = validateCompetitorUrl(url);
      if (!validation.isValid) {
        console.error("❌ URL validation failed:", validation.error);
        toast.error(validation.error || ERROR_MESSAGES.URL_INVALID_FORMAT);
        return;
      }

      // Check for duplicates
      if (competitors.some((comp) => comp.url === validation.sanitizedUrl)) {
        console.warn("⚠️ Duplicate URL detected:", validation.sanitizedUrl);
        toast.error(ERROR_MESSAGES.URL_DUPLICATE);
        return;
      }

      // Check maximum limit
      if (competitors.length >= COMPETITOR_UI_CONFIG.MAX_COMPETITORS) {
        console.warn(
          "⚠️ Maximum competitors limit reached:",
          competitors.length
        );
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

      console.log("✅ Adding new competitor:", newCompetitor);
      setCompetitors((prev) => {
        const updated = [...prev, newCompetitor];
        console.log("🔄 Competitors updated:", {
          previousCount: prev.length,
          newCount: updated.length,
        });
        return updated;
      });

      toast.success(SUCCESS_MESSAGES.COMPETITOR_ADDED, {
        duration: COMPETITOR_UI_CONFIG.SUCCESS_TOAST_DURATION,
      });

      console.log(
        `✅ Added competitor: ${validation.sanitizedUrl} (${validation.extractedName})`
      );
    },
    [isPageValid, isUpdating, competitors.length]
  );

  /**
   * Update competitor data by ID
   */
  const updateCompetitor = useCallback(
    (id: string, updates: Partial<CompetitorResearchItem>) => {
      console.log("🔄 updateCompetitor called", {
        id: id.slice(0, 8),
        updates,
        timestamp: Date.now(),
      });

      setCompetitors((prev) => {
        console.log("🔄 Updating competitors array", {
          prevLength: prev.length,
          targetId: id.slice(0, 8),
        });

        const updated = prev.map((comp) => {
          if (comp.id === id) {
            const updatedComp = { ...comp, ...updates };
            console.log("✅ Competitor updated:", {
              id: id.slice(0, 8),
              before: comp,
              after: updatedComp,
            });
            return updatedComp;
          }
          return comp;
        });

        // Check if any changes were actually made
        const hasChanges = JSON.stringify(prev) !== JSON.stringify(updated);
        console.log("🔄 updateCompetitor result:", {
          hasChanges,
          updatedLength: updated.length,
        });

        return updated;
      });

      console.log(`✅ updateCompetitor completed for: ${id.slice(0, 8)}`);
    },
    []
  );

  /**
   * Remove competitor by ID
   */
  const removeCompetitor = useCallback(
    (id: string) => {
      console.log("🔄 removeCompetitor called", { id: id.slice(0, 8) });

      if (isUpdating) {
        console.warn("⚠️ Cannot remove competitor: update in progress");
        toast.warning(ERROR_MESSAGES.UPDATE_IN_PROGRESS);
        return;
      }

      setCompetitors((prev) => {
        const filtered = prev.filter((comp) => comp.id !== id);
        console.log("🔄 Competitor removed:", {
          previousCount: prev.length,
          newCount: filtered.length,
          removedId: id.slice(0, 8),
        });
        return filtered;
      });

      toast.success(SUCCESS_MESSAGES.COMPETITOR_REMOVED, {
        duration: COMPETITOR_UI_CONFIG.SUCCESS_TOAST_DURATION,
      });

      console.log(`✅ Removed competitor: ${id.slice(0, 8)}`);
    },
    [isUpdating]
  );

  /**
   * Generate system instruction for specific competitor
   */
  const generateInstruction = useCallback(
    (competitorId: string): string => {
      console.log("🔍 generateInstruction called", {
        competitorId: competitorId.slice(0, 8),
        isGenerating: generatingInstructions.has(competitorId),
        timestamp: Date.now(),
      });

      // Check if already generating
      if (generatingInstructions.has(competitorId)) {
        console.warn(
          "⚠️ Instruction already being generated for:",
          competitorId.slice(0, 8)
        );
        return "";
      }

      const competitor = competitors.find((comp) => comp.id === competitorId);
      if (!competitor) {
        console.error("❌ Competitor not found:", competitorId.slice(0, 8));
        return "";
      }

      console.log("🔄 Found competitor for instruction generation:", {
        id: competitorId.slice(0, 8),
        name: competitor.competitorName,
        url: competitor.url,
        alreadyGenerated: competitor.instructionGenerated,
      });

      // Check if instruction already generated
      if (competitor.instructionGenerated) {
        console.log("✅ Instruction already generated, returning existing");
        return generateSystemInstruction(
          competitor.url,
          competitor.competitorName
        );
      }

      // Mark as generating to prevent multiple calls
      setGeneratingInstructions((prev) => {
        const updated = new Set(prev);
        updated.add(competitorId);
        console.log("🔄 Added to generating set:", {
          competitorId: competitorId.slice(0, 8),
          setSize: updated.size,
        });
        return updated;
      });

      try {
        const instruction = generateSystemInstruction(
          competitor.url,
          competitor.competitorName
        );

        console.log("✅ Generated instruction:", {
          competitorId: competitorId.slice(0, 8),
          instructionLength: instruction.length,
        });

        // Mark instruction as generated
        updateCompetitor(competitorId, { instructionGenerated: true });

        toast.success(SUCCESS_MESSAGES.INSTRUCTION_GENERATED, {
          duration: COMPETITOR_UI_CONFIG.SUCCESS_TOAST_DURATION,
        });

        console.log(
          `✅ Instruction generated for competitor: ${competitor.competitorName}`
        );
        return instruction;
      } catch (error) {
        console.error("❌ Error generating instruction:", error);
        return "";
      } finally {
        // Remove from generating set
        setGeneratingInstructions((prev) => {
          const updated = new Set(prev);
          updated.delete(competitorId);
          console.log("🔄 Removed from generating set:", {
            competitorId: competitorId.slice(0, 8),
            setSize: updated.size,
          });
          return updated;
        });
      }
    },
    [competitors, updateCompetitor, generatingInstructions]
  );

  /**
   * Mark instruction as copied to clipboard
   */
  const markInstructionCopied = useCallback(
    (competitorId: string) => {
      console.log("🔄 markInstructionCopied called", {
        competitorId: competitorId.slice(0, 8),
      });

      updateCompetitor(competitorId, { instructionCopied: true });

      toast.success(SUCCESS_MESSAGES.INSTRUCTION_COPIED, {
        duration: COMPETITOR_UI_CONFIG.COPY_FEEDBACK_DURATION,
      });

      console.log(
        `✅ Marked instruction as copied for competitor: ${competitorId.slice(0, 8)}`
      );
    },
    [updateCompetitor]
  );

  /**
   * Enhanced AI response update with JSON validation and conversion
   */
  const updateAiResponse = useCallback(
    (competitorId: string, response: string) => {
      console.log("🔄 updateAiResponse called", {
        competitorId: competitorId.slice(0, 8),
        responseLength: response.length,
      });

      // Validate AI response
      const validation = validateAiResponse(response);
      if (!validation.isValid) {
        console.error("❌ AI response validation failed:", validation.error);
        toast.error(validation.error || ERROR_MESSAGES.AI_RESPONSE_REQUIRED);
        return;
      }

      // Additional validation for JSON structure
      const competitorAnalysis = convertJsonToCompetitorAnalysis(
        validation.sanitizedResponse!
      );
      if (!competitorAnalysis) {
        console.error("❌ Failed to convert JSON to CompetitorAnalysis format");
        toast.error(ERROR_MESSAGES.AI_RESPONSE_INVALID_STRUCTURE);
        return;
      }

      // Update competitor with validated response
      updateCompetitor(competitorId, {
        aiResponseRaw: validation.sanitizedResponse!,
        isCompleted: true,
      });

      toast.success(SUCCESS_MESSAGES.AI_RESPONSE_PARSED, {
        duration: COMPETITOR_UI_CONFIG.SUCCESS_TOAST_DURATION,
      });

      console.log(
        `✅ Updated AI response for competitor: ${competitorId.slice(0, 8)}`
      );
    },
    [updateCompetitor]
  );

  /**
   * Enhanced save competitors with JSON conversion
   */
  const saveCompetitors = useCallback(async (): Promise<boolean> => {
    console.log("🔄 saveCompetitors called", {
      competitorsCount: competitors.length,
      isPageValid,
      isUpdating,
    });

    if (!isPageValid || !page) {
      console.warn("❌ Cannot save competitors: page data is not available");
      toast.error(ERROR_MESSAGES.PAGE_NOT_FOUND);
      return false;
    }

    if (isUpdating) {
      console.warn("❌ Cannot save competitors: update in progress");
      toast.warning(ERROR_MESSAGES.UPDATE_IN_PROGRESS);
      return false;
    }

    if (competitors.length < COMPETITOR_UI_CONFIG.MIN_COMPETITORS_FOR_SAVE) {
      console.warn("❌ Not enough competitors to save:", competitors.length);
      toast.error(ERROR_MESSAGES.MIN_COMPETITORS_REQUIRED);
      return false;
    }

    setIsUpdating(true);
    console.log("🔄 Starting save operation...");

    try {
      // Convert competitors to CompetitorAnalysis format for PageData
      const updatedCompetitorAnalysis: CompetitorAnalysis[] = competitors.map(
        (comp) => {
          // If we have a completed analysis with JSON response, parse it
          if (comp.isCompleted && comp.aiResponseRaw) {
            const parsedAnalysis = convertJsonToCompetitorAnalysis(
              comp.aiResponseRaw
            );
            if (parsedAnalysis) {
              return parsedAnalysis;
            }
          }

          // Fallback to basic structure
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

      console.log(
        "🔄 Converted to CompetitorAnalysis format:",
        updatedCompetitorAnalysis
      );

      const updatedPage: PageData = {
        ...page,
        competitorAnalysis: updatedCompetitorAnalysis,
      };

      // Update categories in context
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

      // Attempt to persist changes
      const updateError = await updateCategories();

      if (updateError) {
        console.error("❌ Failed to update categories:", updateError);

        // Rollback on error
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
          `${ERROR_MESSAGES.SAVE_FAILED}: ${updateError.userMessage}`,
          { duration: COMPETITOR_UI_CONFIG.ERROR_TOAST_DURATION }
        );
        return false;
      }

      // Success - update original reference
      originalCompetitorsRef.current = [...competitors];

      toast.success(SUCCESS_MESSAGES.ALL_RESEARCH_SAVED, {
        duration: COMPETITOR_UI_CONFIG.SUCCESS_TOAST_DURATION,
      });

      console.log(
        `✅ Successfully saved ${competitors.length} competitors for page: ${page.id}`
      );
      return true;
    } catch (error) {
      console.error("❌ Unexpected error saving competitors:", error);

      // Rollback on unexpected error
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

      toast.error(ERROR_MESSAGES.SAVE_FAILED, {
        duration: COMPETITOR_UI_CONFIG.ERROR_TOAST_DURATION,
      });
      return false;
    } finally {
      setIsUpdating(false);
      console.log("🔄 Save operation completed");
    }
  }, [
    competitors,
    isUpdating,
    page,
    categoryTitle,
    setCategories,
    updateCategories,
    isPageValid,
  ]);

  /**
   * Check if results can be saved
   */
  const canSaveResults =
    competitors.length >= COMPETITOR_UI_CONFIG.MIN_COMPETITORS_FOR_SAVE;

  console.log("🔄 useCompetitorResearch hook returning:", {
    competitorsCount: competitors.length,
    isUpdating,
    canEdit,
    canSaveResults,
    generatingCount: generatingInstructions.size,
  });

  return {
    competitors,
    isUpdating,
    canEdit,
    addCompetitor,
    updateCompetitor,
    removeCompetitor,
    saveCompetitors,
    generateInstruction,
    markInstructionCopied,
    updateAiResponse,
    canSaveResults,
  };
}
