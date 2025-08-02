import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Проверка минимального набора обязательных полей
    if (
      !data.pageId ||
      !data.name ||
      !Array.isArray(data.sectionPath) ||
      data.sectionPath.length === 0 ||
      !data.type
    ) {
      return NextResponse.json(
        { error: "pageId, name, type, sectionPath[] обязательны" },
        { status: 400 }
      );
    }

    const section = await prisma.pageSection.create({
      data: {
        pageId: data.pageId,
        name: data.name,
        sectionPath: data.sectionPath,
        order: data.order ?? 1,
        summary: data.summary || null,
        type: data.type,
        className: data.className || null,
        headerContent: data.headerContent ?? {},
        bodyContent: data.bodyContent ?? {},
        footerContent: data.footerContent ?? {},
        videoUrl: data.videoUrl || null,
        imageUrl: data.imageUrl || null,
        sectionClassName: data.sectionClassName || null,
        contentWrapperClassName: data.contentWrapperClassName || null,
        customComponentsAnyTypeData: data.customComponentsAnyTypeData ?? {},
      },
    });

    return NextResponse.json({ id: section.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
