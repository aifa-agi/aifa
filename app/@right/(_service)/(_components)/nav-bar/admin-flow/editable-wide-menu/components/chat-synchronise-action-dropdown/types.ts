// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/chat-synchronise-action-dropdown/types.ts

import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Chat synchronization states
 * inactive - content not ready (gray)
 * pending - content ready but not synchronized (orange)
 * active - content ready and synchronized (green)
 */
export type ChatSyncState = "inactive" | "pending" | "active";

/**
 * Chat synchronization modes
 */
export type ChatSyncMode = "ChatSyncOff" | "ChatSyncOn";

/**
 * Props for main chat synchronization actions dropdown component
 */
export interface ChatSynchroniseActionDropdownProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

/**
 * Props for chat sync trigger button
 */
export interface ChatSyncTriggerButtonProps {
  chatSyncState: ChatSyncState;
}

/**
 * Props for chat sync dropdown content
 */
export interface ChatSyncDropdownContentProps {
  currentMode: ChatSyncMode;
  onModeChange: (mode: ChatSyncMode) => void;
}

/**
 * Props for chat sync status indicator
 */
export interface ChatSyncStatusIndicatorProps {
  mode: ChatSyncMode;
  isActive: boolean;
}
