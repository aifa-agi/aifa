// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/layout.tsx
import { LanguageProvider } from "./(_service)/(_contexts)/language-context";
import { validateTranslations } from "./(_service)/(_libs)/validate-translations";

export default function Layout({ children }: { children: React.ReactNode }) {
  validateTranslations();
  return <LanguageProvider>{children}</LanguageProvider>;
}
