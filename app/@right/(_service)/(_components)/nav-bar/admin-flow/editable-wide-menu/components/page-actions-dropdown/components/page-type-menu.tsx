// @/app/(_service)/components/nav-bar/admin-flow/page-actions-dropdown/components/page-type-menu.tsx

import { StatusIndicator } from "../status-indicator";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PAGE_TYPES } from "@/app/@right/(_service)/(_config)/page-variants";
import { PageType } from "@/app/@right/(_service)/(_types)/page-types";

interface PageTypeMenuProps {
  onSetPageType: (type: PageType) => void;
  isPageTypeActive: (type: PageType) => boolean;
}

export function PageTypeMenu({
  onSetPageType,
  isPageTypeActive,
}: PageTypeMenuProps) {
  return (
    <>
      <DropdownMenuSeparator />

      <DropdownMenuLabel>Page Type</DropdownMenuLabel>

      <div className="max-h-[100px] overflow-y-auto custom-scrollbar">
        <DropdownMenuGroup>
          {PAGE_TYPES.map((pageType) => (
            <DropdownMenuItem
              key={pageType.value}
              onClick={() => onSetPageType(pageType.value)}
              className="cursor-pointer select-none"
            >
              <StatusIndicator
                isActive={isPageTypeActive(pageType.value)}
                size="md"
              />
              <span>{pageType.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </div>
    </>
  );
}
