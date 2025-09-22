// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_hooks)/use-step12-v2-save.ts
/**
 * Step12 V2 Save Hook - Updated for PageUploadPayload  
 * AUTONOMOUS VERSION - no imports from step12-1-fractal
 * Creates own upload service and error handling with new payload structure
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { toPageUploadPayload, validatePageUploadPayload } from "../(_adapters)/sections-v2-mapper";
import { STEP12_V2_IDS } from "../(_constants)/step12-v2-ids";
import { STEP12_V2_TEXTS } from "../(_constants)/step12-v2-texts";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import type { PageUploadPayload } from "@/app/@right/(_service)/(_types)/section-types";

// ==================== AUTONOMOUS V2 UPLOAD SERVICE ====================

interface SectionUploadV2Response {
  success: boolean;
  message: string;
  filePath?: string;
  environment?: "development" | "production";
  error?: string;
  errorCode?: string;
  details?: string;
}

enum UploadErrorV2Type {
  VALIDATION_ERROR = "validation-error",
  NETWORK_ERROR = "network-error", 
  SERVER_ERROR = "server-error",
  FILESYSTEM_ERROR = "filesystem-error",
  GITHUB_ERROR = "github-error",
  UNKNOWN_ERROR = "unknown-error",
}

class SectionUploadV2Error extends Error {
  public readonly type: UploadErrorV2Type;
  public readonly statusCode?: number;
  public readonly details?: string;

  constructor(
    message: string,
    type: UploadErrorV2Type = UploadErrorV2Type.UNKNOWN_ERROR,
    statusCode?: number,
    details?: string
  ) {
    super(message);
    this.name = "SectionUploadV2Error";
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * ✅ ОБНОВЛЕНО: Использует новый API endpoint и PageUploadPayload
 */
async function uploadSectionsV2(payload: PageUploadPayload): Promise<SectionUploadV2Response> {
  try {
    // Validate payload before sending using new validation
    const validationErrors = validatePageUploadPayload(payload);
    if (validationErrors.length > 0) {
      throw new SectionUploadV2Error(
        `Validation failed: ${validationErrors.join(", ")}`,
        UploadErrorV2Type.VALIDATION_ERROR
      );
    }

    // ✅ ОБНОВЛЕНО: Используем новый API endpoint
    const response = await fetch("/api/sections/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Handle non-JSON responses (HTML error pages)
    const responseText = await response.text();
    if (responseText.startsWith("<!DOCTYPE") || responseText.startsWith("<html")) {
      throw new SectionUploadV2Error(
        "Server returned HTML instead of JSON. Check server configuration.",
        UploadErrorV2Type.SERVER_ERROR,
        response.status
      );
    }

    let result: SectionUploadV2Response;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new SectionUploadV2Error(
        `Invalid JSON response: ${responseText.substring(0, 100)}...`,
        UploadErrorV2Type.SERVER_ERROR,
        response.status
      );
    }

    // Handle HTTP errors
    if (!response.ok) {
      const errorType = getV2ErrorTypeFromStatus(response.status);
      throw new SectionUploadV2Error(
        result.message || `HTTP ${response.status}: ${response.statusText}`,
        errorType,
        response.status,
        result.details
      );
    }

    // Handle application-level failures
    if (!result.success) {
      const errorType = getV2ErrorTypeFromCode(result.errorCode);
      throw new SectionUploadV2Error(
        result.message || "Upload failed",
        errorType,
        response.status,
        result.details
      );
    }

    return result;
  } catch (error) {
    if (error instanceof SectionUploadV2Error) {
      throw error;
    }

    // Network or other unexpected errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new SectionUploadV2Error(
        "Network error: Unable to connect to server",
        UploadErrorV2Type.NETWORK_ERROR
      );
    }

    throw new SectionUploadV2Error(
      error instanceof Error ? error.message : "Unknown upload error",
      UploadErrorV2Type.UNKNOWN_ERROR
    );
  }
}

/**
 * ✅ УДАЛЕНО: validateV2Payload - теперь используется validatePageUploadPayload из mapper
 */

function getV2ErrorTypeFromStatus(status: number): UploadErrorV2Type {
  if (status >= 400 && status < 500) return UploadErrorV2Type.VALIDATION_ERROR;
  if (status >= 500) return UploadErrorV2Type.SERVER_ERROR;
  return UploadErrorV2Type.UNKNOWN_ERROR;
}

function getV2ErrorTypeFromCode(errorCode?: string): UploadErrorV2Type {
  if (!errorCode) return UploadErrorV2Type.UNKNOWN_ERROR;
  
  switch (errorCode) {
    case "validation_error":
    case "invalid_data_format":
      return UploadErrorV2Type.VALIDATION_ERROR;
    case "github_token_invalid":
    case "github_api_unavailable":
      return UploadErrorV2Type.GITHUB_ERROR;
    case "file_write_failed":
    case "directory_creation_failed":
      return UploadErrorV2Type.FILESYSTEM_ERROR;
    case "network_error":
      return UploadErrorV2Type.NETWORK_ERROR;
    default:
      return UploadErrorV2Type.UNKNOWN_ERROR;
  }
}

// ==================== V2 SAVE HOOK ====================

interface UseStep12V2SaveReturn {
  save: (page?: PageData) => Promise<boolean>;
  saving: boolean;
}

/**
 * ✅ ОБНОВЛЕНО: Использует toPageUploadPayload вместо toFileSystemPayload
 */
