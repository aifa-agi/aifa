// @/app/@left/(_CHAT-FRACTAL)/(chat)/(_service)/(_db-queries)/message/queries.ts

import { prisma } from "@/lib/db";
import type { Message } from "@prisma/client";

// Локальный интерфейс для создания сообщений, используемый функцией saveMessages
interface DBMessage {
  id: string;
  chatId: string;
  role: string;
  parts: object; // JSON поле
  attachments: object; // JSON поле
  createdAt: Date;
}

/**
 * Сохраняет массив сообщений в базе данных.
 * @param messages - Массив объектов сообщений для сохранения.
 */
export async function saveMessages({
  messages,
}: {
  messages: DBMessage[];
}): Promise<void> {
  console.log("Executing saveMessages query with messages:", messages);

  try {
    await prisma.message.createMany({
      data: messages.map((msg) => ({
        id: msg.id,
        chatId: msg.chatId,
        role: msg.role,
        parts: msg.parts,
        attachments: msg.attachments,
        createdAt: msg.createdAt,
      })),
      skipDuplicates: true, // Пропускать дубликаты по первичному ключу
    });
  } catch (error) {
    console.error("Failed to save messages in database", error);
    throw error;
  }
}

/**
 * Получает все сообщения для конкретного чата, отсортированные по дате создания.
 * @param id - Идентификатор чата.
 * @returns Массив объектов сообщений.
 */
export async function getMessagesByChatId(id: string): Promise<Message[]> {
  console.log("Executing getMessagesByChatId query for chat id:", id);
  try {
    return await prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Failed to get messages by chat id from database", error);
    throw error;
  }
}

/**
 * Получает одно сообщение по его уникальному идентификатору.
 * @param id - Идентификатор сообщения.
 * @returns Объект сообщения или null, если не найдено.
 */
export async function getMessageById(id: string): Promise<Message | null> {
  console.log("Executing getMessageById query for id:", id);
  try {
    return await prisma.message.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to get message by id from database", error);
    throw error;
  }
}

/**
 * Удаляет сообщения и связанные с ними голоса в чате, созданные после указанной временной метки.
 * @param chatId - Идентификатор чата.
 * @param timestamp - Временная метка. Все сообщения, созданные после этой метки, будут удалены.
 */
export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}): Promise<void> {
  console.log(
    "Executing deleteMessagesByChatIdAfterTimestamp for chatId:",
    chatId
  );

  try {
    // Находим все сообщения для удаления, чтобы получить их ID
    const messagesToDelete = await prisma.message.findMany({
      where: {
        chatId,
        createdAt: { gte: timestamp },
      },
      select: { id: true },
    });
    const messageIds = messagesToDelete.map((m) => m.id);

    if (messageIds.length > 0) {
      // Сначала удаляем связанные голоса для сохранения целостности данных
      await prisma.vote.deleteMany({
        where: {
          chatId,
          messageId: { in: messageIds },
        },
      });

      // Затем удаляем сами сообщения
      await prisma.message.deleteMany({
        where: {
          chatId,
          id: { in: messageIds },
        },
      });
    }
  } catch (error) {
    console.error(
      "Failed to delete messages by chat id after timestamp from database",
      error
    );
    throw error;
  }
}

/**
 * Подсчитывает количество сообщений от пользователя за последние N часов.
 * @param id - Идентификатор пользователя.
 * @param differenceInHours - Количество часов для проверки.
 * @returns Количество сообщений.
 */
export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}): Promise<number> {
  console.log("Executing getMessageCountByUserId for user id:", id);
  try {
    const dateFrom = new Date(Date.now() - differenceInHours * 3600000);

    return await prisma.message.count({
      where: {
        role: "user",
        createdAt: { gte: dateFrom },
        Chat: {
          userId: id,
        },
      },
    });
  } catch (error) {
    console.error(
      "Failed to get message count by user id for the last hours from database",
      error
    );
    throw error;
  }
}
