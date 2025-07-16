// @/app/@right/(_public)/(_footer)/(_TERMS-OF-SERVICE)/terms-of-service/(_service)/(_components)/terms-of-service.tsx
"use client";

import { useTranslation } from "../(_libs)/translation";

export default function TermsOfServicePage() {
  const { t } = useTranslation();

  return (
    // The main container for the page content.
    <div className="w-full">
      {/* 
        Page Title: 
        - Styled according to shadcn/ui's 'h2' typography preset for a prominent but not overly large heading.
        - `scroll-m-20` ensures proper scroll anchoring.
        - `tracking-tight` improves letter spacing.
      */}
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-8">
        {t("title")}
      </h1>

      {/* Each section is semantically separated for clarity. */}
      <section>
        {/* 
          Section Heading:
          - Styled using shadcn/ui's 'h3' preset.
          - `mt-10` provides vertical space from the previous section.
          - `border-b` adds a bottom border for visual separation.
        */}
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("acceptance.title")}
        </h2>
        {/* 
          Paragraph Text:
          - Styled with shadcn/ui's standard paragraph classes.
          - `leading-7` sets a comfortable line height.
          - `[&:not(:first-child)]:mt-6` adds top margin to all paragraphs except the first one in a container.
        */}
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("acceptance.description")}
        </p>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("serviceDescription.title")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("serviceDescription.description")}
        </p>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("userAccounts.title")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("userAccounts.description")}
        </p>
        {/* 
          Unordered List:
          - Styled using shadcn/ui's list preset.
          - `my-6` provides vertical margin.
          - `ml-6` adds left indentation.
          - `list-disc` enables standard bullet points.
          - `[&>li]:mt-2` adds top margin to each list item.
        */}
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("userAccounts.accuracy")}</li>
          <li>{t("userAccounts.security")}</li>
          <li>{t("userAccounts.responsibility")}</li>
        </ul>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("userConduct.title")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("userConduct.description")}
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("userConduct.lawful")}</li>
          <li>{t("userConduct.respectful")}</li>
          <li>{t("userConduct.noHarm")}</li>
          <li>{t("userConduct.noSpam")}</li>
        </ul>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("intellectualProperty.title")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("intellectualProperty.description")}
        </p>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("paymentTerms.title")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("paymentTerms.description")}
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("paymentTerms.pricing")}</li>
          <li>{t("paymentTerms.billing")}</li>
          <li>{t("paymentTerms.refunds")}</li>
        </ul>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("termination.title")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("termination.description")}
        </p>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("disclaimers.title")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("disclaimers.description")}
        </p>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("limitation.title")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("limitation.description")}
        </p>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("changes.title")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("changes.description")}
        </p>
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("contact.title")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("contact.description")}
        </p>
      </section>

      {/* 
        Footer Text:
        - Styled using shadcn/ui's 'muted' text style for less emphasis.
        - `mt-8 pt-4 border-t` creates a separator line at the top.
      */}
      <div className="mt-8 pt-4 border-t">
        <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
      </div>
    </div>
  );
}
