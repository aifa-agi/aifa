// @app/@right/(_service)/(_components)/page-transformer-components/header-sections-components/page-header-elements.tsx

import { HTMLAttributes, createElement } from "react";
import { cn } from "@/lib/utils";

type HeadingTag = "h1" | "h2";

interface PageHeaderHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2;
}

function PageHeaderHeading({
  className,
  level = 1,
  ...props
}: PageHeaderHeadingProps) {
  // Выбор тега по уровню
  const Heading: HeadingTag = level === 1 ? "h1" : "h2";
  const h1Classes = "text-2xl sm:text-3xl  md:text-6xl lg:text-7xl";
  const h2Classes = "text-lg sm:text-xl  md:text-3xl lg:text-4xl";

  // Правильное использование createElement
  return createElement(Heading, {
    className: cn(
      "text-center font-bold leading-tight tracking-tighter font-serif",
      level === 1 ? h1Classes : h2Classes,
      className
    ),
    ...props,
  });
}

function PageHeaderDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "max-w-2xl text-balance text-center text-base font-light text-muted-foreground sm:text-lg",
        className
      )}
      {...props}
    />
  );
}

function PageActions({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-2 pt-2",
        className
      )}
      {...props}
    />
  );
}

// Экспорт компонентов
export { PageActions, PageHeaderDescription, PageHeaderHeading };
