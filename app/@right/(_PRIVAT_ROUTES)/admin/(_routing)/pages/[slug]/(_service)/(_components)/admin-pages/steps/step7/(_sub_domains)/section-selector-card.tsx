// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/section-selector-card.tsx
"use client";

/**
 * Comments are in English. UI texts are in English (US).
 * Adds working “+” buttons to insert a new H2 section at specific positions.
 *
 * CSS-only improvements plan (no logic changes) — Comments in English:
 * - Match neutral "card-like" surface used elsewhere (light: subtle neutral, dark: translucent neutral).
 * - Use theme tokens for text colors (text-foreground, text-muted-foreground).
 * - Keep violet/emerald accents; unify neutral chip/plus buttons.
 * - Add focus-visible rings for accessibility with ring-offset against background.
 */

import * as React from "react";
import { useStep7Root } from "../(_contexts)/step7-root-context";
import { useSectionInsert } from "../(_hooks)/use-section-insert";

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`h-4 w-4 ${props.className ?? ""}`}
    >
      <path
        d="M10 4v12M4 10h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function labelByIndex(index: number): string {
  return `Section ${index + 1}`;
}

export function SectionSelectorCard() {
  const { getDraftSections, ui, setActiveSection } = useStep7Root();
  const sections = getDraftSections();
  const { insertAtIndex } = useSectionInsert();

  const handlePick = React.useCallback(
    (id: string | undefined | null) => {
      if (!id) return;
      setActiveSection(id);
    },
    [setActiveSection]
  );

  const handleInsertAt = React.useCallback(
    async (idx: number) => {
      await insertAtIndex(idx);
      // Active section is preserved; alternatively, we could activate the new one after persist if needed.
    },
    [insertAtIndex]
  );

  // Base styles (tokenized for theme)
  const containerCls =
    "w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-4 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40";
  const titleCls = "text-sm font-semibold text-foreground";
  const subtitleCls = "text-xs text-muted-foreground";

  // Chip/button bases
  const chipBase =
    "inline-flex max-w-[240px] items-center truncate rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const plusBase =
    "inline-flex size-7 items-center justify-center rounded-md border text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  // Tones
  const tonePrimary =
    "border-violet-500 bg-violet-500/15 text-white hover:bg-violet-500/20 focus-visible:ring-violet-500";
  const toneCompleted =
    "border-emerald-500 bg-emerald-500/15 text-white hover:bg-emerald-500/20 focus-visible:ring-emerald-500";
  const toneNeutral =
    "border-border bg-background/60 text-muted-foreground hover:bg-background/80 dark:bg-background/30 focus-visible:ring-neutral-500";

  return (
    <div className={containerCls}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={titleCls}>Section Navigation</h3>
        <p className={subtitleCls}>Select a section to work with.</p>
      </div>

      <div className="custom-scrollbar overflow-x-auto">
        <div className="flex min-w-max items-center gap-2">
          {/* Leading plus -> insert at 0 */}
          <button
            type="button"
            aria-label="Add section at beginning"
            title="Add section at beginning"
            className={[
              plusBase,
              "border-border bg-background/60 text-muted-foreground hover:bg-background/80 dark:bg-background/30",
            ].join(" ")}
            onClick={() => handleInsertAt(0)}
          >
            <PlusIcon />
          </button>

          {sections.map((s, idx) => {
            const isActive = ui.activeSectionId === s.id;
            const isChecked = s.status === "checked";

            const tone = isActive
              ? tonePrimary
              : isChecked
                ? toneCompleted
                : toneNeutral;
            const label = labelByIndex(idx);

            return (
              <React.Fragment key={s.id ?? `idx-${idx}`}>
                <button
                  type="button"
                  onClick={() => handlePick(s.id)}
                  className={[chipBase, tone].join(" ")}
                  title={label}
                  aria-pressed={isActive}
                >
                  {label}
                </button>

                {/* Plus after this section -> insert at idx + 1 */}
                <button
                  type="button"
                  aria-label={`Add section after ${label}`}
                  title={`Add section after ${label}`}
                  className={[
                    plusBase,
                    "border-border bg-background/60 text-muted-foreground hover:bg-background/80 dark:bg-background/30",
                  ].join(" ")}
                  onClick={() => handleInsertAt(idx + 1)}
                >
                  <PlusIcon />
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// and here
