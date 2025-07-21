// @/app/@right/(_service)/(_components)/page-transformer-components/header-sections-components/header-section.tsx

import React from "react";
import { cn } from "@/lib/utils";
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "./page-header-elements";

import { Announcement } from "./announcement";
import { HeaderContentConfig } from "../../../(_types)/page-wrapper-types";

export type HeaderSectionProps = {
  headerContent: HeaderContentConfig;
} & React.HTMLAttributes<HTMLDivElement>;

export function HeaderSection({
  headerContent,
  className,
  ...props
}: HeaderSectionProps) {
  if (!headerContent) return null;

  const {
    announcement,
    heading,
    headingLevel = 1,
    description,
    showBorder = false,
  } = headerContent;

  return (
    <section
      className={cn(
        showBorder && "border-t-4 border-b-4 border-primary",
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-1 py-8 md:py-10 lg:py-12">
          {announcement && (
            <Announcement
              badgeText={announcement.badgeText}
              descriptionText={announcement.descriptionText}
              href={announcement.href}
            />
          )}
          <PageHeaderHeading level={headingLevel}>{heading}</PageHeaderHeading>
          {description && (
            <PageHeaderDescription>{description}</PageHeaderDescription>
          )}
        </div>
      </div>
    </section>
  );
}
