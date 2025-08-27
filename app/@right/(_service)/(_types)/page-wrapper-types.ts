// app/@right/(_service)/(_types)/page-wrapper-types.ts

export interface MetadataConfig {
  title?: string;
  description?: string;
}

export type CuidString = string;

export interface PageMetadata {
  id: CuidString;
  title: string;
  description: string;
  image?: string;
  slug?: string[];
  type: SectionType;
  design?: string;
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
  | "feature-showcase-section"
  | "double-presentation-section";

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
  summary?: string;
  headerContent: HeaderContentConfig;
  bodyContent?: React.ReactNode;
  footerContent?: FooterContentConfig;
  videoUrl?: string;
  imageUrl?: string;
  sectionClassName?: string;
  contentWrapperClassName?: string;
  customComponentsAnyTypeData?: any;
}

export type Section = SectionConfig;

export interface PageConfig {
  metadata: PageMetadata;
  sections: Section[];
}

export type SlugType = string[];
