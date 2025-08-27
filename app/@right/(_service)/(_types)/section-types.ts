// @/app/(_service)/types/section-types.ts

import { ImageProps } from "next/image";
import { LinkConfiguration } from "./page-types";



export interface HeaderSection {
  announcement?: {
    badgeText?: string;
    descriptionText?: string;
    href?: string;
  };
  title: string;
  customTitleCss?: string;
  level?: 1 | 2 | 3 | 4;
  description?: string;
  customDescriptionCss?: string;
  position?: "left" | "center" | "right";
  showBorder?: boolean;
}

export interface FooterSection {
  actions?: {
    label: string;
    href: string;
    variant?:
      | "default"
      | "secondary" 
      | "destructive"
      | "outline"
      | "ghost"
      | "link";
  }[];
}

export interface Section {
  id: string;
  headerContent?: HeaderSection;
  bodyContent: {
    sectionType: "Section";
    type: TypographySectionTypeName;
    props: React.ReactNode;
  };
  footerContent?: FooterSection;
  linkConfiguration?: LinkConfiguration;
  videoUrl?: string;
  imageUrl?: string;
  sectionClassName?: string;
  contentWrapperClassName?: string;
  customComponentsAnyTypeData?: any;
}

interface SimpleSectionFullScreenSizeImageProps
  extends Omit<ImageProps, "src" | "width" | "height" | "alt"> {
  src: string;
  alt?: string; 
  width?: number;
  height?: number;
  hasBackdrop?: boolean;
  hasBorder?: boolean;
  hasRounded?: boolean;
  borderRadius?: string;
  aspectRatio?: "video" | "square" | "auto" | number | string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  className?: string;
  style?: React.CSSProperties;
}

export type SimpleSectionTypes = {
  SimpleSectionFullScreenSizeImage: SimpleSectionFullScreenSizeImageProps;
};

export type SimpleSectionTypeName = keyof SimpleSectionTypes;

export type TypographySectionTypes = {
  TypographyH1: React.HTMLAttributes<HTMLHeadingElement>;
  TypographyH2: React.HTMLAttributes<HTMLHeadingElement>;
  TypographyH3: React.HTMLAttributes<HTMLHeadingElement>;
  TypographyH4: React.HTMLAttributes<HTMLHeadingElement>;
  TypographyP: React.HTMLAttributes<HTMLParagraphElement>;
  TypographyBlockquote: React.HTMLAttributes<HTMLElement>;
  TypographyTable: { data: React.ReactNode[][] };
  TypographyList: { items: React.ReactNode[] };
  TypographyOrderedList: { items: React.ReactNode[] };
  TypographyLead: React.HTMLAttributes<HTMLParagraphElement>;
  TypographyLarge: React.HTMLAttributes<HTMLDivElement>;
  TypographySmall: React.HTMLAttributes<HTMLElement>;
  TypographyMuted: React.HTMLAttributes<HTMLParagraphElement>;
};

export type TypographySectionTypeName = keyof TypographySectionTypes;

export interface SimpleSection {
  id: string;
  order?: string;
  bodyContent: {
    sectionType: "Simple";
    type: SimpleSectionTypeName;
    props: SimpleSectionTypes[SimpleSectionTypeName];
  };
}

export interface TypographySection {
  id: string;
  order?: string;
  linkConfiguration?: LinkConfiguration;
  bodyContent: {
    sectionType: "Typography";
    type: TypographySectionTypeName;
    props: TypographySectionTypes[TypographySectionTypeName];
  };
}

export interface StepSection {
  id: string;
  order?: string;
  linkConfiguration?: LinkConfiguration;
  bodyContent: (
    | {
        sectionType: "Simple Steps";
        type: SimpleSectionTypeName;
        props: SimpleSectionTypes[SimpleSectionTypeName];
      }
    | {
        sectionType: "Typography Steps";
        type: TypographySectionTypeName;
        props: TypographySectionTypes[TypographySectionTypeName];
      }
  )[];
}

export type ExtendedSection =
  | Section
  | SimpleSection
  | StepSection
  | TypographySection;


export interface PageSections {
  sections: ExtendedSection[];
}
