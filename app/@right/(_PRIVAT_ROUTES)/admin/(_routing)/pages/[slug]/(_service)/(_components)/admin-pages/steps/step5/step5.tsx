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
export function AdminPageStep5({ slug }: AdminPageInfoProps) {
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
        <StepActivationCard stepKey="step5" />

        {/* Additional step content after activation */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">
            System Instruction Generator: Comprehensive Content Creation Command
            Center
          </h3>
          <p className="text-muted-foreground">
            This mandatory step serves as the primary content generation engine
            that cannot be bypassed.
            <br />
            Here, the system synthesizes and consolidates all accumulated
            knowledge from your completed previous steps - competitor analyses,
            content structure blueprints, and proprietary knowledge base
            integration - into a sophisticated system instruction optimized for
            Perplexity Pro.
            <br />
            Fine-tune your content generation through specialized dropdown
            controls: select the precise response tone (professional,
            conversational, authoritative, etc.) and writing style (technical,
            marketing-focused, educational, etc.) that aligns with your brand
            voice and audience expectations.
            <br />
            Additionally, utilize the free-form textarea to provide specific
            focus directives, strategic emphasis points, or unique requirements
            that will guide the AI&apos;s attention toward your most critical
            business objectives.
            <br />
            The integrated copy functionality seamlessly transfers your
            complete, personalized instruction set to Perplexity Pro, where
            advanced AI processing transforms your strategic inputs into a
            comprehensive, structured content object.
            <br />
            This resulting object becomes the foundation for your final content
            generation, ensuring maximum alignment between your business
            strategy and AI-powered execution.
          </p>
        </div>
      </div>
    </div>
  );
}
