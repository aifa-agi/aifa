// @/app/integrations/lib/api/response.ts

import { NextResponse } from "next/server";
import type { ZodIssue } from "zod";

export type ValidationError = {
  field: string;
  message: string;
};

// Расширенный интерфейс для поддержки дополнительных полей
export interface ServerResponseType<T = unknown> {
  success: boolean;
  message?: string;
  error?: string | ZodIssue[] | ValidationError[];
  data?: T;
  status?: number;
  // Дополнительные поля для store endpoint'а и других API
  details?: {
    duplicate_ids?: string[];
    conflicting_indices?: number[];
    max_products?: number;
    max_size_mb?: number;
    received_products?: number;
    [key: string]: any; // Для произвольных данных в details
  };
  operation_id?: string;
  // Индекс для поддержки любых дополнительных полей
  [key: string]: any;
}

// Основная функция для создания API ответов
export function apiResponse<T = unknown>({
  success,
  message,
  error,
  data,
  status = 200,
  details,
  operation_id,
  ...additionalFields // Поддержка произвольных дополнительных полей
}: ServerResponseType<T>): NextResponse {
  const response: Record<string, any> = {
    success,
    status,
  };

  // Добавляем поля только если они определены
  if (message !== undefined) response.message = message;
  if (error !== undefined) response.error = error;
  if (data !== undefined) response.data = data;
  if (details !== undefined) response.details = details;
  if (operation_id !== undefined) response.operation_id = operation_id;

  // Добавляем любые дополнительные поля
  Object.entries(additionalFields).forEach(([key, value]) => {
    if (value !== undefined && key !== "status") {
      response[key] = value;
    }
  });

  return NextResponse.json(response, { status });
}

// Специализированные функции для различных типов ответов

// Успешный ответ с данными
export function successResponse<T>(
  data: T,
  message?: string,
  additionalFields?: Record<string, any>
): NextResponse {
  return apiResponse({
    success: true,
    data,
    message: message || "Operation completed successfully",
    status: 200,
    ...additionalFields,
  });
}

// Ответ с ошибкой валидации
export function validationErrorResponse(
  error: ZodIssue[] | ValidationError[],
  message: string = "Validation error"
): NextResponse {
  return apiResponse({
    success: false,
    error,
    message,
    status: 400,
  });
}

// Ответ с ошибкой аутентификации
export function unauthorizedResponse(
  message: string = "Unauthorized",
  error?: string
): NextResponse {
  return apiResponse({
    success: false,
    message,
    error: error || "Authentication failed",
    status: 401,
  });
}

// Ответ с ошибкой конфликта данных
export function conflictResponse(
  message: string,
  error: string,
  details?: Record<string, any>
): NextResponse {
  return apiResponse({
    success: false,
    message,
    error,
    details,
    status: 409,
  });
}

// Ответ с внутренней ошибкой сервера
export function internalErrorResponse(
  error: string,
  operation_id?: string,
  message: string = "Internal Server Error"
): NextResponse {
  return apiResponse({
    success: false,
    message,
    error,
    operation_id,
    status: 500,
  });
}

// Ответ при превышении размера payload
export function payloadTooLargeResponse(details?: {
  max_products?: number;
  received_products?: number;
  max_size_mb?: number;
}): NextResponse {
  return apiResponse({
    success: false,
    message: "Payload too large",
    error: "Request exceeds maximum allowed size",
    details,
    status: 413,
  });
}

// Типы для экспорта, чтобы другие модули могли их использовать
export type ApiResponseType<T = unknown> = ServerResponseType<T>;
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
  operation_id?: string;
  [key: string]: any;
};
export type ApiErrorResponse = {
  success: false;
  message: string;
  error: string | ZodIssue[] | ValidationError[];
  details?: Record<string, any>;
  operation_id?: string;
  [key: string]: any;
};
