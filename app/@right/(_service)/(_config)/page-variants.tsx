// @/app/config/page-variants.tsx

import { PageType } from "../(_types)/page-types";

export const PAGE_TYPES: {
  label: string;
  availableSectionIds?: string[];
  value: PageType;
}[] = [
  { label: "Blog", value: "blog" },
  { label: "Home Page", value: "homePage" },
  { label: "Base Page", value: "basePage" },
  { label: "Footer Page", value: "footerPage" },
  { label: "Document", value: "document" },
  { label: "Guide", value: "guide" },
  { label: "Shop Item", value: "shopItem" },
] as const;
