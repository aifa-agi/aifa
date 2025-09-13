// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/editable-toc-card.tsx

"use client";

/**
 * Comments are in English. UI texts are in English (US).
 *
 * EditableTocCard:
 * - High-level composition for Step 7 editing area.
 * - Shows a common header (title + short description + breadcrumbs).
 * - Left column: LeftPanel (tree and controls).
 * - Right column: RightPanel (placeholder with empty selection state).
 */

import * as React from "react";
import { RightPanel } from "./right-panel/right-panel";
import { LeftPanel } from "./left-panel/left-panel";
import { useStep7Root } from "../../../(_contexts)/step7-root-context";
import { getPageTitleSafe } from "../../../(_utils)/step7-utils";
import { EditableTocProvider } from "./(_contexts)/editable-toc-context";

export function EditableTocCard() {
  const { page, getActiveSection } = useStep7Root();

  // Derive page title safely for UI (plain string).
  const pageTitle = React.useMemo(
    () => getPageTitleSafe(page),
    // Depend on optional page props to recalc when they change.
    [page?.title, page?.metadata?.title, page?.linkName]
  );

  // Active section reference (if any).
  const active = getActiveSection();

  // Try to show a human-friendly section label; fall back to short id or 'Untitled section'.
  const sectionLabel =
    (active?.description && active.description.trim()) ||
    (active?.intent && active.intent.trim()) ||
    (active?.taxonomy && active.taxonomy.trim()) ||
    (active?.id ? `#${active.id.slice(0, 8)}` : "Untitled section");

  const hasActive = Boolean(active && active.id);

  return (
    <EditableTocProvider>
      <div className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
        {/* Common header above both columns */}
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-100">
            Draft Structure Editor
          </h3>
          <p className="text-xs text-neutral-400">
            Prepare and confirm content elements before generation.
          </p>
        </div>

        {/* Breadcrumbs line */}
        <div className="mb-3 text-xs text-neutral-500">
          {hasActive ? (
            <span className="text-neutral-400">
              Section: <span className="text-neutral-300">{sectionLabel}</span>
            </span>
          ) : (
            <span className="text-neutral-400">No section selected</span>
          )}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Left column */}
          <div className="md:col-span-5">
            <LeftPanel />
          </div>

          {/* Right column */}
          <div className="md:col-span-7">
            <RightPanel />
          </div>
        </div>
      </div>
    </EditableTocProvider>
  );
}
