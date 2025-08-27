// @/app/api/sections/read/route.ts

import { NextRequest, NextResponse } from "next/server";

interface ReadSectionsRequest {
  filePath: string;
}

interface ReadSectionsResponse {
  success: boolean;
  message: string;
  sections?: any[];
}

// GitHub API configuration from environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_SECTIONS_BASE_PATH = process.env.GITHUB_SECTIONS_BASE_PATH || "config/content/sections";

/**
 * Fetches file content from GitHub repository using GitHub REST API
 * @param filePath - Path to the file without extension
 * @returns Promise with file content as string
 */
async function fetchFileContentFromGitHub(filePath: string): Promise<string> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub configuration missing: GITHUB_TOKEN and GITHUB_REPO are required");
  }

  // Construct GitHub API URL for getting file contents
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_SECTIONS_BASE_PATH}/${filePath}.ts`;

  const response = await fetch(apiUrl, {
    headers: {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "NextJS-App" // GitHub API requires User-Agent header
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("File not found");
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

  // Check if the response contains file content
  if (!data.content) {
    throw new Error("No content found in GitHub file response");
  }

  // Decode base64 content
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

    try {
      // Fetch file content from GitHub
      const fileContent = await fetchFileContentFromGitHub(filePath);

      // Extract sections from the TypeScript file content
      // This regex looks for: export const sections = [...]
      const sectionsMatch = fileContent.match(/export const sections[^=]*=\s*(\[[\s\S]*?\]);/);

      if (!sectionsMatch) {
        return NextResponse.json({
          success: false,
          message: "Could not parse sections from file - invalid format"
        }, { status: 500 });
      }

      // Evaluate the sections array (Note: eval can be dangerous in production)
      // Consider using a safer parsing method like a TypeScript parser
      const sectionsCode = sectionsMatch[1];
      const sections = eval(sectionsCode);

      return NextResponse.json({
        success: true,
        message: "Sections loaded successfully from GitHub",
        sections
      });

    } catch (fetchError: any) {
      // Handle specific GitHub fetch errors
      if (fetchError.message === "File not found") {
        return NextResponse.json({
          success: true,
          message: "No sections file found in GitHub repository",
          sections: []
        });
      }

      // Re-throw other errors to be caught by outer catch block
      throw fetchError;
    }

  } catch (error) {
    console.error("Error reading sections from GitHub:", error);

    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}
