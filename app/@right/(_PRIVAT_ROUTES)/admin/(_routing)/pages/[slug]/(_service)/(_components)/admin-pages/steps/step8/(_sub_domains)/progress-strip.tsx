// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_sub_domains)/progress-strip.tsx
"use client";

/**
 * ProgressStrip:
 * - Purpose: Visualize Step 8 progress across H2 sections and allow guarded activation of the current step.
 * - Data: Uses derived UI-only metrics from useStep8Status; no persistence here.
 * - Guard: Only the section at `unlockedIndex` can be activated; others are shown as completed or locked.
 *
 * Understanding of the task (step-by-step):
 * 1) The single source of truth is PageData; completion is determined by non-empty sections[].tempMDXContent.
 * 2) Derived metrics (savedCount, totalCount, coverage8, unlockedIndex, isAllSaved8) are computed on the fly.
 * 3) Only `unlockedIndex` is interactable; completed indices < unlockedIndex are non-interactive badges.
 * 4) Locked indices > unlockedIndex are disabled; guard toasts communicate the reason if attempted.
 * 5) All UI strings and comments are in English (US) as required by the project policy.
 */

import * as React from "react";
import { useStep8Status } from "../(_hooks)/use-step8-status";
import { useStep8Guard } from "../(_hooks)/use-step8-guard";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";

export function ProgressStrip() {
  const { totalCount, savedCount, coverage8, unlockedIndex, isAllSaved8 } =
    useStep8Status();
  const { canActivateIndex, setActiveSectionGuardedByIndex } = useStep8Guard();

  const hasAny = totalCount > 0;

  const baseChip =
    "inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-medium transition-colors";
  const toneCompleted = "border-emerald-500 bg-emerald-500/15 text-white";
  const toneCurrent = "border-violet-500 bg-violet-500/15 text-white";
  const toneLocked =
    "border-border bg-background/60 text-muted-foreground dark:bg-background/30";

  const onPick = (index: number) => {
    // Delegate to guard; it will handle toasts for invalid picks.
    setActiveSectionGuardedByIndex(index);
  };

  return (
    <div className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-3 dark:border-neutral-800/60 dark:bg-neutral-900/40">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground">Progress</h4>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-sm bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300">
            {savedCount}/{totalCount}
          </span>
          <span className="rounded-sm bg-orange-500/15 px-1.5 py-0.5 text-orange-300">
            {coverage8}% {STEP8_TEXTS.progress.coverageLabel}
          </span>
        </div>
      </div>

      <div className="custom-scrollbar overflow-x-auto">
        <div className="flex min-w-max items-center gap-2">
          {!hasAny ? (
            <span className="text-xs text-muted-foreground">No sections</span>
          ) : (
            Array.from({ length: totalCount }).map((_, idx) => {
              const isCompleted = idx < unlockedIndex;
              const isCurrent = idx === unlockedIndex;
              const tone = isCompleted
                ? toneCompleted
                : isCurrent
                  ? toneCurrent
                  : toneLocked;

              const label = isCompleted
                ? "Completed"
                : isCurrent
                  ? "Current"
                  : "Locked";

              return (
                <button
                  key={`s8-chip-${idx}`}
                  type="button"
                  className={`${baseChip} ${tone}`}
                  title={`${STEP8_TEXTS.labels.section} ${idx + 1} • ${label}`}
                  onClick={() => onPick(idx)}
                  disabled={!isCurrent}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                  {idx + 1}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-2 text-[11px] text-muted-foreground">
        {isAllSaved8
          ? "All sections completed."
          : "Only the current section is unlocked; finish it to proceed."}
      </div>
    </div>
  );
}

export default ProgressStrip;
