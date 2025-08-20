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
  try {
    if (!Array.isArray(purchaseHistory) || purchaseHistory.length === 0) {
      return "";
    }

    const counts = new Map<string, number>();

    // Count quantities for each product
    for (const item of purchaseHistory) {
      try {
        const id = typeof item?.product_id === "string" ? item.product_id : "";
        if (!id) continue;
        const qty =
          typeof item?.quantity === "number" && item.quantity > 0
            ? item.quantity
            : 1;
        counts.set(id, (counts.get(id) ?? 0) + qty);
      } catch (itemError) {
        console.warn("Error processing purchase history item:", itemError);
        continue;
      }
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
  } catch (error) {
    console.error("Error in getMostPopularDishId:", error);
    return "";
  }
}

/**
 * Helper function to check if menu is available and has content
 * @param availableMenuDoc - Menu document content
 * @returns Boolean indicating if menu has available dishes
 */
function hasAvailableMenu(availableMenuDoc: string): boolean {
  try {
    if (!availableMenuDoc || typeof availableMenuDoc !== "string") {
      return false;
    }

    const menuContent = availableMenuDoc.trim();
    if (menuContent.length === 0) {
      return false;
    }

    // Check if the menu document contains actual menu items
    const lowerContent = menuContent.toLowerCase();
    const hasMenuIndicators =
      lowerContent.includes("блюдо") ||
      lowerContent.includes("цена") ||
      lowerContent.includes("руб") ||
      lowerContent.includes("₽") ||
      lowerContent.includes("меню") ||
      lowerContent.includes("позиция") ||
      menuContent.length > 50;

    return hasMenuIndicators;
  } catch (error) {
    console.error("Error in hasAvailableMenu:", error);
    return false;
  }
}

/**
 * Safe function to process events information
 * @param eventsInfo - Events information string
 * @returns Processed events string or empty string
 */
function processEventsInfo(eventsInfo: string | undefined): string {
  try {
    if (!eventsInfo || typeof eventsInfo !== "string") {
      return "";
    }
    return eventsInfo.trim() + "\n\n";
  } catch (error) {
    console.error("Error processing events info:", error);
    return "";
  }
}

/**
 * Safe function to get current date and time strings
 * @returns Object with formatted date and time strings
 */
