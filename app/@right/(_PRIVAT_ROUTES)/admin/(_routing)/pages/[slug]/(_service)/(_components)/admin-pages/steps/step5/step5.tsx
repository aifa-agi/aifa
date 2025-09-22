"use client";

/**
 * Step 5 - Enhanced Content Structure Generation System + Internal AI Stream Mode
 * Understanding of the task (step-by-step):
 * 1) Add a shadcn/ui Switch with enhanced styling and clear mode indicators.
 *    Default OFF keeps the current flow: copy enhanced system instruction for Perplexity.
 * 2) When the Switch is ON (internal AI mode):
 *    - Hide all prompt-related helper content (process notes and copy-instruction UI).
 *    - Replace the big textarea with a streaming output area.
 *    - Replace the "Copy Enhanced Instruction" button with streaming controls.
 *    - The new button changes from "Start Structure Generation" to "Save Content Structure" after completion.
 * 3) Enhanced UI with primary-themed borders and backgrounds for mode selection.
 * 4) More precise naming focused on content structure generation.
 * 5) Full integration with streaming hooks and draftContentStructure saving.
 */

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  CheckCircle,
  FileText,
  Palette,
  MessageSquare,
  Edit3,
  Network,
  Target,
  Copy as CopyIcon,
  Settings,
  Zap
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { PageNotFound } from "../../../page-not-found";
import { Switch } from "@/components/ui/switch";
// Import the new streaming component
import { ContentStructureStreamCard } from "./components/content-structure-stream-card";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { useSystemInstructionGenerator } from "./(_service)/system-instruction-generator";
import { usePromptReadyFlag } from "./(_hooks)/use-prompt-ready-flag";

interface AdminPageInfoProps {
  slug: string;
}

// Writing Style Options for Content Generation
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

// Content Format Options for Delivery Style
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

