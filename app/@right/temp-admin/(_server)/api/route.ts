// @/app/@right/temp-admin/(_server)/api/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Получаем данные страницы из POST-запроса
    const data = await request.json();

    // Валидация
    if (
      !data.title ||
      !Array.isArray(data.slug) ||
      !data.slug.length ||
      !data.type
    ) {
      return NextResponse.json(
        { error: "title, slug[], type — обязательны" },
        { status: 400 }
      );
    }

    // Сохраняем страницу
    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        type: data.type,
        image: data.image || null,
      },
    });

    // Возвращаем id страницы
    return NextResponse.json({ id: page.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
