// @app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_db-queries)/chat/queries.ts

import { prisma } from "@/lib/db";
import type { Chat } from "@prisma/client";
import type { VisibilityType } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/visibility-selector";

/**
 * Сохраняет новый чат в базе данных.
 * @param id - Уникальный идентификатор чата.
 * @param userId - Идентификатор пользователя.
 * @param title - Заголовок чата.
 * @param visibility - Уровень видимости чата.
 * @returns Созданный объект чата.
 */
export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}): Promise<Chat> {
  console.log("Executing saveChat query for id:", id);
  try {
    return await prisma.chat.create({
      data: {
        id,
        userId,
        title,
        visibility,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to save chat in database", error);
    throw error;
  }
}

/**
 * Удаляет чат по его идентификатору.
 * Связанные сообщения и другие данные удаляются каскадно (если настроено в Prisma schema).
 * @param id - Идентификатор чата для удаления.
 * @returns Удаленный объект чата или null, если не найден.
 */
export async function deleteChatById(id: string): Promise<Chat | null> {
  console.log("Executing deleteChatById query for id:", id);
  try {
    return await prisma.chat.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete chat by id from database", error);
    throw error;
  }
}

/**
 * Получает список чатов пользователя с пагинацией.
 * @param id - Идентификатор пользователя.
 * @param limit - Количество записей на странице.
 * @param startingAfter - ID чата для пагинации "вперед".
 * @param endingBefore - ID чата для пагинации "назад".
 * @returns Объект с чатами и флагом наличия следующих страниц.
 */
export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}): Promise<{ chats: Chat[]; hasMore: boolean }> {
  console.log("Executing getChatsByUserId query for user id:", id);

  try {
    const extendedLimit = limit + 1;
    const whereClause = { userId: id };

    let orderBy: { createdAt: "asc" | "desc" } = { createdAt: "desc" };
    let cursor: { id: string } | undefined = undefined;

    if (startingAfter) {
      cursor = { id: startingAfter };
      orderBy = { createdAt: "desc" };
    } else if (endingBefore) {
      cursor = { id: endingBefore };
      orderBy = { createdAt: "asc" };
    }

    const chats = await prisma.chat.findMany({
      where: whereClause,
      orderBy,
      cursor,
      skip: cursor ? 1 : 0,
      take: extendedLimit,
    });

    let chatsList = chats;

    if (endingBefore) {
      chatsList = chats.reverse();
    }

    const hasMore = chatsList.length > limit;

    return {
      chats: hasMore ? chatsList.slice(0, limit) : chatsList,
      hasMore,
    };
  } catch (error) {
    console.error("Failed to get chats by user from database", error);
    throw error;
  }
}

/**
 * Получает один чат по его идентификатору.
 * @param id - Идентификатор чата.
 * @returns Объект чата или null, если не найден.
 */
export async function getChatById(id: string): Promise<Chat | null> {
  console.log("Executing getChatById query for id:", id);
  try {
    return await prisma.chat.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to get chat by id from database", error);
    throw error;
  }
}

/**
 * Обновляет видимость чата по его идентификатору.
 * @param chatId - Идентификатор чата.
 * @param visibility - Новый уровень видимости ('private' или 'public').
 * @returns Обновленный объект чата.
 */
export async function updateChatVisibilityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}): Promise<Chat> {
  console.log("Executing updateChatVisibilityById query for chatId:", chatId);
  try {
    return await prisma.chat.update({
      where: { id: chatId },
      data: { visibility },
    });
  } catch (error) {
    console.error("Failed to update chat visibility in database", error);
    throw error;
  }
}
