"use client";

import { InteractiveSection } from "@/components/shared/interactive-section";
import { useTranslation } from "../(_libs)/translation";
import { useAppContext } from "@/contexts/app-context";
import { useRightSidebar } from "@/contexts/right-sidebar-context";
import { useInteractiveSections } from "@/hooks/useInteractiveSections";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const { setInteractionContext } = useAppContext();
  const { isOpen, closeDrawer } = useRightSidebar();

  const {
    sendModeSectionId,
    setSendModeSectionId,
    hoveredSectionId,
    setHoveredSectionId,
    isMobile,
  } = useInteractiveSections();

  const pageName = t("Privacy Policy");

  const handleSendClick = (sectionId: string) => {
    setInteractionContext(pageName, sectionId);
    if (isMobile && isOpen) {
      closeDrawer();
    }
    setTimeout(() => setSendModeSectionId(null), 500);
  };

  return (
    <div className="w-full md:p-8">
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-8">
        {pageName}
      </h1>

      <InteractiveSection
        id="info-collect"
        isSendMode={sendModeSectionId === "info-collect"}
        isHovered={hoveredSectionId === "info-collect"}
        isMobile={isMobile}
        onHover={setHoveredSectionId}
        onActivate={setSendModeSectionId}
        onSend={handleSendClick}
      >
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Information We Collect")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "We collect information you provide directly to us, such as when you create an account, use our services, or contact us."
          )}
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            {t("Personal information (name, email address, phone number)")}
          </li>
          <li>{t("Usage data and analytics")}</li>
          <li>{t("Cookies and similar tracking technologies")}</li>
        </ul>
      </InteractiveSection>

      <InteractiveSection
        id="info-use"
        isSendMode={sendModeSectionId === "info-use"}
        isHovered={hoveredSectionId === "info-use"}
        isMobile={isMobile}
        onHover={setHoveredSectionId}
        onActivate={setSendModeSectionId}
        onSend={handleSendClick}
      >
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
      </InteractiveSection>

      <InteractiveSection
        id="data-protection"
        isSendMode={sendModeSectionId === "data-protection"}
        isHovered={hoveredSectionId === "data-protection"}
        isMobile={isMobile}
        onHover={setHoveredSectionId}
        onActivate={setSendModeSectionId}
        onSend={handleSendClick}
      >
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Data Protection")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
          )}
        </p>
      </InteractiveSection>

      <InteractiveSection
        id="cookies-tracking"
        isSendMode={sendModeSectionId === "cookies-tracking"}
        isHovered={hoveredSectionId === "cookies-tracking"}
        isMobile={isMobile}
        onHover={setHoveredSectionId}
        onActivate={setSendModeSectionId}
        onSend={handleSendClick}
      >
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Cookies and Tracking")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content."
          )}
        </p>
      </InteractiveSection>

      <InteractiveSection
        id="third-party-services"
        isSendMode={sendModeSectionId === "third-party-services"}
        isHovered={hoveredSectionId === "third-party-services"}
        isMobile={isMobile}
        onHover={setHoveredSectionId}
        onActivate={setSendModeSectionId}
        onSend={handleSendClick}
      >
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Third-Party Services")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "We may share your information with trusted third-party service providers who assist us in operating our services, subject to confidentiality agreements."
          )}
        </p>
      </InteractiveSection>

      <InteractiveSection
        id="your-rights"
        isSendMode={sendModeSectionId === "your-rights"}
        isHovered={hoveredSectionId === "your-rights"}
        isMobile={isMobile}
        onHover={setHoveredSectionId}
        onActivate={setSendModeSectionId}
        onSend={handleSendClick}
      >
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
      </InteractiveSection>

      <InteractiveSection
        id="contact-us"
        isSendMode={sendModeSectionId === "contact-us"}
        isHovered={hoveredSectionId === "contact-us"}
        isMobile={isMobile}
        onHover={setHoveredSectionId}
        onActivate={setSendModeSectionId}
        onSend={handleSendClick}
      >
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Contact Us")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "If you have any questions about this Privacy Policy, please contact us at privacy@yourdomain.com"
          )}
        </p>
      </InteractiveSection>

      <InteractiveSection
        id="changes-to-policy"
        isSendMode={sendModeSectionId === "changes-to-policy"}
        isHovered={hoveredSectionId === "changes-to-policy"}
        isMobile={isMobile}
        onHover={setHoveredSectionId}
        onActivate={setSendModeSectionId}
        onSend={handleSendClick}
      >
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
          {t("Changes to This Policy")}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page."
          )}
        </p>
      </InteractiveSection>

      <div className="mt-8 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          {t("Last updated: December 2024")}
        </p>
      </div>
    </div>
  );
}
