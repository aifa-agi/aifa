// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/step1.tsx
"use client";

import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { useSession } from "next-auth/react";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { PageNotFound } from "../../../page-not-found";
import { AdminPageInfoProps } from "../../../../(_config)/(_types)/admin-page-sections-types";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { StepActivationCard } from "../../../step-activation-card";
import { UserType } from "@prisma/client";

// slug will === "step1"
export function AdminPageStep9({ slug }: AdminPageInfoProps) {
  const { categories, loading, initialized } = useNavigationMenu();
  const { data: session } = useSession();
  const role: UserType= session?.user?.type || "guest";

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
        <StepActivationCard stepKey="step9" />

        {/* Additional step content after activation */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">
            Content Quality Analysis & System Instruction Generator: Strategic
            Assessment & Technical Specification Center
          </h3>
          <p className="text-muted-foreground">
            This sophisticated analytical step serves as your comprehensive
            content quality assessment and technical specification preparation
            center, transforming generated content analysis into actionable
            system instructions for future optimization cycles.
            <br />
            Upon initiating the &quot;Begin Analysis&quot; process, the system
            systematically extracts all completed sections from Vercel Blob
            storage and subjects them to rigorous multi-dimensional evaluation
            using advanced AI models equipped with expansive context windows
            capable of processing up to 1,000,000 tokens simultaneously.
            <br />
            This enormous processing capacity enables complete contextual
            awareness across your entire content ecosystem while conducting
            detailed examinations of each individual section.
            <br />
            <br />
            The comprehensive summary table provides granular performance
            insights across critical quality metrics: keyword density analysis
            reveals frequency and distribution patterns of target keywords
            within your content, structural compliance assessment evaluates
            adherence to predefined content architecture and formatting
            specifications, while intent alignment analysis measures how
            effectively each section fulfills its designated strategic purpose
            and audience targeting objectives.
            <br />
            The system conducts semantic coherence evaluation, readability
            optimization assessment, and competitive positioning effectiveness
            analysis based on your original competitor research insights,
            generating detailed compliance scorecards for each content section.
            <br />
            <br />
            Where discrepancies or optimization opportunities are identified,
            the intelligent recommendation engine generates specific, actionable
            improvement proposals tailored to each section&apos;s unique
            requirements and overall content strategy objectives.
            <br />
            These AI-powered suggestions encompass content restructuring
            recommendations, keyword optimization strategies, intent realignment
            proposals, and structural improvements designed to enhance both
            search engine performance and user engagement metrics.
            <br />
            Each recommendation includes detailed rationale explaining the
            underlying analysis methodology and expected impact of
            implementation.
            <br />
            The intuitive accept/reject interface empowers you to maintain
            complete editorial control while leveraging AI insights - accepted
            recommendations automatically trigger the generation of refined,
            updated system instructions that encapsulate the proposed
            improvements.
            <br />
            These newly created system instructions serve as technical
            specifications ready for deployment in subsequent content generation
            or revision steps, creating a strategic feedback loop where analysis
            insights transform into actionable generation parameters.
            <br />
            The component functions as both quality assurance reporting tool and
            technical specification generator, ensuring your content strategy
            continuously evolves based on data-driven insights rather than
            subjective assumptions.
          </p>
        </div>
      </div>
    </div>
  );
}
