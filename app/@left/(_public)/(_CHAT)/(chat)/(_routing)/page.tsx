// @/app/@left/(_public)/(_CHAT)/(chat)/(_routing)/page.tsx
import { cookies } from "next/headers";

import { Chat } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/chat";
import { DEFAULT_CHAT_MODEL } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/models";
import { DataStreamHandler } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/data-stream-handler";

import { redirect } from "next/navigation";
import { generateCuid } from "@/lib/utils/generateCuid";
import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  const id = generateCuid();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialVisibilityType="private"
          isReadonly={false}
          session={session}
          autoResume={false}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={modelIdFromCookie.value || DEFAULT_CHAT_MODEL}
        initialVisibilityType="private"
        isReadonly={false}
        session={session}
        autoResume={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
