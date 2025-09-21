// File: app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/components/generation-mode-switch.tsx
"use client";

/**
 * GenerationModeSwitch:
 * - Switch component for toggling between internal and external AI generation modes
 * - Features enhanced UI with primary-themed borders and clear mode indicators
 * - Follows the exact styling patterns from the original Step 5 component
 * - Includes descriptive text and status badges for each mode
 * 
 * Extracted from: Original Step 5 enhanced mode switch Card
 */

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Zap, Settings } from "lucide-react";

interface GenerationModeSwitchProps {
    /** Whether internal AI mode is active */
    useInternalAI: boolean;
    /** Callback when mode changes */
    onModeChange: (useInternal: boolean) => void;
    /** Additional CSS classes */
    className?: string;
}

export function GenerationModeSwitch({
    useInternalAI,
    onModeChange,
    className = ""
}: GenerationModeSwitchProps) {

    // Dynamic card styling based on mode - exact styling from original Step 5
    const cardClasses = [
        "w-full",
        "rounded-md",
        "shadow-sm",
        "transition-all",
        useInternalAI
            ? "border-violet-500 bg-violet-500/10 dark:border-violet-400 dark:bg-violet-900/20"
            : "border-neutral-200 bg-neutral-50/60 dark:border-neutral-800/60 dark:bg-neutral-900/40",
        className
    ].filter(Boolean).join(" ");

    return (
        <Card className={cardClasses}>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                    {/* Mode description section */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            {/* Mode icon */}
                            {useInternalAI ? (
                                <Zap className="size-5 text-violet-400" />
                            ) : (
                                <Settings className="size-5 text-muted-foreground" />
                            )}

                            {/* Mode title */}
                            <Label htmlFor="use-internal-ai" className="text-base font-semibold truncate">
                                {useInternalAI ? "AI Structure Generation Mode" : "System Instruction Mode"}
                            </Label>

                            {/* Status badge */}
                            <Badge variant={useInternalAI ? "default" : "secondary"} className="text-xs">
                                {useInternalAI ? "Active" : "Inactive"}
                            </Badge>
                        </div>

                        {/* Mode description */}
                        <p className="text-sm text-muted-foreground">
                            {useInternalAI
                                ? "Using internal AI model to generate content structure directly with streaming output"
                                : "Generate enhanced system instruction for external AI tools like Perplexity Pro"
                            }
                        </p>
                    </div>

                    {/* Switch controls section */}
                    <div className="flex items-center gap-3">
                        <div className="text-xs text-muted-foreground">
                            {useInternalAI ? "Internal AI" : "External AI"}
                        </div>
                        <Switch
                            id="use-internal-ai"
                            checked={useInternalAI}
                            onCheckedChange={onModeChange}
                            className="data-[state=checked]:bg-violet-500"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
