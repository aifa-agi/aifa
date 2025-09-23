// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_components)/step13-header-card.tsx

"use client";

/**
 * Step13HeaderCard:
 * Header card for final step with title, description, and status indicator.
 * Uses consistent styling patterns from step8-header-card.tsx.
 * Shows cleanup status and page information with tri-state status dot.
 * 
 * Understanding of the task (step-by-step):
 * 1) Display "Final Step" title with consistent styling
 * 2) Show step description and current page info
 * 3) Add status indicator for data cleanup state
 * 4) Include last update timestamp
 * 5) Use identical design patterns from step8 (colors, borders, fonts)
 * 6) Maintain responsive layout and accessibility
 */

import * as React from "react";
import { useStep13Status } from "../(_hooks)/use-step13-status";
import { STEP13_TEXTS } from "../(_constants)/step13-texts";
import { STEP13_IDS } from "../(_constants)/step13-ids";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface Step13HeaderCardProps {
    pageData: PageData | null;
}

export function Step13HeaderCard({ pageData }: Step13HeaderCardProps) {
    const {
        isDataComplete,
        isAlreadyCleaned,
        stats
    } = useStep13Status({ pageData });

    // Format last update timestamp
    const updatedAt = React.useMemo(() => {
        if (!pageData?.updatedAt) return "—";

        try {
            return new Date(pageData.updatedAt).toLocaleString();
        } catch {
            return "—";
        }
    }, [pageData?.updatedAt]);

    // Calculate status tone for tri-state dot indicator
    const statusTone = React.useMemo(() => {
        if (!pageData) return "empty";

        if (isAlreadyCleaned) {
            return "complete"; // Green - data already cleaned
        }

        if (isDataComplete && stats.totalFields > 0) {
            return "partial"; // Orange - ready for cleanup  
        }

        return "empty"; // Gray - incomplete or no data
    }, [pageData, isAlreadyCleaned, isDataComplete, stats.totalFields]);

    // Status dot CSS classes (4px dot like in step8)
    const dotBase = "inline-block h-1 w-1 rounded-full";
    const dotCls = React.useMemo(() => {
        switch (statusTone) {
            case "complete":
                return `${dotBase} bg-emerald-400`;
            case "partial":
                return `${dotBase} bg-orange-400`;
            default:
                return `${dotBase} bg-neutral-500/60`;
        }
    }, [statusTone, dotBase]);

    // Button text based on status
    const buttonText = React.useMemo(() => {
        if (isAlreadyCleaned) {
            return "Data Cleaned";
        }

        if (isDataComplete) {
            return "Ready to Clean";
        }

        return "Review Data";
    }, [isAlreadyCleaned, isDataComplete]);

    return (
        <div
            className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40"
            id={STEP13_IDS.containers.headerCard}
        >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-violet-400">
                        {/* Icon placeholder with same styling as step8 */}
                        <div
                            className="h-5 w-5 rounded-sm bg-violet-500/30"
                            aria-hidden="true"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-semibold text-foreground">
                                {STEP13_TEXTS.header.title}
                            </h2>
                            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                                {pageData?.title ?? pageData?.linkName ?? "Untitled Page"}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {STEP13_TEXTS.header.description}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0">
                    <div className="inline-flex items-center gap-2 rounded-md border border-violet-500 bg-violet-500/15 px-3 py-1.5 text-sm text-white hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                        {/* 4px status dot inside button, left to label (same as step8) */}
                        <span className={dotCls} aria-hidden="true" />
                        <span>{buttonText}</span>
                    </div>
                </div>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
                Last update: {updatedAt}
            </p>
        </div>
    );
}
