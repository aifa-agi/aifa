// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/step7.tsx
"use client";

// Comments are in English. UI texts are in English (US).

import React from "react";
import { HeaderCard } from "./(_sub_domains)/header-card";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { PageNotFound } from "../../../page-not-found";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Step7RootProvider } from "./(_contexts)/step7-root-context";
import { EditableTocCard } from "./(_sub_domains)/editable-toc-card/(_sub_domains)/editable-toc-card";
import { SectionSelectorCard } from "./(_sub_domains)/section-selector-card";

// Dummy placeholder page wrapped in provider as requested.
// Pass actual categoryTitle and slug from route params in real integration.
interface AdminPageInfoProps {
  slug: string;
}

export function AdminPageStep7({ slug }: AdminPageInfoProps) {
  const { categories, loading, initialized } = useNavigationMenu();
  const pageData = findPageBySlug(categories, slug);

  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">
          Loading enhanced prompt data...
        </span>
      </div>
    );
  }
  if (!pageData) {
    return <PageNotFound slug={slug} />;
  }

  const { page } = pageData;
  return (
    <Step7RootProvider page={page}>
      <div className="space-y-4">
        <HeaderCard />
        <SectionSelectorCard />
        <EditableTocCard />
      </div>
    </Step7RootProvider>
  );
}
