// @app/@right/(_service)/(_components)/page-transformer-components/body-sections-components/body-section.tsx

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionType } from "../../../(_types)/page-wrapper-types";

interface BodySectionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode | null;
  type: SectionType;
}

/**
 * BodySection component.
 * Renders children if present,
 * otherwise renders an empty section with a default height (in rem) if provided,
 * or renders nothing.
 */
export function BodySection({
  children,
  className,
  ...props
}: BodySectionProps) {
  const defaultHeightRem = 0;
  const hasChildren =
    children !== null &&
    children !== undefined &&
    // Covers case when children = [] or ""
    !(Array.isArray(children) && children.length === 0) &&
    !(typeof children === "string" && children === "");

  if (!hasChildren && defaultHeightRem) {
    return (
      <div
        className={cn(className)}
        style={{ height: `${defaultHeightRem}rem` }}
        {...props}
      >
        {/* Empty section with default height */}
      </div>
    );
  }

  if (!hasChildren) {
    return null;
  }

  // Normal case: render content
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}
