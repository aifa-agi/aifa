// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/add-to-prompt-actions-dropdown/types.ts

import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

export type AddToPromptState = "inactive" | "pending" | "active";
export type AddToPromptMode = "AddToPromptOff" | "AddToPromptOn";

export interface AddToPromptActionsDropdownProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

export interface AddToPromptTriggerButtonProps {
  addToPromptState: AddToPromptState;
}

export interface AddToPromptDropdownContentProps {
  currentMode: AddToPromptMode;
  onModeChange: (mode: AddToPromptMode) => void;
}

export interface AddToPromptStatusIndicatorProps {
  mode: AddToPromptMode;
  isActive: boolean;
}
