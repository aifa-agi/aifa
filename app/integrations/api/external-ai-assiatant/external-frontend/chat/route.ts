// @/app/integrations/api/external-ai-assiatant/external-frontend/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";

// CORS заголовки для всех ответов
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // или укажите конкретные домены
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400", // кешировать preflight на 24 часа
};

// Обработка preflight OPTIONS запроса
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  // Проверка заголовка авторизации
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      {
        status: 401,
        headers: corsHeaders, // Добавляем CORS заголовки к ошибке
      }
    );
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // Валидация токена
  try {
    verify(token, process.env.NEXTAUTH_SECRET!);
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      {
        status: 401,
        headers: corsHeaders, // Добавляем CORS заголовки к ошибке
      }
    );
  }

  // Прокси-запрос на основной чат API
  try {
    const body = await req.json();
    const chatApiRes = await fetch(`${getNextAuthUrl()}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await chatApiRes.json();
    return NextResponse.json(data, {
      status: chatApiRes.status,
      headers: corsHeaders, // Добавляем CORS заголовки к успешному ответу
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
