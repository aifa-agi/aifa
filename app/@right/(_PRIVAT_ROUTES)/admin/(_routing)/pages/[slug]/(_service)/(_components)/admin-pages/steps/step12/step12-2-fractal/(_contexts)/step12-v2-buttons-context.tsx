// @/@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_contexts)/step12-v2-buttons-context.tsx

/**
 * Step12 V2 Buttons Context - File System Based Section Editor
 * AUTONOMOUS VERSION - manages button confirmation state for V2
 * Adapted from step12-buttons-context.tsx for V2 architecture
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useStep12V2Root } from "./step12-v2-root-context";

interface Step12V2ButtonsContextValue {
    isConfirmed: (id: string) => boolean;
    confirm: (id: string) => void;
    resetAll: () => void;
    allConfirmed: boolean;
    totalReal: number;
}

const Step12V2ButtonsContext = createContext<Step12V2ButtonsContextValue | undefined>(undefined);

interface Step12V2ButtonsProviderProps {
    children: React.ReactNode;
}

export function Step12V2ButtonsProvider({ children }: Step12V2ButtonsProviderProps) {
    const { sections } = useStep12V2Root();

    // Get real section IDs (excluding synthetic "all" section)
    const realIds = useMemo(() => {
        return sections.filter(s => s.id !== "all").map(s => s.id);
    }, [sections]);

    // Confirmation flags per real section
    const [flags, setFlags] = useState<Record<string, boolean>>({});

    // Initialize and keep IDs in sync, preserve existing confirmations
    useEffect(() => {
        setFlags(prev => {
            const next: Record<string, boolean> = {};
            for (const id of realIds) {
                next[id] = prev[id] ?? false;
            }
            return next;
        });
    }, [realIds.join()]); // join for simple dependency

    // Check if section is confirmed
    const isConfirmed = useCallback((id: string): boolean => {
        return !!flags[id];
    }, [flags]);

    // Confirm a section (mark as reviewed)
    const confirm = useCallback((id: string): void => {
        if (id === "all") return;

        setFlags(prev =>
            prev[id] ? prev : { ...prev, [id]: true }
        );
    }, []);

    // Reset all confirmations (called after successful save)
    const resetAll = useCallback((): void => {
        setFlags(prev => {
            const next: Record<string, boolean> = {};
            for (const id of Object.keys(prev)) {
                next[id] = false;
            }
            return next;
        });
    }, []);

    // Check if all real sections are confirmed
    const allConfirmed = useMemo(() => {
        if (realIds.length === 0) return false;
        return realIds.every(id => flags[id] === true);
    }, [realIds, flags]);

    // Context value
    const value = useMemo<Step12V2ButtonsContextValue>(() => ({
        isConfirmed,
        confirm,
        resetAll,
        allConfirmed,
        totalReal: realIds.length,
    }), [isConfirmed, confirm, resetAll, allConfirmed, realIds.length]);

    return (
        <Step12V2ButtonsContext.Provider value={value}>
            {children}
        </Step12V2ButtonsContext.Provider>
    );
}

export function useStep12V2Buttons(): Step12V2ButtonsContextValue {
    const context = useContext(Step12V2ButtonsContext);
    if (context === undefined) {
        throw new Error("useStep12V2Buttons must be used within a Step12V2ButtonsProvider");
    }
    return context;
}

export { Step12V2ButtonsContext };
export type { Step12V2ButtonsContextValue };
