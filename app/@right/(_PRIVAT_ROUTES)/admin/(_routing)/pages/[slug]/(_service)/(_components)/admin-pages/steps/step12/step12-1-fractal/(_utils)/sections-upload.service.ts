// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_utils)/sections-upload.service.ts

import type { ExtendedSectionPayload } from '../(_adapters)/sections-mapper';


/**
* Response format from /api/sections/upload
*/
export interface SectionUploadResponse {
 success: boolean;
 message: string;
 filePath?: string;
 environment: "development" | "production";
 error?: string;
 errorCode?: string;
 details?: string;
}


/**
* Error types for better error handling
*/
export enum UploadErrorType {
 VALIDATION_ERROR = 'validation_error',
 NETWORK_ERROR = 'network_error',
 SERVER_ERROR = 'server_error',
 FILESYSTEM_ERROR = 'filesystem_error',
 GITHUB_ERROR = 'github_error',
 UNKNOWN_ERROR = 'unknown_error',
}


/**
* Structured error for upload operations
*/
export class SectionUploadError extends Error {
 public readonly type: UploadErrorType;
 public readonly statusCode?: number;
 public readonly details?: string;


 constructor(
   message: string,
   type: UploadErrorType = UploadErrorType.UNKNOWN_ERROR,
   statusCode?: number,
   details?: string
 ) {
   super(message);
   this.name = 'SectionUploadError';
   this.type = type;
   this.statusCode = statusCode;
   this.details = details;
 }
}


/**
* Uploads sections to the server using /api/sections/upload endpoint.
* Returns structured response or throws SectionUploadError.
*/
export async function uploadSections(
 payload: ExtendedSectionPayload
): Promise<SectionUploadResponse> {
 try {
   // Validate payload before sending
   validatePayload(payload);


   const response = await fetch('/api/sections/upload', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(payload),
   });


   // Handle non-JSON responses (HTML error pages)
   const responseText = await response.text();
   if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
     throw new SectionUploadError(
       'Server returned HTML instead of JSON. Check server configuration.',
       UploadErrorType.SERVER_ERROR,
       response.status
     );
   }


   let result: SectionUploadResponse;
   try {
     result = JSON.parse(responseText);
   } catch (parseError) {
     throw new SectionUploadError(
       `Invalid JSON response: ${responseText.substring(0, 100)}...`,
       UploadErrorType.SERVER_ERROR,
       response.status
     );
   }


   // Handle HTTP errors
   if (!response.ok) {
     const errorType = getErrorTypeFromStatus(response.status);
     throw new SectionUploadError(
       result.message || `HTTP ${response.status}: ${response.statusText}`,
       errorType,
       response.status,
       result.details
     );
   }


   // Handle application-level failures
   if (!result.success) {
     const errorType = getErrorTypeFromCode(result.errorCode);
     throw new SectionUploadError(
       result.message || 'Upload failed',
       errorType,
       response.status,
       result.details
     );
   }


   return result;


 } catch (error) {
   if (error instanceof SectionUploadError) {
     throw error;
   }


   // Network or other unexpected errors
   if (error instanceof TypeError && error.message.includes('fetch')) {
     throw new SectionUploadError(
       'Network error: Unable to connect to server',
       UploadErrorType.NETWORK_ERROR
     );
   }


   throw new SectionUploadError(
     error instanceof Error ? error.message : 'Unknown upload error',
     UploadErrorType.UNKNOWN_ERROR
   );
 }
}


/**
* Validates the upload payload before sending to server
*/
function validatePayload(payload: ExtendedSectionPayload): void {
 if (!payload || typeof payload !== 'object') {
   throw new SectionUploadError(
     'Payload must be an object',
     UploadErrorType.VALIDATION_ERROR
   );
 }


 if (!payload.href || typeof payload.href !== 'string') {
   throw new SectionUploadError(
     'href is required and must be a string',
     UploadErrorType.VALIDATION_ERROR
   );
 }


 if (!payload.sections || !Array.isArray(payload.sections)) {
   throw new SectionUploadError(
     'sections must be an array',
     UploadErrorType.VALIDATION_ERROR
   );
 }


 if (payload.sections.length === 0) {
   throw new SectionUploadError(
     'At least one section is required',
     UploadErrorType.VALIDATION_ERROR
   );
 }


 // Validate each section - check for required properties based on API expectation
 for (let i = 0; i < payload.sections.length; i++) {
   const section = payload.sections[i] as any; // Use any to access potentially different structure
   if (!section || typeof section !== 'object') {
     throw new SectionUploadError(
       `Section at index ${i} must be an object`,
       UploadErrorType.VALIDATION_ERROR
     );
   }
   if (!section.id || typeof section.id !== 'string') {
     throw new SectionUploadError(
       `Section at index ${i} must have a string "id" property`,
       UploadErrorType.VALIDATION_ERROR
     );
   }
   // Check for bodyContent property that API expects
   if (!section.bodyContent || typeof section.bodyContent !== 'object') {
     throw new SectionUploadError(
       `Section at index ${i} must have a "bodyContent" object`,
       UploadErrorType.VALIDATION_ERROR
     );
   }
 }
}


/**
* Maps HTTP status codes to error types
*/
function getErrorTypeFromStatus(status: number): UploadErrorType {
 if (status >= 400 && status < 500) {
   return UploadErrorType.VALIDATION_ERROR;
 }
 if (status >= 500) {
   return UploadErrorType.SERVER_ERROR;
 }
 return UploadErrorType.UNKNOWN_ERROR;
}


/**
* Maps server error codes to error types
*/
function getErrorTypeFromCode(errorCode?: string): UploadErrorType {
 if (!errorCode) return UploadErrorType.UNKNOWN_ERROR;


 switch (errorCode) {
   case 'validation_error':
   case 'invalid_data_format':
     return UploadErrorType.VALIDATION_ERROR;
   case 'github_token_invalid':
   case 'github_api_unavailable':
     return UploadErrorType.GITHUB_ERROR;
   case 'file_write_failed':
   case 'directory_creation_failed':
     return UploadErrorType.FILESYSTEM_ERROR;
   case 'network_error':
     return UploadErrorType.NETWORK_ERROR;
   default:
     return UploadErrorType.UNKNOWN_ERROR;
 }
}


