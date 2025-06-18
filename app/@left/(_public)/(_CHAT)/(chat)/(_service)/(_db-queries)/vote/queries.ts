// @/app/@left/(_CHAT-FRACTAL)/(chat)/(_service)/(_db-queries)/vote/queries.ts

import { prisma } from "@/lib/db";
import type { Vote } from "@prisma/client";

/**
 * Создает или обновляет голос (upvote/downvote) для сообщения.
 * Если голос для данного сообщения уже существует, он обновляется.
 * В противном случае создается новая запись о голосе.
 * @param chatId - Идентификатор чата.
 * @param messageId - Идентификатор сообщения.
 * @param type - Тип голоса ('up' или 'down').
 * @returns Созданный или обновленный объект голоса.
 */
export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;

  type: "up" | "down";
}): Promise<Vote> {
  console.log(
    `Executing voteMessage query for messageId: ${messageId} with type: ${type}`
  );
  try {
    // Prisma upsert для модели с составным ключом
    const existingVote = await prisma.vote.findUnique({
      where: {
        chatId_messageId: { chatId, messageId },
      },
    });

    if (existingVote) {
      return await prisma.vote.update({
        where: {
          chatId_messageId: { chatId, messageId },
        },
        data: { isUpvoted: type === "up" },
      });
    } else {
      return await prisma.vote.create({
        data: {
          chatId,
          messageId,
          isUpvoted: type === "up",
        },
      });
    }
  } catch (error) {
    console.error("Failed to process vote for message in database", error);
    throw error;
  }
}

/**
 * Получает все голоса для указанного чата.
 * @param id - Идентификатор чата.
 * @returns Массив объектов голосов.
 */
export async function getVotesByChatId(id: string): Promise<Vote[]> {
  console.log("Executing getVotesByChatId query for chatId:", id);
  try {
    return await prisma.vote.findMany({
      where: { chatId: id },
    });
  } catch (error) {
    console.error("Failed to get votes by chat id from database", error);
    throw error;
  }
}
