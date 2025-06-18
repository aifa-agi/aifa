// @right/(_public)/(_TERMS-OF-SERVICE-FRACTAL)/terms-of-service/(_routing)/page.tsx

import TermsOfService from "../(_service)/(_components)/terms-of-service";
import { LanguageProvider } from "../(_service)/(_contexts)/language-context";

export default function TermsOfServicePage() {
  return (
    <LanguageProvider>
      <TermsOfService />;
    </LanguageProvider>
  );
}
