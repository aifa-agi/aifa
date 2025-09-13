// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/left-panel/(_sub_domains)/tree/tree-node.tsx
"use client";

import * as React from "react";
import type { ContentStructure } from "@/app/@right/(_service)/(_types)/page-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2, Circle } from "lucide-react";
import { useDraftDelete } from "../../../../../../(_hooks)/use-draft-delete";
import { useRightForms } from "../../../right-panel/(_sub_domains)/forms/forms/(_contexts)/forms-context";

export interface TreeNodeProps {
  node: ContentStructure;
  depth: number;
  isRoot?: boolean;
}

function twoCharTag(tag?: string): string {
  if (!tag) return "--";
  return String(tag).toUpperCase().slice(0, 2);
}

function statusDotClass(status?: "draft" | "checked") {
  return status === "checked" ? "text-emerald-400" : "text-neutral-600";
}

export function TreeNode({ node, depth, isRoot = false }: TreeNodeProps) {
  const { deleteSubtree, deleteActiveSectionCascade } = useDraftDelete();
  const { selectedNodeId, setSelectedNode } = useRightForms();

  const onDelete = async () => {
    if (isRoot) {
      await deleteActiveSectionCascade();
    } else if (node.id) {
      await deleteSubtree(node.id);
    }
  };

  const onSelect = () => {
    if (!node.id) return;
    setSelectedNode(node.id);
  };

  const isSelected: boolean = !!node.id && selectedNodeId === node.id;
  const tagToken = twoCharTag(node.tag);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "group relative flex items-stretch rounded-md border bg-neutral-925",
          isSelected ? "border-violet-500" : "border-neutral-800"
        )}
        role="listitem"
        aria-label="Content element row"
      >
        <button
          type="button"
          onClick={onSelect}
          className="flex flex-1 items-center px-3 py-2 text-left"
          aria-pressed={isSelected || undefined}
        >
          <div className="grid w-full grid-cols-[14px_32px_1fr] items-center gap-2">
            <div className="flex items-center justify-center">
              <Circle
                className={cn("h-3.5 w-3.5", statusDotClass(node.status))}
                aria-label={node.status === "checked" ? "Checked" : "Draft"}
                fill="currentColor"
              />
            </div>

            <span
              className={cn(
                "inline-flex h-6 w-8 shrink-0 items-center justify-center rounded-sm border border-neutral-700 bg-neutral-850 text-[10px] font-semibold tracking-wide text-neutral-300"
              )}
              aria-label="Tag"
              title="Tag"
            >
              {tagToken}
            </span>

            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-neutral-100">
                {isRoot ? "Section (H2)" : "Content element"}
              </div>
              <div className="mt-0.5 text-xs text-neutral-500">
                Level {depth}
              </div>
            </div>
          </div>
        </button>

        <div className="flex items-stretch">
          <div className="w-[4px] bg-neutral-800" aria-hidden="true" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-full w-10 rounded-none rounded-r-md text-neutral-400 hover:bg-neutral-875 hover:text-red-400"
                aria-label="Delete (cascade)"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center" className="max-w-xs">
              <p className="text-xs">
                Delete this item and all its children. This action cannot be
                undone.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
