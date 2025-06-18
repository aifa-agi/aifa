// @right/(_public)/(_footer)/(_PRIVACY-POLICY-FRACTAL)/privacy-policy/layout.tsx
import { Metadata } from "next";
import { LanguageProvider } from "./(_service)/(_contexts)/language-context";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy - How we collect, use, and protect your personal information",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
