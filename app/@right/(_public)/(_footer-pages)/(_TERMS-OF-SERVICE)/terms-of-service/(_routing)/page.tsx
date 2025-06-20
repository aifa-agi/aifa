// @right/(_public)/(_TERMS-OF-SERVICE-FRACTAL)/terms-of-service/(_routing)/page.tsx

import { Metadata } from "next";
import TermsOfService from "../(_service)/(_components)/terms-of-service";
export const metadata: Metadata = {
  title: "Terms Of Service",
  description:
    "Review the Terms of Service for YourAppName. Learn how we collect, use, and protect your personal information, as well as your rights and responsibilities when using our platform.",
};
export default function TermsOfServicePage() {
  return <TermsOfService />;
}
