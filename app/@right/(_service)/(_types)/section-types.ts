import { PageType } from "./page-types";

export interface Section {
  id: string;
  order?: number;
  pageType?: PageType;
  outgoingLinks?: string[];
  incomingLinks?: string[];
  externalLinks?: string[];
  summary?: string;

  selfPrompt?: string;
  designDescription?: string;
  connectedDesignSectionId?: string;

  body?: React.ReactNode | JSON;

  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  attention?: string;
  audiences?: string;
}

export type ExtendedSection = Section;

export interface PageSections {
  sections: ExtendedSection[];
}
