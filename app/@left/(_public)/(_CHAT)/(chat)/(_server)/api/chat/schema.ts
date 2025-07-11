// app\@left\(_public)\(_CHAT)\(chat)\(_server)\api\chat\schema.ts

import { z } from "zod";
import { isValidCuid } from "@/lib/utils/validateCuid";

// Изменяем схему для id и message.id на CUID с использованием refine

const cuidString = z
  .string()
  .min(1)
  .refine(isValidCuid, { message: "Invalid CUID" });

const textPartSchema = z.object({
  text: z.string().min(1).max(2000),
  type: z.enum(["text"]),
});

export const postRequestBodySchema = z.object({
  id: z.string(),
  message: z.object({
    id: cuidString,
    createdAt: z.coerce.date(),
    role: z.enum(["user"]),
    content: z.string().min(1).max(2000),
    parts: z.array(textPartSchema),
    experimental_attachments: z
      .array(
        z.object({
          url: z.string().url(),
          name: z.string().min(1).max(2000),
          contentType: z.enum(["image/png", "image/jpg", "image/jpeg"]),
        })
      )
      .optional(),
  }),
  selectedChatModel: z.enum(["chat-model", "chat-model-reasoning"]),
  selectedVisibilityType: z.enum(["public", "private"]),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
