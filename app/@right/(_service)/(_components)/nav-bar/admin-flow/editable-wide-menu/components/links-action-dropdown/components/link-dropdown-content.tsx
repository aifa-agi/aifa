// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/link-actions-dropdown/components/link-dropdown-content.tsx

"use client";

import React from "react";
import { LinkDropdownContentProps, LinkType } from "../types";
import { LinkItemRow } from "./link-item-row";
import { getLinkTypeLabel } from "../link-utils";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";

/**
 * Dropdown menu content with all link management options
 */
export function LinkDropdownContent({
  linkConfiguration,
  onLinkToggle,
}: LinkDropdownContentProps) {
  const linkTypes: LinkType[] = ["outgoing", "incoming", "external"];

  return (
    <DropdownMenuContent align="end" className="w-48">
      {linkTypes.map((linkType) => (
        <LinkItemRow
          key={linkType}
          linkType={linkType}
          state={linkConfiguration[linkType]}
          onToggle={() => onLinkToggle(linkType)}
          label={getLinkTypeLabel(linkType)}
        />
      ))}
    </DropdownMenuContent>
  );
}
