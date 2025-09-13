// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/left-panel/editable-toc-card.tsx
"use client";

/**
 * Comments are in English. UI texts are in English (US).
 *
 * EditableTocCard:
 * - High-level composition for Step 7 editing area.
 * - Left column: LeftPanel (tree and controls).
 * - Right column: temporary placeholder "Element Editor" area.
 * - No local state; relies on Step7RootContext and sub-components.
 */

import * as React from "react";
import { LeftPanel } from "./left-panel";

export function EditableTocCard() {
  return (
    <div className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-100">
          Draft Structure Editor
        </h3>
        <p className="text-xs text-neutral-400">
          Prepare and confirm content elements before generation.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Left column */}
        <div className="md:col-span-5">
          <LeftPanel />
        </div>

        {/* Right column (temporary placeholder) */}
        <div className="md:col-span-7">
          <div className="flex h-full min-h-[320px] flex-col rounded-lg border border-neutral-800 bg-neutral-925 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-neutral-100">
                Element Editor
              </h4>
              <span className="text-xs text-neutral-500">Step 7</span>
            </div>

            <div className="mt-2 rounded-md border border-dashed border-neutral-800 bg-neutral-900/40 p-4">
              <p className="text-sm text-neutral-300">
                Select a content element on the left to view and edit its
                details here.
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                This area will host forms and controls in the next steps.
              </p>
            </div>

            <div className="mt-auto pt-3 text-right">
              <span className="text-xs text-neutral-500">
                Changes are saved optimistically according to app settings.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
