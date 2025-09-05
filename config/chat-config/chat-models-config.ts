// @/config/chat-models-config.ts

export interface ChatModelConfig {
  name: string;
  description: string;
}

export interface ChatModelsConfigType {
  "chat-model": ChatModelConfig;
  "chat-model-reasoning": ChatModelConfig;
  "api-chat-support": ChatModelConfig;
  "vector-store-model": ChatModelConfig;
  "web-search-model": ChatModelConfig;
}

export const chatModelsConfig: ChatModelsConfigType = {
  "chat-model": {
    name: "Chat model",
    description: "Primary model for all-purpose chat",
  },
  "chat-model-reasoning": {
    name: "Reasoning model",
    description: "Uses advanced reasoning",
  },
  "api-chat-support": {
    name: "Api support model",
    description: "Support model",
  },
  "vector-store-model": {
    name: "The knowledge base",
    description: "Uses vector store knowledges",
  },
  "web-search-model": {
    name: "The web search model",
    description: "Uses exa.ai engine answers",
  },
};

// Дефолтная модель
export const DEFAULT_CHAT_MODEL = "api-chat-support";
