// @/app/@right/(_server)/api/menu/persist\route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  ErrorCode,
  MenuPersistResponse,
  OperationStatus,
} from "@/app/@right/(_service)/(_types)/api-response-types";

const DEFAULT_RELATIVE_PATH = "config/content/content-data.ts";

function getFilePaths() {
  const customPath = process.env.GITHUB_FILE_PATH;
  const relativePath = customPath || DEFAULT_RELATIVE_PATH;
  const localPath = path.resolve(process.cwd(), relativePath);

  return {
    localPath,
    relativePath,
    isCustomPath: !!customPath,
  };
}

const { localPath: DATA_PATH, relativePath: GITHUB_RELATIVE_PATH } =
  getFilePaths();

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function validateGitHubConfig(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = [
    { key: "GITHUB_TOKEN", value: process.env.GITHUB_TOKEN },
    { key: "GITHUB_REPO", value: process.env.GITHUB_REPO },
  ];

  const missingVars = requiredVars
    .filter(({ value }) => !value)
    .map(({ key }) => key);

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

async function getCurrentFileFromGitHub(): Promise<{
  content: string;
  sha: string;
} | null> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_RELATIVE_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-App",
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.type !== "file") {
      throw new Error("GitHub path is not a file");
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8");

    return {
      content,
      sha: data.sha,
    };
  } catch (error) {
    throw error;
  }
}

function generateFileContent(categories: any[]): string {
  const timestamp = new Date().toISOString();
  return `import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

export const contentData = {
  categories: ${JSON.stringify(categories, null, 2)}
} as { categories: MenuCategory[] };

export type contentData = typeof contentData;

export const lastUpdated = "${timestamp}";
export const generatedBy = "menu-persist-api";
`;
}

async function saveToGitHub(categories: any[]): Promise<MenuPersistResponse> {
  try {
    const { isValid, missingVars } = validateGitHubConfig();
    if (!isValid) {
      return {
        status: OperationStatus.GITHUB_API_ERROR,
        message: `Missing GitHub configuration: ${missingVars.join(", ")}`,
        error: `Missing environment variables: ${missingVars.join(", ")}`,
        errorCode: ErrorCode.GITHUB_TOKEN_INVALID,
        environment: "production",
      };
    }

    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;
    const fileContent = generateFileContent(categories);

    let currentFile: { content: string; sha: string } | null = null;

    try {
      currentFile = await getCurrentFileFromGitHub();
    } catch (error) {
      // File doesn't exist, will create new
    }

    if (currentFile && currentFile.content === fileContent) {
      return {
        status: OperationStatus.SUCCESS,
        message: "GitHub file is already up to date",
        environment: "production",
      };
    }

    const apiPayload = {
      message: `Update menu configuration - ${new Date().toISOString()}`,
      content: Buffer.from(fileContent, "utf-8").toString("base64"),
      branch: process.env.GITHUB_BRANCH || "main",
      ...(currentFile && { sha: currentFile.sha }),
    };

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_RELATIVE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "NextJS-App",
        },
        body: JSON.stringify(apiPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: OperationStatus.GITHUB_API_ERROR,
        message: "Failed to update file on GitHub",
        error: `GitHub API returned ${response.status}: ${errorData.message || "Unknown error"}`,
        errorCode:
          response.status === 401
            ? ErrorCode.GITHUB_TOKEN_INVALID
            : ErrorCode.GITHUB_API_UNAVAILABLE,
        environment: "production",
      };
    }

    return {
      status: OperationStatus.SUCCESS,
      message: "Successfully updated data on GitHub",
      environment: "production",
    };
  } catch (error: any) {
    return {
      status: OperationStatus.GITHUB_API_ERROR,
      message: "Network error while connecting to GitHub",
      error: error.message || "Unknown network error",
      errorCode: ErrorCode.NETWORK_ERROR,
      environment: "production",
    };
  }
}

function saveToFileSystem(categories: any[]): MenuPersistResponse {
  try {
    const fileContent = generateFileContent(categories);

    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let hasChanged = true;
    if (fs.existsSync(DATA_PATH)) {
      const currentContent = fs.readFileSync(DATA_PATH, "utf-8");
      hasChanged = currentContent !== fileContent;
    }

    if (!hasChanged) {
      return {
        status: OperationStatus.SUCCESS,
        message: "Local file is already up to date",
        environment: "development",
      };
    }

    fs.writeFileSync(DATA_PATH, fileContent, "utf-8");

    return {
      status: OperationStatus.SUCCESS,
      message: "Successfully saved to filesystem",
      environment: "development",
    };
  } catch (error: any) {
    return {
      status: OperationStatus.FILESYSTEM_ERROR,
      message: "Failed to save file to local filesystem",
      error: error.message || "Unknown filesystem error",
      errorCode: ErrorCode.FILE_WRITE_FAILED,
      environment: "development",
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { categories } = body;

    if (!Array.isArray(categories)) {
      const validationResponse: MenuPersistResponse = {
        status: OperationStatus.VALIDATION_ERROR,
        message: "Invalid data format",
        error: "Categories must be an array",
        errorCode: ErrorCode.INVALID_DATA_FORMAT,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(validationResponse, { status: 400 });
    }

    const localResult = saveToFileSystem(categories);

    if (isProduction()) {
      const githubResult = await saveToGitHub(categories);

      if (
        localResult.status === OperationStatus.SUCCESS &&
        githubResult.status !== OperationStatus.SUCCESS
      ) {
        return NextResponse.json({
          status: OperationStatus.SUCCESS,
          message: "Saved locally but GitHub sync failed",
          error: githubResult.error,
          environment: "production",
        });
      }

      const httpStatus =
        githubResult.status === OperationStatus.SUCCESS ? 200 : 500;
      return NextResponse.json(githubResult, { status: httpStatus });
    }

    const httpStatus =
      localResult.status === OperationStatus.SUCCESS ? 200 : 500;
    return NextResponse.json(localResult, { status: httpStatus });
  } catch (error: any) {
    const errorResponse: MenuPersistResponse = {
      status: OperationStatus.UNKNOWN_ERROR,
      message: "An unexpected error occurred",
      error: error.message || "Unknown error",
      environment: isProduction() ? "production" : "development",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      status: "ok",
      message: "Menu persist API endpoint",
      environment: isProduction() ? "production" : "development",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
