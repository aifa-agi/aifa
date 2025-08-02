// @/app/@right/temp-admin/(_service)/(_types)/types.ts
export interface PageMeta {
  title: string;
  slug: string[];
  description: string;
  type: string;
  image?: string;
}

export interface PageSectionInput {
  name: string;
  order: number;
  summary?: string;
  type: string;
  className?: string;
  headerContent?: any;
  bodyContent?: any;
  footerContent?: any;
  videoUrl?: string;
  imageUrl?: string;
  sectionClassName?: string;
  contentWrapperClassName?: string;
  customComponentsAnyTypeData?: any;
}
