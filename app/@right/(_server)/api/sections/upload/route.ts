// @/app/api/admin/sections/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";
import { generateMetadataFromSection } from "@/app/@right/(_service)/(_components)/content-renderer/utils";

interface UploadRequestBody {
  href: string;
  sections: ExtendedSection[];
}

interface PageUploadResponse {
  success: boolean;
  message: string;
  filePath?: string;
  environment: "development" | "production";
  error?: string;
  errorCode?: string;
  details?: string;
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

// Функция для генерации содержимого page.tsx файла
function generatePageTsxContent(
  firstPartHref: string,
  secondPartHref: string,
  sections: ExtendedSection[]
): string {
  // Генерируем метаданные из первой секции
  const firstSection = sections[0];
  const metadata = firstSection ? generateMetadataFromSection(firstSection) : {
    title: "Страница без заголовка",
    description: "Описание отсутствует",
    images: [],
    keywords: []
  };

  // Создаем JSON строку для секций с правильным форматированием
  const sectionsJson = JSON.stringify(sections, null, 2);

  const pageContent = `// Auto-generated page - do not edit manually
// Generated on: ${new Date().toISOString()}
// Source href: /${firstPartHref}/${secondPartHref}

import { Metadata } from "next";
import ContentRenderer from "@/app/@right/(_service)/(_components)/content-renderer";

// Встроенные данные секций
const sections = ${sectionsJson};

// Генерация метаданных для SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "${metadata.title.replace(/"/g, '\\"')}",
    description: "${metadata.description.replace(/"/g, '\\"')}",
    keywords: ${JSON.stringify(metadata.keywords)},
    
    // Open Graph метатеги
    openGraph: {
      title: "${metadata.title.replace(/"/g, '\\"')}",
      description: "${metadata.description.replace(/"/g, '\\"')}",
      type: "article",
      url: "/${firstPartHref}/${secondPartHref}",
      ${metadata.images.length > 0 ? `images: [
        {
          url: "${metadata.images[0].href}",
          alt: "${metadata.images[0].alt?.replace(/"/g, '\\"') || ''}",
        }
      ],` : ''}
    },
    
    // Twitter метатеги
    twitter: {
      card: "summary_large_image",
      title: "${metadata.title.replace(/"/g, '\\"')}",
      description: "${metadata.description.replace(/"/g, '\\"')}",
      ${metadata.images.length > 0 ? `images: ["${metadata.images[0].href}"],` : ''}
    },
    
    // Дополнительные метатеги
    alternates: {
      canonical: "/${firstPartHref}/${secondPartHref}",
    },
  };
}

// Основной компонент страницы
export default function Page() {
  return (
    <ContentRenderer sections={sections} />
  );
}
`;

  return pageContent;
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

// Функция для сохранения в GitHub (production)
async function saveToGitHub(
  firstPartHref: string,
  secondPartHref: string,
  sections: ExtendedSection[]
): Promise<PageUploadResponse> {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_PAGES_BASE_PATH = process.env.GITHUB_PAGES_BASE_PATH || "app/@right/(_PAGES)";

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

    const fileContents = generatePageTsxContent(firstPartHref, secondPartHref, sections);
    const encodedContent = Buffer.from(fileContents).toString("base64");
    const filePath = `${GITHUB_PAGES_BASE_PATH}/${firstPartHref}/${secondPartHref}/page.tsx`;

    // Проверяем существование файла
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

    // Создаем или обновляем файл
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
          message: `${sha ? 'Update' : 'Create'} page: ${firstPartHref}/${secondPartHref} - ${new Date().toISOString()}`,
          content: encodedContent,
          ...(sha && { sha }),
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      return {
        success: false,
        message: "Failed to update page on GitHub",
        error: `GitHub API returned ${updateResponse.status}: ${errorData.message || "Unknown error"}`,
        errorCode: updateResponse.status === 401
          ? ErrorCode.GITHUB_TOKEN_INVALID
          : ErrorCode.GITHUB_API_UNAVAILABLE,
        environment: "production",
        details: JSON.stringify(errorData),
      };
    }

    return {
      success: true,
      message: "Successfully created/updated page on GitHub",
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

// Функция для сохранения в файловую систему (development)
async function saveToFileSystem(
  firstPartHref: string,
  secondPartHref: string,
  sections: ExtendedSection[]
): Promise<PageUploadResponse> {
  try {
    const pagesDir = join(process.cwd(), "app", "@right", "(_PAGES)");
    const categoryDir = join(pagesDir, firstPartHref);
    const pageDir = join(categoryDir, secondPartHref);
    const filePath = join(pageDir, "page.tsx");
    const relativeFilePath = `app/@right/(_PAGES)/${firstPartHref}/${secondPartHref}/page.tsx`;

    // Создаем все необходимые директории
    await ensureDirectoryExists(pagesDir);
    await ensureDirectoryExists(categoryDir);
    await ensureDirectoryExists(pageDir);

    const fileContent = generatePageTsxContent(firstPartHref, secondPartHref, sections);
    await writeFile(filePath, fileContent, "utf-8");

    return {
      success: true,
      message: "Successfully created page in filesystem",
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

    // Создаем страницу в зависимости от окружения
    const result: PageUploadResponse = isProduction()
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
