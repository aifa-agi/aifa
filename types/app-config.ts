// types/app-config.ts
export interface AppConfig {
  name: string;
  short_name: string;
  description: string;
  url: string;
  ogImage: string;
  manifest: string;
  mailSupport: string;
  lang: string;

  illustrations: {
    loading: {
      dark: string;
      light: string;
    };
  };

  logo: string;

  messages?: {
    loading?: {
      title?: string;
      subtitle?: string;
    };
  };
}
