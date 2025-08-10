// @/app/integrations/api/external-ai-assiatant/external-frontend/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";

// CORS configuration for external clients
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Разрешаем все origins для внешних клиентов
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400", // Кешируем preflight на 24 часа
  "Access-Control-Allow-Credentials": "false", // Для публичного API
};

// Handle preflight OPTIONS request - ОБЯЗАТЕЛЬНО для CORS
export async function OPTIONS(req: NextRequest) {
  console.log("🔍 OPTIONS preflight request received");
  console.log("Origin:", req.headers.get("origin"));
  console.log(
    "Request Method:",
    req.headers.get("access-control-request-method")
  );
  console.log(
    "Request Headers:",
    req.headers.get("access-control-request-headers")
  );

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Handle actual POST request
export async function POST(req: NextRequest) {
  console.log("📡 POST request received");
  console.log("Origin:", req.headers.get("origin"));

  // Проверка заголовка авторизации
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Missing or invalid Authorization header");
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      {
        status: 401,
        headers: corsHeaders, // ВАЖНО: добавляем CORS заголовки к ошибкам
      }
    );
  }

  const token = authHeader.replace("Bearer ", "").trim();
  console.log("🔑 Token received, length:", token.length);

  // Валидация токена
  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!);
    console.log("✅ Token validated successfully");
  } catch (e) {
    console.log("❌ Token validation failed:", e);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      {
        status: 401,
        headers: corsHeaders,
      }
    );
  }

  // Прокси-запрос на основной чат API
  try {
    const body = await req.json();
    console.log("📦 Request body:", body);

    const chatApiRes = await fetch(`${getNextAuthUrl()}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await chatApiRes.json();
    console.log("✅ Internal API response:", chatApiRes.status);

    return NextResponse.json(data, {
      status: chatApiRes.status,
      headers: corsHeaders, // ВАЖНО: добавляем CORS заголовки к успешным ответам
    });
  } catch (error) {
    console.error("❌ Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// Обработка других HTTP методов (GET, PUT, DELETE) - возвращаем 405
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: corsHeaders }
  );
}
