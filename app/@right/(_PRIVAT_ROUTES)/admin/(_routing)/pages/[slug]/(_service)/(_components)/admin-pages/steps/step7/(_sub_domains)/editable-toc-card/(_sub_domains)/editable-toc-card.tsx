// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/editable-toc-card.tsx
"use client";

/*
  CSS-only improvement — Comments in English:

  Goals:
  - Match the neutral "card-like" surface used across the app (light/dark).
  - Use theme tokens for text: text-foreground (primary) and text-muted-foreground (secondary).
  - Keep JSX and behavior unchanged.
*/

import * as React from "react";
import { RightPanel } from "./right-panel/right-panel";
import { LeftPanel } from "./left-panel/left-panel";
import { useStep7Root } from "../../../(_contexts)/step7-root-context";
import { getPageTitleSafe } from "../../../(_utils)/step7-utils";
import { EditableTocProvider } from "./(_contexts)/editable-toc-context";
import { RightFormsProvider } from "./right-panel/(_sub_domains)/forms/forms/(_contexts)/forms-context";

export function EditableTocCard() {
  const { page, getActiveSection } = useStep7Root();

  const pageTitle = React.useMemo(
    () => getPageTitleSafe(page),
    [page?.title, page?.metadata?.title, page?.linkName]
  );

  const active = getActiveSection();

  const sectionLabel =
    (active?.description && active.description.trim()) ||
    (active?.intent && active.intent.trim()) ||
    (active?.taxonomy && active.taxonomy.trim()) ||
    (active?.id ? `#${active.id.slice(0, 8)}` : "Untitled section");

  const hasActive = Boolean(active && active.id);

  return (
    <EditableTocProvider>
      <RightFormsProvider>
        <div className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-4 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Draft Structure Editor
            </h3>
            <p className="text-xs text-muted-foreground">
              Prepare and confirm content elements before generation.
            </p>
          </div>

          <div className="mb-3 text-xs text-muted-foreground">
            {hasActive ? (
              <span className="text-muted-foreground">
                Section: <span className="text-foreground">{sectionLabel}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">No section selected</span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="md:col-span-5">
              <LeftPanel />
            </div>
            <div className="md:col-span-7">
              <RightPanel />
            </div>
          </div>
        </div>
      </RightFormsProvider>
    </EditableTocProvider>
  );
}
