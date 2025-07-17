"use client";

import type React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TestimonialProps {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorCompany: string;
  authorImage: string;
  className?: string;
}

export const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  authorName,
  authorTitle,
  authorCompany,
  authorImage,
  className,
}) => {
  return (
    <div className={cn("testimonial-new safe-paddings mt-20", className)}>
      <div className="relative mx-auto lg:max-w-none lg:px-8 md:px-4 max-w-[960px]  flex flex-col items-center px-16 ">
        {/* Quote Icon Container */}
        <div className="h-[68px] w-full  relative flex items-center justify-center mb-10">
          <div className="absolute left-1/2 top-0 -ml-2.5 -mt-7 -translate-x-1/2  lg:w-auto h-[72px]">
            <div className="mb-6 flex justify-center">
              <Image
                src="/_static/images/blockquote.svg"
                alt="Quote"
                width={96}
                height={96}
                className="w-24 h-24"
                priority
              />
            </div>
          </div>
        </div>

        {/* Testimonial Content */}
        <figure className="max-w-[840px] lg:max-w-[620px]">
          <blockquote className="text-center">
            <p
              className="text-center text-[28px] leading-snug tracking-tighter lg:text-2xl md:text-xl bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.9) 25%, white 50%, rgba(255,255,255,0.9) 75%, rgba(255,255,255,0.2) 100%)",
              }}
            >
              {quote}
            </p>
          </blockquote>

          {/* Author Information */}
          <figcaption className="mt-5 flex items-center justify-center lg:mt-[18px]">
            <Image
              src={authorImage || "/placeholder.svg?height=30&width=30"}
              alt={`${authorName} photo`}
              width={30}
              height={30}
              className="mr-2.5 rounded-full"
            />
            <span className="text-lg font-light leading-tight tracking-extra-tight text-gray-400 lg:text-base md:text-sm">
              {authorName}
              <cite className="ml-1.5 not-italic text-gray-500 before:mr-1.5 before:inline-flex before:h-px before:w-4 before:bg-gray-500 before:align-middle">
                {authorTitle} at {authorCompany}
              </cite>
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};
