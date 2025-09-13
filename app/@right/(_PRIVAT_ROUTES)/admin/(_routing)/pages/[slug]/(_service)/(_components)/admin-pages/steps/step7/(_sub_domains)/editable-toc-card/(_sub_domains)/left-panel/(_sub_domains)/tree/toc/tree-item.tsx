// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/
// (_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/
// (_sub_domains)/left-panel/(_sub_domains)/toc/tree-item.tsx

"use client";

// Comments are in English. UI texts are in English (US).

import {
  File,
  Folder,
  type TreeViewElement,
} from "@/components/extension/toc/tree-view-api";

type TreeItemProps = {
  elements: TreeViewElement[];
};

export function SectionTreeItem({ elements }: TreeItemProps) {
  return (
    <ul className="w-full space-y-1">
      {elements.map((element) => (
        <li key={element.id} className="w-full space-y-2">
          {element.children && element.children.length > 0 ? (
            <Folder
              element={element.name}
              value={element.id}
              isSelectable={element.isSelectable}
              className="px-px pr-1"
            >
              <SectionTreeItem
                key={element.id}
                aria-label={`folder ${element.name}`}
                elements={element.children}
              />
            </Folder>
          ) : (
            <File
              key={element.id}
              value={element.id}
              isSelectable={element.isSelectable}
              className="px-1"
            >
              <span className="ml-1">{element.name}</span>
            </File>
          )}
        </li>
      ))}
    </ul>
  );
}
