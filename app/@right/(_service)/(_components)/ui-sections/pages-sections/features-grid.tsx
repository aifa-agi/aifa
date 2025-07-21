"use client";

import type React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FeatureItem {
  iconSvg: string;
  title: string;
  description: string;
  linkHref: string;
  linkText: string;
}

interface FeaturesGridProps {
  title: string;
  discriptions: string;
  features: FeatureItem[];
  className?: string;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({
  title,
  discriptions,
  features,
  className,
}) => {
  return (
    <section className="w-full pt-20">
      <div className="container w-full mx-auto px-4 flex flex-col items-center ">
        {/* Title */}
        <h2 className="mb-6 max-w-3xl text-center font-serif font-bold leading-tight md:text-2xl lg:text-4xl">
          {title}
        </h2>
        <p className="mb-12 max-w-xl text-base text-muted-foreground text-center">
          {discriptions}
        </p>
        <div className="relative mx-auto lg:max-w-none lg:px-8 md:px-4 max-w-6xl xl:!px-8 ">
          <ul
            className="grid grid-cols-2 gap-x-[26px] gap-y-11 xl:gap-x-[30px] lg:gap-10 md:grid-cols-3 md:gap-8
                       w-full
                       lg:w-auto lg:basis-[70%] lg:mt-0"
          >
            {features.map((feature, index) => (
              <li key={index} className="flex flex-col">
                <div className="flex items-center gap-x-2">
                  {/* Using Image component for SVG data URL */}
                  <Image
                    alt={feature.title}
                    loading="lazy"
                    width="22"
                    height="22"
                    decoding="async"
                    data-nimg="1"
                    className="shrink-0"
                    style={{ color: "transparent" }}
                    src={feature.iconSvg || "/placeholder.svg"}
                  />
                  <h3 className="text-[22px] font-medium leading-tight tracking-extra-tight lg:text-lg">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-2 font-light leading-snug text-gray-new-70">
                  {feature.description}
                </p>
                <Link
                  className="inline-flex items-center transition-colors duration-200 hover:text-primary-2 mt-4 !text-[15px] font-medium tracking-tight group w-fit gap-1 !leading-none
"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={feature.linkHref}
                >
                  <span>
                    {feature.linkText}{" "}
                    <span className="sr-only">about {feature.title}</span>
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="8"
                    fill="none"
                    viewBox="0 0 16 8"
                    className="-mb-px shrink-0 transition-transform duration-200 group-hover:translate-x-[3px]"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.4"
                      d="M1 4h14m0 0-3-3m3 3-3 3"
                    ></path>
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
