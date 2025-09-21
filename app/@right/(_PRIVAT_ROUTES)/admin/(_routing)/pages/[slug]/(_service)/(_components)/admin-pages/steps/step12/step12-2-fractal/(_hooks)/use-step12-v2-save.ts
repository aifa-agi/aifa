// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_hooks)/use-step12-v2-save.ts
/**
 * Step12 V2 Save Hook - File System Based Section Editor  
 * AUTONOMOUS VERSION - no imports from step12-1-fractal
 * Creates own upload service and error handling
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { toFileSystemPayload } from "../(_adapters)/sections-v2-mapper";
import { STEP12_V2_IDS } from "../(_constants)/step12-v2-ids";
import { STEP12_V2_TEXTS } from "../(_constants)/step12-v2-texts";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

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

async function uploadSectionsV2(
  payload: import("../(_types)/step12-v2-types").FileSystemSectionPayload
): Promise<SectionUploadV2Response> {
  try {
    // Validate payload before sending
    validateV2Payload(payload);

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

function validateV2Payload(payload: import("../(_types)/step12-v2-types").FileSystemSectionPayload): void {
  if (!payload || typeof payload !== "object") {
    throw new SectionUploadV2Error("Payload must be an object", UploadErrorV2Type.VALIDATION_ERROR);
  }

  if (!payload.href || typeof payload.href !== "string") {
    throw new SectionUploadV2Error("href is required and must be a string", UploadErrorV2Type.VALIDATION_ERROR);
  }

  if (!payload.sections || !Array.isArray(payload.sections)) {
    throw new SectionUploadV2Error("sections must be an array", UploadErrorV2Type.VALIDATION_ERROR);
  }

  if (payload.sections.length === 0) {
    throw new SectionUploadV2Error("At least one section is required", UploadErrorV2Type.VALIDATION_ERROR);
  }

  // Validate each section
  for (let i = 0; i < payload.sections.length; i++) {
    const section = payload.sections[i] as any;

    if (!section || typeof section !== "object") {
      throw new SectionUploadV2Error(`Section at index ${i} must be an object`, UploadErrorV2Type.VALIDATION_ERROR);
    }

    if (!section.id || typeof section.id !== "string") {
      throw new SectionUploadV2Error(`Section at index ${i} must have a string id property`, UploadErrorV2Type.VALIDATION_ERROR);
    }

    if (!section.bodyContent || typeof section.bodyContent !== "object") {
      throw new SectionUploadV2Error(`Section at index ${i} must have a bodyContent object`, UploadErrorV2Type.VALIDATION_ERROR);
    }
  }
}

function getV2ErrorTypeFromStatus(status: number): UploadErrorV2Type {
  if (status >= 400 && status < 500) return UploadErrorV2Type.VALIDATION_ERROR;
  if (status >= 500) return UploadErrorV2Type.SERVER_ERROR;
  return UploadErrorV2Type.UNKNOWN_ERROR;
}

function getV2ErrorTypeFromCode(errorCode?: string): UploadErrorV2Type {
  if (!errorCode) return UploadErrorV2Type.UNKNOWN_ERROR;
  
  switch (errorCode) {
    case "validation-error":
    case "invalid-data-format":
      return UploadErrorV2Type.VALIDATION_ERROR;
    case "github-token-invalid":
    case "github-api-unavailable":
      return UploadErrorV2Type.GITHUB_ERROR;
    case "file-write-failed":
    case "directory-creation-failed":
      return UploadErrorV2Type.FILESYSTEM_ERROR;
    case "network-error":
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
    
    toast.loading(STEP12_V2_TEXTS.save.startDescription, {
      id: STEP12_V2_IDS.toasts.saveStart
    });

    try {
      const payload = toFileSystemPayload(sections, pageToSave.href);
      
      if (payload.sections.length === 0) {
        throw new Error(STEP12_V2_TEXTS.errors.noSections);
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
                ? { ...p, isPreviewComplited: true, updatedAt: new Date().toISOString() }
                : p
            )
          }))
        );
      } catch (navError) {
        console.warn("Step12V2Save: Failed to update navigation state", navError);
      }

      toast.success(
        `${STEP12_V2_TEXTS.save.successDescription} (${payload.sections.length} sections)${
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
            errorMessage = STEP12_V2_TEXTS.errors.fileSystemError;
            break;
          case UploadErrorV2Type.SERVER_ERROR:
            errorMessage = `${STEP12_V2_TEXTS.errors.serverError}: ${error.message}`;
            break;
          default:
            errorMessage = `${STEP12_V2_TEXTS.save.errorDescription}: ${error.message}`;
        }

        toast.error(errorMessage, {
          id: STEP12_V2_IDS.toasts.saveError,
          duration: 6000
        });
      } else {
        const message = error instanceof Error 
          ? error.message 
          : STEP12_V2_TEXTS.errors.unknownError;
          
        toast.error(`${STEP12_V2_TEXTS.save.errorTitle}: ${message}`, {
          id: STEP12_V2_IDS.toasts.saveError,
          duration: 6000
        });
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
