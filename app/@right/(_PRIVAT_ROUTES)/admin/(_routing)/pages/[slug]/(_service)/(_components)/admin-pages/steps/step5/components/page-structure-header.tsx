// File: app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/components/page-structure-header.tsx
"use client";

/**
 * PageStructureHeader:
 * - Header component for the content structure generation system
 * - Displays system title, description, and status indicator
 * - Follows the exact styling patterns from the original Step 5 component
 * - Reusable across different structure generation contexts
 * 
 * Extracted from: Original Step 5 header Card with violet theme
 */

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusIndicatorDot } from "./status-indicator-dot";

interface PageStructureHeaderProps {
    /** Whether the system is ready for generation */
    isReady: boolean;
    /** Title of the generation system */
    title?: string;
    /** Description of the generation system */
    description?: string;
    /** Current generation mode */
    mode?: "internal" | "external";
    /** Additional CSS classes */
    className?: string;
}

export function PageStructureHeader({
    isReady,
    title = "Recursive Content Structure Generation System",
    description = "Generate enhanced content structure with selfPrompt fields for unlimited structure creation",
    mode = "internal",
    className = ""
}: PageStructureHeaderProps) {

    // Base card styling following original Step 5 patterns
    const cardClasses = [
        "w-full",
        "rounded-md",
        "border",
        "border-neutral-200",
        "bg-neutral-50/60",
        "shadow-sm",
        "dark:border-neutral-800/60",
        "dark:bg-neutral-900/40",
        className
    ].filter(Boolean).join(" ");

    return (
        <Card className={cardClasses}>
            <CardHeader>
                <div className="flex items-center gap-3">
                    {/* Violet indicator box - exact styling from original */}
                    <div className="text-violet-400">
                        <div className="h-5 w-5 rounded-sm bg-violet-500/30" aria-hidden="true" />
                    </div>

                    {/* Title and description section */}
                    <div className="min-w-0">
                        <CardTitle className="text-xl truncate text-foreground">
                            {title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                            {description}
                        </p>
                    </div>

                    {/* Status indicator button - exact styling from original */}
                    <div className="ml-auto">
                        <Button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md border border-violet-500 bg-violet-500/15 px-3 py-1.5 text-sm text-white hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <StatusIndicatorDot isReady={isReady} />
                            <span className="ml-2 truncate">Recursive AI</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
