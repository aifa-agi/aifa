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
export function AdminPageDeploy({ slug }: AdminPageInfoProps) {
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
        <StepActivationCard stepKey="AdminPageDeploy" />

        {/* Additional step content after activation */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">
            Production Launch & Static Build: Seamless Deployment Pipeline
          </h3>

          <p className="text-muted-foreground">
            This final deployment step converts your completed draft into a
            live, globally distributed website. When you click&nbsp;
            <strong>“Deploy”</strong>, the system performs three coordinated
            actions:
          </p>

          <ul className="list-disc ml-6 text-muted-foreground">
            <li>
              <strong>Archive every section</strong> — each section (with its
              full revision history and metadata) is persisted to
              Vercel&nbsp;Blob (S3) under a unique&nbsp;<code>cuid</code>,
              ensuring permanent, versioned storage.
            </li>
            <li>
              <strong>Commit page metadata</strong> — the finalized&nbsp;
              <code>pageData</code> JSON files (titles, links, taxonomy, design
              references, etc.) are committed to your GitHub repository,
              establishing a transparent, Git-tracked source of truth for the
              site structure.
            </li>
            <li>
              <strong>Trigger Vercel build</strong> — Vercel pulls the fresh
              GitHub commit and the referenced Blob assets, then performs an
              optimized static site generation (SSG). The result is a
              fully-rendered, database-free set of pages distributed via
              Vercel’s global edge network, delivering sub-100 ms TTFB and
              flawless Core Web Vitals.
            </li>
          </ul>

          <p className="text-muted-foreground">
            Within minutes your content becomes publicly accessible,
            horizontally scalable, and perfectly optimized for search engines.
            Should you discover issues post-launch, simply iterate on earlier
            steps — every new deployment repeats this pipeline while preserving
            prior versions for rollback confidence.
          </p>
        </div>
      </div>
    </div>
  );
}
