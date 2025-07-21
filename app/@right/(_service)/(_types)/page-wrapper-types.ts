// @app/@right/(_service)/(_types)/page-config-types/types/page-wrapper-types.ts

import { HeroSectionConfig } from "./page-config-types/types/hero-section/hero-section-types";
import { CtaSectionConfig } from "./page-config-types/types/cta-section/cta-section-types";

// 1. Типы для метаданных
export interface MetadataConfig {
  title?: string;
  description?: string;
  // Добавьте другие поля метаданных по необходимости
}

// 1. NEW: PageMetadata as specified by the user
export interface PageMetadata {
  id: string;
  title: string;
  description: string;
  image?: string;
  slug?: string[];
  type: SectionType;
}

export type SectionType =
  | "hero-section"
  | "cta-section"
  | "faq-section"
  | "features-section"
  | "testimonials-section"
  | "pricing-section"
  | "contact-section"
  | "blog-posts-section"
  | "product-grid-section"
  | "image-gallery-section"
  | "text-block-section"
  | "video-section"
  | "team-section"
  | "about-us-section"
  | "newsletter-section"
  | "social-proof-section"
  | "comparison-table-section"
  | "map-section"
  | "custom-html-section"
  | "changelog-section"
  | "comparison-two-column-section"
  | "comparison-three-column-section"
  | "feature-showcase-section";

export interface BaseSection {
  id: string;
  type: SectionType;
  className?: string;
}

export interface HeaderContentConfig {
  announcement?: {
    badgeText?: string;
    descriptionText?: string;
    href?: string;
  };
  heading: string;
  headingLevel?: 1 | 2;
  description?: string;
  showBorder?: boolean;
}

export interface FooterContentConfig {
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
export interface SectionConfig extends BaseSection {
  type: SectionType;
  headerContent: HeaderContentConfig;
  bodyContent?: React.ReactNode;
  footerContent?: FooterContentConfig;
  videoUrl?: string;
  imageUrl?: string;
  sectionClassName?: string;
  contentWrapperClassName?: string;
}

export type Section = SectionConfig;

export interface PageConfig {
  metadata: PageMetadata;
  sections: Section[];
}

// NEW: SlugType for getPageBySlug
export type SlugType = string[];
