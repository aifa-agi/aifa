// Main API route handler for page upload operations
// Production-critical module - consolidated from decomposed services

import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import { join } from "path";
import type { PageUploadPayload, ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";

// Import decomposed services
import { saveToGitHub, type PageUploadResponse, ErrorCode } from "@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_utils)/github-service";
import { saveToFileSystem } from "@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_utils)/filesystem-service";


/**
 * Checks if current environment is production
 * @returns boolean - true if NODE_ENV is production
 */
function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * Parses href string into component parts for file path generation
 * @param href - URL path in format "/category/subcategory"
 * @returns Object with firstPartHref and secondPartHref
 */
function parseHref(href: string): {
  firstPartHref: string;
  secondPartHref: string;
} {
  const cleanHref = href.startsWith("/") ? href.slice(1) : href;
  const parts = cleanHref.split("/").filter((part) => part.length > 0);

  if (parts.length < 2) {
    throw new Error(
      `Invalid href format. Expected format: "/firstPart/secondPart", got: "${href}"`
    );
  }

  const firstPartHref = parts[0];
  const secondPartHref = parts[1];

  return { firstPartHref, secondPartHref };
}

/**
 * Validates request body structure and required fields
 * @param body - Request body to validate
 * @returns boolean - true if valid, throws error if invalid
 */
function validateRequestBody(body: any): body is PageUploadPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be an object");
  }

  const { href, pageMetadata, sections } = body;

  if (!href || typeof href !== "string" || href.trim() === "") {
    throw new Error("href is required and must be a non-empty string");
  }

  if (!pageMetadata || typeof pageMetadata !== "object") {
    throw new Error("pageMetadata is required and must be an object");
  }

  if (!sections || !Array.isArray(sections)) {
    throw new Error("sections must be an array");
  }

  const hrefRegex = /^\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
  if (!hrefRegex.test(href)) {
    throw new Error(
      'href must match format "/category/subcategory" with only letters, numbers, hyphens, and underscores'
    );
  }

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section || typeof section !== "object") {
      throw new Error(`Section at index ${i} must be an object`);
    }
    if (!section.id || typeof section.id !== "string") {
      throw new Error(`Section at index ${i} must have a string "id" property`);
    }
  }

  return true;
}

/**
 * Validates that name contains only safe characters for file paths
 * @param name - Name to validate
 * @param fieldName - Field name for error messages
 */
function validateSafeName(name: string, fieldName: string): void {
  const safeNameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!safeNameRegex.test(name)) {
    throw new Error(
      `${fieldName} contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed`
    );
  }
}

/**
 * POST handler for creating/updating pages
 * Routes to appropriate service based on environment
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<PageUploadResponse>> {
  try {
    let body;
    let rawBody: string;

    try {
      rawBody = await request.text();
      body = JSON.parse(rawBody);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON in request body",
          error: error instanceof Error ? error.message : "Unknown parsing error",
          errorCode: ErrorCode.INVALID_DATA_FORMAT,
          environment: isProduction() ? "production" : "development",
        },
        { status: 400 }
      );
    }

    try {
      validateRequestBody(body);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Validation failed",
          errorCode: ErrorCode.VALIDATION_ERROR,
          environment: isProduction() ? "production" : "development",
        },
        { status: 400 }
      );
    }

    const payload = body as PageUploadPayload;
    const { href } = payload;

    let firstPartHref: string;
    let secondPartHref: string;

    try {
      const parsed = parseHref(href);
      firstPartHref = parsed.firstPartHref;
      secondPartHref = parsed.secondPartHref;
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Invalid href format",
          errorCode: ErrorCode.INVALID_DATA_FORMAT,
          environment: isProduction() ? "production" : "development",
        },
        { status: 400 }
      );
    }

    try {
      validateSafeName(firstPartHref, "First part of href");
      validateSafeName(secondPartHref, "Second part of href");
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Invalid name format",
          errorCode: ErrorCode.INVALID_DATA_FORMAT,
          environment: isProduction() ? "production" : "development",
        },
        { status: 400 }
      );
    }

    // Route to appropriate service based on environment
    const result: PageUploadResponse = isProduction()
      ? await saveToGitHub(firstPartHref, secondPartHref, payload)
      : await saveToFileSystem(firstPartHref, secondPartHref, payload);

    const httpStatus = result.success ? 200 : 500;

    return NextResponse.json(result, {
      status: httpStatus,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    const errorResponse: PageUploadResponse = {
      success: false,
      message: "An unexpected error occurred",
      error: error.message || "Unknown error",
      errorCode: ErrorCode.UNKNOWN_ERROR,
      environment: isProduction() ? "production" : "development",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * GET handler for checking page existence
 * Routes to appropriate check based on environment
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const href = searchParams.get("href");

    if (!href) {
      return NextResponse.json(
        {
          success: false,
          message: "href parameter is required",
          environment: isProduction() ? "production" : "development",
        },
        { status: 400 }
      );
    }

    const { firstPartHref, secondPartHref } = parseHref(href);

    if (isProduction()) {
      return NextResponse.json({
        success: true,
        message: "GitHub environment - file existence check not implemented",
        environment: "production",
      });
    } else {
      const pageDir = join(
        process.cwd(),
        "app",
        "@right",
        "(_PAGES)",
        firstPartHref,
        secondPartHref
      );

      return NextResponse.json({
        success: true,
        message: existsSync(pageDir) ? "Page exists" : "Page does not exist",
        pageDir: pageDir,
        environment: "development",
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
        environment: isProduction() ? "production" : "development",
      },
      { status: 500 }
    );
  }
}
