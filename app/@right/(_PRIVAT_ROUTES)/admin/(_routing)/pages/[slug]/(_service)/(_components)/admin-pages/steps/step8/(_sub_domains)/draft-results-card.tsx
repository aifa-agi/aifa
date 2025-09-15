// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_sub_domains)/draft-results-card.tsx
"use client";

/**
 * DraftResultsCard:
 * - Purpose: Provide an integrated workspace to generate (stream or one-shot) and edit MDX
 *   for the currently active H2 section under Step 8 strict sequence rules.
 * - Composition: Left column -> DraftGenerateCard (generation UI),
 *                Right column -> MDXEditorCard (manual editing & saving).
 *
 * Understanding of the task (step-by-step):
 * 1) Active section is controlled by Step8RootProvider; we only read it and do not mutate PageData here.
 * 2) Progress/sequence state is derived (useStep8Status) and must not be persisted.
 * 3) Only the unlocked section can be generated (enforced by hooks in generator/editor flows).
 * 4) This card avoids importing ProgressStrip for now to keep the step self-contained and compilable.
 * 5) All UI strings and comments are in English (US) as per project policy.
 */

import * as React from "react";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import { useStep8Status } from "../(_hooks)/use-step8-status";
import { useStep8Guard } from "../(_hooks)/use-step8-guard";
import { DraftGenerateCard } from "./draft-generate-card";
import { MDXEditorCard } from "./mdx-editor-card";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";

export function DraftResultsCard() {
  const { getActiveSection } = useStep8Root();
  const { coverage8, unlockedIndex, totalCount, savedCount } = useStep8Status();
  const { canActivateId } = useStep8Guard();

  const active = getActiveSection();
  const activeId = active?.id ?? null;
  const canWork = activeId ? canActivateId(activeId) : false;

  return (
    <div className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-4 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
      {/* Header row with lightweight progress facts (no ProgressStrip dependency yet) */}
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-col">
          <h3 className="truncate text-sm font-semibold text-foreground">
            Draft Workspace
          </h3>
          <p className="text-xs text-muted-foreground">
            Use streaming or one-shot generation, then refine and save the MDX.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md border border-neutral-200 bg-neutral-50/60 px-3 py-2 dark:border-neutral-800/60 dark:bg-neutral-900/30">
            <div className="text-sm font-semibold text-emerald-400">
              {coverage8}%
            </div>
            <div className="text-[10px] text-muted-foreground">
              {STEP8_TEXTS.progress.coverageLabel}
            </div>
          </div>
          <div className="rounded-md border border-neutral-200 bg-neutral-50/60 px-3 py-2 dark:border-neutral-800/60 dark:bg-neutral-900/30">
            <div className="text-sm font-semibold text-violet-400">
              {unlockedIndex + 1}/{totalCount}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {STEP8_TEXTS.progress.currentLabel}
            </div>
          </div>
          <div className="rounded-md border border-neutral-200 bg-neutral-50/60 px-3 py-2 dark:border-neutral-800/60 dark:bg-neutral-900/30">
            <div className="text-sm font-semibold text-orange-400">
              {savedCount}
            </div>
            <div className="text-[10px] text-muted-foreground">Saved</div>
          </div>
        </div>
      </div>

      {/* Active section summary */}
      <div className="mb-3 flex items-center justify-between">
        <div className="min-w-0">
          <div className="truncate text-xs text-muted-foreground">
            {active?.description
              ? `Active section: ${active.description}`
              : activeId
                ? `Active section ID: ${activeId}`
                : "No active section selected"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeId ? (
            canWork ? (
              <span className="rounded-sm bg-violet-500/20 px-2 py-0.5 text-[11px] text-violet-300">
                {STEP8_TEXTS.selector.activeBadge}
              </span>
            ) : (
              <span className="rounded-sm bg-neutral-500/20 px-2 py-0.5 text-[11px] text-neutral-300">
                {STEP8_TEXTS.selector.lockedBadge}
              </span>
            )
          ) : null}
        </div>
      </div>

      {/* Two-column workspace: left -> generation (stream/one-shot), right -> editor */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-neutral-200 bg-background/60 p-3 dark:border-neutral-800/60 dark:bg-background/30">
          <DraftGenerateCard />
        </div>
        <div className="rounded-md border border-neutral-200 bg-background/60 p-3 dark:border-neutral-800/60 dark:bg-background/30">
          <MDXEditorCard />
        </div>
      </div>

      {/* Hint about the chain policy */}
      <p className="mt-3 text-xs text-muted-foreground">
        Clearing the current section revokes the chain and locks the next ones
        until restored.
      </p>
    </div>
  );
}

export default DraftResultsCard;
