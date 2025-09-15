// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_sub_domains)/mdx-editor-card.tsx
"use client";

/**
 * MDXEditorCard:
 * - Top-right action buttons use the app's chip-style design to match Results Navigation / Progress.
 * - Actions are in a single horizontal row with horizontal scroll when overflowing.
 * - Row is wrapped with 'custom-sidebar' to reuse the global sidebar style.
 *
 * Notes:
 * - Saves/clears via useStep8Save; does not perform generation.
 */

import * as React from "react";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import { useStep8Status } from "../(_hooks)/use-step8-status";
import { useStep8Save } from "../(_hooks)/use-step8-save";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { Textarea } from "@/components/ui/textarea";

export function MDXEditorCard() {
  const { page, getActiveSection } = useStep8Root();
  const { getCompletionFor } = useStep8Status();
  const { saveSectionTempMDX, clearSectionTempMDX } = useStep8Save();

  const active = getActiveSection();
  const activeId = active?.id ?? null;

  // Read the saved MDX for the active section from PageData.sections
  const savedMDX = React.useMemo(() => {
    if (!activeId) return "";
    const sections = page?.sections ?? [];
    const found = sections.find((s) => s?.id === activeId);
    return (found?.tempMDXContent ?? "").toString();
  }, [page?.sections, activeId]);

  // Local editor state
  const [editorValue, setEditorValue] = React.useState<string>("");

  // Keep editor in sync with saved content when active section changes
  React.useEffect(() => {
    setEditorValue(savedMDX);
  }, [savedMDX, activeId]);

  const isCompleted = getCompletionFor(activeId);
  const isDirty = editorValue !== savedMDX;
  const hasActive = Boolean(activeId);

  // Chip-style classes aligned with ResultsSelectorCard/Progress
  const chipBase =
    "inline-flex items-center truncate rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const tonePrimary =
    "border-violet-500 bg-violet-500/15 text-white hover:bg-violet-500/20 focus-visible:ring-violet-500";
  const toneNeutral =
    "border-border bg-background/60 text-muted-foreground hover:bg-background/80 dark:bg-background/30 focus-visible:ring-neutral-500";
  const toneDisabled = "opacity-50 cursor-not-allowed";

  const onSave = async () => {
    if (!activeId) return;
    await saveSectionTempMDX(activeId, editorValue ?? "");
  };

  const onClear = async () => {
    if (!activeId) return;
    await clearSectionTempMDX(activeId);
  };

  // Empty state when no section is active
  if (!hasActive) {
    return (
      <div className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-4 text-sm text-muted-foreground dark:border-neutral-800/60 dark:bg-neutral-900/40">
        {STEP8_TEXTS.editor.emptyState}
      </div>
    );
  }

  return (
    <div className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-4 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">MDX Editor</h3>
          {isCompleted ? (
            <span className="rounded-sm bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
              {STEP8_TEXTS.editor.completedBadge}
            </span>
          ) : (
            <span className="rounded-sm bg-neutral-500/20 px-2 py-0.5 text-xs text-neutral-300">
              Draft
            </span>
          )}
        </div>

        {/* Single-row chip buttons with horizontal scroll; wrapped by custom sidebar styling */}
        <div className="custom-sidebar overflow-x-auto">
          <div className="flex min-w-max items-center gap-2">
            <button
              type="button"
              onClick={onClear}
              className={[chipBase, toneNeutral].join(" ")}
            >
              Discard
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!isDirty}
              className={[
                chipBase,
                tonePrimary,
                !isDirty ? toneDisabled : "",
              ].join(" ")}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <Textarea
        value={editorValue}
        onChange={(e) => setEditorValue(e.target.value)}
        placeholder={STEP8_TEXTS.editor.placeholder}
        className="min-h-[300px]"
      />

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{isDirty ? "Unsaved changes" : "No changes"}</span>
        <span>
          {active?.description
            ? `Section: ${active.description}`
            : "Current section"}
        </span>
      </div>
    </div>
  );
}

export default MDXEditorCard;
