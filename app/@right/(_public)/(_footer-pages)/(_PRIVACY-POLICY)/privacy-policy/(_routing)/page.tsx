// @right/(_public)/(_footer)/(_PRIVACY-POLICY-FRACTAL)/privacy-policy/(_routing)/page.tsx

import PrivacyPolicy from "../(_service)/(_components)/privacy-policy";
import { LanguageProvider } from "../(_service)/(_contexts)/language-context";

export default function PrivacyPolicyPage() {
  return (
    <LanguageProvider>
      <PrivacyPolicy />
    </LanguageProvider>
  );
}
