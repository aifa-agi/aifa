// app\@left\(_public)\(_CHAT)\(chat)\(_server)\api\chat\schema.ts

import { z } from "zod";
import { isValidCuid } from "@/lib/utils/validateCuid";

const cuidString = z
  .string()
  .min(1)
  .refine(isValidCuid, { message: "Invalid CUID" });

const textPartSchema = z.object({
  text: z.string().min(1).max(200000),
  type: z.enum(["text"]),
});

export const postRequestBodySchema = z.object({
  id: z.string(),
  message: z.object({
    id: cuidString,
    createdAt: z.coerce.date(),
    role: z.enum(["user", "system", "assistant"]),
    content: z.string().min(1).max(200000),
    parts: z.array(textPartSchema),
    experimental_attachments: z
      .array(
        z.object({
          url: z.string().url(),
          name: z.string().min(1).max(200000),
          contentType: z.enum(["image/png", "image/jpg", "image/jpeg"]),
        })
      )
      .optional(),
  }),
  selectedChatModel: z.enum([
    "api-chat-support",
    "chat-model",
    "chat-model-reasoning",
  ]),
  selectedVisibilityType: z.enum(["public", "private"]),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
