// @/@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_sub_domain)/step12-v2-header-card.tsx

"use client";

import React from "react";
import { STEP12_V2_TEXTS } from "../(_constants)/step12-v2-texts";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface Step12V2HeaderCardProps {
    page?: PageData | null;
}

/**
 * Step12V2HeaderCard - Shows completion status for file system editor
 * Key differences from V1:
 * - Uses STEP12_V2_TEXTS instead of STEP12_TEXTS
 * - Adapted for file system workflow
 * - Shows "File Editor" CTA instead of "Preview flow"
 */
export function Step12V2HeaderCard({ page }: Step12V2HeaderCardProps) {
    const isCompleted = Boolean(page?.isPreviewComplited);

    // Status dot styling - green when completed, orange otherwise
    const dotBase = "inline-block h-1 w-1 rounded-full"; // 4px
    const dotCls = isCompleted
        ? `${dotBase} bg-emerald-400`
        : `${dotBase} bg-orange-400`;

    return (
        <div className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* Left section: Icon + Content */}
                <div className="flex items-start gap-3">
                    {/* Violet file icon indicator */}
                    <div className="mt-0.5 text-violet-400">
                        <div className="h-5 w-5 rounded-sm bg-violet-500/30" aria-hidden="true">
                            {/* Simple file icon representation */}
                            <div className="h-full w-full flex items-center justify-center">
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="opacity-60"
                                >
                                    <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8l6-6V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Title and description */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-foreground">
                            File System Editor
                        </h2>
                        {page?.title && (
                            <div className="text-sm text-muted-foreground">
                                → {page.title}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right section: CTA badge with status dot */}
                <div className="flex shrink-0">
                    <div className="inline-flex items-center gap-2 rounded-md border border-violet-500 bg-violet-500/15 px-3 py-1.5 text-sm text-white hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                        {/* Status dot inside the badge */}
                        <span className={dotCls} aria-hidden="true"></span>
                        {STEP12_V2_TEXTS.labels.headerCta}
                    </div>
                </div>
            </div>

            {/* Subtitle description */}
            <div className="mt-3">
                <p className="text-sm text-muted-foreground">
                    {STEP12_V2_TEXTS.labels.headerSubtitle}
                </p>
            </div>

            {/* Optional completion status indicator */}
            {isCompleted && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-sm bg-emerald-500/10 px-2 py-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    Preview completed
                </div>
            )}
        </div>
    );
}
