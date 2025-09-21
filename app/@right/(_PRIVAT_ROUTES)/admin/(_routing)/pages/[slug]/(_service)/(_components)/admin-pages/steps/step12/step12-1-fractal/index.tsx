// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_utils)/step12-sections-utils.ts
"use client";


import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { PageNotFound } from "../../../../page-not-found";
import { AdminPageInfoProps } from "../../../../../(_config)/(_types)/admin-page-sections-types";
import { findPageBySlug } from "../../../../../(_utils)/page-helpers";
import { mergeDocs } from "./(_utils)/step12-sections-utils";
import { SimpleEditor } from "./(_sub_dommain)/tip-tap-editor/simple-editor";
import { Step12HeaderCard } from "./(_sub_dommain)/step12-header-card";


import { SectionsSelectorCard } from "./(_sub_dommain)/sections-selector-card";
import { Step12Provider, useStep12Root } from "./(_contexts)/step12-root-context";
import { requestBodyConditionGroupFromJSON } from "@vercel/sdk/models/updatefirewallconfigop.js";


function AllSectionsViewer() {
  const { sections } = useStep12Root();

  const realSections = React.useMemo(
    () => sections.filter((s) => s.id !== "all"),
    [sections]
  );

  if (realSections.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8 text-sm text-muted-foreground">
        No sections to display yet.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {realSections.map((s, idx) => (
        <div key={`${s.id}:${idx}`} className="rounded-md border border-border/60  p-4">
          {/* Optional lightweight heading to separate sections visually (no H2 injection into content) */}
          <div className="mb-3 text-xs font-medium text-muted-foreground">
            Section: {idx + 1}
          </div>
          <SimpleEditor
            // Each editor mounts fresh with its own initial content; no editor modification required
            key={`${s.id}:viewer`}
            content={s.content ?? { type: "doc", content: [] }}
            readOnlyMode={true}
          />
        </div>
      ))}
    </div>
  );
}

function SingleSectionEditor({
  activeId,
}: {
  activeId: string;
}) {
  const { sections, updateSectionContent } = useStep12Root();
  const currentSection = sections.find((s) => s.id === activeId);

  if (currentSection?.isLoading) {
    return (
      <section className="min-w-0">
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
            <span className="ml-3 text-muted-foreground">Loading section content...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0">
      <div className="mx-auto w-full max-w-4xl">
        <SimpleEditor
          key={activeId}
          content={currentSection?.content ?? { type: "doc", content: [] }}
          readOnlyMode={false}
          onContentChange={(json) => {
            if (activeId) {
              updateSectionContent(activeId, json);
            }
          }}
        />
      </div>
    </section>
  );
}

function EditorHost() {
  const { activeId } = useStep12Root();
  const isAll = activeId === "all";

  return isAll ? (
    <section className="min-w-0">
      <AllSectionsViewer />
    </section>
  ) : (
    <SingleSectionEditor activeId={activeId} />
  );
}

export { EditorHost };





export function Step12V1({ slug }: AdminPageInfoProps) {
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
    <Step12Provider page={page}>
      {!page?.sections || page.sections.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Sections Available
            </h3>
            <p className="text-muted-foreground">
              This page has no content sections to edit.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full">
          <div className="mx-auto p-4 md:p-6 gap-2 md:gap-4 flex flex-col h-full">
            <Step12HeaderCard page={page} />
            <SectionsSelectorCard page={page} />
            <EditorHost />
          </div>
        </div>
      )}
    </Step12Provider>
  );
}


