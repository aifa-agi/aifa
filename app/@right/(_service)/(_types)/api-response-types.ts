// @/app/(_service)/types/api-response-types.ts

/**
 * Enum for save operation statuses
 */
export enum OperationStatus {
  SUCCESS = "success",
  GITHUB_API_ERROR = "github_api_error", 
  FILESYSTEM_ERROR = "filesystem_error",
  VALIDATION_ERROR = "validation_error",
  UNKNOWN_ERROR = "unknown_error"
}

/**
 * Enum for error codes
 */
export enum ErrorCode {
  GITHUB_TOKEN_INVALID = "GITHUB_TOKEN_INVALID",
  GITHUB_API_UNAVAILABLE = "GITHUB_API_UNAVAILABLE", 
  FILE_WRITE_FAILED = "FILE_WRITE_FAILED",
  INVALID_DATA_FORMAT = "INVALID_DATA_FORMAT",
  NETWORK_ERROR = "NETWORK_ERROR"
}

/**
 * Base interface for API responses
 */
export interface BaseApiResponse {
  status: OperationStatus;
  message: string;
  environment?: 'development' | 'production';
}

/**
 * Interface for successful response
 */
export interface SuccessApiResponse extends BaseApiResponse {
  status: OperationStatus.SUCCESS;
}

/**
 * Interface for error response
 */
export interface ErrorApiResponse extends BaseApiResponse {
  status: Exclude<OperationStatus, OperationStatus.SUCCESS>;
  error: string;
  errorCode?: ErrorCode;
  details?: string;
}

/**
 * Union type for all possible API responses
 */
export type ApiResponse = SuccessApiResponse | ErrorApiResponse;

/**
 * Type alias for menu persist operation response (same as ApiResponse)
 */
export type MenuPersistResponse = ApiResponse;

/**
 * Type guard to check for successful response
 */
export function isSuccessResponse(response: ApiResponse): response is SuccessApiResponse {
  return response.status === OperationStatus.SUCCESS;
}

/**
 * Type guard to check for error response
 */
export function isErrorResponse(response: ApiResponse): response is ErrorApiResponse {
  return response.status !== OperationStatus.SUCCESS;
}

/**
 * Predefined user messages
 */
export const USER_MESSAGES = {
  SUCCESS: "Data successfully updated",
  GITHUB_ERROR: "Failed to update data on GitHub, please check your API key",
  FILESYSTEM_ERROR: "Failed to save file in local environment",
  VALIDATION_ERROR: "Provided data has invalid format",
  UNKNOWN_ERROR: "An unknown error occurred while saving"
} as const;

/**
 * Function to get user message by status
 */
export function getUserMessage(status: OperationStatus): string {
  switch (status) {
    case OperationStatus.SUCCESS:
      return USER_MESSAGES.SUCCESS;
    case OperationStatus.GITHUB_API_ERROR:
      return USER_MESSAGES.GITHUB_ERROR;
    case OperationStatus.FILESYSTEM_ERROR:
      return USER_MESSAGES.FILESYSTEM_ERROR;
    case OperationStatus.VALIDATION_ERROR:
      return USER_MESSAGES.VALIDATION_ERROR;
    default:
      return USER_MESSAGES.UNKNOWN_ERROR;
  }
}
