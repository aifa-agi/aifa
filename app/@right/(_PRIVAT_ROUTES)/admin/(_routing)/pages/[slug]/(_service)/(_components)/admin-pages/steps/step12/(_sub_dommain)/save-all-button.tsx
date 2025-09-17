// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_sub_domains)/save-all-button.tsx
"use client";

import * as React from "react";
import { useStep12Root } from "../(_contexts)/step12-root-context";
import { useStep12Save } from "../(_hooks)/use-step12-save";
import { STEP12_TEXTS } from "../(_constants)/step12-texts";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";

function cx(...arr: Array<string | false | null | undefined>) {
    return arr.filter(Boolean).join(" ");
}

export function SaveAllButton({ page }: { page?: PageData | null }) {
    const { isAllReady } = useStep12Root();
    const { loading, error, save } = useStep12Save();
    const disabled = !isAllReady() || loading;

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => save(page)}
                disabled={disabled}
                className={cx(
                    "inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                    disabled
                        ? "cursor-not-allowed border-border bg-muted text-muted-foreground"
                        : "border-emerald-500 bg-emerald-500/15 text-white hover:bg-emerald-500/20"
                )}
                aria-busy={loading}
            >
                {loading ? STEP12_TEXTS.labels.saving : STEP12_TEXTS.labels.saveAll}
            </button>
            {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
    );
}
