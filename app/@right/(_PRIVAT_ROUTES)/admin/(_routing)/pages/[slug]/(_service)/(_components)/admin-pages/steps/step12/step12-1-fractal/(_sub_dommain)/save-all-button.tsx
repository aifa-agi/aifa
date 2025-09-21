// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_sub_dommain)/save-all-button.tsx
"use client";

/**
 * Changes (EN):
 * - Uses ButtonsContext to enable button only when all sections are confirmed.
 * - Awaits save(); on success resets all confirmation flags.
 * - Keeps existing saving logic and toasts via useStep12Save.
 */

import * as React from "react";
import { useStep12Save } from "../(_hooks)/use-step12-save";
import { STEP12_TEXTS } from "../(_constants)/step12-texts";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { useStep12Buttons } from "../(_contexts)/step12-buttons-context";

function cx(...arr: Array<string | false | null | undefined>) {
    return arr.filter(Boolean).join(" ");
}

export function SaveAllButton({ page }: { page?: PageData | null }) {
    const { save, saving } = useStep12Save();
    const { allConfirmed, resetAll } = useStep12Buttons();

    const disabled = !allConfirmed || saving || !page;

    const onClick = async () => {
        if (!page) return;
        const ok = await save(page);
        if (ok) {
            resetAll();
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
            >
                {saving ? STEP12_TEXTS.labels.saving : STEP12_TEXTS.labels.saveAll}
            </button>
        </div>
    );
}
