// @/app/api/admin/sections/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";

interface UploadRequestBody {
  href: string;
  sections: ExtendedSection[];
}

interface SectionUploadResponse {
  success: boolean;
  message: string;
  filePath?: string;
  environment: "development" | "production";
  error?: string;
  errorCode?: string;
  details?: string;
}

enum OperationStatus {
  SUCCESS = "success",
  GITHUB_API_ERROR = "github_api_error",
  FILESYSTEM_ERROR = "filesystem_error",
  VALIDATION_ERROR = "validation_error",
  NETWORK_ERROR = "network_error",
  UNKNOWN_ERROR = "unknown_error",
}

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

function isProduction() {
  return process.env.NODE_ENV === "production";
}

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

function validateRequestBody(body: any): body is UploadRequestBody {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be an object");
  }

  const { href, sections } = body;

  if (!href || typeof href !== "string" || href.trim() === "") {
    throw new Error("href is required and must be a non-empty string");
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
    if (!section.bodyContent || typeof section.bodyContent !== "object") {
      throw new Error(`Section at index ${i} must have a "bodyContent" object`);
    }
  }

  return true;
}

function validateSafeName(name: string, fieldName: string): void {
  const safeNameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!safeNameRegex.test(name)) {
    throw new Error(
      `${fieldName} contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed`
    );
  }
}

function generateTypeScriptFile(
  filename: string,
  sections: ExtendedSection[]
): string {
  const importStatement = `// @ts-ignore\nimport { ExtendedSection } from "@/app/types/section-types";`;
  const exportStatement = `export const sections: ExtendedSection[] = ${JSON.stringify(sections, null, 2)};`;

  const fileContent = [
    "// Auto-generated file - do not edit manually",
    `// Generated on: ${new Date().toISOString()}`,
    `// Source href: ${filename}`,
    "",
    importStatement,
    "",
    exportStatement,
    "",
  ].join("\n");

  return fileContent;
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

async function saveToGitHub(
  firstPartHref: string,
  secondPartHref: string,
  sections: ExtendedSection[]
): Promise<SectionUploadResponse> {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_SECTIONS_BASE_PATH =
      process.env.GITHUB_SECTIONS_BASE_PATH || "config/content/sections";

    if (!GITHUB_TOKEN) {
      return {
        success: false,
        message: "GitHub token is not configured",
        error: "GitHub token is missing in environment variables",
        errorCode: ErrorCode.GITHUB_TOKEN_INVALID,
        environment: "production",
      };
    }

    if (!GITHUB_REPO) {
      return {
        success: false,
        message: "GitHub repository is not configured",
        error: "GitHub repository is missing in environment variables",
        errorCode: ErrorCode.GITHUB_API_UNAVAILABLE,
        environment: "production",
      };
    }

    const fileContents = generateTypeScriptFile(secondPartHref, sections);
    const encodedContent = Buffer.from(fileContents).toString("base64");
    const filePath = `${GITHUB_SECTIONS_BASE_PATH}/${firstPartHref}/${secondPartHref}.ts`;

    const getFileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    let sha: string | undefined;
    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      sha = fileData.sha;
    }

    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update sections file: ${firstPartHref}/${secondPartHref}.ts - ${new Date().toISOString()}`,
          content: encodedContent,
          ...(sha && { sha }),
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      return {
        success: false,
        message: "Failed to update file on GitHub",
        error: `GitHub API returned ${updateResponse.status}: ${errorData.message || "Unknown error"}`,
        errorCode:
          updateResponse.status === 401
            ? ErrorCode.GITHUB_TOKEN_INVALID
            : ErrorCode.GITHUB_API_UNAVAILABLE,
        environment: "production",
        details: JSON.stringify(errorData),
      };
    }

    return {
      success: true,
      message: "Successfully updated sections file on GitHub",
      filePath: filePath,
      environment: "production",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Network error while connecting to GitHub",
      error: error.message || "Unknown network error",
      errorCode: ErrorCode.NETWORK_ERROR,
      environment: "production",
    };
  }
}

async function saveToFileSystem(
  firstPartHref: string,
  secondPartHref: string,
  sections: ExtendedSection[]
): Promise<SectionUploadResponse> {
  try {
    const contentDir = join(process.cwd(), "config", "content", "sections");
    const firstPartDir = join(contentDir, firstPartHref);
    const filePath = join(firstPartDir, `${secondPartHref}.ts`);
    const relativeFilePath = `config/content/sections/${firstPartHref}/${secondPartHref}.ts`;

    await ensureDirectoryExists(contentDir);
    await ensureDirectoryExists(firstPartDir);

    const fileContent = generateTypeScriptFile(secondPartHref, sections);
    await writeFile(filePath, fileContent, "utf-8");

    return {
      success: true,
      message: "Successfully saved sections file to filesystem",
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
      message: "Failed to save file to local filesystem",
      error: error.message || "Unknown filesystem error",
      errorCode: ErrorCode.FILE_WRITE_FAILED,
      environment: "development",
    };
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SectionUploadResponse>> {
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
          error:
            error instanceof Error ? error.message : "Unknown parsing error",
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

    const { href, sections } = body as UploadRequestBody;

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
          message:
            error instanceof Error ? error.message : "Invalid href format",
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
          message:
            error instanceof Error ? error.message : "Invalid name format",
          errorCode: ErrorCode.INVALID_DATA_FORMAT,
          environment: isProduction() ? "production" : "development",
        },
        { status: 400 }
      );
    }

    const result: SectionUploadResponse = isProduction()
      ? await saveToGitHub(firstPartHref, secondPartHref, sections)
      : await saveToFileSystem(firstPartHref, secondPartHref, sections);

    const httpStatus = result.success ? 200 : 500;

    return NextResponse.json(result, {
      status: httpStatus,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    const errorResponse: SectionUploadResponse = {
      success: false,
      message: "An unexpected error occurred",
      error: error.message || "Unknown error",
      errorCode: ErrorCode.UNKNOWN_ERROR,
      environment: isProduction() ? "production" : "development",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

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

    const { firstPartHref } = parseHref(href);

    if (isProduction()) {
      return NextResponse.json({
        success: true,
        message: "GitHub environment - file existence check not implemented",
        environment: "production",
      });
    } else {
      const categoryDir = join(
        process.cwd(),
        "config",
        "content",
        "sections",
        firstPartHref
      );

      return NextResponse.json({
        success: true,
        message: existsSync(categoryDir)
          ? "Directory exists"
          : "Directory does not exist",
        categoryDir: categoryDir,
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
