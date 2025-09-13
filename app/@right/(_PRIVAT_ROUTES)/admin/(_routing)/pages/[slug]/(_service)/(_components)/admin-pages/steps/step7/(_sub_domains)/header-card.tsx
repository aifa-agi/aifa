// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)
/*  /(_components)/admin-pages/steps/step7/(_sub_domains)/header-card.tsx */

"use client";

/**
 * Comments are in English. UI texts are in English (US).
 * HeaderCard: dark card header for Step 7 with page title and section metrics.
 *
 * Changes:
 * - "Draft Editor" button is highlighted with primary style (same as active section chip).
 * - Left dot indicator inside the button reflects readiness:
 *   gray (0%), orange (1-99%), green (100%).
 */

import React, { useMemo } from "react";
import { useStep7Root } from "../(_contexts)/step7-root-context";
import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";
import { getPageTitleSafe } from "../(_utils)/step7-utils";

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      className={`h-5 w-5 ${props.className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Map ready percentage to indicator color classes. */
function readyDotClass(pct: number): string {
  if (pct <= 0) return "bg-neutral-400";
  if (pct >= 100) return "bg-emerald-400";
  return "bg-orange-400";
}

export function HeaderCard() {
  const { page, getDraftSections, ui } = useStep7Root();

  // Always return a plain string for JSX
  const pageTitleText = useMemo(
    () => getPageTitleSafe(page),
    [page?.title, page?.metadata?.title, page?.linkName]
  );

  const { total, completed, inProgress, readyPct } = useMemo(() => {
    const roots = getDraftSections() as RootContentStructure[];
    const total = roots.length;
    const completed = roots.filter((r) => r.status === "checked").length;
    const inProgress = roots.reduce(
      (acc, r) =>
        r.id && ui.derivedBySection[r.id]?.inProcess ? acc + 1 : acc,
      0
    );
    const readyPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, readyPct };
  }, [getDraftSections, ui.derivedBySection]);

  // Primary-styled button (same tone as active section chip)
  const editorBtnBase =
    "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors";
  const editorBtnTone =
    "border-violet-500 bg-violet-500/15 text-neutral-100 hover:bg-violet-500/20";

  return (
    <div className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-violet-400">
            <PencilIcon />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-neutral-100">
                Draft Preparation
              </h2>
              <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300">
                {pageTitleText}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-400">
              Prepare your content structure for generation. Make necessary
              adjustments before launching the content generation process.
            </p>
          </div>
        </div>

        {/* Draft Editor primary-highlighted with dynamic readiness dot */}
        <div className="flex shrink-0">
          <button
            type="button"
            className={`${editorBtnBase} ${editorBtnTone}`}
            aria-label="Open draft editor"
            title="Open draft editor"
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${readyDotClass(
                readyPct
              )}`}
              aria-hidden="true"
            />
            Draft Editor
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="rounded-md border border-neutral-800 bg-neutral-925 p-4 text-center">
          <div className="text-xl font-semibold text-violet-400">{total}</div>
          <div className="text-xs text-neutral-400">Total Sections</div>
        </div>
        <div className="rounded-md border border-neutral-800 bg-neutral-925 p-4 text-center">
          <div className="text-xl font-semibold text-emerald-400">
            {completed}
          </div>
          <div className="text-xs text-neutral-400">Completed</div>
        </div>

        <div className="rounded-md border border-neutral-800 bg-neutral-925 p-4 text-center">
          <div className="text-xl font-semibold text-orange-400">
            {readyPct}%
          </div>
          <div className="text-xs text-neutral-400">Ready</div>
        </div>
      </div>
    </div>
  );
}
