"use client";

import React, { createRef, useEffect, useRef } from "react";
import { InteractiveSection } from "@/components/shared/interactive-section";
import { useTranslation } from "../(_libs)/translation";
import { useAppContext } from "@/contexts/app-context";
import { useRightSidebar } from "@/contexts/right-sidebar-context";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useInteractiveSections } from "@/app/@right/(_service)/hooks/useInteractiveSections";

interface SectionData {
  id: string;
  titleKey: string;
  contentKeys: string[];
  listItems?: string[];
}

const sectionsData: SectionData[] = [
  {
    id: "info-collect",
    titleKey: "Information We Collect",
    contentKeys: [
      "We collect information you provide directly to us, such as when you create an account, use our services, or contact us.",
    ],
    listItems: [
      "Personal information (name, email address, phone number)",
      "Usage data and analytics",
      "Cookies and similar tracking technologies",
    ],
  },
  {
    id: "info-use",
    titleKey: "How We Use Your Information",
    contentKeys: [
      "We use the information we collect to provide, maintain, and improve our services.",
    ],
    listItems: [
      "Provide and deliver our services",
      "Communicate with you about our services",
      "Improve and develop new features",
    ],
  },
  {
    id: "data-protection",
    titleKey: "Data Protection",
    contentKeys: [
      "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
    ],
  },
  {
    id: "cookies-tracking",
    titleKey: "Cookies and Tracking",
    contentKeys: [
      "We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content.",
    ],
  },
  {
    id: "third-party-services",
    titleKey: "Third-Party Services",
    contentKeys: [
      "We may share your information with trusted third-party service providers who assist us in operating our services, subject to confidentiality agreements.",
    ],
  },
  {
    id: "your-rights",
    titleKey: "Your Rights",
    contentKeys: [
      "You have certain rights regarding your personal information:",
    ],
    listItems: [
      "Access and review your personal information",
      "Correct inaccurate information",
      "Request deletion of your personal information",
    ],
  },
  {
    id: "contact-us",
    titleKey: "Contact Us",
    contentKeys: [
      "If you have any questions about this Privacy Policy, please contact us at privacy@yourdomain.com",
    ],
  },
  {
    id: "changes-to-policy",
    titleKey: "Changes to This Policy",
    contentKeys: [
      "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.",
    ],
  },
];

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const router = useRouter();
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

  const sectionRefs = useRef<
    Record<string, React.RefObject<HTMLElement | null>>
  >(
    sectionsData.reduce(
      (acc, section) => {
        acc[section.id] = createRef<HTMLElement>();
        return acc;
      },
      {} as Record<string, React.RefObject<HTMLElement | null>>
    )
  );

  const searchParams = useSearchParams();
  const scrollTo = searchParams.get("scroll-to");

  useEffect(() => {
    if (!scrollTo) return;

    const ref = sectionRefs.current[scrollTo];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setSendModeSectionId(scrollTo);

      const timer = setTimeout(() => {
        setSendModeSectionId(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("scroll-to");
        router.replace(url.pathname + url.search, { scroll: false });
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [scrollTo, setSendModeSectionId, router]);

  const handleSendClick = (sectionId: string) => {
    setInteractionContext(pageName, sectionId);
    if (isMobile && isOpen) {
      closeDrawer();
    }
    setTimeout(() => setSendModeSectionId(null), 1000);
  };

  return (
    <div className="w-full">
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-8">
        {pageName}
      </h1>
      <div className="flex gap-4 mb-6 flex-wrap">
        {sectionsData
          .filter(({ id }) =>
            ["info-collect", "info-use", "your-rights"].includes(id)
          )
          .map(({ id }) => (
            <Button
              key={id}
              onClick={() =>
                router.push(`/privacy-policy?scroll-to=${id}`, {
                  scroll: false,
                })
              }
            >
              {id}
            </Button>
          ))}
      </div>
      {sectionsData.map(({ id, titleKey, contentKeys, listItems }) => (
        <InteractiveSection
          key={id}
          id={id}
          ref={sectionRefs.current[id]}
          isSendMode={sendModeSectionId === id}
          isHovered={hoveredSectionId === id}
          isMobile={isMobile}
          onHover={setHoveredSectionId}
          onActivate={setSendModeSectionId}
          onSend={handleSendClick}
        >
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 border-b pb-2 mb-4">
            {t(titleKey)}
          </h2>

          {contentKeys.map((contentKey, idx) => (
            <p key={idx} className="leading-7 [&:not(:first-child)]:mt-6">
              {t(contentKey)}
            </p>
          ))}

          {listItems && (
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              {listItems.map((itemKey, idx) => (
                <li key={idx}>{t(itemKey)}</li>
              ))}
            </ul>
          )}
        </InteractiveSection>
      ))}
      <div className="flex gap-4 mb-6 flex-wrap">
        {sectionsData
          .filter(({ id }) =>
            ["info-collect", "info-use", "your-rights"].includes(id)
          )
          .map(({ id }) => (
            <Button
              key={`bottom-${id}`}
              onClick={() =>
                router.push(`/privacy-policy?scroll-to=${id}`, {
                  scroll: false,
                })
              }
            >
              {id}
            </Button>
          ))}
      </div>

    </div>
  );
}
