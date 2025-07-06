// @/app/integrations/lib/api/response.ts

import { NextResponse } from "next/server";
import type { ZodIssue } from "zod";

export type ValidationError = {
  field: string;
  message: string;
};

export interface ServerResponseType<T> {
  success: boolean;
  message?: string;
  error?: string | ZodIssue[] | ValidationError[];
  data?: T;
  status?: number;
}

export function apiResponse<T>({
  success,
  message,
  error,
  data,
  status = 200,
}: ServerResponseType<T>): NextResponse {
  const response: ServerResponseType<T> = { success, status };
  if (message) response.message = message;
  if (error) response.error = error;
  if (data !== undefined) response.data = data;
  return NextResponse.json(response, { status });
}
