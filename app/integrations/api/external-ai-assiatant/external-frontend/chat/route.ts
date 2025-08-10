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

export async function POST(req: NextRequest) {
  // Authorization validation
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }
  const token = authHeader.replace("Bearer ", "").trim();

  // Token validation
  try {
    verify(token, process.env.NEXTAUTH_SECRET!);
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  // Parse external request body
  let externalBody: ExternalChatRequest;
  try {
    externalBody = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }

  // Validate required fields
  if (!externalBody.chat_id || !externalBody.text) {
    return NextResponse.json(
      { error: "Missing required fields: chat_id and text" },
      { status: 400 }
    );
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
    selectedChatModel: "api-chat-support", // Default model for external integrations
    selectedVisibilityType: "private", // Default visibility for external integrations
  };

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

    return NextResponse.json(data, { status: chatApiRes.status });
  } catch (error) {
    console.error("Error calling internal chat API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
