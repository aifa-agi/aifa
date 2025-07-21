// @/app/@right/(_service)/(_components)/page-transformer-components/page-html-transformer.tsx

"use client";

import {
  PageConfig,
  Section,
  SectionConfig,
} from "../../(_types)/page-wrapper-types";
import { BodySection } from "./body-sections-components/body-section";
import { FooterSection } from "./footer-sections-components/footer-section";
import { HeaderSection } from "./header-sections-components/header-section";
import { useTheme } from "next-themes";
import { FullScreenWrapper } from "./wrappers/full-screen-wrapper";
import { Wrapper } from "./wrappers/wrapper";

interface PageHtmlTransformerProps {
  data: PageConfig;
}

function renderSectionContent(config: any) {
  return (
    <>
      {config.headerContent && (
        <HeaderSection headerContent={config.headerContent} />
      )}
      {config.bodyContent && (
        <BodySection type={config.type}>
          {config.bodyContent.content}
        </BodySection>
      )}
      {config.footerContent && (
        <FooterSection actions={config.footerContent.actions} />
      )}
    </>
  );
}

export function PageHtmlTransformer({ data }: PageHtmlTransformerProps) {
  const { theme } = useTheme();
  if (!data?.sections?.length) return null;

  return (
    <>
      {data.sections.map((section: Section, idx: number) => {
        switch (section.type) {
          case "hero-section": {
            const config = section as SectionConfig;
            return (
              <FullScreenWrapper
                key={config.id || idx}
                videoUrl={config.videoUrl}
                imageUrl={config.imageUrl}
                className={config.sectionClassName}
              >
                {renderSectionContent(config)}
              </FullScreenWrapper>
            );
          }
          // ...другие case без изменений
          default: {
            const config = section as any;
            return (
              <Wrapper
                key={config.id || idx}
                className={config.sectionClassName}
              >
                {renderSectionContent(config)}
              </Wrapper>
            );
          }
        }
      })}
    </>
  );
}
