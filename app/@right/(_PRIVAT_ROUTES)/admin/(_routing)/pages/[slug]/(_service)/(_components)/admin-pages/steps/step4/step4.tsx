// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/step1.tsx
"use client";

import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { PageNotFound } from "../../../page-not-found";
import { AdminPageInfoProps } from "../../../../(_config)/(_types)/admin-page-sections-types";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { StepActivationCard } from "../../../step-activation-card";

// slug will === "step1"
export function AdminPageStep4({ slug }: AdminPageInfoProps) {
  const { categories, loading, initialized } = useNavigationMenu();
  const { data: session } = useSession();
  const role: UserType = session?.user?.type || "guest";

  // Show loading state with theme-aware colors
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">Loading page data...</span>
      </div>
    );
  }

  // Adapt to existing findPageBySlug function
  const searchResult = findPageBySlug(categories, slug);

  // Show error state if page not found with theme-aware styling
  if (!searchResult) {
    return <PageNotFound slug={slug} />;
  }

  let page: PageData;
  let category: { title: string };

  if (
    typeof searchResult === "object" &&
    "page" in searchResult &&
    "category" in searchResult
  ) {
    page = searchResult.page as PageData;
    category = searchResult.category as { title: string };
  } else {
    page = searchResult as PageData;
    category = { title: "Unknown Category" };
  }

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto p-6">
        <StepActivationCard stepKey="step4" />

        {/* Additional step content after activation */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">
            Knowledge Base Integration: Expert Content Customization Engine
          </h3>
          <p className="text-muted-foreground">
            This optional step enables you to upload your proprietary knowledge
            base containing detailed business descriptions, product
            specifications, service offerings, unique methodologies, and
            strategic insights.
            <br />
            Once uploaded, a precision slider becomes available to fine-tune the
            content generation balance between three knowledge sources: your
            expertise, AI model knowledge, and competitor intelligence gathered
            from previous steps.
            <br />
            Setting the slider to 80% (maximum) prioritizes your proprietary
            knowledge, creating highly specialized, expert-level content that
            reflects your unique business perspective and industry expertise.
            <br />
            Conversely, setting it to 20% (minimum) generates broader,
            informational content that leverages AI capabilities and competitor
            insights while minimally incorporating your specific knowledge.
            <br />
            This intelligent mixing system ensures your content aligns perfectly
            with your strategic positioning - whether you need authoritative
            thought leadership or accessible market-oriented information.
            <br />
            The quality balance directly impacts content authenticity, expertise
            depth, and competitive differentiation potential.
          </p>
        </div>
      </div>
    </div>
  );
}
