"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PresentationItem {
  mediaUrl: string;
  title: string;
  description: string;
}

interface DoublePresentationProps {
  leftItem: PresentationItem;
  rightItem: PresentationItem;
}

export default function DoublePresentationDesktop({
  leftItem,
  rightItem,
}: DoublePresentationProps) {
  // Активная карточка: "left" или "right"
  const [activeContainer, setActiveContainer] = useState<"left" | "right">(
    "left"
  );
  // Ключ для update прогресс-бара
  const [sliderKey, setSliderKey] = useState(0);

  // Эффект автопереключения карточек
  useEffect(() => {
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
  }, []);

  // Общие CSS классы карточки
  const commonCardClasses =
    "relative flex flex-col rounded-lg overflow-hidden bg-transparent text-white p-0 shadow-lg h-[30rem] flex-shrink-0";

  // Функция рендера карточки
  const renderCard = (item: PresentationItem, isActive: boolean) => (
    <motion.div
      layout
      animate={{ flex: isActive ? "7 1 0%" : "3 1 0%" }}
      transition={{ duration: 0.5 }}
      className={cn(commonCardClasses)}
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

  return (
    <div className="flex gap-6 w-full max-w-6xl">
      {renderCard(leftItem, activeContainer === "left")}
      {renderCard(rightItem, activeContainer === "right")}
    </div>
  );
}
