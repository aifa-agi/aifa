// File: app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/components/content-personalization-panel.tsx
"use client";

/**
 * ContentPersonalizationPanel:
 * - Comprehensive personalization controls for content structure generation
 * - Includes writing style selection, content format selection, and custom requirements
 * - Features prompt ready status banner and configuration summary
 * - Follows the exact styling patterns from the original Step 5 component
 * 
 * Extracted from: Original Step 5 personalization controls Card
 */

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
    CheckCircle,
    FileText,
    Palette,
    MessageSquare,
    Edit3
} from "lucide-react";

// Writing Style Options - extracted from original Step 5
const WRITING_STYLES = [
    { value: "narrative", label: "Narrative", description: "Story-driven, engaging storytelling approach" },
    { value: "artistic", label: "Artistic", description: "Creative, expressive, and imaginative tone" },
    { value: "humorous", label: "Humorous", description: "Light-hearted, entertaining, with wit and humor" },
    { value: "academic", label: "Academic", description: "Scholarly, research-based, formal approach" },
    { value: "conversational", label: "Conversational", description: "Friendly, informal, like talking to a friend" },
    { value: "inspirational", label: "Inspirational", description: "Motivating, uplifting, encouraging tone" },
    { value: "technical", label: "Technical", description: "Precise, detailed, expert-level information" },
    { value: "minimalist", label: "Minimalist", description: "Clean, concise, essential information only" },
    { value: "dramatic", label: "Dramatic", description: "Emotionally engaging, powerful storytelling" },
    { value: "educational", label: "Educational", description: "Teaching-focused, step-by-step learning approach" },
];

// Content Format Options - extracted from original Step 5
const CONTENT_FORMATS = [
    { value: "simple", label: "Simple", description: "Easy to understand, basic language" },
    { value: "professional", label: "Professional", description: "Business-appropriate, formal tone" },
    { value: "first-person", label: "First Person", description: "Personal perspective, 'I' and 'my' approach" },
    { value: "expert", label: "Expert", description: "Authority-based, industry expertise" },
    { value: "beginner-friendly", label: "Beginner Friendly", description: "Accessible to newcomers, explained simply" },
    { value: "data-driven", label: "Data Driven", description: "Statistics, facts, and research-focused" },
    { value: "case-study", label: "Case Study", description: "Real examples and practical applications" },
    { value: "how-to", label: "How-To Guide", description: "Step-by-step instructional format" },
    { value: "comparison", label: "Comparison", description: "Pros/cons, before/after analysis" },
    { value: "listicle", label: "Listicle", description: "Organized in numbered or bulleted lists" },
];

interface PersonalizationConfig {
    writingStyle: string;
    contentFormat: string;
    customRequirements: string;
}

interface ContentPersonalizationPanelProps {
    /** Current writing style */
    writingStyle: string;
    /** Current content format */
    contentFormat: string;
    /** Custom requirements text */
    customRequirements: string;
    /** Whether prompt is ready */
    isPromptReady: boolean;
    /** Whether prompt is being updated */
    isPromptUpdating: boolean;
    /** Whether user can update prompt status */
    canUpdatePrompt: boolean;
    /** Callback when personalization changes */
    onPersonalizationChange: (config: PersonalizationConfig) => void;
    /** Callback to unmark prompt as ready */
    onUnmarkPromptAsReady: () => void;
    /** Additional CSS classes */
    className?: string;
}

