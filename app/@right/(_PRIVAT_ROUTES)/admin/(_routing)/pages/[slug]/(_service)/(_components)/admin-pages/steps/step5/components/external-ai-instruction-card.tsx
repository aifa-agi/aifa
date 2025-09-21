// File: app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/components/external-ai-instruction-card.tsx
"use client";

/**
 * ExternalAIInstructionCard:
 * - Component for external AI mode instruction generation and copying
 * - Features large textarea with system instruction, copy button with states
 * - Includes process instructions and enhanced information panel
 * - Follows the exact styling patterns from the original Step 5 component
 * 
 * Extracted from: Original Step 5 external AI instruction section
 */

import * as React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle, Copy as CopyIcon } from "lucide-react";

interface ExternalAIInstructionCardProps {
    /** System instruction text to display */
    systemInstruction: string;
    /** Whether copy operation was successful */
    isCopied: boolean;
    /** Whether prompt is being updated */
    isPromptUpdating: boolean;
    /** Callback when copy button is clicked */
    onCopy: () => void;
    /** Additional CSS classes */
    className?: string;
}

export function ExternalAIInstructionCard({
    systemInstruction,
    isCopied,
    isPromptUpdating,
    onCopy,
    className = ""
}: ExternalAIInstructionCardProps) {

    // Chip-style classes following original Step 5 patterns
    const chipBase = "inline-flex items-center truncate rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
    const tonePrimary = "border-violet-500 bg-violet-500/15 text-white hover:bg-violet-500/20 focus-visible:ring-violet-500";
    const toneDisabled = "opacity-50 cursor-not-allowed";

    const copyDisabled = !systemInstruction || isPromptUpdating;

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Process Instructions */}
            <div className="space-y-3 text-sm text-muted-foreground">
                <p className="leading-relaxed truncate">
                    This enhanced system instruction generates expanded content structure with selfPrompt fields for recursive content generation, enabling unlimited structure creation
                </p>

                <div className="rounded-lg p-3 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
                    <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2 truncate">
                        Enhanced Generation Process
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-amber-800 dark:text-amber-200 text-xs">
                        <li className="truncate">Copy the comprehensive system instruction below</li>
                        <li className="truncate">Use Perplexity Pro or GPT-4 for complex structure generation</li>
                        <li className="truncate">Expect larger token usage due to complete data transmission</li>
                        <li className="truncate">Generated JSON will include selfPrompt for each content element</li>
                        <li className="truncate">Use generated structure for recursive content creation</li>
                        <li className="truncate">Each content piece can be generated independently</li>
                    </ol>
                </div>
            </div>

            {/* Header with Copy Button */}
            <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium truncate">
                    Enhanced System Instruction for Structure Generation
                </label>
                <button
                    type="button"
                    onClick={onCopy}
                    disabled={copyDisabled}
                    className={[chipBase, tonePrimary, copyDisabled ? toneDisabled : ""].join(" ")}
                    title="Copy enhanced instruction"
                >
                    {isPromptUpdating ? (
                        <>
                            <LoadingSpinner className="size-4" />
                            <span className="ml-2">Updating...</span>
                        </>
                    ) : isCopied ? (
                        <>
                            <CheckCircle className="size-4 text-emerald-400" />
                            <span className="ml-2">Copied & Ready!</span>
                        </>
                    ) : (
                        <>
                            <CopyIcon className="size-4" />
                            <span className="ml-2">Copy Enhanced Instruction</span>
                        </>
                    )}
                </button>
            </div>

            {/* System Instruction Textarea */}
            <textarea
                value={systemInstruction}
                readOnly
                className="w-full h-96 p-4 text-sm font-mono bg-white text-black border border-input rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
                placeholder="Generating comprehensive enhanced system instruction..."
            />

            {/* Enhanced Information Panel */}
            <div className="rounded-lg p-3 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
                <h5 className="font-medium text-green-900 dark:text-green-100 mb-2 text-sm truncate">
                    Enhanced Structure System Features
                </h5>
                <ul className="space-y-1 text-green-800 dark:text-green-200 text-xs">
                    <li className="truncate">✓ Complete page configuration data for structure generation</li>
                    <li className="truncate">✓ Current content structure analysis and enhancement</li>
                    <li className="truncate">✓ selfPrompt generation for each content structure element</li>
                    <li className="truncate">✓ Resource and link suggestions for recursive generation</li>
                    <li className="truncate">✓ SEO optimization with keyword distribution in structure</li>
                    <li className="truncate">✓ Quality criteria and validation rules for each element</li>
                    <li className="truncate">✓ Dependencies mapping for logical content structure flow</li>
                    <li className="truncate">✓ Unlimited content structure generation through recursive architecture</li>
                </ul>
            </div>
        </div>
    );
}