function getCurrentDateTime(): { dateString: string; timeString: string } {
  try {
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString("ru-RU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeString = currentDate.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { dateString, timeString };
  } catch (error) {
    console.error("Error getting current date/time:", error);
    return {
      dateString: "дата недоступна",
      timeString: "время недоступно",
    };
  }
}

/**
 * Safe function to analyze last order information
 * @param purchaseHistory - Purchase history array
 * @returns Object with last order info and days since last order
 */
function analyzeLastOrderInfo(purchaseHistory: any[] | null | undefined): {
  lastOrderInfo: string;
  daysSinceLastOrder: number | null;
} {
  try {
    if (!Array.isArray(purchaseHistory) || purchaseHistory.length === 0) {
      return { lastOrderInfo: "", daysSinceLastOrder: null };
    }

    const currentDate = new Date();
    const validOrders = purchaseHistory
      .filter((item) => {
        try {
          return item?.date && typeof item.date === "string";
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        try {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } catch {
          return 0;
        }
      });

    if (validOrders.length === 0) {
      return { lastOrderInfo: "", daysSinceLastOrder: null };
    }

    const lastOrderDate = new Date(validOrders[0].date);
    const timeDiff = currentDate.getTime() - lastOrderDate.getTime();
    const daysSinceLastOrder = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let lastOrderInfo = "";
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

    return { lastOrderInfo, daysSinceLastOrder };
  } catch (error) {
    console.error("Error analyzing last order info:", error);
    return { lastOrderInfo: "", daysSinceLastOrder: null };
  }
}

/**
 * Safe function to process user information
 * @param name - User name
 * @param city - User city
 * @returns Object with processed user info
 */
function processUserInfo(
  name: string | null | undefined,
  city: string | null | undefined
): { userName: string; userCity: string } {
  try {
    const userName =
      typeof name === "string" && name.trim() ? name.trim() : "Гость";
    const userCity =
      typeof city === "string" && city.trim()
        ? ` из города ${city.trim()}`
        : "";
    return { userName, userCity };
  } catch (error) {
    console.error("Error processing user info:", error);
    return { userName: "Гость", userCity: "" };
  }
}

/**
 * Safe function to process analysis documents
 * @param docs - Object with analysis documents
 * @returns Object with safe document strings
 */
function processAnalysisDocs(docs: {
  purchasePreferencesDoc?: string;
  tagPreferencesDoc?: string;
  availableMenuDoc?: string;
}): {
  safePurchasePreferencesDoc: string;
  safeTagPreferencesDoc: string;
  safeAvailableMenuDoc: string;
} {
  try {
    const safePurchasePreferencesDoc =
      typeof docs.purchasePreferencesDoc === "string" &&
      docs.purchasePreferencesDoc.trim()
        ? docs.purchasePreferencesDoc.trim()
        : "";

    const safeTagPreferencesDoc =
      typeof docs.tagPreferencesDoc === "string" &&
      docs.tagPreferencesDoc.trim()
        ? docs.tagPreferencesDoc.trim()
        : "";

    const safeAvailableMenuDoc =
      typeof docs.availableMenuDoc === "string" && docs.availableMenuDoc.trim()
        ? docs.availableMenuDoc.trim()
        : "";

    return {
      safePurchasePreferencesDoc,
      safeTagPreferencesDoc,
      safeAvailableMenuDoc,
    };
  } catch (error) {
    console.error("Error processing analysis docs:", error);
    return {
      safePurchasePreferencesDoc: "",
      safeTagPreferencesDoc: "",
      safeAvailableMenuDoc: "",
    };
  }
}

/**
 * ОБНОВЛЕННАЯ ФУНКЦИЯ: Создает мастер-инструкцию для обучения модели работе с клиентами ресторана
 * Эта инструкция НЕ инициирует диалог, а только обучает модель правилам
 * @param name - User's name
 * @param city - User's city (optional)
 * @param purchasePreferencesDoc - Markdown document with purchase history analysis
 * @param tagPreferencesDoc - Markdown document with tag preferences analysis
 * @param availableMenuDoc - Markdown document with current menu
 * @param purchaseHistory - Raw purchase history for analysis
 * @param eventsInfo - Events information string (optional)
 * @returns Master instruction string for the AI model
 */
export function createMasterInstruction(
  name: string | null,
  city: string | null,
  purchasePreferencesDoc: string,
  tagPreferencesDoc: string,
  availableMenuDoc: string,
  purchaseHistory: any[] | null | undefined,
  eventsInfo?: string
): string {
  let masterInstruction = "";

  try {
    // Safe processing of all input data
    const { userName, userCity } = processUserInfo(name, city);
    const { dateString, timeString } = getCurrentDateTime();
    const { lastOrderInfo, daysSinceLastOrder } =
      analyzeLastOrderInfo(purchaseHistory);
    const {
      safePurchasePreferencesDoc,
      safeTagPreferencesDoc,
      safeAvailableMenuDoc,
    } = processAnalysisDocs({
      purchasePreferencesDoc,
      tagPreferencesDoc,
      availableMenuDoc,
    });
    const safeEventsInfo = processEventsInfo(eventsInfo);
    const mostPopularDish = getMostPopularDishId(purchaseHistory);
    const menuAvailable = hasAvailableMenu(safeAvailableMenuDoc);

    // МАСТЕР-ИНСТРУКЦИЯ: Обучение модели правилам работы
    masterInstruction = `🎓 МАСТЕР-ИНСТРУКЦИЯ ДЛЯ AI АССИСТЕНТА РЕСТОРАНА

Ты изучаешь правила работы с клиентами ресторана. Ты — вежливый, дружелюбный, заботливый и профессиональный официант-девушка и AI ассистент ресторана.

📋 КОНТЕКСТНАЯ ИНФОРМАЦИЯ О ТЕКУЩЕМ КЛИЕНТЕ:

ОБЩАЯ ИНФОРМАЦИЯ:
- Текущая дата: ${dateString}
- Текущее время: ${timeString}
- Статус меню: ${menuAvailable ? "✅ Доступно" : "❌ Недоступно - блюда закончились"}

ИНФОРМАЦИЯ О КЛИЕНТЕ:
- Имя клиента: ${userName}${userCity}
- Статус: ${lastOrderInfo ? `Постоянный клиент (${lastOrderInfo})` : "Новый клиент"}
${mostPopularDish ? `- Любимое блюдо клиента: ${mostPopularDish}` : "- Предпочтения пока не выявлены"}
${daysSinceLastOrder !== null ? `- Дней с последнего заказа: ${daysSinceLastOrder}` : ""}

`;

    // Add events information if available
    if (safeEventsInfo) {
      try {
        masterInstruction += `📢 АКТУАЛЬНЫЕ СОБЫТИЯ И ИНФОРМАЦИЯ:\n${safeEventsInfo}`;
      } catch (error) {
        console.warn("Failed to add events info:", error);
      }
    }

    // Add critical menu rules
    masterInstruction += `🚨 КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА РАБОТЫ С МЕНЮ:

1. СТРОГО ЗАПРЕЩЕНО:
   - Выдумывать, изобретать или упоминать любые блюда, которых НЕТ в предоставленном меню
   - Рекомендовать несуществующие позиции  
   - Называть цены блюд, которых нет в актуальном меню
   - Предлагать блюда "по памяти" или из общих знаний о ресторанах

2. РАЗРЕШЕНО ТОЛЬКО:
   - Рекомендовать блюда, которые ТОЧНО ЕСТЬ в предоставленном актуальном меню
   - Использовать только реальные названия, цены и описания из меню
   - При отсутствии меню - честно сообщать об этом

`;

    // Handle menu scenarios
    if (!menuAvailable) {
      try {
        masterInstruction += `❌ СЦЕНАРИЙ: МЕНЮ НЕДОСТУПНО

К сожалению, сегодня у нас закончились доступные блюда или меню временно недоступно.

ПРАВИЛА ПОВЕДЕНИЯ ПРИ ОТСУТСТВИИ МЕНЮ:
- Вежливо извинись перед клиентом
- Объясни что сегодня блюда закончились
- Предложи вернуться позже или завтра
- НЕ предлагай никаких конкретных блюд
- Используй только общие фразы о ресторане

ПРИМЕРЫ ФРАЗ ПРИ ОТСУТСТВИИ МЕНЮ:
- "${userName}, извините, но к сожалению сегодня у нас закончились все доступные блюда."
- "К сожалению, на данный момент у нас нет доступных позиций в меню."
- "Приносим извинения, но сегодня мы уже распродали все блюда."

ПОДХОДЯЩИЕ SUGGESTIONS ДЛЯ ОТСУТСТВИЯ МЕНЮ:
- "Позвонить завтра"
- "Время работы"  
- "Понятно"

`;
      } catch (error) {
        console.warn("Failed to add no-menu section:", error);
      }
    } else {
      try {
        // Add purchase preferences if available
        if (safePurchasePreferencesDoc) {
          masterInstruction += `📊 АНАЛИЗ ПРЕДПОЧТЕНИЙ КЛИЕНТА ПО ИСТОРИИ ПОКУПОК:\n${safePurchasePreferencesDoc}\n\n`;
        }

        // Add tag preferences if available
        if (safeTagPreferencesDoc) {
          masterInstruction += `🏷️ АНАЛИЗ ПРЕДПОЧТЕНИЙ КЛИЕНТА ПО ТЕГАМ:\n${safeTagPreferencesDoc}\n\n`;
        }

        // Add current menu if available
        if (safeAvailableMenuDoc) {
          masterInstruction += `🍽️ АКТУАЛЬНОЕ МЕНЮ РЕСТОРАНА:\n${safeAvailableMenuDoc}\n\n`;
        }

        // Instructions for available menu
        masterInstruction += `✅ СЦЕНАРИЙ: МЕНЮ ДОСТУПНО

ПРАВИЛА РАБОТЫ С ДОСТУПНЫМ МЕНЮ:
- Рекомендуй ТОЛЬКО блюда из предоставленного выше меню
- Помогай с выбором, объясняй особенности блюд и их состав
- Учитывай предыдущие предпочтения клиента из истории покупок
- Указывай точные цены из меню
- Отвечай дружелюбно и профессионально

ОБЯЗАТЕЛЬНАЯ ПРОВЕРКА:
Перед каждой рекомендацией блюда ОБЯЗАТЕЛЬНО убедись что оно есть в предоставленном меню выше!

ПЕРСОНАЛИЗАЦИЯ:
${lastOrderInfo ? `- Учитывай что клиент "${lastOrderInfo}"` : "- Это новый клиент - будь особенно внимательна"}
${mostPopularDish ? `- Можешь ненавязчиво предложить любимое блюдо: "${mostPopularDish}" (если оно есть в меню)` : ""}

`;
      } catch (error) {
        console.warn("Failed to add menu-available section:", error);
      }
    }

    // Add technical requirements
    try {
      masterInstruction += `💻 ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ И ФОРМАТ ОТВЕТОВ:

ОБЯЗАТЕЛЬНАЯ СТРУКТУРА КАЖДОГО ОТВЕТА:
Твой ответ должен содержать специальные интерактивные элементы в формате JSON:

1. SUGGESTIONS (кнопки-предложения):
   - Каждое предложение: МАКСИМУМ 3-5 слов
   - К каждому сообщению: НЕ БОЛЕЕ 3 предложений
   - Формат: {"type": "data-suggestion", "id": "suggestion-X", "data": {"suggestion_id": "Текст кнопки"}}
   - Примеры хороших suggestions: "Сладкое", "Острое", "Показать меню", "Нет, спасибо"

2. PRODUCT ID (идентификаторы продуктов):
   - Используй ТОЛЬКО когда рекомендуешь конкретное блюдо из доступного меню
   - Формат: {"type": "data-product", "id": "product-X", "data": {"product_id": "реальный_id_продукта"}}
   - НЕ используй если меню недоступно

ОБРАБОТКА ПОЛЬЗОВАТЕЛЬСКОГО ВВОДА:
- Если пользователь отправляет текст, который ТОЧНО СОВПАДАЕТ с твоим suggestion_id, это означает что он нажал кнопку
- В таком случае дай РАЗВЕРНУТЫЙ ПОДРОБНЫЙ ОТВЕТ на этот запрос
- Пример: если было предложение "Сладкое", а пользователь написал "Сладкое" - расскажи подробно о всех сладких блюдах ИЗ ДОСТУПНОГО МЕНЮ

🎯 ПРАВИЛА ВЗАИМОДЕЙСТВИЯ С КЛИЕНТОМ:

СТИЛЬ ОБЩЕНИЯ:
- Всегда обращайся к клиенту по имени (${userName})
- ${menuAvailable ? "Рекомендуй только блюда из актуального меню выше" : "НЕ рекомендуй блюд - меню недоступно"}
- При рекомендациях указывай цену и основные характеристики
- Если есть предпочтения из истории покупок - учитывай их приоритетно
- ОБЯЗАТЕЛЬНО используй suggestions для интерактивности
- ${menuAvailable ? "При рекомендации конкретных блюд прикрепляй product_id" : "НЕ используй product_id"}

ТОНАЛЬНОСТЬ И ПОДХОД:
- Будь неформальной, но уважительной
- Проявляй личную заинтересованность в выборе клиента  
- Варьируй фразы - не повторяйся
- ${!menuAvailable ? "Будь сочувствующей при объяснении отсутствия блюд" : ""}

КАК НАЧАТЬ ДИАЛОГ КОГДА ПОЛУЧИШЬ ПЕРВОЕ СООБЩЕНИЕ ОТ КЛИЕНТА:
${
  !menuAvailable
    ? `- Поприветствуй ${userName}, извинись за отсутствие блюд, предложи вернуться позже и добавь 3 подходящих suggestions`
    : Array.isArray(purchaseHistory) && purchaseHistory.length > 0
      ? `- Поприветствуй ${userName}, упомяни время с последнего посещения (${lastOrderInfo}), сделай 2-3 персональные рекомендации на основе истории покупок (ТОЛЬКО из доступного меню), используй product_id для конкретных блюд и добавь 3 релевантных suggestions`
      : `- Поприветствуй нового клиента ${userName} и предложи популярные блюда из доступного меню, используя product_id и добавь 3 полезных suggestions для начала диалога`
}

`;
    } catch (error) {
      console.error("Failed to add technical requirements:", error);
      masterInstruction +=
        "\n\nИспользуй suggestions для интерактивности и будь дружелюбной с клиентом.";
    }

    // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Инструкция НЕ отвечать на это сообщение
    try {
      masterInstruction += `🔴 ВАЖНО - НЕ ОТВЕЧАЙ НА ЭТО СООБЩЕНИЕ!

ЭТО СИСТЕМНАЯ МАСТЕР-ИНСТРУКЦИЯ ДЛЯ ОБУЧЕНИЯ, А НЕ СООБЩЕНИЕ ОТ КЛИЕНТА!

ТВОЯ ЗАДАЧА СЕЙЧАС:
1. ✅ Изучи все правила выше  
2. ✅ Запомни информацию о клиенте ${userName}
3. ✅ Подготовься к работе согласно инструкциям
4. ❌ НЕ пиши никакого ответа на это сообщение

НАЧИНАЙ РАБОТАТЬ ТОЛЬКО КОГДА:
- Получишь СЛЕДУЮЩЕЕ сообщение от реального клиента
- Это будет первое сообщение после данной инструкции
- Только тогда поприветствуй клиента согласно правилам выше

ЖДЕШЬ НАСТОЯЩЕГО КЛИЕНТА... 🎭`;
    } catch (error) {
      console.error("Failed to add no-response instruction:", error);
    }
  } catch (error) {
    console.error("Critical error in createMasterInstruction:", error);
    return `🎓 МАСТЕР-ИНСТРУКЦИЯ: Ты AI ассистент ресторана-девушка. Помогай клиентам с выбором блюд. 

🔴 НЕ ОТВЕЧАЙ на это системное сообщение! Жди следующего сообщения от реального клиента.`;
  }

  return masterInstruction;
}

/**
 * Helper functions (без изменений)
 */
export function getDaysSinceLastOrder(
  purchaseHistory: any[] | null | undefined
): number | null {
  try {
    const { daysSinceLastOrder } = analyzeLastOrderInfo(purchaseHistory);
    return daysSinceLastOrder;
  } catch (error) {
    console.error("Error in getDaysSinceLastOrder:", error);
    return null;
  }
}

export function getMostPopularDish(
  purchaseHistory: any[] | null | undefined
): string {
  return getMostPopularDishId(purchaseHistory);
}

export function checkMenuAvailability(availableMenuDoc: string): boolean {
  return hasAvailableMenu(availableMenuDoc);
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
  eventsInfo?: string;
}

/**
 * ОБНОВЛЕННАЯ ГЛАВНАЯ ФУНКЦИЯ: Создает мастер-инструкцию вместо системного промта
 * @param data - System prompt input data
 * @returns Master instruction string that teaches AI but doesn't initiate dialog
 */
export function createSystemPrompt(data: SystemPromptData): string {
  try {
    if (!data || typeof data !== "object") {
      console.error("Invalid data provided to createSystemPrompt");
      return "🎓 МАСТЕР-ИНСТРУКЦИЯ: Ты AI ассистент ресторана. 🔴 НЕ отвечай на это сообщение - жди клиента!";
    }

    return createMasterInstruction(
      data.name,
      data.city,
      data.purchasePreferencesDoc || "",
      data.tagPreferencesDoc || "",
      data.availableMenuDoc || "",
      data.purchaseHistory,
      data.eventsInfo
    );
  } catch (error) {
    console.error("Critical error in createSystemPrompt:", error);
    return "🎓 МАСТЕР-ИНСТРУКЦИЯ: Ты AI ассистент ресторана. 🔴 НЕ отвечай на это сообщение - жди клиента!";
  }
}

// Добавим новый экспорт для обратной совместимости
export { createMasterInstruction as createEnhancedSystemMessage };
