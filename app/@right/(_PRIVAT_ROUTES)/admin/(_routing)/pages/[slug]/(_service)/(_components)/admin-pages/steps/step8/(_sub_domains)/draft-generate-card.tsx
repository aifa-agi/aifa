// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_sub_domains)/draft-generate-card.tsx
"use client";

/**
 * DraftGenerateCard:
 * - Keeps the streaming generation flow intact (production-proven).
 * - Replaces the former "One-shot Generate" with a "Copy Prompt" action.
 * - "Copy Prompt" copies the current system instruction to the clipboard.
 *
 * Notes:
 * - UI strings and comments are in English (US). Toaster: Sonner.
 * - No persistence here; saving is delegated to useStep8Save.
 */

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { useStep8Guard } from "../(_hooks)/use-step8-guard";
import { useStep8Prompt } from "../(_hooks)/use-step8-prompt";
import { useStep8Stream } from "../(_hooks)/use-step8-stream";
import { useStep8Save } from "../(_hooks)/use-step8-save";
import { toast } from "sonner";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { STEP8_IDS } from "../(_constants)/step8-ids";
import { useStep8Root } from "../(_contexts)/step8-root-context";

export function DraftGenerateCard() {
  const { getActiveSection } = useStep8Root();
  const { canActivateId } = useStep8Guard();
  const { buildForActiveSection } = useStep8Prompt(); // ✅ Правильное название функции
  const { saveSectionTempMDX } = useStep8Save();

  const active = getActiveSection();
  const activeId = active?.id ?? null;

  // Streaming hook for live preview
  const { streamText, isStreaming, startStreaming, cancel } = useStep8Stream();
  const [localPreview, setLocalPreview] = React.useState<string>("");

  // Keep the textarea in sync with the streaming completion
  React.useEffect(() => {
    if (isStreaming) {
      setLocalPreview(streamText ?? "");
    }
  }, [isStreaming, streamText]);

  // Chip-style classes aligned with ResultsSelectorCard/Progress
  const chipBase =
    "inline-flex items-center truncate rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const tonePrimary =
    "border-violet-500 bg-violet-500/15 text-white hover:bg-violet-500/20 focus-visible:ring-violet-500";
  const toneNeutral =
    "border-border bg-background/60 text-muted-foreground hover:bg-background/80 dark:bg-background/30 focus-visible:ring-neutral-500";
  const toneDisabled = "opacity-50 cursor-not-allowed";
  const toneCancel =
    "border-border bg-background/60 text-muted-foreground hover:bg-background/70 dark:bg-background/30 focus-visible:ring-neutral-500";

  const onStream = async () => {
    if (!activeId) {
      toast.error(STEP8_TEXTS.errors.missingActive, {
        id: STEP8_IDS.toasts.generateError,
        description: STEP8_TEXTS.selector.selectPrompt,
      });
      return;
    }
    if (!canActivateId(activeId)) {
      toast.error(STEP8_TEXTS.guard.lockedTitle, {
        id: STEP8_IDS.toasts.guardLocked,
        description: STEP8_TEXTS.guard.lockedDescription,
      });
      return;
    }
    const prompt = buildForActiveSection(); // ✅ Правильное название функции
    if (!prompt) return;

    // Clear preview and start streaming
    setLocalPreview("");
    await startStreaming({
      system: prompt.system,
      prompt: prompt.user,
      model: "gpt-4.1-mini",
    });
  };

  // ✅ Исправленная функция копирования с правильным названием
  const onCopyPrompt = async () => {
    if (!activeId) {
      toast.error(STEP8_TEXTS.errors.missingActive, {
        id: STEP8_IDS.toasts.copyError,
        description: STEP8_TEXTS.selector.selectPrompt,
      });
      return;
    }
    const prompt = buildForActiveSection(); // ✅ Правильное название функции
    if (!prompt) return;

    try {
      await navigator.clipboard.writeText(prompt.system);
      toast.success(STEP8_TEXTS.copy.successTitle, {
        id: STEP8_IDS.toasts.copySuccess,
        description: STEP8_TEXTS.copy.successDescription,
      });
    } catch {
      toast.error(STEP8_TEXTS.copy.errorTitle, {
        id: STEP8_IDS.toasts.copyError,
        description: STEP8_TEXTS.copy.errorDescription,
      });
    }
  };

  const onSave = async () => {
    if (!activeId) return;
    const ok = await saveSectionTempMDX(activeId, localPreview ?? "");
    if (ok) {
      toast.success(STEP8_TEXTS.save.successTitle, {
        id: STEP8_IDS.toasts.saveSuccess,
        description: STEP8_TEXTS.save.successDescription,
      });
    }
  };

  const onClear = () => {
    setLocalPreview("");
    toast.info(STEP8_TEXTS.save.clearedTitle, {
      id: STEP8_IDS.toasts.saveCleared,
      description: STEP8_TEXTS.save.clearedDescription,
    });
  };

  const streamDisabled = isStreaming;

  return (
    <div className="rounded-md border p-4">
      {/* Single-row chip buttons with horizontal scroll; wrapped by custom sidebar styling */}
      <div className="custom-sidebar overflow-x-auto">
        <div className="flex min-w-max items-center gap-2">
          <button
            type="button"
            onClick={onStream}
            disabled={streamDisabled}
            className={[
              chipBase,
              tonePrimary,
              streamDisabled ? toneDisabled : "",
            ].join(" ")}
          >
            {isStreaming ? "Streaming..." : "Stream Generate"}
          </button>

          {/* Copy Prompt button with correct function */}
          <button
            type="button"
            onClick={onCopyPrompt}
            disabled={!activeId}
            className={[
              chipBase,
              toneNeutral,
              !activeId ? toneDisabled : "",
            ].join(" ")}
            title="Copy current system instruction"
          >
            {STEP8_TEXTS.labels.copyPrompt}
          </button>

          {isStreaming && (
            <button
              type="button"
              onClick={cancel}
              className={[chipBase, toneCancel].join(" ")}
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={onClear}
            className={[chipBase, toneNeutral].join(" ")}
          >
            Clear
          </button>

          <button
            type="button"
            onClick={onSave}
            className={[chipBase, tonePrimary].join(" ")}
          >
            Save to Section
          </button>
        </div>
      </div>

      <div className="mt-3">
        <Textarea
          value={localPreview}
          onChange={(e) => setLocalPreview(e.target.value)}
          placeholder="Streaming MDX will appear here..."
          className="min-h-[240px]"
        />
      </div>
    </div>
  );
}
