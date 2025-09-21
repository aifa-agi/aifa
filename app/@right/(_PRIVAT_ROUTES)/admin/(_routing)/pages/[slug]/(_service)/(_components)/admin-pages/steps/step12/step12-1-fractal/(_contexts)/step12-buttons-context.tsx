// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_contexts)/step12-buttons-context.tsx
"use client";

/**
 * Buttons confirmation context (local to Step 12 UI cluster).
 * - Holds "confirm" flags per real section (excludes synthetic "all").
 * - Marks a section as confirmed on first click.
 * - Exposes allConfirmed flag for enabling "Save all sections".
 * - Can reset all confirmations after successful save.
 *
 * Notes:
 * - This state is intentionally decoupled from content/hasData flags.
 * - It depends on Step12Root sections to know current real section IDs.
 */

import * as React from "react";
import { useStep12Root } from "./step12-root-context";

type ButtonsContextValue = {
    isConfirmed: (id: string) => boolean;
    confirm: (id: string) => void;
    resetAll: () => void;
    allConfirmed: boolean;
    totalReal: number;
};

const ButtonsContext = React.createContext<ButtonsContextValue | undefined>(undefined);

export function Step12ButtonsProvider({ children }: { children: React.ReactNode }) {
    const { sections } = useStep12Root();
    const realIds = React.useMemo(() => sections.filter(s => s.id !== "all").map(s => s.id), [sections]);

    const [flags, setFlags] = React.useState<Record<string, boolean>>({});

    // Initialize and keep IDs in sync; preserve existing confirmations
    React.useEffect(() => {
        setFlags(prev => {
            const next: Record<string, boolean> = {};
            for (const id of realIds) next[id] = prev[id] ?? false;
            return next;
        });
    }, [realIds.join("|")]); // join for simple dependency

    const isConfirmed = React.useCallback((id: string) => !!flags[id], [flags]);

    const confirm = React.useCallback((id: string) => {
        if (id === "all") return;
        setFlags(prev => (prev[id] ? prev : { ...prev, [id]: true }));
    }, []);

    const resetAll = React.useCallback(() => {
        setFlags(prev => {
            const next: Record<string, boolean> = {};
            for (const id of Object.keys(prev)) next[id] = false;
            return next;
        });
    }, []);

    const allConfirmed = React.useMemo(() => {
        if (realIds.length === 0) return false;
        return realIds.every(id => flags[id] === true);
    }, [realIds, flags]);

    const value = React.useMemo<ButtonsContextValue>(() => ({
        isConfirmed,
        confirm,
        resetAll,
        allConfirmed,
        totalReal: realIds.length,
    }), [isConfirmed, confirm, resetAll, allConfirmed, realIds.length]);

    return <ButtonsContext.Provider value={value}>{children}</ButtonsContext.Provider>;
}

export function useStep12Buttons() {
    const ctx = React.useContext(ButtonsContext);
    if (!ctx) throw new Error("useStep12Buttons must be used within Step12ButtonsProvider");
    return ctx;
}
