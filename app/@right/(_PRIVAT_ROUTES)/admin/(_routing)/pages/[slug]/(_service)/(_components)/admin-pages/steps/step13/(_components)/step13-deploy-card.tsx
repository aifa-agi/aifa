// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_components)/step13-deploy-card.tsx

"use client";

/**
 * Step13DeployCard:
 * Deploy launch card with description, timing info, and navigation button.
 * Uses consistent styling patterns and provides navigation to admin/vercel-deploy.
 * Shows deploy timing estimate and process description.
 * 
 * Understanding of the task (step-by-step):
 * 1) Display "Launch Deploy" title and description
 * 2) Show deploy process information and timing estimates
 * 3) Provide navigation button to admin/vercel-deploy via router.push()
 * 4) Include deploy purpose tooltip and SEO recommendations
 * 5) Handle navigation errors gracefully
 * 6) Maintain identical design patterns (colors, borders, fonts)
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getDeployTimingMessage } from "../(_utils)/step13-helpers";
import { STEP13_TEXTS } from "../(_constants)/step13-texts";
import { STEP13_IDS } from "../(_constants)/step13-ids";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface Step13DeployCardProps {
    pageData: PageData | null;
    totalPagesCount?: number;
}

export function Step13DeployCard({ pageData, totalPagesCount }: Step13DeployCardProps) {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = React.useState(false);

    // Calculate timing message based on page count
    const timingMessage = React.useMemo(() => {
        return getDeployTimingMessage(totalPagesCount);
    }, [totalPagesCount]);

    // Handle navigation to deploy page
    const handleNavigateToDeploy = React.useCallback(async () => {
        if (isNavigating) return;

        setIsNavigating(true);

        try {
            // Show navigation toast
            toast.loading("Redirecting to deployment management...", {
                id: STEP13_IDS.toasts.deployRedirect,
            });

            // Navigate to deploy page using soft routing
            router.push("/admin/vercel-deploy");

            // Clear loading toast after navigation
            setTimeout(() => {
                toast.dismiss(STEP13_IDS.toasts.deployRedirect);
            }, 1000);

        } catch (error) {
            console.error("Navigation error:", error);

            toast.error("Failed to navigate to deploy page", {
                id: STEP13_IDS.toasts.deployError,
                description: "Please try refreshing the page and try again."
            });
        } finally {
            setIsNavigating(false);
        }
    }, [router, isNavigating]);

    return (
        <div
            className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40"
            id={STEP13_IDS.containers.deployCard}
        >
            {/* Header Section */}
            <div className="flex items-start gap-3 mb-4">
                <div className="mt-0.5 text-purple-400">
                    <div
                        className="h-5 w-5 rounded-sm bg-purple-500/30"
                        aria-hidden="true"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                        {STEP13_TEXTS.deploy.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {STEP13_TEXTS.deploy.description}
                    </p>
                </div>
            </div>

            {/* Deploy Information */}
            <div className="mb-4 p-3 rounded-md bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50">
                <div className="flex items-start gap-2 mb-2">
                    <svg className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                            Deployment Timing
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {timingMessage}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                            Process Overview
                        </p>
                        <p className="text-xs text-muted-foreground">
                            GitHub data → Static HTML files → Vercel deployment
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={handleNavigateToDeploy}
                    disabled={isNavigating}
                    className={`inline-flex items-center gap-2 rounded-md border border-violet-500 bg-violet-500/15 px-4 py-2 text-sm text-white transition-colors ${isNavigating
                            ? "opacity-75 cursor-not-allowed"
                            : "hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        }`}
                    id={STEP13_IDS.elements.deployButton}
                    title={STEP13_TEXTS.tooltips.deploy}
                >
                    {isNavigating ? (
                        <>
                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                            <span>Navigating...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span>{STEP13_TEXTS.deploy.buttonLabel}</span>
                        </>
                    )}
                </button>

                <div className="text-xs text-muted-foreground">
                    Target: <span className="font-medium">{STEP13_TEXTS.deploy.navigation.targetPage}</span>
                </div>
            </div>

            {/* SEO Recommendation */}
            <div className="p-3 rounded-md bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800/30">
                <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                            {STEP13_TEXTS.seo.title}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-400">
                            {STEP13_TEXTS.seo.recommendation}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
