/**
 * Save All V2 Button - File System Based Section Editor
 * AUTONOMOUS VERSION - mirrors SaveAllButton but adapted for V2 architecture
 * Integrates with Step12V2 contexts for save functionality and button state management
 */

"use client";

import React from "react";
import { useStep12V2Root } from "../(_contexts)/step12-v2-root-context";
import { useStep12V2Buttons } from "../(_contexts)/step12-v2-buttons-context";
import { useStep12V2Save } from "../(_hooks)/use-step12-v2-save";
import { STEP12_V2_TEXTS } from "../(_constants)/step12-v2-texts";
import { STEP12_V2_IDS } from "../(_constants)/step12-v2-ids";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface SaveAllV2ButtonProps {
    page?: PageData | null;
}

/**
 * Utility function for combining class names - mirrors cx from V1
 */
function cx(...arr: Array<string | false | null | undefined>): string {
    return arr.filter(Boolean).join(" ");
}

/**
 * SaveAllV2Button - Main save button component for V2
 * FIXED: Proper type handling for page parameter (null safety)
 */
export function SaveAllV2Button({ page }: SaveAllV2ButtonProps) {
    const { isAllReady, resetAllFlags, setSaving } = useStep12V2Root();
    const { allConfirmed, resetAll: resetButtonFlags } = useStep12V2Buttons();

    // Convert page to proper type: null becomes undefined
    const pageForHook: PageData | undefined = page || undefined;

    const { save, saving } = useStep12V2Save(
        useStep12V2Root().sections,
        isAllReady,
        resetAllFlags,
        setSaving,
        pageForHook // Now correctly typed as PageData | undefined
    );

    // Button is disabled if: no page, not all sections confirmed, or currently saving
    const disabled = !allConfirmed || saving || !page;

    const onClick = async () => {
        if (!page) return;

        const success = await save(page);
        if (success) {
            // Reset button confirmation flags after successful save
            resetButtonFlags();
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={cx(
                    "inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                    disabled
                        ? "cursor-not-allowed border-border bg-muted text-muted-foreground"
                        : "border-emerald-500 bg-emerald-500/15 text-white hover:bg-emerald-500/20"
                )}
                aria-busy={saving}
                data-testid={STEP12_V2_IDS.selectors.saveAllButton}
            >
                {saving
                    ? STEP12_V2_TEXTS.labels.saving
                    : STEP12_V2_TEXTS.labels.saveAll
                }
            </button>
        </div>
    );
}
