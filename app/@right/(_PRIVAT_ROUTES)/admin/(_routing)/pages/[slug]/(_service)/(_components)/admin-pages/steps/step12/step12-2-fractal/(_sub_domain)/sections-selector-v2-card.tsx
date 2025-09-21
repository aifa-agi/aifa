// @/@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_sub_domain)/sections-selector-v2-card.tsx

"use client";

import React from "react";

import { STEP12_V2_TEXTS } from "../(_constants)/step12-v2-texts";
import { STEP12_V2_IDS } from "../(_constants)/step12-v2-ids";
import { useStep12V2Root } from "../(_contexts)/step12-v2-root-context";
import { useStep12V2Buttons } from "../(_contexts)/step12-v2-buttons-context";
import { SaveAllV2Button } from "./save-all-v2-button";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface SectionsSelectorV2CardProps {
    page?: PageData | null;
}

/**
 * SectionsSelectorV2Card - Main sections navigation component for V2
 * Key differences from V1:
 * - Uses STEP12_V2_TEXTS and STEP12_V2_IDS
 * - Integrates with Step12V2 contexts
 * - Uses SaveAllV2Button instead of SaveAllButton
 */
export function SectionsSelectorV2Card({ page }: SectionsSelectorV2CardProps) {
    const { sections, activeId, setActive, refreshAll } = useStep12V2Root();
    const buttons = useStep12V2Buttons();

    // CSS classes for consistent styling (matching V1)
    const containerCls = "w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-4 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40";
    const titleCls = "text-sm font-semibold text-foreground";
    const subtitleCls = "text-xs text-muted-foreground";

    // Chip styling base classes
    const chipBase = "inline-flex max-w-[240px] items-center truncate rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
    const toneActive = "border-violet-500 bg-violet-500/15 text-white hover:bg-violet-500/20 focus-visible:ring-violet-500";
    const toneNeutral = "border-border bg-background/60 text-muted-foreground hover:bg-background/80 dark:bg-background/30 focus-visible:ring-neutral-500";

    // Handle section chip click
    const onChipClick = (id: string) => {
        if (id === "all") {
            if (activeId === "all") {
                // If already viewing all sections, refresh the view
                refreshAll();
            } else {
                setActive("all");
            }
            return;
        }

        // Set active section and mark as confirmed
        setActive(id);
        buttons.confirm(id);
    };

    return (
        <div className={containerCls}>
            {/* Header section with title, subtitle and save button */}
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h3 className={titleCls}>{STEP12_V2_TEXTS.labels.sections}</h3>
                    <p className={subtitleCls}>
                        {activeId === "all"
                            ? STEP12_V2_TEXTS.labels.selectToEdit
                            : STEP12_V2_TEXTS.labels.editingEnabled
                        }
                    </p>
                </div>

                {/* Save button positioned on the right */}
                <div className="shrink-0">
                    <SaveAllV2Button page={page} />
                </div>
            </div>

            {/* Sections chips scroll area */}
            <div className="custom-scrollbar overflow-x-auto whitespace-nowrap">
                <div className="flex min-w-max items-center gap-2 pr-1">
                    {sections.map((s) => {
                        const isActive = activeId === s.id;
                        const tone = isActive ? toneActive : toneNeutral;
                        const showConfirm = s.id !== "all" && buttons.isConfirmed(s.id);

                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => onChipClick(s.id)}
                                className={`${chipBase} ${tone}`.trim()}
                                title={s.label}
                                aria-pressed={isActive}
                                disabled={s.isLoading}
                                data-testid={`${STEP12_V2_IDS.selectors.sectionChip}-${s.id}`}
                            >
                                <span className="truncate">
                                    {s.isLoading ? STEP12_V2_TEXTS.loading.sectionContent : s.label}
                                </span>

                                {/* Confirmation badge for reviewed sections */}
                                {showConfirm && (
                                    <span className="ml-2 inline-flex items-center rounded-sm bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300">
                                        {STEP12_V2_TEXTS.labels.resultBadge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
