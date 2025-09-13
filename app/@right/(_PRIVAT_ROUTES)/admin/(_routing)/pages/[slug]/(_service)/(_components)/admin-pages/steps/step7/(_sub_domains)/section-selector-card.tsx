// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)
/*  /(_components)/admin-pages/steps/step7/(_sub_domains)/section-selector-card.tsx */

"use client";

/**
 * Comments are in English. UI texts are in English (US).
 *
 * SectionSelectorCard:
 * - Strict labels: "Section N".
 * - Active section: primary highlight (violet).
 * - Completed (status='checked' on H2 root) and not active: green highlight (emerald),
 *   using the same visual style as primary (border + soft background).
 * - Leading/trailing plus buttons kept as placeholders.
 */

import * as React from "react";
import { useStep7Root } from "../(_contexts)/step7-root-context";

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

// Strict numeric labeling: "Section N"
function labelByIndex(index: number): string {
  return `Section ${index + 1}`;
}

export function SectionSelectorCard() {
  const { getDraftSections, ui, setActiveSection } = useStep7Root();
  const sections = getDraftSections();

  const handlePick = React.useCallback(
    (id: string | undefined | null) => {
      if (!id) return;
      setActiveSection(id);
    },
    [setActiveSection]
  );

  return (
    <div className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-100">
          Section Navigation
        </h3>
        <p className="text-xs text-neutral-400">
          Select a section to work with.
        </p>
      </div>

      <div className="custom-scrollbar overflow-x-auto">
        <div className="flex min-w-max items-center gap-2">
          {/* Leading plus (placeholder) */}
          <button
            type="button"
            aria-label="Add section (placeholder)"
            title="Add section (placeholder)"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-neutral-700 bg-neutral-875 text-neutral-300 hover:bg-neutral-850"
          >
            <PlusIcon />
          </button>

          {sections.map((s, idx) => {
            const isActive = ui.activeSectionId === s.id;
            const isChecked = s.status === "checked";

            const base =
              "inline-flex max-w-[240px] items-center truncate rounded-md border px-3 py-1.5 text-xs font-medium transition-colors";
            const primary =
              "border-violet-500 bg-violet-500/15 text-neutral-100";
            const completed =
              "border-emerald-500 bg-emerald-500/15 text-neutral-100";
            const neutral =
              "border-neutral-700 bg-neutral-875 text-neutral-300 hover:bg-neutral-850";

            // Priority: active (primary) > completed (green) > neutral
            const tone = isActive ? primary : isChecked ? completed : neutral;

            const label = labelByIndex(idx);

            return (
              <React.Fragment key={s.id ?? `idx-${idx}`}>
                <button
                  type="button"
                  onClick={() => handlePick(s.id)}
                  className={[base, tone].join(" ")}
                  title={label}
                  aria-pressed={isActive}
                >
                  {label}
                </button>

                {/* Plus between sections (placeholder) */}
                <button
                  type="button"
                  aria-label="Add section (placeholder)"
                  title="Add section (placeholder)"
                  className="inline-flex size-7 items-center justify-center rounded-md border border-neutral-700 bg-neutral-875 text-neutral-300 hover:bg-neutral-850"
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
