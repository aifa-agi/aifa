// app/api/vercel/deploy/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Vercel } from "@vercel/sdk";

interface VercelDeploymentResponse {
  deploymentId: string;
  status: string;
  url?: string;
  createdAt: number;
  success: boolean;
}

interface DeploymentStatusResponse {
  id: string;
  status: string;
  isComplete: boolean;
}

export async function POST(): Promise<
  NextResponse<VercelDeploymentResponse | { error: string; details?: any }>
> {
  try {
    // Initialize Vercel SDK
    const vercel = new Vercel({
      bearerToken: process.env.VERCEL_TOKEN?.trim(),
    });

    const projectName = process.env.PROJECT_NAME?.trim();
    const projectId = process.env.VERCEL_PROJECT_ID?.trim();
    const githubRepo = process.env.GITHUB_REPO?.trim();

    if (
      !process.env.VERCEL_TOKEN ||
      !projectId ||
      !projectName ||
      !githubRepo
    ) {
      return NextResponse.json(
        {
          error: "Missing required environment variables",
          details: {
            hasVercelToken: !!process.env.VERCEL_TOKEN,
            hasProjectId: !!projectId,
            hasGithubRepo: !!githubRepo,
          },
        },
        { status: 500 }
      );
    }

    // Parse GitHub repo info
    const [org, repo] = githubRepo.split("/");

    if (!org || !repo) {
      return NextResponse.json(
        {
          error: 'Invalid GITHUB_REPO format. Expected "owner/repo-name"',
          details: { githubRepo },
        },
        { status: 400 }
      );
    }

    console.log("Creating deployment with Vercel SDK:", {
      projectName,
      projectId,
      org,
      repo,
      tokenPresent: !!process.env.VERCEL_TOKEN,
    });

    // Create deployment using Vercel SDK
    const deployment = await vercel.deployments.createDeployment({
      requestBody: {
        name: projectName,
        project: projectId,
        target: "production",
        gitSource: {
          type: "github",
          repo: repo,
          org: org,
          ref: "main",
        },
      
      },
    });

    console.log("Deployment created successfully:", {
      id: deployment.id,
      status: deployment.status,
      url: deployment.url,
    });

    return NextResponse.json({
      deploymentId: deployment.id,
      status: deployment.status || "BUILDING",
      url: deployment.url,
      createdAt: deployment.createdAt || Date.now(),
      success: true,
    });
  } catch (error: any) {
    console.error("Vercel SDK deployment error:", error);

    // Handle different types of SDK errors
    let errorMessage = "Failed to create deployment";
    let errorDetails = {};

    if (error.statusCode) {
      errorMessage = `Vercel API error (${error.statusCode})`;
      errorDetails = {
        statusCode: error.statusCode,
        message: error.message,
        body: error.body,
      };
    } else if (error.message) {
      errorMessage = error.message;
      errorDetails = { originalError: error.toString() };
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest
): Promise<
  NextResponse<DeploymentStatusResponse | { error: string; details?: any }>
> {
  try {
    const { searchParams } = new URL(request.url);
    const deploymentId = searchParams.get("deploymentId");

    if (!deploymentId) {
      return NextResponse.json(
        { error: "deploymentId parameter is required" },
        { status: 400 }
      );
    }

    if (!process.env.VERCEL_TOKEN) {
      return NextResponse.json(
        { error: "VERCEL_TOKEN environment variable is missing" },
        { status: 500 }
      );
    }

    // Initialize Vercel SDK
    const vercel = new Vercel({
      bearerToken: process.env.VERCEL_TOKEN.trim(),
    });

    console.log("Checking deployment status:", { deploymentId });

    // Get deployment status using Vercel SDK
    const deployment = await vercel.deployments.getDeployment({
      idOrUrl: deploymentId,
      withGitRepoInfo: "true",
    });

    const isComplete = ["READY", "ERROR", "CANCELED"].includes(
      deployment.readyState || ""
    );

    console.log("Deployment status retrieved:", {
      id: deployment.id,
      status: deployment.readyState,
      isComplete,
    });

    return NextResponse.json({
      id: deployment.id || deploymentId,
      status: deployment.readyState || "UNKNOWN",
      isComplete,
    });
  } catch (error: any) {
    console.error("Vercel SDK status check error:", error);

    let errorMessage = "Failed to check deployment status";
    let errorDetails = {};

    if (error.statusCode) {
      errorMessage = `Vercel API error (${error.statusCode})`;
      errorDetails = {
        statusCode: error.statusCode,
        message: error.message,
        body: error.body,
      };
    } else if (error.message) {
      errorMessage = error.message;
      errorDetails = { originalError: error.toString() };
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
