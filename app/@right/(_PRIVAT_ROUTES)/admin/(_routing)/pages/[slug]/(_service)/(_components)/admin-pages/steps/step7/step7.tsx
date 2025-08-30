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
export function AdminPageStep7({ slug }: AdminPageInfoProps) {
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
        <StepActivationCard stepKey="step7" />

        {/* Additional step content after activation */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">
            Advanced Design Customization: Visual Enhancement & Component
            Architecture Designer
          </h3>
          <p className="text-muted-foreground">
            This optional enhancement step empowers users seeking sophisticated
            visual presentation beyond standard typography-based content
            formatting.
            <br />
            The interface features an intuitive dual-column layout: the left
            panel displays vertically arranged section cards representing each
            empty content section created in the previous step, while the right
            panel showcases a curated gallery of professional design templates
            and custom component options.
            <br />
            Each design option encompasses various visual enhancements including
            custom layout structures, integrated image placement systems,
            embedded video components, interactive elements, and advanced
            styling configurations that transcend basic text formatting.
            <br />
            When you select a section card and pair it with a specific design
            template, the system intelligently maps your choice to generate
            detailed design specifications that will be incorporated during
            final content creation.
            <br />
            This process results in the automatic creation of standalone,
            fully-functional React components that seamlessly integrate with
            your overall content architecture while maintaining design
            consistency and responsive behavior.
            <br />
            The component returns comprehensive mapping information linking each
            section to its corresponding custom design specifications, ensuring
            that your content generation process produces visually compelling,
            professionally designed sections that enhance user engagement and
            brand presentation quality.
          </p>
        </div>
      </div>
    </div>
  );
}
