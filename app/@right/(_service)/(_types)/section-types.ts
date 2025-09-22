import { PageImages } from "../(_context)/dialogs";
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

  bodyContent?: React.ReactNode | any;

 
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

export interface PageUploadPayload {
  href: string;
  
  pageMetadata: {
  title?: string;
  description?: string;
  images?: PageImages[];
  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  attention?: string;
  audiences?: string;
  
  };

  outgoingLinks?: string[];
  incomingLinks?: string[];
  externalLinks?: string[];
  summary?: string;
  tags?: string[];
  authors?: string[];
  relatedPages?: string[];
 
  sections: ExtendedSection[]; 
}