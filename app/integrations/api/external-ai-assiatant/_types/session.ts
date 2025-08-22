// @/app/integrations/api/external-ai-assiatant/_types/session.ts

import { z } from "zod";

// Тип для purchase_history (json as any, но лучше уточнить структуру)
export const PurchaseHistorySchema = z.any(); // Можно заменить на строгую схему при необходимости

// Тип для user_info (json as any)
export const UserInfoSchema = z.any();

// Тип для events (array of objects с text и date)
export const EventItemSchema = z.object({
  text: z.string().max(600),
  createdAt: z.string().datetime(),
});
export type EventItem = z.infer<typeof EventItemSchema>;

// Основная схема для создания сессии
export const StartSessionSchema = z.object({
  user_id: z.string().min(1),
  name: z.string().max(60).nullable().optional(),
  city: z.string().max(60).nullable().optional(),
  user_info: UserInfoSchema.optional(),
  purchase_history: PurchaseHistorySchema.optional(),
  available_products: z.array(z.string()).optional(),
  available_items: z.string().max(60).optional().nullable(),
  events: z.array(EventItemSchema).optional(),
  auth_secret: z.string().min(1),
});

export type StartSessionRequest = z.infer<typeof StartSessionSchema>;

// Схема для обновления сессии (все поля опциональны, кроме session_id и auth_secret)
export const UpdateSessionSchema = z.object({
  session_id: z.string().min(1),
  city: z.string().max(60).nullable().optional(),
  user_info: UserInfoSchema.optional(),
  purchase_history: PurchaseHistorySchema.optional(),
  available_products: z.array(z.string()).optional(),
  available_items: z.string().optional().nullable(),
  events: z.array(EventItemSchema).optional(),
  auth_secret: z.string().min(1),
});

export type UpdateSessionRequest = z.infer<typeof UpdateSessionSchema>;

// Тип для ответа start/route
export type StartSessionResponse = {
  session_id: string;
  jwt: string;
  chatId: string;
  messageId: string;
  aiResponse: any;
};
