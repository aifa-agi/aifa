// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/vector-store-actions-dropdown/types.ts

import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

export type VectorStoreState = "inactive" | "pending" | "active";
export type VectorStoreMode = "VectorStoreOff" | "VectorStoreOn";

export interface VectorStoreActionsDropdownProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

export interface VectorStoreTriggerButtonProps {
  vectorStoreState: VectorStoreState;
}

export interface VectorStoreDropdownContentProps {
  currentMode: VectorStoreMode;
  onModeChange: (mode: VectorStoreMode) => void;
}

export interface VectorStoreStatusIndicatorProps {
  mode: VectorStoreMode;
  isActive: boolean;
}
