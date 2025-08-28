// @/app/app/(_service)/types/page-types.ts

import { Metadata } from "next";
import { UserType } from "@prisma/client";
import { BadgeName } from "../(_config)/badge-config";

export type PageType =
  | "homePage"
  | "basePage"
  | "footerPage"
  | "blog"
  | "document"
  | "guide"
  | "shopItem";

export interface LinksData {
  linkBuilderType: "outgoing" | "incoming" | "externa";
  path: string[];
}
export interface SectionInfo {
  id: string;
  summary?: SummaryData;
  linksData?: LinksData[];
  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  attention?: string;
}
export interface SummaryData {
  id: string;
  path: string;
  tags?: string[];
  childSummary: string;
  parentSummary: string;
  selfSummary: string;
}

export type LinkItemState = "pending" | "active";

export interface LinkConfiguration {
  outgoing: LinkItemState;
  incoming: LinkItemState;
  external: LinkItemState;
}

export interface Activities {
  likesCount: number;
  bookmarksCount: number;
}

interface PageImages {
  id: string;
  alt?: string;
  href?: string;
}
export interface PageData {
  metadata?: Metadata;
  id: string;
  linkName: string;
  title?: string;
  description?: string;
  images?: PageImages[];
  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  attention?: string;
  href?: string;
  roles: UserType[];
  hasBadge?: boolean;
  badgeName?: BadgeName;
  badgeLink?: string;
  order?: number;
  isPublished: boolean;
  isVectorConnected: boolean;
  isAddedToPrompt: boolean;
  isChatSynchronized: boolean;
  type: PageType;
  design?: string;
  linkConfiguration?: LinkConfiguration;
  createdAt?: string;
  updatedAt?: string;
  sections?: SectionInfo[];
}
