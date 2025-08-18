// @/app/integrations/api/external-ai-assiatant/utils/create-system-prompt.ts

/**
 * Internal helper function to get most popular dish ID from purchase history
 * Uses single pass algorithm instead of sorting to avoid tuple type issues
 * @param purchaseHistory - Purchase history array
 * @returns Most popular dish ID or empty string
 */
function getMostPopularDishId(
  purchaseHistory: any[] | null | undefined
): string {
  if (!Array.isArray(purchaseHistory) || purchaseHistory.length === 0) {
    return "";
  }

  const counts = new Map<string, number>();

  // Count quantities for each product
  for (const item of purchaseHistory) {
    const id = typeof item?.product_id === "string" ? item.product_id : "";
    if (!id) continue;
    const qty =
      typeof item?.quantity === "number" && item.quantity > 0
        ? item.quantity
        : 1;
    counts.set(id, (counts.get(id) ?? 0) + qty);
  }

  if (counts.size === 0) return "";

  // Find maximum in single pass
  let maxId = "";
  let maxCount = -1;

  for (const [id, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      maxId = id;
    }
  }

  return maxId;
}

/**
 * Creates enhanced system message with personalized information
 * @param name - User's name
 * @param city - User's city (optional)
 * @param purchasePreferencesDoc - Markdown document with purchase history analysis
 * @param tagPreferencesDoc - Markdown document with tag preferences analysis
 * @param availableMenuDoc - Markdown document with current menu
 * @param purchaseHistory - Raw purchase history for time analysis
 * @returns Enhanced system message string
 */
export function createEnhancedSystemMessage(
  name: string | null,
  city: string | null,
  purchasePreferencesDoc: string,
  tagPreferencesDoc: string,
  availableMenuDoc: string,
  purchaseHistory: any[] | null | undefined
): string {
  const userName = name || "Гость";
  const userCity = city ? ` из города ${city}` : "";

  // Текущая дата и время
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTimeString = currentDate.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Анализ времени последнего заказа
  let lastOrderInfo = "";
  let daysSinceLastOrder: number | null = null;
  let mostPopularDish = "";

  if (Array.isArray(purchaseHistory) && purchaseHistory.length > 0) {
    // Найти последний заказ
    const sortedHistory = purchaseHistory
      .filter((item) => item?.date && typeof item.date === "string")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedHistory.length > 0) {
      const lastOrderDate = new Date(sortedHistory[0].date);
      const timeDiff = currentDate.getTime() - lastOrderDate.getTime();
      daysSinceLastOrder = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (daysSinceLastOrder >= 0) {
        if (daysSinceLastOrder === 0) {
          lastOrderInfo = "сегодня уже делали заказ";
        } else if (daysSinceLastOrder === 1) {
          lastOrderInfo = "вчера были у нас";
        } else if (daysSinceLastOrder <= 7) {
          lastOrderInfo = `${daysSinceLastOrder} дней назад заходили к нам`;
        } else if (daysSinceLastOrder <= 30) {
          lastOrderInfo = `целых ${daysSinceLastOrder} дней вас не было`;
        } else {
          lastOrderInfo = `больше месяца вас не было - мы соскучились`;
        }
      }
    }

    // Получить самое популярное блюдо без работы с кортежами
    mostPopularDish = getMostPopularDishId(purchaseHistory);
  }

  let systemMessage = `Ты AI-ассистент ресторана. Твоя основная задача - помогать пользователю выбирать блюда и отвечать на вопросы о меню.

ТЕКУЩАЯ ИНФОРМАЦИЯ:
- Дата: ${currentDateString}
- Время: ${currentTimeString}

ИНФОРМАЦИЯ О КЛИЕНТЕ:
- Имя: ${userName}${userCity}
${lastOrderInfo ? `- Последнее посещение: ${lastOrderInfo}` : "- Новый клиент"}
${mostPopularDish ? `- Любимое блюдо: ${mostPopularDish}` : ""}

`;

  // Add purchase preferences if available
  if (purchasePreferencesDoc.trim()) {
    systemMessage += `${purchasePreferencesDoc}\n`;
  }

  // Add tag preferences if available
  if (tagPreferencesDoc.trim()) {
    systemMessage += `${tagPreferencesDoc}\n`;
  }

  // Add current menu if available
  if (availableMenuDoc.trim()) {
    systemMessage += `${availableMenuDoc}\n`;
  }

  // Персонализированные инструкции
  systemMessage += `ТВОИ ЗАДАЧИ:
- Рекомендуй блюда на основе предыдущих предпочтений клиента
- Помогай с выбором, объясняй особенности блюд и их состав
- Учитывай популярные характеристики продуктов при рекомендациях
- Отвечай дружелюбно и профессионально
- Если клиент спрашивает о блюдах, которых нет в меню - предложи альтернативы

ПРАВИЛА:
- Всегда обращайся к клиенту по имени (${userName})
- Рекомендуй только те блюда, которые есть в актуальном меню
- При рекомендациях указывай цену и основные характеристики
- Если у клиента есть предпочтения из истории покупок - учитывай их приоритетно
- Используй suggestions (предложения) для рекомендаций блюд

СТИЛЬ ОБЩЕНИЯ:
${lastOrderInfo ? `- Начни с радостного приветствия и упомяни, что "${lastOrderInfo}"` : "- Поприветствуй нового клиента тепло"}
${mostPopularDish ? `- Можешь ненавязчиво предложить любимое блюдо клиента: "${mostPopularDish}"` : ""}
- Будь неформальным, но уважительным
- Проявляй личную заинтересованность в выборе клиента
- Варьируй фразы приветствия - не повторяйся

ПРИМЕРЫ НЕФОРМАЛЬНОГО ОБЩЕНИЯ:
${
  daysSinceLastOrder !== null && daysSinceLastOrder > 3
    ? `- "Ой, как мы рады, что вы снова к нам зашли! Постойте-постойте, сколько вас не было... кажется ${daysSinceLastOrder} ${daysSinceLastOrder === 1 ? "день" : daysSinceLastOrder < 5 ? "дня" : "дней"}! Мы по вам соскучились!"`
    : `- "Как здорово снова вас видеть!"`
}
${
  mostPopularDish
    ? `- "Может быть начнём с того, что больше всего любите? Как насчёт ${mostPopularDish}?"`
    : `- "Что будем выбирать сегодня? Подскажу самое вкусное!"`
}
- "Что-то новенькое попробуем или возьмём проверенное?"
- "У меня есть несколько идей специально для вас!"

ПЕРВОЕ СООБЩЕНИЕ:
${
  Array.isArray(purchaseHistory) && purchaseHistory.length > 0
    ? `Поприветствуй клиента, упомяни время с последнего посещения, и сделай 2-3 персональные рекомендации на основе истории покупок, используя suggestions.`
    : `Поприветствуй нового клиента и предложи популярные блюда из меню, используя suggestions.`
}`;

  return systemMessage;
}

