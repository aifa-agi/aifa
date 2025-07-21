// @/app/@right/public/(_routing)/[[...slug]]/page.tsx

import { PageHtmlTransformer } from "@/app/@right/(_service)/(_components)/page-transformer-components/page-html-transformer";
import {
  getPageBySlug,
  getAllPublicPages,
} from "@/app/@right/(_service)/(_config)/pages-config";
import { constructMetadata } from "@/lib/construct-metadata";
import type { PageConfig } from "@/app/@right/(_service)/(_types)/page-wrapper-types";

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
  const pageConfig = getPageBySlug(["public", ...slugArr]);

  if (!pageConfig) return {};
  return constructMetadata(pageConfig.metadata);
}

export default async function PublicDynamicSlugPage({ params }: Props) {
  const resolvedParams = await params;
  const slugArr = resolvedParams.slug ?? [];
  const pageConfig = getPageBySlug(["public", ...slugArr]);

  if (!pageConfig) {
    return <div>Page not found</div>;
  }

  return <PageHtmlTransformer data={pageConfig} />;
}
