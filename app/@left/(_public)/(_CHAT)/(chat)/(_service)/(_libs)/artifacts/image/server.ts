// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_libs)/artifacts/image/server.ts

import { myProvider } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/ai/providers";
import { createDocumentHandler } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_libs)/artifacts/server";
import { experimental_generateImage } from "ai";

export const imageDocumentHandler = createDocumentHandler<"image">({
  kind: "image",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const { image } = await experimental_generateImage({
      model: myProvider.imageModel("small-model"),
      prompt: title,
      n: 1,
    });

    draftContent = image.base64;

    dataStream.writeData({
      type: "image-delta",
      content: image.base64,
    });

    return draftContent;
  },
  onUpdateDocument: async ({ description, dataStream }) => {
    let draftContent = "";

    const { image } = await experimental_generateImage({
      model: myProvider.imageModel("small-model"),
      prompt: description,
      n: 1,
    });

    draftContent = image.base64;

    dataStream.writeData({
      type: "image-delta",
      content: image.base64,
    });

    return draftContent;
  },
});
