"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: React.ReactNode;
  answer: React.ReactNode;
}

interface FaqAccordionProps {
  title: React.ReactNode;
  items: FaqItem[];
}

export function FaqAccordion({ title, items }: FaqAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Следим за количеством элементов и корректируем массив refs
  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, items.length);
  }, [items.length]);

  return (
    <section className="faq safe-paddings mt-[200px] xl:mt-[160px] lg:mt-[126px]">
      <div className="relative mx-auto lg:max-w-none lg:px-8 md:px-4 max-w-6xl flex flex-col lg:flex-row gap-x-[100px] xl:gap-x-[62px] xl:px-8">
        <h2
          className=" font-serif text-balance font-title text-[52px] font-medium leading-none tracking-tighter xl:text-[48px] lg:text-[36px] md:text-[32px]
                     w-full text-center mb-4
                     lg:w-auto lg:basis-[30%] lg:text-left lg:mb-0"
        >
          {title}
        </h2>
        <ul className="-my-4 flex w-full flex-col xl:-my-5 lg:mt-0 lg:w-auto lg:basis-[70%]">
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <li
                key={index}
                className="overflow-hidden border-b border-gray-new-15 py-[18px] last:border-0"
              >
                <button
                  className="group relative flex w-full items-start justify-between gap-4 text-left after:absolute after:-inset-y-5 after:left-0 after:w-full"
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`panel-${index}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <h3
                    className={cn(
                      "text-xl font-medium leading-snug tracking-tighter transition-colors duration-300 lg:text-lg md:text-[18px]",
                      isActive ? "text-primary-2" : "group-hover:text-primary-2"
                    )}
                  >
                    {item.question}
                  </h3>
                  <span
                    className={cn(
                      "mr-2.5 mt-2.5 h-2 w-2 shrink-0 transform border-l border-t border-gray-new-80 transition duration-300 group-hover:border-primary-2",
                      isActive ? "rotate-[405deg]" : "rotate-[225deg]"
                    )}
                  ></span>
                </button>
                <div
                  id={`panel-${index}`}
                  ref={(el) => {
                    contentRefs.current[index] = el;
                  }} // Исправлено: возвращает void
                  style={{
                    maxHeight: isActive
                      ? contentRefs.current[index]?.scrollHeight || "auto"
                      : "0px",
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                    transition:
                      "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
                  }}
                >
                  <div className="with-link-primary with-list-style pt-4 text-base leading-normal text-gray-new-80 lg:pt-5">
                    {item.answer}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
