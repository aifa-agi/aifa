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
export function AdminPageStep10({ slug }: AdminPageInfoProps) {
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
        <StepActivationCard stepKey="step10" />

        {/* Additional step content after activation */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">
            Content Finalization & Optimization Implementation: Advanced Section
            Refinement & Publication Preparation Center
          </h3>
          <p className="text-muted-foreground">
            This culminating step serves as your comprehensive content
            finalization workspace, presenting all generated sections as
            organized, vertically-arranged cards that mirror the familiar
            interface from Step 8, but now populated with completed content and
            equipped with advanced optimization capabilities. Each content-rich
            section card displays in a locked configuration state, preventing
            accidental modifications to successfully generated content while
            maintaining full visibility of the final results achieved through
            your strategic content creation process.
            <br />
            <br />
            For sections that received targeted improvement recommendations
            during the previous Step 9 analysis, specialized dual-button
            functionality becomes available to execute precision content
            optimization. The primary &quot;Copy System Instruction&quot;
            button, active by default, provides immediate access to
            AI-generated, refinement-specific system instructions that
            incorporate all strategic improvements identified during quality
            analysis. These optimized instructions are designed for seamless
            integration with Perplexity Pro, enabling you to leverage external
            AI processing power for sophisticated content enhancement that
            exceeds standard automated capabilities.
            <br />
            <br />
            Upon successfully copying system instructions, the secondary
            &quot;Load Response&quot; button activates, creating a streamlined
            workflow for importing enhanced content. Clicking this activation
            button triggers intelligent card expansion, revealing a dedicated
            textarea field specifically configured for receiving and processing
            Perplexity Pro responses. This expanded interface maintains
            contextual information about the original section content alongside
            the improvement parameters, ensuring seamless integration of
            enhanced content with existing strategic elements. As each optimized
            response is uploaded and processed, the system automatically updates
            the corresponding section in Vercel Blob storage with comprehensive
            versioning and backup functionality, preserving both original and
            enhanced content iterations for complete audit trail maintenance.
            Successfully updated sections immediately display distinctive green
            border highlighting, providing instant visual feedback about
            completion status and content quality assurance. Sections that did
            not require optimization also receive green border treatment upon
            final validation, creating a unified completion indicator system.
            The step achieves full activation and completion status when every
            section card displays the characteristic green border highlighting,
            signifying that your comprehensive page content creation workflow
            has reached successful conclusion. This visual completion system
            ensures no sections are accidentally overlooked while providing
            clear progress tracking throughout the finalization process,
            ultimately delivering publication-ready content that meets all
            strategic objectives and quality standards established throughout
            your multi-step content generation journey.
          </p>
        </div>
      </div>
    </div>
  );
}
