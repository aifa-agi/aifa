// @/app/@right/public/(_routing)/[[...slug]]/page.tsx

import { PageHtmlTransformer } from "@/app/@right/(_service)/(_components)/page-transformer-components/page-html-transformer";
import { constructMetadata } from "@/lib/construct-metadata";
import {
  getAllPublicPages,
  getPageBySlug,
} from "../../(_servise)/(_libs)/utils";
import { PageConfig } from "@/app/@right/(_service)/(_types)/page-wrapper-types";

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
  const publicPageConfig = getPageBySlug(["public", ...slugArr]);

  if (!publicPageConfig) return {};
  return constructMetadata(publicPageConfig.metadata);
}

export default async function PublicDynamicSlugPage({ params }: Props) {
  const resolvedParams = await params;
  const slugArr = resolvedParams.slug ?? [];
  const publicPageConfig = getPageBySlug(["public", ...slugArr]);

  if (!publicPageConfig) {
    return <div>Page not found</div>;
  }

  return <PageHtmlTransformer data={publicPageConfig} />;
}
