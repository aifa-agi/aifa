// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_components)/chat.tsx
"use client";

import type { Attachment, UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { ChatHeader } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/chat-header";
import { fetcher } from "@/lib/utils";
import { Artifact } from "./artifact";
import { MultimodalInput } from "./multimodal-input";
import { Messages } from "./messages";
import type { VisibilityType } from "./visibility-selector";
import { useArtifactSelector } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_hooks)/use-artifact";
import { unstable_serialize } from "swr/infinite";
import { getChatHistoryPaginationKey } from "./sidebar-history";
import { toast } from "./toast";
import type { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatVisibility } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_hooks)/use-chat-visibility";
import { useAutoResume } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_hooks)/use-auto-resume";
import { Vote } from "@prisma/client";
import { generateCuid } from "@/lib/utils/generateCuid";

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  session,
  autoResume,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
  session: Session;
  autoResume: boolean;
}) {
  const { mutate } = useSWRConfig();
  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  });
  const router = useRouter();
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
    experimental_resume,
    data,
  } = useChat({
    id,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateCuid,
    experimental_prepareRequestBody: (body) => ({
      id,
      message: body.messages.at(-1),
      selectedChatModel: initialChatModel,
      selectedVisibilityType: visibilityType,
    }),
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      let redirectTo: string | undefined;
      let delay: number = 3000;

      try {
        const data = JSON.parse(error.message);
        if (data?.redirectTo) {
          redirectTo = data.redirectTo;
          delay = data.delay || 3000;
          toast({ type: "error", description: data.error });
        } else {
          toast({ type: "error", description: error.message });
        }
      } catch {
        toast({ type: "error", description: error.message });
      }

      if (redirectTo) {
        setTimeout(() => {
          router.push(redirectTo!);
        }, delay);
      }
    },
  });

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      append({
        role: "user",
        content: query,
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, "", `/chat/${id}`);
    }
  }, [query, append, hasAppendedQuery, id]);

  const { data: votes } = useSWR<Array<Vote>>(
    messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  useAutoResume({
    autoResume,
    initialMessages,
    experimental_resume,
    data,
    setMessages,
  });

  useEffect(() => {
    console.log("essages in chat txt ", messages);
  }, [messages]);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          chatId={id}
          selectedModelId={initialChatModel}
          selectedVisibilityType={initialVisibilityType}
          isReadonly={isReadonly}
          session={session}
        />

        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
              selectedVisibilityType={visibilityType}
            />
          )}
        </form>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
        selectedVisibilityType={visibilityType}
      />
    </>
  );
}
