// @/config/visibility-config.ts

export type VisibilityConfigType = {
  private: {
    label: string;
    description: string;
  };
  public: {
    label: string;
    description: string;
  };
};

export const visibilityConfig: VisibilityConfigType = {
  private: {
    label: "Приватный",
    description: "Только вы можете получить доступ к этому чату",
  },
  public: {
    label: "Публичный",
    description:
      "Любой, у кого есть ссылка, может получить доступ к этому чату",
  },
};

export const visibilityConfigEn: VisibilityConfigType = {
  private: {
    label: "Private",
    description: "Only you can access this chat",
  },
  public: {
    label: "Public",
    description: "Anyone with the link can access this chat",
  },
};

// Функция для получения конфига по языку
export const getVisibilityConfig = (
  locale: string = "en"
): VisibilityConfigType => {
  switch (locale) {
    case "ru":
      return visibilityConfig;
    case "en":
    default:
      return visibilityConfigEn;
  }
};
