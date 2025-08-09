// @/app/@left/(_public)/(_CHAT)/(chat)/chat/[id]/(_routing)/page.tsx

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { Chat } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/chat";
import { DataStreamHandler } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/models";
import type { Attachment, UIMessage } from "ai";
import { VisibilityType } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/visibility-selector";
import { Message, Visibility } from "@prisma/client";
import { getChatById } from "../../../(_service)/(_db-queries)/chat/queries";
import { getMessagesByChatId } from "../../../(_service)/(_db-queries)/message/queries";
import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  let chat;
  let messagesFromDb: Message[] = [];
  let session;

  try {
    const params = await props.params;
    const { id } = params;

    console.log("Page const { id } = params; ", id);

    chat = await getChatById(id);

    if (!chat) {
      notFound();
    }

    // Получаем сессию пользователя
    session = await auth();

    if (!session) {
      //redirect("/api/auth/guest");
      redirect("/login");
    }

    // Проверяем приватность чата
    if (chat.visibility === Visibility.private) {
      if (!session.user || session.user.id !== chat.userId) {
        notFound();
      }
    }

    // Получаем сообщения
    messagesFromDb = await getMessagesByChatId(id);
  } catch (error) {
    // Логируем ошибку для отладки (можно убрать на проде)
    console.error("Error in chat page:", error);
    // Можно показать свою страницу ошибки или скрыть детали
    notFound(); // или redirect("/error") если есть кастомная страница
  }

  function convertToUIMessages(messages: Array<Message>): Array<UIMessage> {
    function isAttachmentArray(data: unknown): data is Attachment[] {
      return (
        Array.isArray(data) &&
        data.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "url" in item &&
            typeof (item as any).url === "string"
        )
      );
    }

    return messages.map((message) => ({
      id: message.id,
      parts: message.parts as UIMessage["parts"],
      role: message.role as UIMessage["role"],
      content: "",
      createdAt: message.createdAt,
      experimental_attachments: isAttachmentArray(
        message.attachments as unknown
      )
        ? (message.attachments as unknown as Attachment[])
        : [],
    }));
  }

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get("chat-model");

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(messagesFromDb)}
        initialChatModel={chatModelFromCookie?.value ?? DEFAULT_CHAT_MODEL}
        initialVisibilityType={chat.visibility as VisibilityType}
        isReadonly={session?.user?.id !== chat.userId}
        session={session}
        autoResume={true}
      />

      <DataStreamHandler id={chat.id} />
    </>
  );
}
