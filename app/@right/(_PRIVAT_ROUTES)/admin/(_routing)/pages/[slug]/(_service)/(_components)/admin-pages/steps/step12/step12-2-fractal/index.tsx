// 3) step12-12fractal/index.ts
// /Users/romanbolshiyanov/Documents/Code/Aifa/aifa-main/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-12fractal/index.ts

"use client";

import React from "react";
import { AdminPageInfoProps } from "../../../admin-page-info/(_service)/(_types)/admin-page-types";


/**
 * Placeholder for Step 12-2 subtree.
 * - Will load FS JSON via a dedicated read router in the next phase.
 * - Keeps the same props contract to be swappable without touching the router.
 */
export function Step12V2({ slug }: AdminPageInfoProps) {
    return (
        <div className="w-full h-full">
            <div className="mx-auto p-4 md:p-6 gap-2 md:gap-4 flex flex-col h-full">
                <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                    здесь будет 12‑2
                </div>
            </div>
        </div>
    );
}
