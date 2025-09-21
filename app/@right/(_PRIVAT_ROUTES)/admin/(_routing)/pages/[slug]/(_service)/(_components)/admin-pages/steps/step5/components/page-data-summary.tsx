// File: app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/components/page-data-summary.tsx
"use client";

/**
 * PageDataSummary:
 * - Displays comprehensive page information in a structured grid layout
 * - Shows all relevant page data including metadata, structure, and generation status
 * - Follows the exact styling patterns from the original Step 5 component
 * - Features responsive grid with proper truncation and badges
 * 
 * Extracted from: Original Step 5 enhanced page info summary section
 */

import * as React from "react";
import { Badge } from "@/components/ui/badge";

interface PageDataSummaryProps {
    /** Page data object */
    page?: {
        title?: string;
        linkName?: string;
        type?: string;
        keywords?: string[];
        images?: any[];
        aiRecommendContentStructure?: any[];
        intent?: string;
        taxonomy?: string;
        audiences?: string;
    } | null;
    /** Current writing style selection */
    writingStyle: string;
    /** Current content format selection */
    contentFormat: string;
    /** Whether the generation system is ready */
    isReady: boolean;
    /** Writing styles configuration */
    writingStyles?: Array<{ value: string; label: string }>;
    /** Content formats configuration */
    contentFormats?: Array<{ value: string; label: string }>;
    /** Additional CSS classes */
    className?: string;
}

export function PageDataSummary({
    page,
    writingStyle,
    contentFormat,
    isReady,
    writingStyles = [],
    contentFormats = [],
    className = ""
}: PageDataSummaryProps) {

    // Get style and format labels
    const currentWritingStyle = writingStyles.find(s => s.value === writingStyle);
    const currentContentFormat = contentFormats.find(f => f.value === contentFormat);

    return (
        <div className={`rounded-lg p-4 bg-muted/50 ${className}`}>
            <h4 className="font-medium mb-3 text-foreground truncate">
                Complete Page Data for Structure Generation
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {/* Title */}
                <div className="truncate">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="ml-2 font-medium">{page?.title || page?.linkName || "Untitled"}</span>
                </div>

                {/* Type */}
                <div className="truncate">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2">{page?.type || "Not specified"}</span>
                </div>

                {/* Keywords */}
                <div className="truncate">
                    <span className="text-muted-foreground">Keywords:</span>
                    <span className="ml-2">
                        {page?.keywords?.length ? `${page.keywords.length} keywords` : "None"}
                    </span>
                </div>

                {/* Images */}
                <div className="truncate">
                    <span className="text-muted-foreground">Images:</span>
                    <span className="ml-2">{page?.images?.length || 0} images</span>
                </div>

                {/* Current Structure */}
                <div className="truncate">
                    <span className="text-muted-foreground">Current Structure:</span>
                    <span className="ml-2">{page?.aiRecommendContentStructure?.length || 0} elements</span>
                </div>

                {/* Intent */}
                <div className="truncate">
                    <span className="text-muted-foreground">Intent:</span>
                    <span className="ml-2">{page?.intent || "Not defined"}</span>
                </div>

                {/* Taxonomy */}
                <div className="truncate">
                    <span className="text-muted-foreground">Taxonomy:</span>
                    <span className="ml-2">{page?.taxonomy || "Not classified"}</span>
                </div>

                {/* Audiences */}
                <div className="truncate">
                    <span className="text-muted-foreground">Audiences:</span>
                    <span className="ml-2">{page?.audiences || "Not specified"}</span>
                </div>

                {/* Writing Style */}
                <div className="truncate">
                    <span className="text-muted-foreground">Writing Style:</span>
                    <span className="ml-2">{currentWritingStyle?.label || writingStyle}</span>
                </div>

                {/* Content Format */}
                <div className="truncate">
                    <span className="text-muted-foreground">Content Format:</span>
                    <span className="ml-2">{currentContentFormat?.label || contentFormat}</span>
                </div>

                {/* Generation Status */}
                <div className="truncate">
                    <span className="text-muted-foreground">Generation Status:</span>
                    <span className="ml-2">
                        {isReady ? (
                            <Badge variant="default" className="bg-green-600 text-xs">Ready for AI</Badge>
                        ) : (
                            <Badge variant="secondary" className="text-xs">Not Ready</Badge>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}
