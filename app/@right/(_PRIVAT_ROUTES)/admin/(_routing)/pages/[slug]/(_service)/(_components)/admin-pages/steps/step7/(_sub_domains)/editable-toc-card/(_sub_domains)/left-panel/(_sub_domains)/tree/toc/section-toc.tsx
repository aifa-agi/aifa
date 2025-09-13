// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/
// (_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/
// (_sub_domains)/left-panel/(_sub_domains)/toc/section-toc.tsx

"use client";

// Comments are in English. UI texts are in English (US).
// Read-only mini TOC for the active section.

import * as React from "react";
import {
  Tree,
  type TreeViewElement,
  CollapseButton,
} from "@/components/extension/toc/tree-view-api";
import { SectionTreeItem } from "./tree-item";

type SectionTOCProps = {
  elements: TreeViewElement[];
};

export function SectionTOC({ elements }: SectionTOCProps) {
  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-2">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-semibold text-neutral-200">
          Section Outline
        </h4>
        <span className="text-[10px] text-neutral-500">Read-only</span>
      </div>
      <Tree
        className="w-full h-40 bg-neutral-925 p-2 rounded-md border border-neutral-800"
        indicator={true}
      >
        {elements.map((el) => (
          <SectionTreeItem key={el.id} elements={[el]} />
        ))}
        <CollapseButton elements={elements} expandAll={true} />
      </Tree>
    </div>
  );
}
