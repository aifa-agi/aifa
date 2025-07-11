// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_libs)/ai/providers.ts

import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { xai } from "@ai-sdk/xai";
import { openai, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { isTestEnvironment } from "../../(_constants)/constants";
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from "./models.test";

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        "chat-model": chatModel,
        "chat-model-reasoning": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        "chat-model": openai.responses("gpt-4.1"),
        "chat-model-reasoning": wrapLanguageModel({
          model: openai.responses("o4-mini-2025-04-16"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": openai.responses("gpt-4.1"),
        "artifact-model": openai.responses("gpt-4.1"),
      },
      imageModels: {
        "small-model": xai.image("grok-2-image"),
      },
    });
