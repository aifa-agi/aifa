// @/app/@right/(_service)/(_components)/page-transformer-components/custom-sections/custom-double-prsentation.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "../../../hooks/use-media-query";

interface PresentationMeta {
  metaTitle: string;
  metaDescription: string;
}

interface PresentationItem {
  mediaUrl: string;
  title: string;
  description: string;
}

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

  // Desktop animation state
  const [activeContainer, setActiveContainer] = useState<"left" | "right">(
    "left"
  );
  const [sliderKey, setSliderKey] = useState(0);

  // Desktop auto-switching effect
  useEffect(() => {
    // Only run animation cycle on desktop
    if (isMobile) return;

    let sliderTimer: NodeJS.Timeout;
    let transitionTimer: NodeJS.Timeout;

    const startAnimationCycle = () => {
      setSliderKey((prev) => prev + 1);
      sliderTimer = setTimeout(() => {
        setActiveContainer((prev) => (prev === "left" ? "right" : "left"));
        transitionTimer = setTimeout(() => {
          startAnimationCycle();
        }, 500);
      }, 9000);
    };

    startAnimationCycle();

    return () => {
      clearTimeout(sliderTimer);
      clearTimeout(transitionTimer);
    };
  }, [isMobile]);

  // Return null while determining screen size
  if (isMobile === null) {
    return null;
  }

  // Common CSS classes
  const metaBlockClass = "text-center max-w-3xl flex flex-col items-center";
  const descriptionClass =
    "mb-12 max-w-xl text-base text-muted-foreground text-center";
  const desktopTitleClass =
    "mb-6 max-w-3xl font-serif font-bold leading-tight md:text-2xl lg:text-4xl";
  const desktopDescriptionClass =
    "mb-12 max-w-xl text-lg text-muted-foreground md:text-xl text-center";

  // Mobile card renderer
  const renderMobileCard = (item: PresentationItem) => (
    <div className="relative flex flex-col rounded-xl bg-gray-900 text-white shadow-lg mb-6 overflow-hidden">
      <div className="w-full relative" style={{ paddingTop: "56.25%" }}>
        <Image
          src={item.mediaUrl}
          alt={item.title}
          fill
          className="object-cover rounded-t-xl"
          sizes="100vw"
          priority
        />
      </div>
      <div className="flex flex-col p-4">
        <h2 className="text-xl font-bold mb-2">{item.title}</h2>
        <p className="text-gray-300 mb-2 text-base min-h-16">
          {item.description}
        </p>
      </div>
    </div>
  );

  // Desktop card renderer
  const renderDesktopCard = (item: PresentationItem, isActive: boolean) => (
    <motion.div
      layout
      animate={{ flex: isActive ? "7 1 0%" : "3 1 0%" }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col rounded-lg overflow-hidden bg-transparent text-white p-0 shadow-lg h-[30rem] flex-shrink-0"
    >
      <div className="relative w-full h-60 mb-4 rounded-xl overflow-hidden border-4 border-gray-700">
        <Image
          src={item.mediaUrl}
          alt={item.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col pt-6">
        <h2 className="text-2xl font-bold mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
          {item.title}
        </h2>
        <div className="relative w-full h-px bg-gray-700 mb-4">
          <motion.div
            key={`slider-${item.title}-${sliderKey}`}
            className={cn(
              "absolute top-0 left-0 h-full",
              isActive ? "bg-primary" : "bg-gray-700"
            )}
            initial={{ width: 0 }}
            animate={{ width: isActive ? "100%" : "0%" }}
            transition={
              isActive ? { duration: 9, ease: "linear" } : { duration: 0 }
            }
          />
        </div>
        <p className="text-gray-300 mb-4 text-sm line-clamp-4 min-h-[4rem]">
          {item.description}
        </p>
      </div>
    </motion.div>
  );

  // Mobile layout
  if (isMobile) {
    return (
      <section className="w-full pt-20">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className={metaBlockClass}>
            <h2 className="text-xl font-bold mb-4">{metaData.metaTitle}</h2>
            <p className={descriptionClass}>{metaData.metaDescription}</p>
          </div>

          <div className="w-full flex flex-col">
            {renderMobileCard(leftItem)}
            {renderMobileCard(rightItem)}
          </div>
        </div>
      </section>
    );
  }

  // Desktop layout
  return (
    <section className="w-full pt-28">
      <div className="container mx-auto px-4 flex flex-col items-center gap-12">
        <div className={metaBlockClass}>
          <h2 className={desktopTitleClass}>{metaData.metaTitle}</h2>
          <p className={desktopDescriptionClass}>{metaData.metaDescription}</p>
        </div>

        <div className="flex gap-6 w-full max-w-6xl">
          {renderDesktopCard(leftItem, activeContainer === "left")}
          {renderDesktopCard(rightItem, activeContainer === "right")}
        </div>
      </div>
    </section>
  );
}
