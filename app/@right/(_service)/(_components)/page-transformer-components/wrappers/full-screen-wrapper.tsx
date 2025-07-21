// @/app/@right/(_service)/(_components)/page-transformer-components/wrappers/full-screen-wrapper.tsx

import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FullScreenWrapperProps extends HTMLAttributes<HTMLDivElement> {
  videoUrl?: string;
  imageUrl?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * FullScreenWrapper — обёртка для полноэкранных секций, поддерживает фон-видео и фон-изображение.
 */
export function FullScreenWrapper({
  videoUrl,
  imageUrl,
  className,
  children,
  ...props
}: FullScreenWrapperProps) {
  let backgroundElement: React.ReactNode = null;

  if (videoUrl) {
    backgroundElement = (
      <video
        className="absolute inset-0 size-full object-cover z-0 opacity-40 transition-all duration-500"
        autoPlay
        loop
        muted
        playsInline
        src={videoUrl}
      />
    );
  } else if (imageUrl) {
    backgroundElement = (
      <img
        className="absolute inset-0 size-full object-cover z-0"
        src={imageUrl || "/placeholder.svg"}
        alt="Background"
      />
    );
  }

  return (
    <section
      className={cn(
        "relative flex min-h-screen flex-col py-10 lg:py-14 bg-background",
        className
      )}
      {...props}
    >
      {backgroundElement}
      <div className="relative z-10 flex flex-col flex-1">{children}</div>
    </section>
  );
}
