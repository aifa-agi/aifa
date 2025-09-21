// @/@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/index.tsx

"use client";

import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";

import { SimpleEditorV2 } from "./(_sub_domain)/tip-tap-editor/simple-editor-v2";
import { Step12V2HeaderCard } from "./(_sub_domain)/step12-v2-header-card";
import { SectionsSelectorV2Card } from "./(_sub_domain)/sections-selector-v2-card";
import { Step12V2Provider, useStep12V2Root } from "./(_contexts)/step12-v2-root-context";
import { STEP12_V2_TEXTS } from "./(_constants)/step12-v2-texts";
import { AdminPageInfoProps } from "../../../admin-page-info/(_service)/(_types)/admin-page-types";
import { findPageBySlug } from "../../../../../(_utils)/page-helpers";
import { PageNotFound } from "../../../../page-not-found";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

// ==================== INTERNAL COMPONENTS ====================

/**
 * AllSectionsViewer - Shows merged view of all sections for V2
 * Displays all sections in read-only mode for overview
 */
function AllSectionsViewerV2() {
    const { sections } = useStep12V2Root();
    const realSections = React.useMemo(() =>
        sections.filter(s => s.id !== "all"),
        [sections]
    );

    if (realSections.length === 0) {
        return (
            <div className="mx-auto w-full max-w-4xl py-8 text-sm text-muted-foreground">
                {STEP12_V2_TEXTS.placeholders.noSectionsDisplay}
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl space-y-8">
            {realSections.map((s, idx) => (
                <div key={`${s.id}-${idx}`} className="rounded-md border border-border/60 p-4">
                    <div className="mb-3 text-xs font-medium text-muted-foreground">
                        Section {idx + 1}: {s.label}
                    </div>
                    <SimpleEditorV2
                        key={`${s.id}-viewer`}
                        content={s.content ?? { type: "doc", content: [] }}
                        readOnlyMode={true}
                    />
                </div>
            ))}
        </div>
    );
}

/**
 * SingleSectionEditor - Editor for individual sections in V2
 * Interactive editor with save functionality
 */
function SingleSectionEditorV2({ activeId }: { activeId: string }) {
    const { sections, updateSectionContent } = useStep12V2Root();
    const currentSection = sections.find(s => s.id === activeId);

    if (currentSection?.isLoading) {
        return (
            <section className="min-w-0">
                <div className="mx-auto w-full max-w-4xl">
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner />
                        <span className="ml-3 text-muted-foreground">
                            {STEP12_V2_TEXTS.loading.sectionContent}
                        </span>
                    </div>
                </div>
            </section>
        );
    }

    if (!currentSection) {
        return (
            <section className="min-w-0">
                <div className="mx-auto w-full max-w-4xl py-8 text-sm text-muted-foreground">
                    {STEP12_V2_TEXTS.errors.sectionNotFound}
                </div>
            </section>
        );
    }

    return (
        <section className="min-w-0">
            <div className="mx-auto w-full max-w-4xl">
                <SimpleEditorV2
                    key={activeId}
                    content={currentSection.content ?? { type: "doc", content: [] }}
                    readOnlyMode={false}
                    onContentChange={(json) => {
                        updateSectionContent(activeId, json);
                    }}
                />
            </div>
        </section>
    );
}

/**
 * EditorHost - Switches between all sections view and single section editor
 * Core router for editor modes
 */
function EditorHostV2() {
    const { activeId } = useStep12V2Root();
    const isAll = activeId === "all";

    return isAll ? (
        <section className="min-w-0">
            <AllSectionsViewerV2 />
        </section>
    ) : (
        <SingleSectionEditorV2 activeId={activeId} />
    );
}

// ==================== MAIN EXPORT ====================

/**
 * Step12V2 - FINAL VERSION replaces "здесь будет 12‑2"
 * File System Based Section Editor using SectionProvider
 * AUTONOMOUS VERSION - completely self-contained, no step12-1 dependencies
 * 
 * Key Features:
 * - Reads TipTap JSON from file system via SectionProvider
 * - Interactive section editing with live preview
 * - Save functionality with toast notifications
 * - Confirmation state management for user workflow
 * - Responsive design with mobile support
 * - Error handling and loading states
 */
export function Step12V2({ slug }: AdminPageInfoProps) {
    const { categories, loading, initialized } = useNavigationMenu();
    const { data: session } = useSession();
    const role: UserType = (session?.user?.type as UserType) || "guest";

    // Loading state
    if (loading || !initialized) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
                <span className="ml-3 text-muted-foreground">
                    {STEP12_V2_TEXTS.loading.pageData}
                </span>
            </div>
        );
    }

    // Find page by slug
    const searchResult = findPageBySlug(categories, slug);
    if (!searchResult) {
        return <PageNotFound slug={slug} />;
    }

    let page: PageData
    let categoryTitle: string;

    if (typeof searchResult === "object" && "page" in searchResult && "category" in searchResult) {
        page = searchResult.page as PageData;
        categoryTitle = (searchResult.category as { title: string }).title;
    } else {
        page = searchResult as PageData;
        categoryTitle = "Unknown Category";
    }

    // Error state - no href means no file system operations possible
    if (!page?.href) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        Page Not Available
                    </h3>
                    <p className="text-muted-foreground">
                        {STEP12_V2_TEXTS.errors.missingHref}
                    </p>
                </div>
            </div>
        );
    }

    // Main application
    return (
        <Step12V2Provider page={page}>
            <div className="w-full h-full">
                <div className="mx-auto p-4 md:p-6 gap-2 md:gap-4 flex flex-col h-full">
                    {/* Header with completion status */}
                    <Step12V2HeaderCard page={page} />

                    {/* Sections navigation and save controls */}
                    <SectionsSelectorV2Card page={page} />

                    {/* Main editor area */}
                    <EditorHostV2 />
                </div>
            </div>
        </Step12V2Provider>
    );
}

// Export internal components for potential testing or extending
export { EditorHostV2, AllSectionsViewerV2, SingleSectionEditorV2 };
