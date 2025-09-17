// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/step1.tsx
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
import { mergeDocs } from "./(_utils)/step12-sections-utils";
import { SimpleEditor } from "./(_sub_dommain)/tip-tap-editor/simple-editor";
import { Step12HeaderCard } from "./(_sub_dommain)/step12-header-card";
import { Step12Provider, useStep12Root } from "./(_contexts)/step12-root-context";
import { SectionsSelectorCard } from "./(_sub_dommain)/sections-selector-card";



function EditorHost() {
  const { sections, activeId, updateSectionContent } = useStep12Root();
  const isAll = activeId === "all";
  const current = isAll
    ? mergeDocs(sections)
    : sections.find((s) => s.id === activeId)?.content ?? { type: "doc", content: [] };

  return (
    <section className="min-w-0">
      <div className="mx-auto w-full max-w-4xl">
        <SimpleEditor
          content={current}
          readOnlyMode={isAll}
          onContentChange={(json) => {
            if (!isAll && activeId) updateSectionContent(activeId, json);
          }}
        />
      </div>
    </section>
  );
}

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
  if (typeof searchResult === "object" && "page" in searchResult && "category" in searchResult) {
    page = searchResult.page as PageData;
    category = searchResult.category as { title: string };
  } else {
    page = searchResult as PageData;
    category = { title: "Unknown Category" };
  }

  return (
    <Step12Provider totalSections={7}>
      <div className="w-full h-full">
        <div className="mx-auto p-4 md:p-6 gap-2 md:gap-4 flex flex-col h-full">
          <Step12HeaderCard page={page} />
          <SectionsSelectorCard page={page} />
          <EditorHost />
        </div>
      </div>
    </Step12Provider>
  );
}
