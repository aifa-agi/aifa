"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface PresentationItem {
  mediaUrl: string;
  title: string;
  description: string;
}

interface DoublePresentationMobileProps {
  leftItem: PresentationItem;
  rightItem: PresentationItem;
}

export default function DoublePresentationMobile({
  leftItem,
  rightItem,
}: DoublePresentationMobileProps) {
  // Общие CSS классы карточки
  const commonCardClasses =
    "relative flex flex-col rounded-xl bg-gray-900 text-white shadow-lg mb-6 overflow-hidden";

  const renderCard = (item: PresentationItem) => (
    <div className={cn(commonCardClasses)}>
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

  return (
    <div className="w-full flex flex-col">
      {renderCard(leftItem)}
      {renderCard(rightItem)}
    </div>
  );
}
