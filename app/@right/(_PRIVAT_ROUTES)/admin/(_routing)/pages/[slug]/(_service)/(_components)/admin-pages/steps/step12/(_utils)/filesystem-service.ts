// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_utils)/filesystem-service.ts

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import type { PageUploadPayload } from "@/app/@right/(_service)/(_types)/section-types";
import { generatePageTsxContent } from "./page-generator";

// Response interface - exactly matching original
interface PageUploadResponse {
  success: boolean;
  message: string;
  filePath?: string;
  environment: "development" | "production";
  error?: string;
  errorCode?: string;
  details?: string;
}

// Error codes enum - identical to original
enum ErrorCode {
  GITHUB_TOKEN_INVALID = "github_token_invalid",
  GITHUB_API_UNAVAILABLE = "github_api_unavailable",
  NETWORK_ERROR = "network_error",
  FILE_WRITE_FAILED = "file_write_failed",
  INVALID_DATA_FORMAT = "invalid_data_format",
  DIRECTORY_CREATION_FAILED = "directory_creation_failed",
  VALIDATION_ERROR = "validation_error",
  UNKNOWN_ERROR = "unknown_error",
}

/**
 * Ensures directory exists, creates it recursively if needed
 * Critical utility for filesystem operations - do not modify
 * 
 * @param dirPath - Full path to directory that should exist
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

/**
 * Saves page to local filesystem for development environment
 * Production-critical function - preserve exact error handling
 * 
 * @param firstPartHref - First part of the URL path (category)
 * @param secondPartHref - Second part of the URL path (subcategory)
 * @param payload - Complete page data including metadata and sections
 * @returns Promise<PageUploadResponse> - Save result with status and details
 */
export async function saveToFileSystem(
  firstPartHref: string,
  secondPartHref: string,
  payload: PageUploadPayload
): Promise<PageUploadResponse> {
  try {
    const pagesDir = join(process.cwd(), "app", "@right", "(_PAGES)");
    const categoryDir = join(pagesDir, firstPartHref);
    const pageDir = join(categoryDir, secondPartHref);
    const filePath = join(pageDir, "page.tsx");
    const relativeFilePath = `app/@right/(_PAGES)/${firstPartHref}/${secondPartHref}/page.tsx`;

    // Create all necessary directories
    await ensureDirectoryExists(pagesDir);
    await ensureDirectoryExists(categoryDir);
    await ensureDirectoryExists(pageDir);

    const fileContent = generatePageTsxContent(firstPartHref, secondPartHref, payload);
    await writeFile(filePath, fileContent, "utf-8");

    return {
      success: true,
      message: `Successfully created page "${payload.pageMetadata.title || 'Untitled'}" in filesystem`,
      filePath: relativeFilePath,
      environment: "development",
    };
  } catch (error: any) {
    if (error.message.includes("EACCES")) {
      return {
        success: false,
        message: "Permission denied: Unable to write to file system",
        error: error.message,
        errorCode: ErrorCode.FILE_WRITE_FAILED,
        environment: "development",
      };
    }

    if (error.message.includes("ENOSPC")) {
      return {
        success: false,
        message: "No space left on device",
        error: error.message,
        errorCode: ErrorCode.FILE_WRITE_FAILED,
        environment: "development",
      };
    }

    return {
      success: false,
      message: "Failed to create page in local filesystem",
      error: error.message || "Unknown filesystem error",
      errorCode: ErrorCode.FILE_WRITE_FAILED,
      environment: "development",
    };
  }
}

// Export types for use in main router
export type { PageUploadResponse };
export { ErrorCode };
