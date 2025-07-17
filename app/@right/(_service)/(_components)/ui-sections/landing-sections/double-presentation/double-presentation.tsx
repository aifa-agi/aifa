"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import DoublePresentationDesktop from "./double-presentation-desktop";
import DoublePresentationMobile from "./double-presentation-mobile";

interface PresentationMeta {
  metaTitle: string;
  metaDescription: string;
}

interface PresentationItem {
  mediaUrl: string;
  title: string;
  description: string;
}

// DoublePresentation component props
interface DoublePresentationProps {
  metaData: PresentationMeta;
  leftItem: PresentationItem;
  rightItem: PresentationItem;
}

export default function DoublePresentation({
  metaData,
  leftItem,
  rightItem,
}: DoublePresentationProps) {
  const { isMobile } = useMediaQuery();

  if (isMobile === null) {
    return null;
  }
  const metaBlockClass = "text-center max-w-3xl flex flex-col items-center";
  const descriptionClass =
    "mb-12 max-w-xl text-base text-muted-foreground text-center";

  const desktopTitleClass =
    "mb-6 max-w-3xl font-serif font-bold leading-tight md:text-2xl lg:text-4xl";
  const desktopDescriptionClass =
    "mb-12 max-w-xl text-lg text-muted-foreground md:text-xl text-center";
  return isMobile ? (
    <section className="w-full  pt-20 ">
      <div className="container mx-auto px-4 flex flex-col items-center ">
        <div className={metaBlockClass}>
          <h2 className="text-xl font-bold  mb-4">{metaData.metaTitle}</h2>
          <p className={descriptionClass}>{metaData.metaDescription}</p>
        </div>

        <DoublePresentationMobile leftItem={leftItem} rightItem={rightItem} />
      </div>
    </section>
  ) : (
    <section className="w-full  pt-28">
      <div className="container mx-auto px-4 flex flex-col items-center gap-12">
        <div className={metaBlockClass}>
          <h2 className={desktopTitleClass}>{metaData.metaTitle}</h2>
          <p className={desktopDescriptionClass}>{metaData.metaDescription}</p>
        </div>
        <DoublePresentationDesktop leftItem={leftItem} rightItem={rightItem} />
      </div>
    </section>
  );
}
