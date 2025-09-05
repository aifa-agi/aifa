// @/app/@left/(_public)/(_CHATL)/(chat)/(_service)/(_libs)/ai/entitlements.ts
import { UserType } from "@prisma/client";
import type { ChatModel } from "./models";

interface Entitlements {
  maxMessagesPerDay: number;
  availableChatModelIds: Array<ChatModel["id"]>;
}

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  guest: {
    maxMessagesPerDay: 10,
    availableChatModelIds: ["chat-model"],
  },
  subscriber: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
  customer: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
  architect: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
  admin: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
  editor: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
  authUser: {
    maxMessagesPerDay: 3,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
  apiUser: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["chat-model"],
  },
};
