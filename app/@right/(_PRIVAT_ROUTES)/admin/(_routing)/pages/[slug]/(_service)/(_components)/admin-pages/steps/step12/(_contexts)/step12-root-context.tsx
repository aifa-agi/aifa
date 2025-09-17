// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_contexts)/step12-root-context.tsx
"use client";
import * as React from "react";
import type {
    JSONContent,
    SectionEditorContextValue,
    SectionId,
    SectionState,
} from "../(_types)/step12-types";
import { buildRandomDoc, mergeDocs } from "../(_utils)/step12-sections-utils";

const Step12Context = React.createContext<SectionEditorContextValue | null>(null);

type ProviderProps = { children: React.ReactNode; totalSections?: number };

export function Step12Provider({ children, totalSections = 7 }: ProviderProps) {
    const base = React.useMemo<SectionState[]>(
        () =>
            Array.from({ length: totalSections }).map((_, i) => ({
                id: `section-${i + 1}`,
                label: `Section ${i + 1}`,
                hasData: false,
                isLoading: false,
                content: null,
            })),
        [totalSections]
    );

    const initial = React.useMemo<SectionState[]>(
        () => [...base, { id: "all", label: "All sections", hasData: false, isLoading: false, content: null }],
        [base]
    );

    const [sections, setSections] = React.useState<SectionState[]>(initial);
    const [activeId, setActiveId] = React.useState<SectionId>("all");
    const [saving, setSaving] = React.useState(false);

    const setActive = React.useCallback((id: SectionId) => setActiveId(id), []);

    const loadSectionData = React.useCallback(
        async (id: SectionId) => {
            if (id === "all") {
                setActiveId("all");
                return;
            }

            // If already have content cached, just activate without reloading
            const existing = sections.find((s) => s.id === id)?.content;
            if (existing) {
                setSections((prev) => prev.map((s) => (s.id === id ? { ...s, isLoading: false } : s)));
                setActiveId(id);
                return;
            }

            // Mark loading for first-time load
            setSections((prev) => prev.map((s) => (s.id === id ? { ...s, isLoading: true } : s)));

            await new Promise((r) => setTimeout(r, 600));

            setSections((prev) =>
                prev.map((s, idx) => {
                    if (s.id !== id) return s;
                    // Only generate if still empty (protect against races)
                    const finalContent = s.content ?? buildRandomDoc(Date.now() + idx * 97, s.label);
                    return { ...s, content: finalContent, hasData: true, isLoading: false };
                })
            );
            setActiveId(id);
        },
        [sections]
    );

    const updateSectionContent = React.useCallback((id: SectionId, content: JSONContent) => {
        if (id === "all") return;
        setSections((prev) => prev.map((s) => (s.id === id ? { ...s, content, hasData: true } : s)));
    }, []);

    const isAllReady = React.useCallback(
        () => sections.filter((s) => s.id !== "all").every((s) => s.hasData),
        [sections]
    );

    const resetAllFlags = React.useCallback(() => {
        setSections((prev) => prev.map((s) => (s.id === "all" ? s : { ...s, hasData: false })));
    }, []);

    const value = React.useMemo<SectionEditorContextValue>(
        () => ({
            sections,
            activeId,
            saving,
            setActive,
            loadSectionData,
            updateSectionContent,
            isAllReady,
            resetAllFlags,
            setSaving,
            getMergedDoc: () => mergeDocs(sections),
        }),
        [sections, activeId, saving, setActive, loadSectionData, updateSectionContent, isAllReady, resetAllFlags]
    );

    return <Step12Context.Provider value={value}>{children}</Step12Context.Provider>;
}

export function useStep12Root(): SectionEditorContextValue {
    const ctx = React.useContext(Step12Context);
    if (!ctx) throw new Error("useStep12Root must be used within Step12Provider");
    return ctx;
}
