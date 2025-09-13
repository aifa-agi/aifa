// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/right-panel/right-panel.tsx

"use client";

/**
 * Comments are in English. UI texts are in English (US).
 *
 * Fixes and UX improvements:
 * - Initialize local state with safe defaults (no node dereference before null-check).
 * - Early return for empty state before computing dirty flags.
 * - Correct import path for useRightForms (kept as provided by the project structure).
 * - Keep two-column layout only for min/max words; others are full width.
 * - "Save field" buttons appear only when a field is dirty.
 * - Self Prompt replaces actualContent edit area.
 * - linksToSource (H2) and keywords (non-H2) as self-growing lists.
 * - MOVE PRIMARY CTA: sticky, full-width "Finish & Save" bar right under panel header.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ContentStructure } from "@/app/@right/(_service)/(_types)/page-types";
import { useRightForms } from "./(_sub_domains)/forms/forms/(_contexts)/forms-context";

// Self-growing list of strings
function SimpleStringList({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  label: string;
}) {
  const normalized = React.useMemo(
    () => (value && Array.isArray(value) ? value : []),
    [value]
  );

  const withTrailing = React.useMemo(() => {
    return normalized.length === 0 ||
      normalized[normalized.length - 1].trim() !== ""
      ? [...normalized, ""]
      : normalized;
  }, [normalized]);

  const handleChange = (idx: number, v: string) => {
    const next = [...withTrailing];
    next[idx] = v;

    // Compact middle empties and ensure single trailing empty
    const compact = next.filter(
      (s, i) => s.trim() !== "" || i === next.length - 1
    );
    if (compact.length === 0 || compact[compact.length - 1].trim() !== "") {
      compact.push("");
    }
    onChange(compact);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-1 text-xs text-neutral-400">{label}</div>
      {withTrailing.map((s, idx) => (
        <Input
          key={idx}
          value={s}
          onChange={(e) => handleChange(idx, e.currentTarget.value)}
          placeholder={placeholder}
        />
      ))}
    </div>
  );
}

function arraysEqual(
  a: string[] | undefined,
  b: string[] | undefined
): boolean {
  const na = (a ?? []).filter((s) => s.trim() !== "");
  const nb = (b ?? []).filter((s) => s.trim() !== "");
  if (na.length !== nb.length) return false;
  for (let i = 0; i < na.length; i++) {
    if (na[i] !== nb[i]) return false;
  }
  return true;
}

export function RightPanel() {
  const { getEffectiveNode, saveTempField, finishAndPersist, isH2Selected } =
    useRightForms();

  const node = getEffectiveNode() as ContentStructure | null;

  // Local editable states with safe defaults (no node dereference here)
  const [description, setDescription] = React.useState<string>("");
  const [intent, setIntent] = React.useState<string>("");
  const [taxonomy, setTaxonomy] = React.useState<string>("");
  const [audiences, setAudiences] = React.useState<string>("");
  const [selfPrompt, setSelfPrompt] = React.useState<string>("");
  const [minWords, setMinWords] = React.useState<string>("0");
  const [maxWords, setMaxWords] = React.useState<string>("0");
  const [links, setLinks] = React.useState<string[]>([]);
  const [keywords, setKeywords] = React.useState<string[]>([]);

  // Saving flag for sticky CTA
  const [saving, setSaving] = React.useState<boolean>(false);

  // Sync local state when selected node changes
  React.useEffect(() => {
    if (!node || !node.id) return;
    setDescription(node.description ?? "");
    setIntent(node.intent ?? "");
    setTaxonomy(node.taxonomy ?? "");
    setAudiences(node.audiences ?? "");
    setSelfPrompt(node.selfPrompt ?? "");
    setMinWords(String(node.additionalData?.minWords ?? 0));
    setMaxWords(String(node.additionalData?.maxWords ?? 0));
    setLinks([...(node.linksToSource ?? [])]);
    setKeywords([...(node.keywords ?? [])]);
  }, [node?.id]); // use optional chaining in deps

  // Empty state early return (no sticky CTA when nothing is selected)
  if (!node || !node.id) {
    return (
      <div className="flex h-full min-h-[320px] flex-col rounded-lg border border-neutral-800 bg-neutral-925 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-neutral-100">
            Element Editor
          </h4>
          <span className="text-xs text-neutral-500">Step 7</span>
        </div>

        <div className="mt-2 flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm rounded-md border border-dashed border-neutral-800 bg-neutral-900/40 p-5 text-center">
            <div className="mx-auto mb-2 h-10 w-10 rounded-full border border-neutral-800 bg-neutral-875" />
            <p className="text-sm text-neutral-300">
              Select a content element on the left to view and edit its details
              here.
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              No element selected. Pick one from the tree.
            </p>
          </div>
        </div>

        <div className="mt-3 pt-2 text-right">
          <span className="text-xs text-neutral-500">
            Changes will be saved optimistically according to app settings.
          </span>
        </div>
      </div>
    );
  }

  const rootOnly = isH2Selected();

  // Dirty flags (safe to compute after null-guard)
  const descDirty = description !== (node.description ?? "");
  const intentDirty = intent !== (node.intent ?? "");
  const taxonomyDirty = taxonomy !== (node.taxonomy ?? "");
  const audiencesDirty = audiences !== (node.audiences ?? "");
  const selfPromptDirty = selfPrompt !== (node.selfPrompt ?? "");
  const minDirty =
    Number(minWords || 0) !== (node.additionalData?.minWords ?? 0);
  const maxDirty =
    Number(maxWords || 0) !== (node.additionalData?.maxWords ?? 0);
  const linksDirty = rootOnly ? !arraysEqual(links, node.linksToSource) : false;
  const keywordsDirty = !rootOnly
    ? !arraysEqual(keywords, node.keywords)
    : false;

  // Save handlers write to temp overlay; Finish will persist
  const onSaveDescription = () => saveTempField("description", description);
  const onSaveIntent = () => saveTempField("intent", intent);
  const onSaveTaxonomy = () => saveTempField("taxonomy", taxonomy);
  const onSaveAudiences = () => saveTempField("audiences", audiences);
  const onSaveSelfPrompt = () => saveTempField("selfPrompt", selfPrompt);
  const onSaveMinMax = () =>
    saveTempField("additionalData", {
      minWords: Number(minWords || 0),
      maxWords: Number(maxWords || 0),
    });
  const onSaveLinks = () =>
    saveTempField(
      "linksToSource",
      links.filter((s) => s.trim() !== "")
    );
  const onSaveKeywords = () =>
    saveTempField(
      "keywords",
      keywords.filter((s) => s.trim() !== "")
    );

  const onFinish = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await finishAndPersist();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-lg border border-neutral-800 bg-neutral-925 p-4">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-neutral-100">
          Element Editor
        </h4>
        <span className="text-xs text-neutral-500">Step 7</span>
      </div>

      {/* Sticky, full-width CTA just under the header */}
      <div
        className="
          sticky top-0 z-10
          -mx-4 mb-2 px-4 pt-2 pb-2
          border-b border-neutral-800
          bg-neutral-925/95 backdrop-blur
        "
        role="region"
        aria-label="Save actions"
      >
        <Button
          type="button"
          onClick={onFinish}
          disabled={saving}
          className="w-full h-9 bg-violet-600 hover:bg-violet-700 text-white"
          aria-busy={saving}
        >
          {saving ? "Saving..." : "Finish & Save"}
        </Button>
      </div>

      {/* Form fields */}
      <div className="flex flex-1 flex-col gap-4">
        {/* Description (full width) */}
        <div>
          <div className="mb-1 text-xs text-neutral-400">Description</div>
          <Input
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            placeholder="Describe this element purpose"
          />
          {descDirty && (
            <div className="mt-1 text-right">
              <Button size="sm" variant="secondary" onClick={onSaveDescription}>
                Save field
              </Button>
            </div>
          )}
        </div>

        {/* Intent (full width) */}
        <div>
          <div className="mb-1 text-xs text-neutral-400">Intent</div>
          <Input
            value={intent}
            onChange={(e) => setIntent(e.currentTarget.value)}
            placeholder="User intent for this element"
          />
          {intentDirty && (
            <div className="mt-1 text-right">
              <Button size="sm" variant="secondary" onClick={onSaveIntent}>
                Save field
              </Button>
            </div>
          )}
        </div>

        {/* Taxonomy (full width) */}
        <div>
          <div className="mb-1 text-xs text-neutral-400">Taxonomy</div>
          <Input
            value={taxonomy}
            onChange={(e) => setTaxonomy(e.currentTarget.value)}
            placeholder="Taxonomy tag"
          />
          {taxonomyDirty && (
            <div className="mt-1 text-right">
              <Button size="sm" variant="secondary" onClick={onSaveTaxonomy}>
                Save field
              </Button>
            </div>
          )}
        </div>

        {/* Audiences (full width) */}
        <div>
          <div className="mb-1 text-xs text-neutral-400">Audiences</div>
          <Input
            value={audiences}
            onChange={(e) => setAudiences(e.currentTarget.value)}
            placeholder="Target audiences"
          />
          {audiencesDirty && (
            <div className="mt-1 text-right">
              <Button size="sm" variant="secondary" onClick={onSaveAudiences}>
                Save field
              </Button>
            </div>
          )}
        </div>

        {/* Min/Max words (two columns only) */}
        <div>
          <div className="mb-1 text-xs text-neutral-400">
            Word count (optional)
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-xs text-neutral-500">Min words</div>
              <Input
                type="number"
                inputMode="numeric"
                value={minWords}
                onChange={(e) => setMinWords(e.currentTarget.value)}
                placeholder="0"
              />
            </div>
            <div>
              <div className="mb-1 text-xs text-neutral-500">Max words</div>
              <Input
                type="number"
                inputMode="numeric"
                value={maxWords}
                onChange={(e) => setMaxWords(e.currentTarget.value)}
                placeholder="0"
              />
            </div>
          </div>
          {(minDirty || maxDirty) && (
            <div className="mt-1 text-right">
              <Button size="sm" variant="secondary" onClick={onSaveMinMax}>
                Save field
              </Button>
            </div>
          )}
        </div>

        {/* Self Prompt (textarea, replaces actualContent area) */}
        <div>
          <div className="mb-1 text-xs text-neutral-400">Self Prompt</div>
          <Textarea
            value={selfPrompt}
            onChange={(e) => setSelfPrompt(e.currentTarget.value)}
            placeholder="Optional guiding prompt for this element"
            rows={6}
          />
          {selfPromptDirty && (
            <div className="mt-1 text-right">
              <Button size="sm" variant="secondary" onClick={onSaveSelfPrompt}>
                Save field
              </Button>
            </div>
          )}
        </div>

        {/* H2-only linksToSource vs non-H2 keywords */}
        {rootOnly ? (
          <div>
            <SimpleStringList
              value={links}
              onChange={setLinks}
              placeholder="https://example.com/path"
              label="Links to source (H2 only)"
            />
            {linksDirty && (
              <div className="mt-1 text-right">
                <Button size="sm" variant="secondary" onClick={onSaveLinks}>
                  Save field
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <SimpleStringList
              value={keywords}
              onChange={setKeywords}
              placeholder="keyword"
              label="Keywords"
            />
            {keywordsDirty && (
              <div className="mt-1 text-right">
                <Button size="sm" variant="secondary" onClick={onSaveKeywords}>
                  Save field
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer hint only (primary CTA moved to sticky top) */}
      <div className="mt-4 flex justify-end gap-2 pt-2">
        <span className="text-xs text-neutral-500">
          Changes will be saved optimistically according to app settings.
        </span>
      </div>
    </div>
  );
}
