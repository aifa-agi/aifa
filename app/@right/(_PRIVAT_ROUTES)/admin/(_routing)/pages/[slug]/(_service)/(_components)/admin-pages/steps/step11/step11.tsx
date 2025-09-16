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
export function AdminPageStep11({ slug }: AdminPageInfoProps) {
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
        <StepActivationCard stepKey="step11" />

        {/* Additional step content after activation */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">
            Project Completion Dashboard: Comprehensive Content Analytics &
            Strategic Performance Report
          </h3>
          <p className="text-muted-foreground">
            This final analytical step serves as your comprehensive project
            completion dashboard, providing detailed insights and strategic
            performance metrics that summarize the entire content creation
            journey from initial competitor analysis through final content
            optimization. The system automatically generates an extensive
            completion report that transforms your multi-step content generation
            process into actionable intelligence and measurable outcomes,
            enabling you to evaluate both tactical success and strategic
            alignment with your original business objectives.
            <br />
            <br />
            The comprehensive analytics dashboard presents critical content
            metrics through intuitive visualizations and detailed breakdowns:
            total section count analysis reveals the scope and architectural
            complexity of your completed content structure, while individual
            section word count statistics provide granular insights into content
            depth and coverage across different topic areas. The aggregate page
            word count calculation demonstrates the substantial content volume
            achieved through your systematic approach, often resulting in
            comprehensive long-form content exceeding industry standards and
            competitive benchmarks established during initial analysis phases.
            <br />
            <br />
            Advanced keyword analysis functionality presents detailed keyword
            density reports, semantic distribution patterns, and strategic
            keyword placement effectiveness across all generated sections. The
            system evaluates keyword diversity, competitive keyword coverage
            based on original competitor research, and search intent alignment
            scores that measure how effectively your content addresses target
            audience queries and business objectives. Additionally, structural
            coherence metrics assess content flow, section interconnectivity,
            and overall narrative consistency throughout your completed page
            architecture.
            <br />
            <br />
            The dashboard includes strategic performance indicators such as
            content uniqueness scores compared to competitor baselines,
            estimated reading time calculations for user experience
            optimization, and technical SEO readiness assessments covering meta
            descriptions, heading structures, and content organization. Quality
            assurance metrics highlight any remaining optimization
            opportunities, compliance with original technical specifications,
            and alignment with competitor analysis insights gathered during
            initial research phases. Export functionality enables comprehensive
            report generation for stakeholder presentations, content strategy
            documentation, and future content planning initiatives, ensuring
            your strategic investment in systematic content creation delivers
            measurable business value and competitive advantages.
          </p>
        </div>
      </div>
    </div>
  );
}
