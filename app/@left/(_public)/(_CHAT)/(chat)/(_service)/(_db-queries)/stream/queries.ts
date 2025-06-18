// @/app/@left/(_CHAT-FRACTAL)/(chat)/(_service)/(_db-queries)/stream/queries.ts

import { prisma } from "@/lib/db";

/**
 * Сохраняет ID нового стрима в базе данных.
 * @param streamId - Уникальный идентификатор стрима.
 * @param chatId - Идентификатор чата, к которому относится стрим.
 */
export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}): Promise<void> {
  console.log("Executing createStreamId query for streamId:", streamId);
  try {
    await prisma.stream.create({
      data: {
        id: streamId,
        chatId,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to create stream id in database", error);
    throw error;
  }
}

/**
 * Получает все ID стримов для конкретного чата.
 * @param chatId - Идентификатор чата.
 * @returns Массив строковых ID стримов.
 */
export async function getStreamIdsByChatId(chatId: string): Promise<string[]> {
  console.log("Executing getStreamIdsByChatId query for chatId:", chatId);
  try {
    const streams = await prisma.stream.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    return streams.map((stream) => stream.id);
  } catch (error) {
    console.error("Failed to get stream ids by chat id from database", error);
    throw error;
  }
}
