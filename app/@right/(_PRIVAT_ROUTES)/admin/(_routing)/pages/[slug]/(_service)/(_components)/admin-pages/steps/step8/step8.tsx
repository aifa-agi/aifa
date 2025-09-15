// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/step8.tsx
"use client";

/**
 * Step 8 entry: wires context and cards:
 * - Step8HeaderCard
 * - ProgressStrip
 * - ResultsSelectorCard
 * - DraftResultsCard
 */

import * as React from "react";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Step8RootProvider } from "./(_contexts)/step8-root-context";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { PageNotFound } from "../../../page-not-found";
import { Step8HeaderCard } from "./(_sub_domains)/step8-header-card";
import { ResultsSelectorCard } from "./(_sub_domains)/results-selector-card";
import { ProgressStrip } from "./(_sub_domains)/progress-strip";
import { DraftResultsCard } from "./(_sub_domains)/draft-results-card";

interface AdminPageInfoProps {
  slug: string;
}

export function AdminPageStep8({ slug }: AdminPageInfoProps) {
  const { categories, loading, initialized } = useNavigationMenu();
  const pageData = findPageBySlug(categories, slug);

  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">
          Loading draft results...
        </span>
      </div>
    );
  }
  if (!pageData) {
    return <PageNotFound slug={slug} />;
  }

  const { page } = pageData;
  return (
    <Step8RootProvider page={page}>
      <div className="space-y-4">
        <Step8HeaderCard />
        <ProgressStrip />
        <ResultsSelectorCard />
        <DraftResultsCard />
      </div>
    </Step8RootProvider>
  );
}
