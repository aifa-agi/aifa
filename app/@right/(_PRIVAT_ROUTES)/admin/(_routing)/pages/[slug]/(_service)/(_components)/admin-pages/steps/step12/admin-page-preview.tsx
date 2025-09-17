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
import {SimpleEditor} from "./(_sub_dommain)/tip-tap-editor/simple-editor";
/**
 * Understanding:
 * - Replace full-bleed container with a two-column layout (left nav + right editor).
 * - Avoid 100vw/100vh to prevent horizontal overflow in app router parallel slots.
 * - Left column scrolls vertically when overflowing; right editor never scrolls horizontally.
 * - Toolbar should wrap to next line on small widths.
 */
export function AdminPagePreview({ slug }: AdminPageInfoProps) {
  const { categories, loading, initialized } = useNavigationMenu();
  const { data: session } = useSession();
  const role: UserType = session?.user?.type || "guest";

  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">Loading page data...</span>
      </div>
    );
  }

  const searchResult = findPageBySlug(categories, slug);
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

  // Two-column layout wrapper
  return (
    <div className="w-full h-full">
      <div className="mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-4 md:gap-6">
          {/* Left navigation column */}
        
<aside className="rounded-lg border bg-card text-card-foreground p-3 md:p-4 max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)] overflow-hidden">
  {/* Mobile: horizontal scroll; Desktop: vertical list */}
  <nav
    className="
      custom-sidebar
      flex gap-2
      overflow-x-auto overflow-y-hidden
      px-1
      md:px-0
      md:flex-col md:overflow-x-hidden md:overflow-y-auto
    "
    aria-label="Sections"
  >
    <button type="button" className="shrink-0 md:shrink md:w-full text-left px-3 py-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary">
      All sections
    </button>
    {Array.from({ length: 7 }).map((_, idx) => (
      <button
        key={idx}
        type="button"
        className="shrink-0 md:shrink md:w-full text-left px-3 py-2 rounded-md hover:bg-accent"
      >
        Section {idx + 1}
      </button>
    ))}
  </nav>
</aside>


          {/* Right editor column */}
          <section className="min-w-0">
            {/* min-w-0 prevents flex/grid children from overflowing horizontally */}
            <div className="mx-auto w-full max-w-4xl">
              <SimpleEditor/>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
