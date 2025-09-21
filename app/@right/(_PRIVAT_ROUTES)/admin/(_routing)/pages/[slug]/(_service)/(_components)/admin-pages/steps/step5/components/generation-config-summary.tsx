// File: app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/components/generation-config-summary.tsx
"use client";

/**
 * GenerationConfigSummary:
 * - Compact summary of current generation settings in blue-themed info block
 * - Displays writing style, content format, current structure, generation mode
 * - Shows custom requirements character count when present
 * - Follows the exact styling patterns from the original Step 5 component
 * 
 * Extracted from: Original Step 5 configuration summary section
 */

import * as React from "react";

interface GenerationConfig {
    writingStyle: string;
    contentFormat: string;
    customRequirements: string;
    useInternalAI: boolean;
    currentStructureCount?: number;
}

interface StyleFormat {
    value: string;
    label: string;
    description: string;
}

interface GenerationConfigSummaryProps {
    /** Configuration object with all settings */
    config: GenerationConfig;
    /** Available writing styles for label lookup */
    writingStyles: StyleFormat[];
    /** Available content formats for label lookup */
    contentFormats: StyleFormat[];
    /** Additional CSS classes */
    className?: string;
}

export function GenerationConfigSummary({
    config,
    writingStyles,
    contentFormats,
    className = ""
}: GenerationConfigSummaryProps) {

    // Get style and format labels
    const selectedWritingStyle = writingStyles.find(s => s.value === config.writingStyle);
    const selectedContentFormat = contentFormats.find(f => f.value === config.contentFormat);

    return (
        <div className={`p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 ${className}`}>
            <h4 className="font-medium mb-3 text-foreground truncate">
                Enhanced Structure Generation Configuration
            </h4>

            <div className="text-sm text-foreground/80 space-y-1">
                {/* Writing Style */}
                <p className="truncate">
                    <span className="font-medium">Style:</span> {selectedWritingStyle?.label || config.writingStyle} - {selectedWritingStyle?.description || "Custom style"}
                </p>

                {/* Content Format */}
                <p className="truncate">
                    <span className="font-medium">Format:</span> {selectedContentFormat?.label || config.contentFormat} - {selectedContentFormat?.description || "Custom format"}
                </p>

                {/* Current Structure Count */}
                <p className="truncate">
                    <span className="font-medium">Current Structure:</span> {config.currentStructureCount || 0} existing elements
                </p>

                {/* Generation Mode */}
                <p className="truncate">
                    <span className="font-medium">Generation Mode:</span> {config.useInternalAI ? "Internal AI streaming" : "External instruction generation"}
                </p>

                {/* Custom Requirements - only show if present */}
                {config.customRequirements.trim() && (
                    <p className="truncate">
                        <span className="font-medium">Custom Requirements:</span> {config.customRequirements.trim().length} characters specified
                    </p>
                )}
            </div>
        </div>
    );
}
