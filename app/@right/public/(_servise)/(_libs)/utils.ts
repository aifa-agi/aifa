// @app/@right/public/(_servise)/(_libs)/utils.ts

import {
  PageConfig,
  SlugType,
} from "@/app/@right/(_service)/(_types)/page-wrapper-types";
import { PublicPagesConfig } from "../(_config)/public-pages-config";

export function getAllPublicPages(): PageConfig[] {
  return PublicPagesConfig.pages.filter(
    (page: PageConfig) => page.metadata.slug?.[0] === "public"
  );
}

export function getPageBySlug(slug: SlugType): PageConfig | undefined {
  return PublicPagesConfig.pages.find(
    (page: PageConfig) =>
      JSON.stringify(
        page.metadata.slug?.map((s: string) => s.toLowerCase())
      ) === JSON.stringify(slug.map((s: string) => s.toLowerCase()))
  );
}