export function useStep12V2Save(
  sections: import("../(_types)/step12-v2-types").SectionStateV2[],
  isAllReady: () => boolean,
  resetAllFlags: () => void,
  setSaving: (saving: boolean) => void,
  page?: PageData
): UseStep12V2SaveReturn {
  const [localSaving, setLocalSaving] = useState(false);
  const { setCategories } = useNavigationMenu();

  const save = useCallback(async (targetPage?: PageData): Promise<boolean> => {
    const pageToSave = targetPage || page;
    
    if (!pageToSave) {
      toast.error(STEP12_V2_TEXTS.errors.missingHref, {
        id: STEP12_V2_IDS.toasts.saveError
      });
      return false;
    }

    if (!pageToSave.href) {
      toast.error(STEP12_V2_TEXTS.errors.missingHref, {
        id: STEP12_V2_IDS.toasts.saveError
      });
      return false;
    }

    if (!isAllReady()) {
      toast.error(STEP12_V2_TEXTS.save.notReadyDescription, {
        id: STEP12_V2_IDS.toasts.saveNotReady
      });
      return false;
    }

    setLocalSaving(true);
    setSaving(true);
    
    toast.loading("Saving page with all sections...", {
      id: STEP12_V2_IDS.toasts.saveStart
    });

    try {
      // ✅ ОБНОВЛЕНО: Используем toPageUploadPayload с разделенными метаданными
      const payload: PageUploadPayload = toPageUploadPayload(sections, pageToSave);
      
      if (payload.sections.length === 0) {
        throw new Error(STEP12_V2_TEXTS.errors.noSections);
      }

      // Валидация метаданных страницы
      if (!payload.pageMetadata.title && !payload.pageMetadata.description) {
        console.warn("Step12V2Save: Page metadata is incomplete - no title or description provided");
      }

      const response = await uploadSectionsV2(payload);

      resetAllFlags();

      // Update navigation state optimistically
      try {
        setCategories(prevCategories => 
          prevCategories.map(category => ({
            ...category,
            pages: category.pages.map(p => 
              p.href === pageToSave.href 
                ? { 
                    ...p, 
                    isPreviewComplited: true, 
                    updatedAt: new Date().toISOString(),
                    // Обновляем также метаданные в навигации
                    title: payload.pageMetadata.title || p.title,
                    description: payload.pageMetadata.description || p.description,
                  }
                : p
            )
          }))
        );
      } catch (navError) {
        console.warn("Step12V2Save: Failed to update navigation state", navError);
      }

      // ✅ ОБНОВЛЕНО: Показываем название страницы в успешном сообщении
      toast.success(
        `Successfully saved page "${payload.pageMetadata.title || 'Untitled'}" with ${payload.sections.length} sections${
          response.filePath ? ` to ${response.filePath}` : ""
        }`,
        {
          id: STEP12_V2_IDS.toasts.saveSuccess,
          duration: 4000
        }
      );

      return true;

    } catch (error) {
      console.error("Step12V2Save: Save failed", error);

      if (error instanceof SectionUploadV2Error) {
        let errorMessage = error.message;
        
        switch (error.type) {
          case UploadErrorV2Type.VALIDATION_ERROR:
            errorMessage = `${STEP12_V2_TEXTS.errors.validationError}: ${error.message}`;
            break;
          case UploadErrorV2Type.NETWORK_ERROR:
            errorMessage = STEP12_V2_TEXTS.errors.networkError;
            break;
          case UploadErrorV2Type.GITHUB_ERROR:
            errorMessage = `GitHub integration error: ${error.message}`;
            break;
          case UploadErrorV2Type.FILESYSTEM_ERROR:
            errorMessage = "File system error: Unable to save page";
            break;
          case UploadErrorV2Type.SERVER_ERROR:
            errorMessage = `${STEP12_V2_TEXTS.errors.serverError}: ${error.message}`;
            break;
          default:
            errorMessage = `Upload failed: ${error.message}`;
        }

        toast.error(errorMessage, {
          id: STEP12_V2_IDS.toasts.saveError,
          duration: 6000
        });
      } else {
        const message = error instanceof Error 
          ? error.message 
          : STEP12_V2_TEXTS.errors.unknownError;
          
        toast.error(`Save failed: ${message}`, {
          id: STEP12_V2_IDS.toasts.saveError,
          duration: 6000
        });
      }

      // Rollback navigation state
      try {
        setCategories(prevCategories =>
          prevCategories.map(category => ({
            ...category,
            pages: category.pages.map(p =>
              p.href === (targetPage || page)?.href
                ? { ...p, isPreviewComplited: false }
                : p
            ),
          }))
        );
      } catch (rollbackError) {
        console.warn("Step12V2Save: Failed to rollback navigation state", rollbackError);
      }

      return false;

    } finally {
      setLocalSaving(false);
      setSaving(false);
      toast.dismiss(STEP12_V2_IDS.toasts.saveStart);
    }
  }, [sections, isAllReady, resetAllFlags, setSaving, page, setCategories]);

  return {
    save,
    saving: localSaving
  };
}

// ==================== LEGACY SUPPORT ====================

/**
 * @deprecated Legacy function for backward compatibility
 * Use the updated version above instead
 */
export function useStep12V2SaveLegacy(
  sections: import("../(_types)/step12-v2-types").SectionStateV2[],
  isAllReady: () => boolean,
  resetAllFlags: () => void,
  setSaving: (saving: boolean) => void,
  page?: PageData
): UseStep12V2SaveReturn {
  console.warn("useStep12V2SaveLegacy is deprecated. Use useStep12V2Save instead.");
  return useStep12V2Save(sections, isAllReady, resetAllFlags, setSaving, page);
}
