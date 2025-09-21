// File: content-structure-stream-card.tsx
"use client";

/**
 * ContentStructureStreamCard:
 * - Handles streaming content structure generation following Step 8 architecture
 * - Clean separation of streaming logic from main component
 * - Uses optimized useStep5Stream hook with proper error handling
 * - Provides streaming controls and real-time output display
 */

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import { useStep5Save } from "../(_hooks)/use-step5-save";
import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";
import { useStep5Stream } from "../(_hooks)/use-step5-stream";

interface ContentStructureStreamCardProps {
    systemInstruction: string;
    pageData: any;
    onStreamCompleted?: (structure: RootContentStructure[]) => void;
}

export function ContentStructureStreamCard({
    systemInstruction,
    pageData,
    onStreamCompleted
}: ContentStructureStreamCardProps) {
    // Streaming hook for live preview
    const { streamText, isStreaming, startStreaming, cancel } = useStep5Stream();
    const { saveDraftContentStructure } = useStep5Save();

    // Local state for streaming output
    const [localPreview, setLocalPreview] = React.useState<string>("");
    const [generatedStructure, setGeneratedStructure] = React.useState<RootContentStructure[]>([]);
    const [streamCompleted, setStreamCompleted] = React.useState<boolean>(false);

    // Keep the textarea in sync with the streaming completion
    React.useEffect(() => {
        if (isStreaming) {
            setLocalPreview(streamText ?? "");
        }
    }, [isStreaming, streamText]);

    // Watch for streaming completion and parse JSON
    React.useEffect(() => {
        if (!isStreaming && streamText && streamText.trim().length > 0) {
            try {
                // Try to parse JSON from streamed text
                const parsed = JSON.parse(streamText);
                if (Array.isArray(parsed)) {
                    setGeneratedStructure(parsed);
                    setStreamCompleted(true);
                    onStreamCompleted?.(parsed);
                }
            } catch (e) {
                console.warn("Failed to parse streamed JSON:", e);
                // If not JSON, treat as raw text and create basic structure
                setStreamCompleted(true);
            }
        }
    }, [isStreaming, streamText, onStreamCompleted]);

    // Chip-style classes aligned with Step 8 architecture
    const chipBase = "inline-flex items-center truncate rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
    const tonePrimary = "border-violet-500 bg-violet-500/15 text-white hover:bg-violet-500/20 focus-visible:ring-violet-500";
    const toneNeutral = "border-border bg-background/60 text-muted-foreground hover:bg-background/80 dark:bg-background/30 focus-visible:ring-neutral-500";
    const toneDisabled = "opacity-50 cursor-not-allowed";
    const toneCancel = "border-border bg-background/60 text-muted-foreground hover:bg-background/70 dark:bg-background/30 focus-visible:ring-neutral-500";

    const onStream = async () => {
        if (!systemInstruction) {
            toast.error("System instruction is required", {
                id: "step5-stream-error",
                description: "Please configure the system instruction first.",
            });
            return;
        }

        if (!pageData?.page) {
            toast.error("Page data is missing", {
                id: "step5-stream-error",
                description: "Cannot generate structure without page data.",
            });
            return;
        }

        // Clear preview and reset state
        setLocalPreview("");
        setStreamCompleted(false);
        setGeneratedStructure([]);

        // Start streaming
        await startStreaming({
            system: systemInstruction,
            prompt: "Generate enhanced content structure with selfPrompt fields for recursive generation.",
            model: "gpt-4.1-mini",
        });
    };

    const onSave = async () => {
        if (!pageData?.page || generatedStructure.length === 0) {
            toast.error("Nothing to save", {
                description: "No generated structure found.",
            });
            return;
        }

        const success = await saveDraftContentStructure(pageData.page, generatedStructure);
        if (success) {
            setStreamCompleted(false);
            setGeneratedStructure([]);
            setLocalPreview("");
            toast.success("Structure saved successfully", {
                description: "Content structure has been saved to the page.",
            });
        }
    };

    const onClear = () => {
        setLocalPreview("");
        setGeneratedStructure([]);
        setStreamCompleted(false);
        toast.info("Output cleared", {
            description: "Streaming output has been cleared.",
        });
    };

    const streamDisabled = isStreaming || !systemInstruction;

    return (
        <div className="rounded-md border p-4">
            {/* Single-row chip buttons with horizontal scroll wrapped by custom sidebar styling */}
            <div className="custom-sidebar overflow-x-auto">
                <div className="flex min-w-max items-center gap-2">
                    {/* Stream Generate button */}
                    <button
                        type="button"
                        onClick={onStream}
                        disabled={streamDisabled}
                        className={[chipBase, tonePrimary, streamDisabled ? toneDisabled : ""].join(" ")}
                    >
                        {isStreaming ? (
                            <>
                                <LoadingSpinner className="size-4 mr-2" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Zap className="size-4 mr-2" />
                                Start Structure Generation
                            </>
                        )}
                    </button>

                    {/* Cancel button (only visible when streaming) */}
                    {isStreaming && (
                        <button
                            type="button"
                            onClick={cancel}
                            className={[chipBase, toneCancel].join(" ")}
                        >
                            Cancel
                        </button>
                    )}

                    {/* Save button (only visible when completed) */}
                    {streamCompleted && (
                        <button
                            type="button"
                            onClick={onSave}
                            className={[chipBase, tonePrimary].join(" ")}
                        >
                            <CheckCircle className="size-4 mr-2" />
                            Save Content Structure
                        </button>
                    )}

                    {/* Clear button */}
                    <button
                        type="button"
                        onClick={onClear}
                        className={[chipBase, toneNeutral].join(" ")}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Streaming output area */}
            <div className="mt-3">
                <div className="w-full h-96 p-4 text-sm font-mono bg-white text-black border border-input rounded-lg overflow-auto">
                    {isStreaming && (
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <LoadingSpinner className="size-4" />
                            <span>Generating content structure...</span>
                        </div>
                    )}

                    {localPreview ? (
                        <pre className="whitespace-pre-wrap text-xs leading-relaxed">{localPreview}</pre>
                    ) : (
                        <div className="text-gray-400 italic">Content structure will appear here during generation...</div>
                    )}

                    {streamCompleted && generatedStructure.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                            <div className="text-green-800 text-xs font-medium">
                                Structure generation completed! {generatedStructure.length} elements ready to save.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
