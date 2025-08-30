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
export function AdminPageStep8({ slug }: AdminPageInfoProps) {
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
        <StepActivationCard stepKey="step8" />

        {/* Additional step content after activation */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">
            Content Generation Control Center: Advanced Section Management &
            AI-Powered Creation Engine
          </h3>
          <p className="text-muted-foreground">
            This mandatory and most comprehensive step serves as your complete
            content generation command center, orchestrating the transformation
            of strategic planning into finalized, publication-ready content.
            <br />
            The interface presents all empty sections as elegantly designed,
            vertically-stacked cards that maximize screen real estate through an
            intelligent accordion system - expanding one card automatically
            collapses others, maintaining optimal workspace organization. <br />
            Each expandable card reveals critical generation parameters: any
            custom design components selected in the previous step, alongside
            the detailed system instructions originally crafted by Perplexity
            Pro during Step 5 and imported in Step 6. <br />
            These instructions serve as precision blueprints that you can
            review, refine, and customize before initiating content generation,
            ensuring perfect alignment with your strategic vision.
            <br />
            <br />
            The central &quot;Generate Content&quot; button triggers
            sophisticated AI processing through advanced models like OpenAI
            GPT-4, enhanced with integrated web search capabilities that access
            real-time information and current market data.
            <br /> The system methodically processes each section&apos;s unique
            instructions, generating content sequentially to overcome individual
            AI request limitations while enabling the creation of extensive
            long-form content exceeding 100,000 words. <br />
            Each completed section is immediately stored in Vercel Blob with
            comprehensive versioning, creating an enterprise-grade content
            repository.
            <br />
            <br />
            For users preferring manual control, the system offers seamless
            Perplexity integration: copy any section&apos;s system instructions,
            process them through Perplexity Pro manually, and upload the
            response directly into the target section. <br />
            Additionally, you can create entirely new sections from scratch,
            defining custom content requirements and generation parameters to
            expand your content architecture dynamically.
            <br />
            The intuitive drag-and-drop functionality empowers you to reorganize
            sections effortlessly, creating the perfect content flow and
            narrative structure that serves your audience and business
            objectives. <br />
            This comprehensive toolkit ensures maximum flexibility while
            maintaining professional content quality and strategic coherence
            across your entire content ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
}
