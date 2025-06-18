// @/app/@right/(_public)/(_footer)/(_PRIVACY-POLICY)/privacy-policy/(_policy)/(_components)/privacy-policy.tsx
"use client";

import { useTranslation } from "../(_libs)/translation";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    // Main container for the page content, ensuring it takes full width within its parent.
    <div className="w-full">
      {/* 
        Page Title: 
        - Styled using shadcn/ui's standard for a main page heading.
        - `scroll-m-20` ensures proper scroll anchoring for in-page links.
        - `font-semibold` and `tracking-tight` are part of the shadcn/ui typography system.
      */}
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-8">
        {t("Privacy Policy")}
      </h1>

      {/* Each section is semantically separated for clarity and styling. */}
      <section>
        {/* 
          Section Heading:
          - Styled as a shadcn/ui h2/h3.
          - `mt-10` adds significant vertical space from the previous section.
          - `border-b pb-2` creates a visual separator, improving readability for long documents.
        */}
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Information We Collect")}
        </h2>
        {/* 
          Paragraph Text:
          - `leading-7` sets a comfortable line height for readability.
          - `[&:not(:first-child)]:mt-6` adds top margin to subsequent paragraphs.
        */}
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "We collect information you provide directly to us, such as when you create an account, use our services, or contact us."
          )}
        </p>
        {/* 
          Unordered List:
          - Styled using shadcn/ui's list preset.
          - `my-6 ml-6` provides vertical margin and left indentation.
          - `list-disc` enables standard bullet points.
          - `[&>li]:mt-2` adds consistent spacing between list items.
        */}
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            {t("Personal information (name, email address, phone number)")}
          </li>
          <li>{t("Usage data and analytics")}</li>
          <li>{t("Cookies and similar tracking technologies")}</li>
        </ul>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("How We Use Your Information")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "We use the information we collect to provide, maintain, and improve our services."
          )}
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("Provide and deliver our services")}</li>
          <li>{t("Communicate with you about our services")}</li>
          <li>{t("Improve and develop new features")}</li>
        </ul>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Data Protection")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
          )}
        </p>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Cookies and Tracking")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content."
          )}
        </p>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Third-Party Services")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "We may share your information with trusted third-party service providers who assist us in operating our services, subject to confidentiality agreements."
          )}
        </p>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Your Rights")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("You have certain rights regarding your personal information:")}
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("Access and review your personal information")}</li>
          <li>{t("Correct inaccurate information")}</li>
          <li>{t("Request deletion of your personal information")}</li>
        </ul>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Contact Us")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "If you have any questions about this Privacy Policy, please contact us at privacy@yourdomain.com"
          )}
        </p>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Changes to This Policy")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page."
          )}
        </p>
      </section>

      {/* 
        Footer Text / Meta Information:
        - `mt-8 pt-4 border-t` creates a separator line from the main content.
        - `text-sm text-muted-foreground` styles the text to be less prominent, suitable for metadata.
      */}
      <div className="mt-8 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          {t("Last updated: December 2024")}
        </p>
      </div>
    </div>
  );
}
