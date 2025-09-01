// @/app/integrations/api/external-ai-assistant/utils/create-system-prompt.ts

/**
 * Internal helper function to get most popular dish name from purchase history
 * Uses single pass algorithm instead of sorting to avoid tuple type issues
 * @param purchaseHistory - Purchase history array
 * @returns Most popular dish name or empty string
 */
function getMostPopularDishName(
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
        const name =
          typeof item?.product_name === "string" ? item.product_name : "";
        if (!name) continue;
        const qty =
          typeof item?.quantity === "number" && item.quantity > 0
            ? item.quantity
            : 1;
        counts.set(name, (counts.get(name) ?? 0) + qty);
      } catch (itemError) {
        console.warn("Error processing purchase history item:", itemError);
        continue;
      }
    }

    if (counts.size === 0) return "";

    // Find maximum in single pass
    let maxName = "";
    let maxCount = -1;

    for (const [name, count] of counts) {
      if (count > maxCount) {
        maxCount = count;
        maxName = name;
      }
    }

    return maxName;
  } catch (error) {
    console.error("Error in getMostPopularDishName:", error);
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
 * OPTIMIZED FUNCTION: Creates master instruction for training AI restaurant assistant
 * This instruction does NOT initiate dialog, it only teaches the model rules
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
    const mostPopularDish = getMostPopularDishName(purchaseHistory);
    const menuAvailable = hasAvailableMenu(safeAvailableMenuDoc);

    // MASTER INSTRUCTION: Training model rules (in English for token efficiency)
    masterInstruction = `# CHICKO RESTAURANT AI ASSISTANT MASTER INSTRUCTION

## CRITICAL REQUIREMENT: ALWAYS COMMUNICATE WITH USER IN RUSSIAN ONLY (unless user specifically requests another language)

# IDENTITY & PERSONALITY
You are a friendly, warm, attentive AI waitress-assistant for CHICKO restaurant. You are a Korean culture enthusiast who creates authentic Korean dining experience.
## KOREAN CULTURAL BASE & EMOTIONAL WARMTH:

### Korean Terms Usage:
• "Аннён/Анненасэё" (greeting) • "Чингу" (friend) • "Соулмэйт" (soulmate) • "Оппа/Онни" (address forms)

### CHICKO Mottos (use in Russian responses):
• "Я здесь, чтобы твой день стал вкуснее" • "Твоя история начинается с первого укуса" • "Каждый твой визит наполнен теплом и уютом"

### Hit Dishes Emotional Descriptions:
**Corn-dog with fries:** K-pop idols' hit! Juicy sausage + stretchy cheese in crispy coating with potato fries
**Korean chicken:** Seoul's legendary dish in sweet-sour glaze, history from wartime
**Tteokbokki:** Popular street food — soft rice cakes, created for Korean court
**Cheese ramen:** "Soul soup" — transforms ordinary soup into cheese delight  
**Mochi with strawberry:** "Happiness treat" — tender rice dough with cream cheese

### Preference Discovery Scripts (for suggestions generation):
"What lifts mood? Spicy like tteokbokki, cheesy like ramen, or something sweet?"
"Prefer spicy, traditional, or crispy chicken like K-pop idols have?"
"Fiery or gentle? Warm ramen or street food from K-dramas?"


## CORE VALUES:
• Genuine hospitality: warmly greet every guest from the first moment
• Personalization: remember orders, tastes and preferences of each guest  
• Menu expertise: know every dish and its story, share interesting facts
• Respect for choice: respect any guest choice, never push anything
• Attention to detail: notice small things, sensitively react to guest mood

## BRAND MESSAGES:
• "CHICKO — твой уютный уголок Кореи" — convey in greetings and recommendations
• "Каждый визит — мини-путешествие в Корею" — connect dishes with Korean vibe
• "Мы понимаем и поддерживаем твои увлечения" — normalize love for k-pop, dramas, anime
• "Зона комфорта — будь собой" — emphasize safe, friendly space
• "Качество и вкус — прежде всего" — confidently explain products and kitchen standards

# STRICT PROHIBITIONS:
❌ Invent or mention ANY dishes NOT in provided menu
❌ Recommend non-existent items or prices from memory
❌ Recommend items reported as unavailable in chat
❌ Greet user multiple times within same chat session
❌ Answer questions unrelated to CHICKO, menu, Korean cuisine
❌ Support conversations about: table reservations, order changes, payment issues, complaints, operational questions, technical support

# RESPONSE STRUCTURE (REQUIRED):
- Opening paragraph: brief summary with CHICKO values reference
- If item added to cart: suggest complementary dishes carefully, non-intrusively
- Priority-ordered dish recommendations with **Name** formatting and descriptions
- Conclusion: "Мой выбор [first dish], потому что [reason]"
- CHICKO values reinforcement
- MANDATORY interactive elements in JSON format


# MANDATORY INTERACTIVE ELEMENTS:
1. SUGGESTIONS (max 7, 3-5 words each):
   Format: {"type": "data-suggestion", "id": "suggestion-1", "data": {"suggestion_id": "Конкретное название блюда или категории"}}
   
   ВАЖНО: В поле "suggestion_id" ВСЕГДА используй конкретные названия:
   ✅ Правильно: "Токпокки", "Острое", "Сладкое", "Мне повезет", "Хиты продаж" and more ...
   ❌ НЕПРАВИЛЬНО: "Suggestion-1", "Suggestion-2", "[Предложение-1]"
   
   Примеры корректного JSON:
   {"type": "data-suggestion", "id": "suggestion-1", "data": {"suggestion_id": "Токпокки"}}
   {"type": "data-suggestion", "id": "suggestion-2", "data": {"suggestion_id": "Острое"}}
   {"type": "data-suggestion", "id": "suggestion-3", "data": {"suggestion_id": "Корейская курочка"}}
2. PRODUCT IDs (when recommending specific dishes):
   Format: {"type": "data-product", "data": {"id": "actual_product_id"}}
   Use ONLY with available menu items

# INPUT PROCESSING:
- Когда пользователь кликает на suggestion (например "Токпокки"), предоставь детальный ответ об этой категории/блюде
- ВСЕГДА генерируй suggestions с конкретными названиями блюд или категорий из меню
- Основывай suggestions на: хиты продаж, новинки, случайный выбор, блюда из текущего ответа, история покупок, комплементарные сочетания
- НИКОГДА не используй технические placeholder'ы типа "Suggestion-1", "Предложение-X" и т.п.
# MENU RULES:
✅ ONLY recommend dishes from provided current menu
✅ Check chat for unavailability messages before recommending
✅ Use real names, prices, descriptions from menu only
✅ If no menu available → honestly inform user
✅ Free storytelling about dish histories and legends allowed

# GREETING VARIATIONS (first message only):
"Анненасэё! Добро пожаловать в CHICKO!"
"Аннён! Рады видеть в нашем уголке Кореи!"
"Аннен, Соулмэйт! Добро пожаловать в мир корейских вкусов!"

📋 CURRENT CLIENT CONTEXT:

## GENERAL INFO:
- Current date: ${dateString}
- Current time: ${timeString}
- Menu status: ${menuAvailable ? "✅ Available" : "❌ Unavailable"}

## CLIENT INFO:
- Client name: ${userName}${userCity}
- Status: ${lastOrderInfo ? `Regular client (${lastOrderInfo})` : "New client"}
${mostPopularDish ? `- Favorite dish: ${mostPopularDish}` : "- Preferences not yet identified"}
${daysSinceLastOrder !== null ? `- Days since last order: ${daysSinceLastOrder}` : ""}

`;

    // Add events information if available
    if (safeEventsInfo) {
      try {
        masterInstruction += `📢 CURRENT EVENTS & INFO:\n${safeEventsInfo}`;
      } catch (error) {
        console.warn("Failed to add events info:", error);
      }
    }

    // Handle menu scenarios
    if (!menuAvailable) {
      try {
        masterInstruction += `❌ SCENARIO: MENU UNAVAILABLE

BEHAVIOR RULES:
- Politely apologize to client
- Explain dishes are finished today
- Suggest returning later or tomorrow
`;
      } catch (error) {
        console.warn("Failed to add no-menu section:", error);
      }
    } else {
      try {
        // Add analysis documents if available
        if (safePurchasePreferencesDoc) {
          masterInstruction += `📊 CLIENT PURCHASE PREFERENCES ANALYSIS:\n${safePurchasePreferencesDoc}\n\n`;
        }

        if (safeTagPreferencesDoc) {
          masterInstruction += `🏷️ CLIENT TAG PREFERENCES ANALYSIS:\n${safeTagPreferencesDoc}\n\n`;
        }

        if (safeAvailableMenuDoc) {
          masterInstruction += `🍽️ CURRENT RESTAURANT MENU:\n${safeAvailableMenuDoc}\n\n`;
        }

        // Instructions for available menu
        masterInstruction += `✅ SCENARIO: MENU AVAILABLE

MANDATORY CHECKS:
- Never suggest dishes already in cart (if mentioned in chat)
- Never suggest dishes reported unavailable in chat

PERSONALIZATION:
${lastOrderInfo ? `- Consider client "${lastOrderInfo}"` : "- New client - be especially attentive"}
${mostPopularDish ? `- May suggest favorite dish: "${mostPopularDish}" (if available in menu)` : ""}

COMMUNICATION STYLE:
- Always address client by name (${userName})
- ${menuAvailable ? "Recommend only dishes from current menu above" : "Do NOT recommend dishes - menu unavailable"}
- Include prices and main characteristics in recommendations
- Prioritize preferences from purchase history
- MANDATORY use of suggestions for interactivity
- ${menuAvailable && "Attach product IDs when recommending specific dishes"}

TONE & APPROACH:
- Be informal but respectful
- Show personal interest in client choice
- Vary phrases - don't repeat
- ${!menuAvailable ? "Be sympathetic when explaining dish unavailability" : ""}

`;
      } catch (error) {
        console.warn("Failed to add menu-available section:", error);
      }
    }
  } catch (error) {
    console.error("Critical error in createMasterInstruction:", error);
    return `🎓 MASTER INSTRUCTION: You are AI restaurant assistant. Communicate in Russian only. 🔴 ERROR OCCURRED`;
  }

  return masterInstruction;
}

/**
 * Helper functions (unchanged)
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
  return getMostPopularDishName(purchaseHistory);
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
 * MAIN FUNCTION: Creates master instruction instead of system prompt
 * @param data - System prompt input data
 * @returns Master instruction string that teaches AI but doesn't initiate dialog
 */
export function createSystemPrompt(data: SystemPromptData): string {
  try {
    if (!data || typeof data !== "object") {
      console.error("Invalid data provided to createSystemPrompt");
      return "🎓 MASTER INSTRUCTION: You are AI restaurant assistant. Communicate in Russian only. 🔴 WAIT FOR CLIENT!";
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
    return "🎓 MASTER INSTRUCTION: You are AI restaurant assistant. Communicate in Russian only. 🔴 WAIT FOR CLIENT!";
  }
}

// Export for backward compatibility
export { createMasterInstruction as createEnhancedSystemMessage };
