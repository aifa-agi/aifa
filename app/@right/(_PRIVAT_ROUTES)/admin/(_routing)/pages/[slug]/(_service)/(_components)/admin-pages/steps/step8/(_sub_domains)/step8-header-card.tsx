// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_sub_domains)/step8-header-card.tsx
"use client";

/**
 * Step8HeaderCard:
 * - Shows summary metrics and last update.
 * - Adds a 4px tri-state status dot INSIDE the "Regenerate draft" button, left to the label.
 * - Status logic: green (all saved), gray (none saved or zero sections), orange (partial).
 * - Uses derived UI-only metrics from useStep8Status (no persistence).
 */

import * as React from "react";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import { useStep8Status } from "../(_hooks)/use-step8-status";

export function Step8HeaderCard() {
  const { page, getSections, ui } = useStep8Root();
  const { savedCount, totalCount, isAllSaved8 } = useStep8Status();

  const sections = getSections();
  const total = sections.length;
  const withResults = sections.filter(
    (s) => s.id && ui.resultsBySection[s.id]
  ).length;
  const pct = total > 0 ? Math.round((withResults / total) * 100) : 0;

  const updatedAt =
    typeof page?.updatedAt === "string"
      ? new Date(page!.updatedAt!).toLocaleString()
      : "—";

  // Tri-state: green (all), gray (none), orange (partial) — 4px dot
  const statusTone =
    totalCount === 0 || savedCount === 0
      ? "empty"
      : isAllSaved8
        ? "complete"
        : "partial";
  const dotBase = "inline-block h-1 w-1 rounded-full"; // 4px
  const dotCls =
    statusTone === "complete"
      ? `${dotBase} bg-emerald-400`
      : statusTone === "partial"
        ? `${dotBase} bg-orange-400`
        : `${dotBase} bg-neutral-500/60`;

  return (
    <div className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-violet-400">
            {/* icon placeholder */}
            <div
              className="h-5 w-5 rounded-sm bg-violet-500/30"
              aria-hidden="true"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">
                Draft Results
              </h2>
              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                {page?.title ?? page?.linkName ?? "Untitled Page"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Review AI draft results and analysis before proceeding to
              reporting.
            </p>
          </div>
        </div>

        <div className="flex shrink-0">
          <div className="inline-flex items-center gap-2 rounded-md border border-violet-500 bg-violet-500/15 px-3 py-1.5 text-sm text-white hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            {/* 4px status dot placed inside the button, left to the label */}
            <span className={`${dotCls}`} aria-hidden="true" />
            <span> Generate draft</span>
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Last update: {updatedAt}
      </p>
    </div>
  );
}
