// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_components)/step13-cleanup-card.tsx

"use client";

/**
 * Step13CleanupCard:
 * Data cleanup card with information text, cleanup button, and animated process visualization.
 * Uses consistent styling patterns and integrates with useStep13Cleanup hook.
 * Shows field-by-field cleanup animation with proper timing sequences.
 * 
 * Understanding of the task (step-by-step):
 * 1) Display cleanup information text and instructions
 * 2) Show main "Clean All Temporary Data" button with states
 * 3) Animate field cleanup process (appearing → 500ms → deleting 250ms → deleted 200ms)
 * 4) Display progress bar and completion status
 * 5) Handle loading, success, and error states
 * 6) Use identical design patterns (colors, borders, fonts, button styles)
 */

import * as React from "react";
import { useStep13Cleanup } from "../(_hooks)/use-step13-cleanup";
import { useStep13Status } from "../(_hooks)/use-step13-status";
import { STEP13_TEXTS } from "../(_constants)/step13-texts";
import { STEP13_IDS } from "../(_constants)/step13-ids";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface Step13CleanupCardProps {
    pageData: PageData | null;
    slug: string;
}

export function Step13CleanupCard({ pageData, slug }: Step13CleanupCardProps) {
    const {
        cleanupProcess,
        isCleanupActive,
        isCleanupCompleted,
        canStartCleanup,
        startCleanup,
        stopCleanup,
        estimatedDuration,
        fieldsToClean,
        currentProgress,
    } = useStep13Cleanup({ pageData, slug });

    const { isAlreadyCleaned } = useStep13Status({ pageData });

    // Button state and styling
    const buttonState = React.useMemo(() => {
        if (isCleanupActive) {
            return {
                text: "Cleaning...",
                disabled: true,
                className: "inline-flex items-center gap-2 rounded-md border border-orange-500 bg-orange-500/15 px-4 py-2 text-sm text-white cursor-not-allowed opacity-75",
            };
        }

        if (isCleanupCompleted || isAlreadyCleaned) {
            return {
                text: "Cleanup Completed",
                disabled: true,
                className: "inline-flex items-center gap-2 rounded-md border border-emerald-500 bg-emerald-500/15 px-4 py-2 text-sm text-white cursor-not-allowed",
            };
        }

        if (canStartCleanup) {
            return {
                text: STEP13_TEXTS.cleanup.buttonLabel,
                disabled: false,
                className: "inline-flex items-center gap-2 rounded-md border border-violet-500 bg-violet-500/15 px-4 py-2 text-sm text-white hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors",
            };
        }

        return {
            text: "No Data to Clean",
            disabled: true,
            className: "inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm text-neutral-500 cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400",
        };
    }, [isCleanupActive, isCleanupCompleted, isAlreadyCleaned, canStartCleanup]);

    // Handle cleanup button click
    const handleCleanup = React.useCallback(async () => {
        if (!canStartCleanup) return;
        await startCleanup();
    }, [canStartCleanup, startCleanup]);

    return (
        <div
            className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40"
            id={STEP13_IDS.containers.cleanupCard}
        >
            {/* Header Section */}
            <div className="flex items-start gap-3 mb-4">
                <div className="mt-0.5 text-blue-400">
                    <div
                        className="h-5 w-5 rounded-sm bg-blue-500/30"
                        aria-hidden="true"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                        {STEP13_TEXTS.cleanup.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {STEP13_TEXTS.cleanup.description}
                    </p>
                </div>
            </div>

            {/* Info Section */}
            {fieldsToClean > 0 && (
                <div className="mb-4 p-3 rounded-md bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50">
                    <p className="text-xs text-muted-foreground">
                        <span className="font-medium">{fieldsToClean}</span> temporary fields will be removed
                        {estimatedDuration && (
                            <>
                                {" • Estimated time: "}
                                <span className="font-medium">{estimatedDuration}</span>
                            </>
                        )}
                    </p>
                </div>
            )}

            {/* Cleanup Animation Section */}
            {isCleanupActive && cleanupProcess.fields.length > 0 && (
                <div
                    className="mb-4 space-y-2"
                    id={STEP13_IDS.elements.cleanupAnimation}
                    aria-live="polite"
                >
                    {cleanupProcess.fields.map((field, index) => (
                        <div
                            key={field.fieldName}
                            className={`flex items-center gap-2 p-2 rounded-md text-sm transition-all duration-200 ${field.phase === "idle"
                                    ? "opacity-30"
                                    : field.phase === "appearing"
                                        ? "opacity-60 bg-blue-50 dark:bg-blue-900/20"
                                        : field.phase === "deleting"
                                            ? "opacity-80 bg-orange-50 dark:bg-orange-900/20"
                                            : "opacity-100 bg-emerald-50 dark:bg-emerald-900/20"
                                }`}
                        >
                            {/* Status Icon */}
                            <div className="w-4 h-4 flex items-center justify-center">
                                {field.phase === "idle" && (
                                    <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                )}
                                {field.phase === "appearing" && (
                                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                )}
                                {field.phase === "deleting" && (
                                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-spin" />
                                )}
                                {field.phase === "deleted" && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                )}
                            </div>

                            {/* Field Info */}
                            <div className="flex-1 min-w-0">
                                <span className="text-foreground font-medium truncate">
                                    {field.fieldName}
                                </span>
                            </div>

                            {/* Status Text */}
                            <div className="text-xs text-muted-foreground">
                                {field.phase === "appearing" && STEP13_TEXTS.cleanup.animation.appearing}
                                {field.phase === "deleting" && STEP13_TEXTS.cleanup.animation.deleting}
                                {field.phase === "deleted" && STEP13_TEXTS.cleanup.animation.deleted}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Progress Bar */}
            {isCleanupActive && (
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{currentProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2 dark:bg-neutral-700">
                        <div
                            className="bg-violet-500 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${currentProgress}%` }}
                            id={STEP13_IDS.elements.cleanupProgress}
                        />
                    </div>
                </div>
            )}

            {/* Action Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCleanup}
                        disabled={buttonState.disabled}
                        className={buttonState.className}
                        id={STEP13_IDS.elements.cleanupButton}
                        title={STEP13_TEXTS.tooltips.cleanup}
                    >
                        {/* Loading spinner for active state */}
                        {isCleanupActive && (
                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        )}

                        {/* Success checkmark */}
                        {(isCleanupCompleted || isAlreadyCleaned) && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}

                        <span>{buttonState.text}</span>
                    </button>

                    {/* Stop button for active cleanup */}
                    {isCleanupActive && (
                        <button
                            onClick={stopCleanup}
                            className="inline-flex items-center gap-1 rounded-md border border-red-500 bg-red-500/15 px-3 py-2 text-xs text-white hover:bg-red-500/20 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="6" y="6" width="12" height="12" strokeWidth={2} />
                            </svg>
                            Stop
                        </button>
                    )}
                </div>

                {/* Status Text */}
                <div className="text-xs text-muted-foreground">
                    {isCleanupActive && `${cleanupProcess.completedFields}/${cleanupProcess.totalFields} fields`}
                    {isCleanupCompleted && STEP13_TEXTS.cleanup.states.completed}
                    {isAlreadyCleaned && "Data already cleaned"}
                </div>
            </div>
        </div>
    );
}
