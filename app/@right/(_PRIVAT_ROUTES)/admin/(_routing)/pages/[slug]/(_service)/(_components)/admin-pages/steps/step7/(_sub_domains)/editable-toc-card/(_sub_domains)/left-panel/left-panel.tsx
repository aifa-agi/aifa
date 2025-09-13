// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/
// admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/left-panel/left-panel.tsx
"use client";

/**
 * Comments are in English. UI texts are in English (US).
 *
 * LeftPanel:
 * - Adds a read-only mini TOC for the active section below the header and above the TreeView.
 */

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useStep7Root } from "../../../../(_contexts)/step7-root-context";
import { useDraftConfirm } from "../../../../(_hooks)/use-draft-confirm";
import { TreeView } from "./(_sub_domains)/tree/tree-view";
import { useEditableToc } from "../(_contexts)/editable-toc-context";

import { SectionTOC } from "./(_sub_domains)/tree/toc/section-toc";
import { transformSectionChildrenToTOC } from "./(_sub_domains)/tree/toc/section-toc-transformer";

export function LeftPanel() {
  const { getActiveSection, ui } = useStep7Root();
  const { confirmSection } = useDraftConfirm();

  const active = getActiveSection();
  const derived = active?.id ? ui.derivedBySection[active.id] : undefined;

  const total = derived?.total ?? 0;
  const confirmed = derived?.confirmed ?? 0;
  const isConfirmed = Boolean(derived?.isConfirmed);

  const onToggleAll = async (next: boolean) => {
    if (!next || isConfirmed) return;
    await confirmSection();
  };

  // Original data for the editable tree
  const { rootSection, nodes } = useEditableToc();

  // Build read-only TOC elements for the active section
  const tocElements = React.useMemo(
    () => transformSectionChildrenToTOC(rootSection?.realContentStructure),
    [rootSection?.realContentStructure]
  );

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-925 p-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <h3 className="text-sm font-semibold text-neutral-100 truncate line-clamp-1">
              Content Structure
            </h3>
            <p className="text-xs text-neutral-500 truncate line-clamp-2">
              Manage your draft content elements for the active section.
            </p>
            <div className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-300 w-12 text-center">
              {confirmed}/{total}
            </div>
          </div>

          {/* Metrics + Confirm all */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">
                Confirm all elements
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Switch
                      checked={isConfirmed}
                      onCheckedChange={onToggleAll}
                      disabled={isConfirmed || total === 0}
                      aria-label="Confirm all elements in the active section"
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent align="end" side="bottom" className="max-w-xs">
                  <p className="text-xs">
                    One-way action. Confirms all existing elements in the active
                    section.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Read-only mini TOC (below header, above editable tree) */}
        <SectionTOC elements={tocElements} />

        <Separator className="bg-neutral-800" />

        {/* Body: tree view (always expanded) */}
        <div className="min-h-[220px]">
          <TreeView root={rootSection} nodes={nodes} />
        </div>
      </div>
    </TooltipProvider>
  );
}
