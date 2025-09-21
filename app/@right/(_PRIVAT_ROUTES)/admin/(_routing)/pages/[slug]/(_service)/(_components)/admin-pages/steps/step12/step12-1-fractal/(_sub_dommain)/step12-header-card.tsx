// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_sub_dommain)/step12-header-card.tsx


import * as React from "react";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { STEP12_TEXTS } from "../(_constants)/step12-texts";


/**
* Step12HeaderCard:
* - Shows a CTA chip with a 4px tri-state status dot INSIDE, left to label.
* - Status logic: green (isPreviewComplited === true), orange (default/otherwise).
* - Texts sourced from STEP12_TEXTS.
*/
export function Step12HeaderCard({ page }: { page?: PageData | null }) {
  const isCompleted = Boolean(page?.isPreviewComplited);


  const dotBase = "inline-block h-1 w-1 rounded-full"; // 4px
  const dotCls = isCompleted ? `${dotBase} bg-emerald-400` : `${dotBase} bg-orange-400`;


  return (
    <div className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-violet-400">
            <div className="h-5 w-5 rounded-sm bg-violet-500/30" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">Preview</h2>
              {/* можно добавить бейдж с page?.title при необходимости */}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {STEP12_TEXTS.labels.headerSubtitle}
            </p>
          </div>
        </div>


        <div className="flex shrink-0">
          <div className="inline-flex items-center gap-2 rounded-md border border-violet-500 bg-violet-500/15 px-3 py-1.5 text-sm text-white hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <span className={dotCls} aria-hidden="true" />
            <span>{STEP12_TEXTS.labels.headerCta}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