export function AdminPageStep5({ slug }: AdminPageInfoProps) {
  const { categories, loading, initialized } = useNavigationMenu();
  const [isCopied, setIsCopied] = useState(false);

  // Personalization state
  const [writingStyle, setWritingStyle] = useState<string>("conversational");
  const [contentFormat, setContentFormat] = useState<string>("professional");
  const [customRequirements, setCustomRequirements] = useState<string>("");

  // Mode switch state
  const [useInternalAI, setUseInternalAI] = useState<boolean>(true);

  const pageData = findPageBySlug(categories, slug);

  // Ready-flag control (unchanged logic)
  const {
    isUpdating: isPromptUpdating,
    markPromptAsReady,
    unmarkPromptAsReady,
    isPromptReady,
    canUpdate: canUpdatePrompt
  } = usePromptReadyFlag({
    page: pageData?.page || null,
    categoryTitle: pageData?.category?.title || "",
    slug,
  });

  // System instruction generator
  const systemInstruction = useSystemInstructionGenerator({
    pageData,
    slug,
    writingStyle,
    contentFormat,
    customRequirements,
    writingStyles: WRITING_STYLES,
    contentFormats: CONTENT_FORMATS,
  });

  // Compute ready indicator
  const page = pageData?.page;
  const isReadyFlag = Boolean((page as any)?.aiReadyPromptForPerplexyty) ||
    Boolean(page?.isReadyPromptForPerplexity) ||
    Boolean(isPromptReady);

  // Copy instruction handler
  const handleCopyInstruction = async () => {
    try {
      await navigator.clipboard.writeText(systemInstruction);
      setIsCopied(true);

      const promptMarked = await markPromptAsReady();
      if (promptMarked) {
        toast.success("Enhanced system instruction copied and marked as ready for Perplexity!");
      } else {
        toast.success("Enhanced system instruction copied to clipboard!");
        toast.warning("Could not mark prompt as ready. Please try again.");
      }
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy instruction. Please try again.");
    }
  };

  // Loading state
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">Loading content structure system...</span>
      </div>
    );
  }

  if (!pageData) {
    return <PageNotFound slug={slug} />;
  }

  // Shared style classes
  const chipBase = "inline-flex items-center truncate rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const tonePrimary = "border-violet-500 bg-violet-500/15 text-white hover:bg-violet-500/20 focus-visible:ring-violet-500";
  const toneNeutral = "border-border bg-background/60 text-muted-foreground hover:bg-background/80 dark:bg-background/30 focus-visible:ring-neutral-500";
  const toneDisabled = "opacity-50 cursor-not-allowed";

  // Status dot
  const dotBase = "inline-block h-1 w-1 rounded-full";
  const dotCls = isReadyFlag ? `${dotBase} bg-emerald-400` : `${dotBase} bg-yellow-400`;

  return (
    <div className="space-y-6">
      {/* Header aligned to Step 8 styles */}
      <Card className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="text-violet-400">
              <div className="h-5 w-5 rounded-sm bg-violet-500/30" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xl truncate text-foreground">
                Recursive Content Structure Generation System
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                Generate enhanced content structure with selfPrompt fields for unlimited structure creation
              </p>
            </div>
            {/* Status indicator with 4px dot */}
            <div className="ml-auto">
              <Button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-violet-500 bg-violet-500/15 px-3 py-1.5 text-sm text-white hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className={dotCls} aria-hidden="true" />
                <span className="ml-2 truncate">Recursive AI</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Mode Switch with primary theme */}
      <Card className={`w-full rounded-md shadow-sm transition-all ${useInternalAI
        ? "border-violet-500 bg-violet-500/10 dark:border-violet-400 dark:bg-violet-900/20"
        : "border-neutral-200 bg-neutral-50/60 dark:border-neutral-800/60 dark:bg-neutral-900/40"
        }`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-2">
                {useInternalAI ? (
                  <Zap className="size-5 text-violet-400" />
                ) : (
                  <Settings className="size-5 text-muted-foreground" />
                )}
                <Label htmlFor="use-internal-ai" className="text-base font-semibold truncate">
                  {useInternalAI ? "AI Structure Generation Mode" : "System Instruction Mode"}
                </Label>
                <Badge variant={useInternalAI ? "default" : "secondary"} className="text-xs">
                  {useInternalAI ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {useInternalAI
                  ? "Using internal AI model to generate content structure directly with streaming output"
                  : "Generate enhanced system instruction for external AI tools like Perplexity Pro"
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground">
                {useInternalAI ? "Internal AI" : "External AI"}
              </div>
              <Switch
                id="use-internal-ai"
                checked={useInternalAI}
                onCheckedChange={setUseInternalAI}
                className="data-[state=checked]:bg-violet-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalization Controls */}
      <Card className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="size-5 text-primary" />
            <CardTitle className="text-lg truncate">Content Structure Personalization</CardTitle>
            {isReadyFlag ? (
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
          {/* Prompt Ready Status */}
          {isPromptReady && !useInternalAI && (
            <div className="mb-6 p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-medium text-green-900 dark:text-green-100 truncate">
                    Enhanced Structure Prompt Ready
                  </h4>
                </div>
                <Button
                  onClick={unmarkPromptAsReady}
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
              <Select value={writingStyle} onValueChange={setWritingStyle}>
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
              <Select value={contentFormat} onValueChange={setContentFormat}>
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
              onChange={(e) => setCustomRequirements(e.target.value)}
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
              <p className="truncate">
                <span className="font-medium">Current Structure:</span> {page?.aiRecommendContentStructure?.length || 0} existing elements
              </p>
              <p className="truncate">
                <span className="font-medium">Generation Mode:</span> {useInternalAI ? "Internal AI streaming" : "External instruction generation"}
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

      {/* Main Generation Card */}
      <Card className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Target className="size-6 text-primary shrink-0" />
              <CardTitle className="text-xl truncate">
                {useInternalAI ? "AI Content Structure Generation" : "Enhanced AI Structure Generation Prompt"}
              </CardTitle>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs text-muted-foreground border-border bg-background/60 dark:bg-background/30">
              <Network className="size-3" />
              <span className="truncate">{useInternalAI ? "Internal Model" : "Recursive System"}</span>
            </span>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            {!useInternalAI ? (
              <>
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
              <p className="leading-relaxed truncate">
                Stream content structure using the internal AI model; the output area below will display results in real time during generation
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enhanced Page Info Summary */}
          <div className="rounded-lg p-4 bg-muted/50">
            <h4 className="font-medium mb-3 text-foreground truncate">
              Complete Page Data for Structure Generation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="truncate">
                <span className="text-muted-foreground">Title:</span>
                <span className="ml-2 font-medium">{page?.title || page?.linkName}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Slug:</span>
                <span className="ml-2 font-mono bg-background px-2 py-1 rounded">{slug}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2">{page?.type}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Keywords:</span>
                <span className="ml-2">{page?.keywords?.length ? `${page.keywords.length} keywords` : "None"}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Images:</span>
                <span className="ml-2">{page?.images?.length || 0} images</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Current Structure:</span>
                <span className="ml-2">{page?.aiRecommendContentStructure?.length || 0} elements</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Intent:</span>
                <span className="ml-2">{page?.intent}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Taxonomy:</span>
                <span className="ml-2">{page?.taxonomy}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Audiences:</span>
                <span className="ml-2">{page?.audiences}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Writing Style:</span>
                <span className="ml-2">{WRITING_STYLES.find((s) => s.value === writingStyle)?.label}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Content Format:</span>
                <span className="ml-2">{CONTENT_FORMATS.find((f) => f.value === contentFormat)?.label}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Generation Status:</span>
                <span className="ml-2">
                  {isReadyFlag ? (
                    <Badge variant="default" className="bg-green-600 text-xs">Ready for AI</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Not Ready</Badge>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Generation Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium truncate">
                {useInternalAI ? "Internal AI Structure Generation Output" : "Enhanced System Instruction for Structure Generation"}
              </label>
              {!useInternalAI && (
                <button
                  type="button"
                  onClick={handleCopyInstruction}
                  disabled={!systemInstruction || isPromptUpdating}
                  className={[chipBase, tonePrimary, (!systemInstruction || isPromptUpdating) ? toneDisabled : ""].join(" ")}
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
              )}
            </div>

            {!useInternalAI ? (
              /* System instruction textarea for external mode */
              <textarea
                value={systemInstruction}
                readOnly
                className="w-full h-96 p-4 text-sm font-mono bg-white text-black border border-input rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
                placeholder="Generating comprehensive enhanced system instruction..."
              />
            ) : (
              /* Streaming component for internal AI mode */
              <ContentStructureStreamCard
                systemInstruction={systemInstruction}
                pageData={pageData}
                onStreamCompleted={(structure) => {
                  console.log("Stream completed with structure:", structure);
                }}
              />
            )}
          </div>

          {/* Enhanced Information (hide in internal AI mode) */}
          {!useInternalAI && (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
