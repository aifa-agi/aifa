// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/badges-actions-dropdown/components/badges-dropdown-content.tsx

"use client";

import React from "react";

import { BadgesDropdownContentProps } from "../types";
import { RoleItemRow } from "./role-item-row";
import { BadgeItemRow } from "./badge-item-row";
import { isRoleActive, isBadgeActive } from "../badges-utils";
import { useBadgesLogic } from "../hooks/use-badges-logic";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ALL_BADGES } from "@/config/pages-config/badges/badge-config";
import { ALL_ROLES } from "@/app/@right/(_service)/(_config)/user-roles";

/**
 * Dropdown menu content with all badge and role management options
 */
export function BadgesDropdownContent({
  singlePage,
  categoryTitle,
  setCategories,
}: BadgesDropdownContentProps) {
  const { handleToggleRole, handleToggleBadge, handleRename, handleDelete } =
    useBadgesLogic({
      singlePage,
      categoryTitle,
      setCategories,
    });

  return (
    <DropdownMenuContent align="end" className="min-w-[190px]">
      <DropdownMenuItem onClick={handleRename}>
        <span>Rename</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuLabel>Roles</DropdownMenuLabel>
      <div className="max-h-[100px] overflow-y-auto custom-scrollbar">
        <DropdownMenuGroup>
          {ALL_ROLES.map((role) => (
            <RoleItemRow
              key={role}
              role={role}
              isActive={isRoleActive(singlePage, role)}
              onToggle={() => handleToggleRole(role)}
            />
          ))}
        </DropdownMenuGroup>
      </div>

      <DropdownMenuSeparator />

      <DropdownMenuLabel>Badge</DropdownMenuLabel>
      <div className="max-h-[100px] overflow-y-auto custom-scrollbar">
        <DropdownMenuGroup>
          {ALL_BADGES.map((badge) => (
            <BadgeItemRow
              key={badge}
              badge={badge}
              isActive={isBadgeActive(singlePage, badge)}
              onToggle={() => handleToggleBadge(badge)}
            />
          ))}
        </DropdownMenuGroup>
      </div>

      <DropdownMenuSeparator />

      <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
