// @/app/@right/[...slug]/page.tsx

import { PageHtmlTransformer } from "@/app/@right/(_service)/(_components)/page-transformer-components/page-html-transformer";
import { constructMetadata } from "@/lib/construct-metadata";

import {
  PageConfig,
  SlugType,
} from "@/app/@right/(_service)/(_types)/page-wrapper-types";
import { PublicPagesConfig } from "../(_service)/(_config)/public-pages-config";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const pages: PageConfig[] = getAllPublicPages();

  return pages.map((page: PageConfig) => ({
    slug: page.metadata.slug || [],
  }));
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const slugArr = resolvedParams.slug ?? [];

  const publicPageConfig = getPageBySlug(slugArr);

  if (!publicPageConfig) return {};
  return constructMetadata(publicPageConfig.metadata);
}

export default async function PublicDynamicSlugPage({ params }: Props) {
  const resolvedParams = await params;
  const slugArr = resolvedParams.slug ?? [];

  const publicPageConfig = getPageBySlug(slugArr);

  if (!publicPageConfig) {
    return <div>Page not found</div>;
  }

  return <PageHtmlTransformer data={publicPageConfig} />;
}

export function getAllPublicPages(): PageConfig[] {
  return PublicPagesConfig.pages;
}

// Ищем страницу точным совпадением slug, без вставки "public"
export function getPageBySlug(slug: SlugType): PageConfig | undefined {
  return PublicPagesConfig.pages.find(
    (page: PageConfig) =>
      JSON.stringify(
        page.metadata.slug?.map((s: string) => s.toLowerCase()) || []
      ) === JSON.stringify(slug.map((s: string) => s.toLowerCase()))
  );
}
