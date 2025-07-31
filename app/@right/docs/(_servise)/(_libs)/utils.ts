// @app/@right/docs/(_servise)/(_libs)/utils.ts

import {
  PageConfig,
  SlugType,
} from "@/app/@right/(_service)/(_types)/page-wrapper-types";
import { DocsPagesConfig } from "../(_config)/docs-pages-config";

export function getAllDocsPages(): PageConfig[] {
  return DocsPagesConfig.pages.filter(
    (page: PageConfig) => page.metadata.slug?.[0] === "docs"
  );
}

export function getPageBySlug(slug: SlugType): PageConfig | undefined {
  return DocsPagesConfig.pages.find(
    (page: PageConfig) =>
      JSON.stringify(
        page.metadata.slug?.map((s: string) => s.toLowerCase())
      ) === JSON.stringify(slug.map((s: string) => s.toLowerCase()))
  );
}
