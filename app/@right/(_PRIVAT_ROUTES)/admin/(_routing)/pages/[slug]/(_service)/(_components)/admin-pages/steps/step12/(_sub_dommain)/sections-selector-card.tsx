// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_sub_domains)/sections-selector-card.tsx
"use client";

import * as React from "react";
import { useStep12Root } from "../(_contexts)/step12-root-context";
import { STEP12_TEXTS } from "../(_constants)/step12-texts";
import { SaveAllButton } from "./save-all-button";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";

export function SectionsSelectorCard({ page }: { page?: PageData | null }) {
    const { sections, activeId, setActive, loadSectionData } = useStep12Root();

    const containerCls =
        "w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-4 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40";
    const titleCls = "text-sm font-semibold text-foreground";
    const subtitleCls = "text-xs text-muted-foreground";

    const chipBase =
        "inline-flex max-w-[240px] items-center truncate rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
    const tonePrimary =
        "border-violet-500 bg-violet-500/15 text-white hover:bg-violet-500/20 focus-visible:ring-violet-500";
    const toneCompleted =
        "border-emerald-500 bg-emerald-500/15 text-white hover:bg-emerald-500/20 focus-visible:ring-emerald-500";
    const toneNeutral =
        "border-border bg-background/60 text-muted-foreground hover:bg-background/80 dark:bg-background/30 focus-visible:ring-neutral-500";

    const onChipClick = async (id: string) => {
        if (id === "all") setActive("all");
        else await loadSectionData(id);
    };

    return (
        <div className={containerCls}>
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h3 className={titleCls}>{STEP12_TEXTS.labels.sections}</h3>
                    <p className={subtitleCls}>
                        {activeId === "all"
                            ? STEP12_TEXTS.labels.selectToEdit
                            : STEP12_TEXTS.labels.editingEnabled}
                    </p>
                </div>
                <div className="shrink-0">
                    <SaveAllButton page={page} />
                </div>
            </div>

            <div className="custom-scrollbar overflow-x-auto whitespace-nowrap">
                <div className="flex min-w-max items-center gap-2 pr-1">
                    {sections.map((s) => {
                        const isActive = activeId === s.id;
                        const tone = isActive ? tonePrimary : s.hasData ? toneCompleted : toneNeutral;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => onChipClick(s.id)}
                                className={[chipBase, tone].join(" ")}
                                title={s.label}
                                aria-pressed={isActive}
                                disabled={s.isLoading}
                            >
                                <span className="truncate">{s.isLoading ? "Loading..." : s.label}</span>
                                {s.id !== "all" && s.hasData && (
                                    <span className="ml-2 inline-flex items-center rounded-sm bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300">
                                        {STEP12_TEXTS.labels.resultBadge}
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
