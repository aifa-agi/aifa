// File: app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/components/status-indicator-dot.tsx
"use client";

/**
 * StatusIndicatorDot:
 * - Small reusable component for displaying status indicators
 * - Shows green dot for ready/active state, yellow dot for pending/draft state
 * - Follows the exact styling patterns from the original Step 5 component
 * - Supports different sizes for various UI contexts
 * 
 * Usage:
 * - Status indicators in headers, buttons, cards
 * - Ready/pending state visualization
 * - Consistent visual status representation across the app
 */

import * as React from "react";

interface StatusIndicatorDotProps {
    /** Whether the status is in ready/active state */
    isReady: boolean;
    /** Size variant for different UI contexts */
    variant?: "small" | "medium";
    /** Additional CSS classes */
    className?: string;
    /** Accessibility label for screen readers */
    ariaLabel?: string;
}

export function StatusIndicatorDot({
    isReady,
    variant = "medium",
    className = "",
    ariaLabel
}: StatusIndicatorDotProps) {
    // Base dot styling following original Step 5 patterns
    const dotBase = "inline-block rounded-full";

    // Size variants
    const sizeClasses = {
        small: "h-1 w-1",
        medium: "h-1 w-1", // Original size from Step 5
    };

    // Color based on ready state - matches original Step 5 logic
    const colorClass = isReady
        ? "bg-emerald-400"  // Ready state - green
        : "bg-yellow-400";  // Pending/draft state - yellow

    const combinedClasses = [
        dotBase,
        sizeClasses[variant],
        colorClass,
        className
    ].filter(Boolean).join(" ");

    return (
        <span
            className={combinedClasses}
            aria-hidden={!ariaLabel}
            aria-label={ariaLabel}
            role={ariaLabel ? "status" : undefined}
        />
    );
}
