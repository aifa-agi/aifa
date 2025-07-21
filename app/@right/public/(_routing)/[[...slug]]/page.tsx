// @/app/@right/public/(_routing)/[[…slug]]/page.tsx

import { PageHtmlTransformer } from "@/app/@right/(_service)/(_components)/page-transformer-components/page-html-transformer";
import { getPageBySlug } from "@/app/@right/(_service)/(_config)/pages-config";
import { constructMetadata } from "@/lib/construct-metadata";
import { notFound } from "next/navigation";

interface Props {
  params: { slug?: string[] };
}

export async function generateMetadata({ params }: Props) {
  const slugArr = params.slug ?? [];
  const pageConfig = getPageBySlug(["public", ...slugArr]);
  if (!pageConfig) return {};
  return constructMetadata(pageConfig.metadata);
}

export default function PublicDynamicSlugPage({ params }: Props) {
  const slugArr = params.slug ?? [];
  const pageConfig = getPageBySlug(["public", ...slugArr]);
  if (!pageConfig) return <div>Page not found</div>;

  return <PageHtmlTransformer data={pageConfig} />;
}
