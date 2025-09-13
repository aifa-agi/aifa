// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/right-panel/(_hooks)/use-right-panel-commands.ts

"use client";

/**
 * Comments are in English. UI texts are in English (US).
 * Right panel commands: provides a single "finishAndSave" action
 * that persists pending optimistic changes via NavigationMenuProvider.
 */

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";

export function useRightPanelCommands() {
  const { updateCategories } = useNavigationMenu();
  const [saving, setSaving] = useState(false);

  const finishAndSave = useCallback(async () => {
    if (saving) return true;
    setSaving(true);
    const err = await updateCategories();
    setSaving(false);

    if (err) {
      toast.error(`Failed to save: ${err.userMessage ?? "unknown error"}`);
      return false;
    }

    toast.success("Changes saved");
    return true;
  }, [saving, updateCategories]);

  return { finishAndSave, saving };
}
