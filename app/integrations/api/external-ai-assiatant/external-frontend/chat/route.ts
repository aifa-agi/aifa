// @/app/integrations/api/external-ai-assiatant/external-frontend/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";
import { generateCuid } from "@/lib/utils/generateCuid";

/**
 * External partner request format
 */
interface ExternalChatRequest {
  chat_id: string;
  text: string;
}

/**
 * Internal chat API format
 */
interface InternalChatRequest {
  id: string;
  message: {
    id: string;
    createdAt: string;
    role: "user";
    content: string;
    parts: Array<{
      type: "text";
      text: string;
    }>;
  };
  selectedChatModel: string;
  selectedVisibilityType: string;
}

/**
 * Add CORS headers to response
 */
function addCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

/**
 * Handle OPTIONS preflight request
 */
export async function OPTIONS(req: NextRequest) {
  console.log("OPTIONS preflight request received");
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}

/**
 * Handle POST request
 */
export async function POST(req: NextRequest) {
  console.log("POST request received to external chat API");

  // Authorization validation
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Missing or invalid Authorization header");
    const response = NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
    return addCorsHeaders(response);
  }
  const token = authHeader.replace("Bearer ", "").trim();

  // Token validation
  try {
    verify(token, process.env.NEXTAUTH_SECRET!);
    console.log("Token validated successfully");
  } catch (e) {
    console.log("Invalid or expired token:", e);
    const response = NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
    return addCorsHeaders(response);
  }

  // Parse external request body
  let externalBody: ExternalChatRequest;
  try {
    externalBody = await req.json();
    console.log("External request body:", externalBody);
  } catch (e) {
    console.log("Invalid JSON format:", e);
    const response = NextResponse.json(
      { error: "Invalid JSON format" },
      { status: 400 }
    );
    return addCorsHeaders(response);
  }

  // Validate required fields
  if (!externalBody.chat_id || !externalBody.text) {
    console.log("Missing required fields");
    const response = NextResponse.json(
      { error: "Missing required fields: chat_id and text" },
      { status: 400 }
    );
    return addCorsHeaders(response);
  }

  // Transform external format to internal format
  const internalBody: InternalChatRequest = {
    id: externalBody.chat_id,
    message: {
      id: generateCuid(),
      createdAt: new Date().toISOString(),
      role: "user",
      content: externalBody.text,
      parts: [
        {
          type: "text",
          text: externalBody.text,
        },
      ],
    },
    selectedChatModel: "api-chat-support",
    selectedVisibilityType: "private",
  };

  console.log("Transformed internal body:", internalBody);

  // Proxy request to internal chat API
  try {
    const chatApiRes = await fetch(`${getNextAuthUrl()}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(internalBody),
    });

    const data = await chatApiRes.json();
    console.log("Internal chat API response:", data);

    const response = NextResponse.json(data, { status: chatApiRes.status });
    return addCorsHeaders(response);
  } catch (error) {
    console.error("Error calling internal chat API:", error);
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
