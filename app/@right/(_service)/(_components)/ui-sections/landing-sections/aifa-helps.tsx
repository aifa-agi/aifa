"use client";

import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AifaHelpsItem {
  id: string;
  title: string;
  problem: string;
  solution: string;
}

interface AifaHelpsProps {
  title: string;
  discriptions: string;
  items: AifaHelpsItem[];
  className?: string;
}

// Base64 SVG for "The problem"
const PROBLEM_ICON =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgZmlsbD0ibm9uZSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBzdHJva2U9IiMwMEU1OTkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTEwLjk5OCAyMC41OThhOS42IDkuNiAwIDAgMCA5LjYtOS42IDkuNiA5LjYgMCAwIDAtOS42LTkuNiA5LjYgOS42IDAgMCAwLTkuNiA5LjYgOS42IDkuNiAwIDAgMCA5LjYgOS42TTExIDYuMnY1Ljc2Ii8+PHBhdGggZmlsbD0iIzAwRTU5OSIgZD0iTTEwLjk5NyAxNi43NmExLjIgMS4yIDAgMSAwIDAtMi40IDEuMiAxLjIgMCAwIDAgMCAyLjQiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDIydjIySDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+";

// Base64 SVG for "How Aifa helps"
const HELPS_ICON =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgZmlsbD0ibm9uZSI+PGcgc3Ryb2tlPSIjMDBFNTk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsaXAtcGF0aD0idXJsKCNhKSI+PHBhdGggZD0iTTEgMTEuNDUzaDEuODE4TTMuOTMgNC4zODNsMS4yODUgMS4yODVNMTEgMS40NTN2MS44MThNMTguMDY3IDQuMzgzIDE2Ljc4IDUuNjY4TTIxLjAwNiAxMS40NTNoLTEuODE5TTE2LjQ1NiAxMS40NTRhNS40NTQgNS40NTQgMCAxIDAtMTAuOTEgMCA1LjQ1IDUuNDUgMCAwIDAgMy42MzcgNS4xMzd2My45NTRoMy42MzZ2LTMuOTU0YTUuNDUgNS40NSAwIDAgMCAzLjYzNy01LjEzNyIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImEiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoMjJ2MjJIMHoiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=";

export const AifaHelps: React.FC<AifaHelpsProps> = ({
  title,
  discriptions,
  items,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleItemClick = (index: number) => {
    if (index === activeIndex || isAnimating) return;

    setIsAnimating(true);

    setTimeout(() => {
      setActiveIndex(index);
      setIsAnimating(false);
    }, 400);
  };

  const activeItem = items[activeIndex];

  return (
    <section className="w-full  pt-20">
      <div className="container w-full mx-auto px-4 flex flex-col items-center ">
        {/* Title */}
        <h2 className="mb-6 max-w-3xl text-center font-serif font-bold leading-tight md:text-2xl lg:text-4xl">
          {title}
        </h2>
        <p className="mb-12 max-w-xl text-base text-muted-foreground text-center">
          {discriptions}
        </p>
        {/* Main Content */}
        <div className="mt-11 flex flex-col gap-6 md:flex-row md:gap-10 items-start md:mt-10">
          {/* Left Panel - Navigation */}
          <ul className="flex w-full flex-col gap-y-2.5 md:w-[280px] md:shrink-0 lg:w-[216px]">
            {items.map((item, index) => (
              <li key={item.id}>
                <button
                  className={cn(
                    "w-full border-l-[3px] py-2.5 pl-3.5 text-left text-xl font-medium leading-snug tracking-tight transition-all duration-200 ease-in-out focus-visible:rounded-md focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-0 lg:py-2 lg:text-lg",
                    index === activeIndex
                      ? "border-primary-1 text-white cursor-default border-green-500"
                      : "border-transparent text-gray-400 hover:text-white"
                  )}
                  type="button"
                  onClick={() => handleItemClick(index)}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>

          {/* Right Panel - Content */}
          <div className="relative min-h-[280px] w-full grow overflow-hidden rounded-[14px] bg-gray-900 p-8 pb-3.5 lg:px-6 lg:py-5 sm:min-h-[320px] border border-gray-800">
            {/* Problem Section */}
            <div className="flex items-center gap-x-2">
              <img
                src={PROBLEM_ICON}
                alt=""
                width={22}
                height={22}
                decoding="async"
                className="shrink-0"
                style={{ color: "transparent" }}
              />
              <h3 className="text-xl font-semibold leading-none tracking-tighter text-white lg:text-lg">
                The problem
              </h3>
            </div>

            <div className="relative overflow-hidden min-h-[66px] mt-3.5">
              <p
                className={cn(
                  "text-base leading-normal tracking-tight text-white opacity-80 transition-all duration-400 ease-in-out",
                  isAnimating
                    ? "transform translate-y-4 opacity-0"
                    : "transform translate-y-0 opacity-80"
                )}
              >
                {activeItem.problem}
              </p>
            </div>

            {/* Divider */}
            <span
              className="my-1.5 block h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent lg:mt-[18px]"
              aria-hidden="true"
            />

            {/* Solution Section */}
            <div className="mt-6 flex items-center gap-x-2 lg:mt-5">
              <img
                src={HELPS_ICON}
                alt=""
                width={22}
                height={22}
                decoding="async"
                className="shrink-0"
                style={{ color: "transparent" }}
              />
              <h3 className="text-xl font-semibold leading-none tracking-tighter text-white lg:text-lg">
                How Aifa helps
              </h3>
            </div>

            <div className="relative overflow-hidden min-h-[66px] mt-3.5">
              <p
                className={cn(
                  "text-base leading-normal tracking-tight text-white opacity-80 transition-all duration-400 ease-in-out",
                  isAnimating
                    ? "transform translate-y-4 opacity-0"
                    : "transform translate-y-0 opacity-80"
                )}
              >
                {activeItem.solution}
              </p>
            </div>

            {/* Decorative Elements */}
            <span className="pointer-events-none absolute -bottom-14 -left-32 h-[83px] w-[155px] rounded-full bg-green-400/20 blur-2xl" />
            <span className="pointer-events-none absolute -bottom-40 -left-20 h-[293px] w-[175px] -rotate-45 rounded-full bg-gradient-to-b from-green-400/30 to-transparent opacity-40 blur-2xl" />
            <span className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
};
