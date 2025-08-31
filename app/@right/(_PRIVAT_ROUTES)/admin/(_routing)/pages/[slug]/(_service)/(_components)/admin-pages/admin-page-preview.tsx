// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/step1.tsx
"use client";

import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { PageNotFound } from "../page-not-found";
import { AdminPageInfoProps } from "../../(_types)/admin-page-sections-types";
import { findPageBySlug } from "../../(_utils)/page-helpers";
import { StepActivationCard } from "../step-activation-card";

// slug will === "step1"
export function AdminPagePreview({ slug }: AdminPageInfoProps) {
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
        <StepActivationCard stepKey="AdminPagePreview" />

        {/* Additional step content after activation */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">
            Live Preview & Final Editorial Control: Real-Time Content
            Visualization & Advanced Text Editor Integration
          </h3>
          <p className="text-muted-foreground">
            This penultimate step transforms your strategically crafted content
            into a pixel-perfect preview experience, presenting your completed
            page exactly as it will appear to end users in the live production
            environment. The sophisticated preview engine renders all generated
            sections with authentic styling, responsive design elements, custom
            visual components, and interactive features, providing comprehensive
            visualization of your content&apos;s final presentation across
            different device formats and screen resolutions. This realistic
            preview functionality ensures complete confidence in your
            content&apos;s visual impact and user experience before final
            publication deployment.
            <br />
            <br />
            The integrated advanced text editor empowers you with
            professional-grade editorial control over every content element,
            featuring rich formatting capabilities, real-time collaborative
            editing, and intelligent suggestion systems that maintain content
            quality while preserving strategic keyword optimization and
            structural integrity. Each section becomes individually editable
            through intuitive click-to-edit functionality, allowing seamless
            transitions between preview mode and active editing without
            disrupting the overall content flow or losing contextual awareness
            of surrounding sections.
            <br />
            <br />
            The editor includes sophisticated features such as grammar and style
            checking, readability optimization suggestions, keyword density
            monitoring, and format consistency validation that ensure your final
            edits enhance rather than compromise the strategic content
            architecture developed throughout your multi-step creation process.
            Version control functionality automatically saves editing
            iterations, enabling easy rollback to previous versions if needed,
            while change tracking highlights all modifications for comprehensive
            audit trail maintenance.
            <br />
            <br />
            Advanced formatting options include custom typography controls,
            image placement optimization, video embedding capabilities, and
            interactive element positioning that align with your selected design
            components from earlier steps. The system maintains perfect
            synchronization between preview rendering and actual page output,
            ensuring that every editorial refinement translates accurately to
            the final published result. Real-time collaboration features enable
            team-based editing workflows, stakeholder review processes, and
            approval management systems that streamline content finalization
            across organizational hierarchies while maintaining strategic
            coherence and brand consistency throughout all editorial
            modifications.
          </p>
        </div>
      </div>
    </div>
  );
}
