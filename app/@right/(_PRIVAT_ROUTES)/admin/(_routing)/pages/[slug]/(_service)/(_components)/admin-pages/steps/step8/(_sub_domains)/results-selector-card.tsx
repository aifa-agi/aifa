// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_sub_domains)/results-selector-card.tsx
"use client";

/**
 * ResultsSelectorCard:
 * - Horizontal chips of H2 sections with a small badge when results exist.
 * - Keeps visual consistency with Step 7 SectionSelectorCard.
 */

import * as React from "react";
import { useStep8Root } from "../(_contexts)/step8-root-context";

function labelByIndex(index: number): string {
  return `Section ${index + 1}`;
}

export function ResultsSelectorCard() {
  const { getSections, ui, setActiveSection } = useStep8Root();
  const sections = getSections();

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

  const handlePick = React.useCallback(
    (id: string | undefined | null) => {
      if (!id) return;
      setActiveSection(id);
    },
    [setActiveSection]
  );

  return (
    <div className={containerCls}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={titleCls}>Results Navigation</h3>
        <p className={subtitleCls}>Pick a section to inspect its AI results.</p>
      </div>

      <div className="custom-scrollbar overflow-x-auto">
        <div className="flex min-w-max items-center gap-2">
          {sections.map((s, idx) => {
            const isActive = ui.activeSectionId === s.id;
            const hasResults = s.id ? !!ui.resultsBySection[s.id] : false;
            const tone = isActive
              ? tonePrimary
              : hasResults
                ? toneCompleted
                : toneNeutral;
            const label = labelByIndex(idx);
            return (
              <button
                key={s.id ?? `idx-${idx}`}
                type="button"
                onClick={() => handlePick(s.id)}
                className={[chipBase, tone].join(" ")}
                title={label}
                aria-pressed={isActive}
              >
                <span className="truncate">{label}</span>
                {hasResults && (
                  <span className="ml-2 inline-flex items-center rounded-sm bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300">
                    result
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