/**
 * Helper function to get days since last order
 * @param purchaseHistory - Purchase history array
 * @returns Number of days since last order or null if no history
 */
export function getDaysSinceLastOrder(
  purchaseHistory: any[] | null | undefined
): number | null {
  if (
    !purchaseHistory ||
    !Array.isArray(purchaseHistory) ||
    purchaseHistory.length === 0
  ) {
    return null;
  }

  const sortedHistory = purchaseHistory
    .filter((item) => item?.date && typeof item.date === "string")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedHistory.length === 0) {
    return null;
  }

  const lastOrderDate = new Date(sortedHistory[0].date);
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - lastOrderDate.getTime();

  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}

/**
 * Helper function to get most popular dish from purchase history
 * @param purchaseHistory - Purchase history array
 * @returns Most popular dish ID or empty string
 */
export function getMostPopularDish(
  purchaseHistory: any[] | null | undefined
): string {
  // Use the internal helper to avoid code duplication
  return getMostPopularDishId(purchaseHistory);
}

/**
 * Interface for system prompt input data
 */
export interface SystemPromptData {
  name: string | null;
  city: string | null;
  purchaseHistory: any[] | null | undefined;
  purchasePreferencesDoc: string;
  tagPreferencesDoc: string;
  availableMenuDoc: string;
}

/**
 * Main function to create system prompt with all data
 * @param data - System prompt input data
 * @returns Enhanced system message string
 */
export function createSystemPrompt(data: SystemPromptData): string {
  return createEnhancedSystemMessage(
    data.name,
    data.city,
    data.purchasePreferencesDoc,
    data.tagPreferencesDoc,
    data.availableMenuDoc,
    data.purchaseHistory
  );
}
