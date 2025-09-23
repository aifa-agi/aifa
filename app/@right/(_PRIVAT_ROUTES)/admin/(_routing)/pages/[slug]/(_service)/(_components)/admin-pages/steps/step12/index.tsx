
// app/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/admin-page-preview.tsx

"use client";

import React from "react";

// Project contexts and utils (keep paths consistent with your repo)
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";
import { PageNotFound } from "../../../page-not-found";
import { AdminPageInfoProps } from "../../../../(_config)/(_types)/admin-page-sections-types";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";

// Local fractal routes
import { Step12V1 } from "./step12-1-fractal";
import { Step12V2 } from "./step12-2-fractal";

/**
 * Router component for Step 12.
 * - Keeps the legacy entry name "AdminPagePreview" to avoid breaking external imports.
 * - Resolves page by slug, checks page.isPreviewComplited and mounts either V1 or V2 subtree.
 */
export function AdminPageStep12({ slug }: AdminPageInfoProps) {
  const { categories, loading, initialized } = useNavigationMenu();
  const { data: session } = useSession();
  const role: UserType = session?.user?.type || "guest";

  // Show global loading until navigation data is ready
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">Loading page data...</span>
      </div>
    );
  }

  // Find page by slug from navigation categories
  const searchResult = findPageBySlug(categories, slug);
  if (!searchResult) {
    return <PageNotFound slug={slug} />;
  }

  // Normalize shape to PageData
  let page = (typeof searchResult === "object" && "page" in searchResult)
    ? (searchResult as any).page
    : searchResult;

  const isCompleted = Boolean(page?.isPreviewComplited);

  // Branch by preview completion:
  // false -> legacy Step 12 (V1, HTML->adapter flow)
  // true  -> new Step 12-2 (V2, FS JSON flow; stub for now)
  if (!isCompleted) {
    return <Step12V1 slug={slug} />;
  }
  return <Step12V2 slug={slug} />;
}

export default AdminPageStep12;
