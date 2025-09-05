// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_libs)/ai/models.ts

import {
  DEFAULT_CHAT_MODEL as DEFAULT_MODEL_ID,
  type ChatModelsConfigType,
  chatModelsConfig,
} from "@/config/chat-config/chat-models-config";

// Экспортируем дефолтную модель из конфигурации
export const DEFAULT_CHAT_MODEL: string = DEFAULT_MODEL_ID;

// Интерфейс для модели чата (сохраняем существующий)
export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

// Преобразуем конфигурацию в массив моделей
export const chatModels: Array<ChatModel> = Object.entries(
  chatModelsConfig
).map(([id, config]) => ({
  id,
  name: config.name,
  description: config.description,
}));

// Вспомогательная функция для получения модели по ID
export const getChatModelById = (id: string): ChatModel | undefined => {
  return chatModels.find((model) => model.id === id);
};

// Вспомогательная функция для проверки существования модели
export const isValidChatModelId = (
  id: string
): id is keyof ChatModelsConfigType => {
  return id in chatModelsConfig;
};

// Типизированные ключи моделей для лучшей типобезопасности
export type ChatModelId = keyof ChatModelsConfigType;
