// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/step1.tsx
"use client";

import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { PageNotFound } from "../../../page-not-found";
import { AdminPageInfoProps } from "../../../../(_types)/admin-page-sections-types";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { StepActivationCard } from "../../../step-activation-card";

// slug will === "step1"
export function AdminPageStep1({ slug }: AdminPageInfoProps) {
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
        <StepActivationCard stepKey="step1" />

        {/* Additional step content after activation */}
        {/* Additional step content after activation */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">
            Competitor Analysis Tool: System Instruction Generator
          </h3>
          <p className="text-muted-foreground">
            This tool helps you prepare system instructions for competitor
            analysis using Perplexity AI. <br />
            Enter your competitor&apos;s URL to generate a ready-to-use system
            instruction. <br />
            Copy the generated instruction, paste it into Perplexity Pro to get
            detailed competitor analysis, then return here to paste the results
            into the provided textarea. <br />
            You can analyze multiple competitors by adding new entries with the
            plus button. <br />
            This step will be marked as complete once you&apos;ve added at least
            one analysis result to the textarea field.
          </p>
        </div>
      </div>
    </div>
  );
}
