// @app/@left/(_public)/(_CHAT)/(chat)/(_server)/api/files/upload/route.ts

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import { prisma } from "@/lib/db";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/svg+xml",
  "image/tiff",
  "application/pdf",
];

const MAX_FILE_SIZE = 7 * 4096 * 4096; // 7MB

const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size should be less than 7MB",
    })
    .refine((file) => allowedTypes.includes(file.type), {
      message: "File type should be image or PDF",
    }),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.body === null) {
    return NextResponse.json(
      { error: "Request body is empty" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Получаем имя файла
    const filename = (formData.get("file") as File).name;
    const fileBuffer = await file.arrayBuffer();

    try {
      // Загружаем файл в Vercel Blob
      const data = await put(filename, fileBuffer, {
        access: "public",
      });

      // Сохраняем метаданные файла в БД
      await prisma.file.create({
        data: {
          userId: session.user.id,
          name: filename,
          url: data.url,
          contentType: data.contentType || file.type,
          size: file.size,
          // createdAt не указываем — Prisma выставит автоматически
        },
      });

      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