export function ContentPersonalizationPanel({
    writingStyle,
    contentFormat,
    customRequirements,
    isPromptReady,
    isPromptUpdating,
    canUpdatePrompt,
    onPersonalizationChange,
    onUnmarkPromptAsReady,
    className = ""
}: ContentPersonalizationPanelProps) {

    // Handle personalization updates
    const handleWritingStyleChange = (newStyle: string) => {
        onPersonalizationChange({
            writingStyle: newStyle,
            contentFormat,
            customRequirements
        });
    };

    const handleContentFormatChange = (newFormat: string) => {
        onPersonalizationChange({
            writingStyle,
            contentFormat: newFormat,
            customRequirements
        });
    };

    const handleCustomRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onPersonalizationChange({
            writingStyle,
            contentFormat,
            customRequirements: e.target.value
        });
    };

    return (
        <Card className={`w-full rounded-md border border-neutral-200 bg-neutral-50/60 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40 ${className}`}>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Palette className="size-5 text-primary" />
                    <CardTitle className="text-lg truncate">Content Structure Personalization</CardTitle>
                    {isPromptReady ? (
                        <span className="ml-auto rounded-sm bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                            Ready for Perplexity
                        </span>
                    ) : (
                        <span className="ml-auto rounded-sm bg-neutral-500/20 px-2 py-0.5 text-xs text-neutral-300">
                            Draft
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                    Configure writing style and content format for enhanced content structure generation
                </p>
            </CardHeader>
            <CardContent>
                {/* Prompt Ready Status Banner - only show when ready */}
                {isPromptReady && (
                    <div className="mb-6 p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                                <h4 className="font-medium text-green-900 dark:text-green-100 truncate">
                                    Enhanced Structure Prompt Ready
                                </h4>
                            </div>
                            <Button
                                onClick={onUnmarkPromptAsReady}
                                variant="outline"
                                size="sm"
                                disabled={!canUpdatePrompt}
                                className="border-green-300 text-green-700 hover:bg-green-100"
                            >
                                {isPromptUpdating ? (
                                    <>
                                        <LoadingSpinner className="size-4 mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    "Unmark as Ready"
                                )}
                            </Button>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-200 mt-2 truncate">
                            This enhanced prompt includes full page configuration for recursive content structure generation
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Writing Style Selection */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="size-4 text-primary" />
                            <Label htmlFor="writing-style" className="text-sm font-medium truncate">
                                Writing Style
                            </Label>
                        </div>
                        <Select value={writingStyle} onValueChange={handleWritingStyleChange}>
                            <SelectTrigger className="truncate">
                                <SelectValue placeholder="Select writing style" />
                            </SelectTrigger>
                            <SelectContent>
                                {WRITING_STYLES.map((style) => (
                                    <SelectItem key={style.value} value={style.value} className="truncate">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-left truncate">{style.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground truncate">
                            {WRITING_STYLES.find((s) => s.value === writingStyle)?.description}
                        </p>
                    </div>

                    {/* Content Format Selection */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <FileText className="size-4 text-primary" />
                            <Label htmlFor="content-format" className="text-sm font-medium truncate">
                                Content Format
                            </Label>
                        </div>
                        <Select value={contentFormat} onValueChange={handleContentFormatChange}>
                            <SelectTrigger className="truncate">
                                <SelectValue placeholder="Select content format" />
                            </SelectTrigger>
                            <SelectContent>
                                {CONTENT_FORMATS.map((format) => (
                                    <SelectItem key={format.value} value={format.value} className="truncate">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-left truncate">{format.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground truncate">
                            {CONTENT_FORMATS.find((f) => f.value === contentFormat)?.description}
                        </p>
                    </div>
                </div>

                {/* Custom Requirements Section */}
                <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2">
                        <Edit3 className="size-4 text-primary" />
                        <Label htmlFor="custom-requirements" className="text-sm font-medium truncate">
                            Custom Requirements & Specifications
                        </Label>
                        <Badge variant="outline" className="text-xs">Optional</Badge>
                    </div>
                    <Textarea
                        id="custom-requirements"
                        placeholder="Add specific requirements for content structure generation..."
                        value={customRequirements}
                        onChange={handleCustomRequirementsChange}
                        className="min-h-[100px] resize-y"
                    />
                </div>

                {/* Configuration Summary */}
                <div className="mt-6 p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                    <h4 className="font-medium mb-3 text-foreground truncate">
                        Enhanced Structure Generation Configuration
                    </h4>
                    <div className="text-sm text-foreground/80 space-y-1">
                        <p className="truncate">
                            <span className="font-medium">Style:</span> {WRITING_STYLES.find((s) => s.value === writingStyle)?.label} - {WRITING_STYLES.find((s) => s.value === writingStyle)?.description}
                        </p>
                        <p className="truncate">
                            <span className="font-medium">Format:</span> {CONTENT_FORMATS.find((f) => f.value === contentFormat)?.label} - {CONTENT_FORMATS.find((f) => f.value === contentFormat)?.description}
                        </p>
                        {customRequirements.trim() && (
                            <p className="truncate">
                                <span className="font-medium">Custom Requirements:</span> {customRequirements.trim().length} characters specified
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
