// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/right-panel/right-panel.tsx
"use client";

/**
 * Comments are in English. UI texts are in English (US).
 *
 * RightPanel (placeholder):
 * - Shows an empty state when no content element is selected.
 * - Uses Step7RootContext to read the active section (no new types introduced).
 * - Ready to host forms (Section Meta, Content Element, Links, Additional Data) later.
 */

import * as React from "react";
import { useStep7Root } from "../../../../(_contexts)/step7-root-context";

export function RightPanel() {
  const { getActiveSection } = useStep7Root();
  const section = getActiveSection();

  // In this initial version, we don't track a selected node yet.
  const hasActiveSection = Boolean(section && section.id);

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-lg border border-neutral-800 bg-neutral-925 p-4">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-neutral-100">
          Element Editor
        </h4>
        <span className="text-xs text-neutral-500">Step 7</span>
      </div>

      {/* Empty state (no element selected) */}
      <div className="mt-2 flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm rounded-md border border-dashed border-neutral-800 bg-neutral-900/40 p-5 text-center">
          <div className="mx-auto mb-2 h-10 w-10 rounded-full border border-neutral-800 bg-neutral-875" />
          <p className="text-sm text-neutral-300">
            Select a content element on the left to view and edit its details
            here.
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {hasActiveSection
              ? "No element selected. Pick one from the tree."
              : "No section selected. Choose a section to start."}
          </p>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-3 pt-2 text-right">
        <span className="text-xs text-neutral-500">
          Changes will be saved optimistically according to app settings.
        </span>
      </div>
    </div>
  );
}
