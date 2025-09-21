// @/app/@right/(_server)/api/sections/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

interface ReadSectionsRequest {
  filePath: string;
}

interface ReadSectionsResponse {
  success: boolean;
  message: string;
  sections?: any[];
  source?: string;
  environment?: string;
}

// GitHub API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_SECTIONS_BASE_PATH = process.env.GITHUB_SECTIONS_BASE_PATH || "config/content/sections";

/**
 * Автоматическое определение среды выполнения без дополнительных переменных
 * Основано на наличии GitHub конфигурации и характеристиках окружения
 */
function detectEnvironment(): { isDevelopment: boolean; useLocal: boolean; reason: string } {
  // 1. Проверка NODE_ENV (базовая проверка)
  const nodeEnv = process.env.NODE_ENV;
  
  // 2. Проверка наличия GitHub конфигурации
  const hasGitHubConfig = !!(GITHUB_TOKEN && GITHUB_REPO);
  
  // 3. Проверка наличия локальных файлов (синхронная проверка существования директории)
  const localPath = path.join(process.cwd(), "config/content/sections");
  let hasLocalFiles = false;
  
  try {
    // Синхронная проверка существования директории
    const fs_sync = require('fs');
    const stats = fs_sync.statSync(localPath);
    hasLocalFiles = stats.isDirectory();
  } catch (error) {
    hasLocalFiles = false;
  }

  // 4. Проверка характеристик среды выполнения
  const isVercel = !!process.env.VERCEL;
  const isNetlify = !!process.env.NETLIFY;
  const isLocal = !isVercel && !isNetlify && (
    process.env.PWD?.includes('/Users/') ||  // macOS
    process.env.PWD?.includes('/home/') ||   // Linux
    process.env.USERPROFILE?.includes('\\Users\\') || // Windows
    process.env.COMPUTERNAME || // Windows
    !!process.env.USERNAME      // Local development indicators
  );

  // Логика определения:
  if (nodeEnv === 'development') {
    if (hasLocalFiles) {
      return { 
        isDevelopment: true, 
        useLocal: true, 
        reason: "Development mode with local files available" 
      };
    } else if (hasGitHubConfig) {
      return { 
        isDevelopment: true, 
        useLocal: false, 
        reason: "Development mode but no local files, using GitHub" 
      };
    }
  }

  if (nodeEnv === 'production') {
    if (hasGitHubConfig) {
      return { 
        isDevelopment: false, 
        useLocal: false, 
        reason: "Production mode with GitHub config" 
      };
    } else if (hasLocalFiles && isLocal) {
      return { 
        isDevelopment: false, 
        useLocal: true, 
        reason: "Production mode locally with local files" 
      };
    }
  }

  // Fallback логика на основе доступных ресурсов
  if (hasLocalFiles && isLocal) {
    return { 
      isDevelopment: true, 
      useLocal: true, 
      reason: "Local environment detected with local files" 
    };
  }

  if (hasGitHubConfig && (isVercel || isNetlify)) {
    return { 
      isDevelopment: false, 
      useLocal: false, 
      reason: "Cloud deployment detected with GitHub config" 
    };
  }

  // Последняя попытка - если есть только GitHub конфиг
  if (hasGitHubConfig) {
    return { 
      isDevelopment: false, 
      useLocal: false, 
      reason: "Fallback to GitHub (only available option)" 
    };
  }

  // Если ничего нет - используем локальные файлы как fallback
  return { 
    isDevelopment: true, 
    useLocal: true, 
    reason: "No valid config found, attempting local files" 
  };
}

/**
 * Fetches file content from local file system
 */
async function fetchFileContentFromLocal(filePath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), "config/content/sections", `${filePath}.ts`);
  
  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    return content;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error("File not found in local filesystem");
    }
    throw error;
  }
}

/**
 * Fetches file content from GitHub repository using GitHub REST API
 */
async function fetchFileContentFromGitHub(filePath: string): Promise<string> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub configuration missing: GITHUB_TOKEN and GITHUB_REPO are required");
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_SECTIONS_BASE_PATH}/${filePath}.ts`;

  const response = await fetch(apiUrl, {
    headers: {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "NextJS-App"
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("File not found in GitHub repository");
    }
    if (response.status === 401) {
      throw new Error("GitHub authentication failed");
    }
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded or insufficient permissions");
    }
    
    const errorData = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();

  if (!data.content) {
    throw new Error("No content found in GitHub file response");
  }

  const buffer = Buffer.from(data.content, "base64");
  return buffer.toString("utf-8");
}

export async function POST(request: NextRequest): Promise<NextResponse<ReadSectionsResponse>> {
  try {
    const body: ReadSectionsRequest = await request.json();
    const { filePath } = body;

    if (!filePath) {
      return NextResponse.json({
        success: false,
        message: "File path is required"
      }, { status: 400 });
    }

    // Validate file path format
    const pathRegex = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
    if (!pathRegex.test(filePath)) {
      return NextResponse.json({
        success: false,
        message: "Invalid file path format"
      }, { status: 400 });
    }

    // Автоматическое определение среды
    const { isDevelopment, useLocal, reason } = detectEnvironment();
    
    console.log(`Environment Detection: ${reason} (Development: ${isDevelopment}, UseLocal: ${useLocal})`);

    try {
      let fileContent: string;
      let source: string;

      if (useLocal) {
        console.log(`📁 Reading from LOCAL filesystem: ${filePath}`);
        fileContent = await fetchFileContentFromLocal(filePath);
        source = "Local FileSystem";
      } else {
        console.log(`🔗 Reading from GITHUB repository: ${filePath}`);
        fileContent = await fetchFileContentFromGitHub(filePath);
        source = "GitHub API";
      }

      // Extract sections from the TypeScript file content
      const sectionsMatch = fileContent.match(/export const sections[^=]*=\s*(\[[\s\S]*?\]);/);

      if (!sectionsMatch) {
        return NextResponse.json({
          success: false,
          message: "Could not parse sections from file - invalid format",
          source,
          environment: `${process.env.NODE_ENV} (${reason})`
        }, { status: 500 });
      }

      const sectionsCode = sectionsMatch[1];
      const sections = eval(sectionsCode);

      return NextResponse.json({
        success: true,
        message: `Sections loaded successfully from ${source}`,
        sections,
        source,
        environment: `${process.env.NODE_ENV} (${reason})`
      });

    } catch (fetchError: any) {
      const source = useLocal ? "Local FileSystem" : "GitHub API";
      
      if (fetchError.message.includes("File not found")) {
        return NextResponse.json({
          success: true,
          message: `No sections file found in ${source}`,
          sections: [],
          source,
          environment: `${process.env.NODE_ENV} (${reason})`
        });
      }

      throw fetchError;
    }

  } catch (error) {
    console.error("Error reading sections:", error);

    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}
