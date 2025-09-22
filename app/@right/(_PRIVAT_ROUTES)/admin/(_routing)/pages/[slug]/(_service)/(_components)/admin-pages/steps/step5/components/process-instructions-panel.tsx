// File: app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/components/process-instructions-panel.tsx
"use client";

/**
 * ProcessInstructionsPanel:
 * - Displays process instructions based on the current generation mode
 * - Features mode-specific descriptions and amber-themed instruction blocks
 * - Follows the exact styling patterns from the original Step 5 component
 * - Shows different content for internal vs external AI modes
 * 
 * Extracted from: Original Step 5 process instructions section
 */

import * as React from "react";

interface ProcessInstructionsPanelProps {
    /** Current generation mode */
    mode: "internal" | "external";
    /** Additional CSS classes */
    className?: string;
}

export function ProcessInstructionsPanel({
    mode,
    className = ""
}: ProcessInstructionsPanelProps) {

    return (
        <div className={`space-y-3 text-sm text-muted-foreground ${className}`}>
            {mode === "external" ? (
                <>
                    {/* External AI Mode Instructions */}
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
                </>
            ) : (
                <>
                    {/* Internal AI Mode Instructions */}
                    <p className="leading-relaxed truncate">
                        Stream content structure using the internal AI model; the output area below will display results in real time during generation
                    </p>

                    <div className="rounded-lg p-3 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2 truncate">
                            Internal AI Generation Process
                        </h4>
                        <ol className="list-decimal list-inside space-y-1 text-amber-800 dark:text-amber-200 text-xs">
                            <li className="truncate">Click &quot;Start Structure Generation&quot; to begin streaming</li>
                            <li className="truncate">Watch real-time output in the streaming area below</li>
                            <li className="truncate">Generation uses your configured personalization settings</li>
                            <li className="truncate">Cancel anytime during generation if needed</li>
                            <li className="truncate">Save completed structure to page when ready</li>
                            <li className="truncate">Generated structure includes selfPrompt for recursive use</li>
                        </ol>
                    </div>
                </>
            )}
        </div>
    );
}
