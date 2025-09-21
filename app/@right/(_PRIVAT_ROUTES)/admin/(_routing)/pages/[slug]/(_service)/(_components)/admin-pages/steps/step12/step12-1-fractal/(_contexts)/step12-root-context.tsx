// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_contexts)/step12-root-context.tsx

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { JSONContent } from "@tiptap/react";
import { SectionState } from "../(_types)/step12-types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { areAllSectionsReady, fromSectionInfo } from "../(_adapters)/sections-mapper";
import { mergeDocs } from "../(_utils)/step12-sections-utils";

// NEW: import buttons provider to wrap subtree
import { Step12ButtonsProvider } from "./step12-buttons-context";

interface Step12ContextType {
    sections: SectionState[];
    activeId: string;
    saving: boolean;
    isAllReady: () => boolean;
    hasValidSections: boolean;
    totalSections: number;

    loadSectionData: (sectionId: string) => void;
    setActive: (sectionId: string) => void;
    updateSectionContent: (sectionId: string, content: JSONContent) => void;
    resetAllFlags: () => void;
    setSaving: (saving: boolean) => void;

    getMergedDoc: () => JSONContent;
    getActiveSection: () => SectionState | null;
    getSection: (sectionId: string) => SectionState | null;

    allRefresh: number;
    refreshAll: () => void;

    page?: PageData;
}

const Step12Context = createContext<Step12ContextType | undefined>(undefined);

interface Step12ProviderProps {
    children: React.ReactNode;
    page?: PageData | null;
}

export function Step12Provider({ children, page }: Step12ProviderProps) {
    const hasValidSections = Boolean(page?.sections && Array.isArray(page.sections) && page.sections.length > 0);

    const initialSections = useMemo(() => {
        if (!page || !hasValidSections || !page.sections) {
            return [];
        }
        return fromSectionInfo(page.sections);
    }, [page, page?.sections, hasValidSections]);

    const [sections, setSections] = useState<SectionState[]>(initialSections);
    const [activeId, setActiveId] = useState<string>("all");
    const [saving, setSaving] = useState(false);
    const [allRefresh, setAllRefresh] = useState(0);

    React.useEffect(() => {
        setSections(initialSections);
        setActiveId("all");
        setAllRefresh((v) => v + 1);
    }, [initialSections]);

    const loadSectionData = useCallback((sectionId: string) => {
        if (!hasValidSections) return;
        setActiveId(sectionId);
    }, [hasValidSections]);

    const updateSectionContent = useCallback((sectionId: string, content: JSONContent) => {
        setSections(prev => prev.map(section =>
            section.id === sectionId
                ? { ...section, content, hasData: true }
                : section
        ));
    }, []);

    const setActive = useCallback((sectionId: string) => {
        if (!hasValidSections) return;
        setActiveId(sectionId);
    }, [hasValidSections]);

    const resetAllFlags = useCallback(() => {
        setSections(prev => prev.map(section => ({
            ...section,
            hasData: Boolean(section.content),
        })));
    }, []);

    const isAllReady = useCallback(() => {
        return hasValidSections && areAllSectionsReady(sections);
    }, [sections, hasValidSections]);

    const getMergedDoc = useCallback((): JSONContent => {
        if (!hasValidSections) {
            return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] };
        }
        const realSections = sections.filter(s => s.id !== "all" && s.content);
        if (realSections.length === 0) {
            return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] };
        }
        return mergeDocs(realSections);
    }, [sections, hasValidSections]);

    const refreshAll = useCallback(() => {
        setAllRefresh((v) => v + 1);
    }, []);

    const getActiveSection = useCallback((): SectionState | null => {
        return sections.find(s => s.id === activeId) || null;
    }, [sections, activeId]);

    const getSection = useCallback((sectionId: string): SectionState | null => {
        return sections.find(s => s.id === sectionId) || null;
    }, [sections]);

    const contextValue: Step12ContextType = useMemo(() => ({
        sections,
        activeId,
        saving,
        isAllReady,
        hasValidSections,
        totalSections: sections.filter(s => s.id !== "all").length,

        setActive,
        loadSectionData,
        updateSectionContent,
        resetAllFlags,
        setSaving,

        getMergedDoc,
        getActiveSection,
        getSection,

        allRefresh,
        refreshAll,

        page: page || undefined,
    }), [
        sections,
        activeId,
        saving,
        isAllReady,
        hasValidSections,
        setActive,
        loadSectionData,
        updateSectionContent,
        resetAllFlags,
        getMergedDoc,
        getActiveSection,
        getSection,
        allRefresh,
        refreshAll,
        page,
    ]);

    return (
        <Step12Context.Provider value={contextValue}>
            {/* Lifted provider: now the whole Step 12 subtree has buttons context */}
            <Step12ButtonsProvider>
                {children}
            </Step12ButtonsProvider>
        </Step12Context.Provider>
    );
}

export function useStep12Root() {
    const context = useContext(Step12Context);
    if (context === undefined) {
        throw new Error("useStep12Root must be used within a Step12Provider");
    }
    return context;
}

export { Step12Context };
export type { Step12ContextType };
