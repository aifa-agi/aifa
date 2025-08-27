// @/app/(_service)/lib/persist-menu.ts

import { MenuCategory } from "../(_types)/menu-types";
import {
  MenuPersistResponse,
  OperationStatus,
  ErrorCode,
  isSuccessResponse,
  isErrorResponse,
} from "../(_types)/api-response-types";

/**
 * Extended response interface that includes network-level errors
 * Uses intersection type instead of interface extension
 */
export type PersistMenuResult = MenuPersistResponse & {
  networkError?: boolean;
  httpStatus?: number;
};

/**
 * Persist menu categories to the server
 * Handles both successful responses and various error states
 */
export async function persistMenuCategories(
  categories: MenuCategory[]
): Promise<PersistMenuResult> {
  try {
    const response = await fetch("/api/menu/persist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categories }),
    });

    // Check if we got a response from the server
    if (
      !response.ok &&
      !response.headers.get("content-type")?.includes("application/json")
    ) {
      // Server returned non-JSON error (network issues, server down, etc.)
      return {
        status: OperationStatus.UNKNOWN_ERROR,
        message: "Network error occurred",
        error: `Server returned ${response.status}: ${response.statusText}`,
        networkError: true,
        httpStatus: response.status,
        environment: "production", // Assume production for network errors
      };
    }

    // Parse JSON response
    let apiResponse: MenuPersistResponse;
    try {
      apiResponse = await response.json();
    } catch (parseError) {
      return {
        status: OperationStatus.UNKNOWN_ERROR,
        message: "Failed to parse server response",
        error: "Server returned invalid JSON response",
        networkError: true,
        httpStatus: response.status,
        environment: "production",
      };
    }

    // Add HTTP status to response for debugging
    const resultWithStatus: PersistMenuResult = {
      ...apiResponse,
      httpStatus: response.status,
      networkError: false,
    };

    return resultWithStatus;
  } catch (networkError: any) {
    // Network-level errors (no internet, server unreachable, etc.)
    console.error("Network error during menu persist:", networkError);

    return {
      status: OperationStatus.UNKNOWN_ERROR,
      message: "Network connection failed",
      error: networkError.message || "Failed to connect to server",
      networkError: true,
      environment: "production", // Assume production for network errors
    };
  }
}

/**
 * Utility function to check if the operation was successful
 */
export function isPersistSuccess(result: PersistMenuResult): boolean {
  return isSuccessResponse(result) && !result.networkError;
}

/**
 * Utility function to check if the error is GitHub-related
 */
export function isGitHubError(result: PersistMenuResult): boolean {
  return (
    isErrorResponse(result) &&
    result.status === OperationStatus.GITHUB_API_ERROR
  );
}

/**
 * Utility function to check if the error is filesystem-related
 */
export function isFilesystemError(result: PersistMenuResult): boolean {
  return (
    isErrorResponse(result) &&
    result.status === OperationStatus.FILESYSTEM_ERROR
  );
}

/**
 * Utility function to check if the error is validation-related
 */
export function isValidationError(result: PersistMenuResult): boolean {
  return (
    isErrorResponse(result) &&
    result.status === OperationStatus.VALIDATION_ERROR
  );
}

/**
 * Utility function to check if the error is network-related
 */
export function isNetworkError(result: PersistMenuResult): boolean {
  return result.networkError === true;
}

/**
 * Get appropriate retry strategy based on error type
 */
export function shouldRetry(result: PersistMenuResult): boolean {
  if (isPersistSuccess(result)) {
    return false; // No need to retry success
  }

  if (isNetworkError(result)) {
    return true; // Network errors can be retried
  }

  if (isErrorResponse(result)) {
    // Don't retry validation errors or token errors
    if (result.status === OperationStatus.VALIDATION_ERROR) {
      return false;
    }

    if (result.errorCode === ErrorCode.GITHUB_TOKEN_INVALID) {
      return false;
    }

    // Can retry GitHub API availability issues and filesystem errors
    return (
      result.status === OperationStatus.GITHUB_API_ERROR ||
      result.status === OperationStatus.FILESYSTEM_ERROR
    );
  }

  return false;
}

/**
 * Get user-friendly error message for display
 */
export function getUserFriendlyMessage(result: PersistMenuResult): string {
  if (isPersistSuccess(result)) {
    return "Data successfully updated";
  }

  if (isNetworkError(result)) {
    return "Network connection failed. Please check your internet connection and try again.";
  }

  if (isErrorResponse(result)) {
    switch (result.status) {
      case OperationStatus.GITHUB_API_ERROR:
        if (result.errorCode === ErrorCode.GITHUB_TOKEN_INVALID) {
          return "Failed to update data on GitHub, please check your API key";
        }
        return "Failed to update data on GitHub. Please try again later.";

      case OperationStatus.FILESYSTEM_ERROR:
        return "Failed to save file in local environment";

      case OperationStatus.VALIDATION_ERROR:
        return "Provided data has invalid format";

      default:
        return "An unknown error occurred while saving";
    }
  }

  return "An unexpected error occurred";
}
