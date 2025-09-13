// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/right-panel/_sub_domains/controls/save-bar.tsx

"use client";

/**
 * Comments are in English. UI texts are in English (US).
 * SaveBar: sticky full-width CTA right under the panel header.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useRightPanelCommands } from "../../../../../(_hooks)/use-right-panel-commands";

export function SaveBar() {
  const { finishAndSave, saving } = useRightPanelCommands();

  return (
    <div
      className="
        sticky top-0 z-10
        -mx-4 mb-3 px-4 pt-2
        border-b border-neutral-800
        bg-neutral-925/95 backdrop-blur
      "
      role="region"
      aria-label="Save actions"
    >
      <Button
        type="button"
        onClick={finishAndSave}
        disabled={saving}
        className="w-full h-9 bg-violet-600 hover:bg-violet-700 text-white"
        aria-busy={saving}
      >
        {saving ? "Saving..." : "Finish & Save"}
      </Button>
    </div>
  );
}
