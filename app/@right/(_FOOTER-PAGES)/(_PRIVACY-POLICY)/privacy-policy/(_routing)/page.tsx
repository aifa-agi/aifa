// @right/(_public)/(_footer)/(_PRIVACY-POLICY-FRACTAL)/privacy-policy/(_routing)/page.tsx


import { Metadata } from "next";
import PrivacyPolicy from "../(_service)/(_components)/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy - How we collect, use, and protect your personal information",
};
export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
