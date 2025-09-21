// File: app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/page.tsx
"use client";

/**
 * AdminPageStep5 - Рефакторенная версия:
 * - Использует декомпозированные компоненты для лучшей поддержки
 * - Сохраняет всю оригинальную функциональность и логику
 * - Улучшенная читаемость кода за счет разделения ответственности
 * - Оптимизированная стриминговая архитектура по образцу Step 8
 */

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Target, Network } from "lucide-react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { PageNotFound } from "../../../page-not-found";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { usePromptReadyFlag } from "./(_hooks)/use-prompt-ready-flag";
import { useSystemInstructionGenerator } from "./(_service)/system-instruction-generator";
import type { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

// Import decomposed components
import { PageStructureHeader } from "./components/page-structure-header";
import { GenerationModeSwitch } from "./components/generation-mode-switch";
import { ContentPersonalizationPanel } from "./components/content-personalization-panel";
import { PageDataSummary } from "./components/page-data-summary";
import { ExternalAIInstructionCard } from "./components/external-ai-instruction-card";
import { GenerationConfigSummary } from "./components/generation-config-summary";
import { ProcessInstructionsPanel } from "./components/process-instructions-panel";
import { ContentStructureStreamCard } from "./components/content-structure-stream-card";

interface AdminPageInfoProps {
  slug: string;
}

// Writing Style Options for Content Generation - moved to shared constants
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

// Content Format Options for Delivery Style - moved to shared constants
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
    canUpdate: canUpdatePrompt,
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
  const isReadyFlag =
    Boolean((page as any)?.aiReadyPromptForPerplexyty) ||
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

  // Personalization change handler
  const handlePersonalizationChange = (config: {
    writingStyle: string;
    contentFormat: string;
    customRequirements: string;
  }) => {
    setWritingStyle(config.writingStyle);
    setContentFormat(config.contentFormat);
    setCustomRequirements(config.customRequirements);
  };

  // Stream completion handler
  const handleStreamCompleted = (structure: RootContentStructure[]) => {
    console.log("Stream completed with structure:", structure);
    // Additional logic can be added here if needed
  };

  // Loading state
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">
          Loading content structure system...
        </span>
      </div>
    );
  }

  if (!pageData) {
    return <PageNotFound slug={slug} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Component */}
      <PageStructureHeader
        isReady={isReadyFlag}
        mode={useInternalAI ? "internal" : "external"}
      />

      {/* Mode Switch Component */}
      <GenerationModeSwitch
        useInternalAI={useInternalAI}
        onModeChange={setUseInternalAI}
      />

      {/* Personalization Controls Component */}
      <ContentPersonalizationPanel
        writingStyle={writingStyle}
        contentFormat={contentFormat}
        customRequirements={customRequirements}
        isPromptReady={isPromptReady}
        isPromptUpdating={isPromptUpdating}
        canUpdatePrompt={canUpdatePrompt}
        onPersonalizationChange={handlePersonalizationChange}
        onUnmarkPromptAsReady={unmarkPromptAsReady}
      />

      {/* Main Generation Card */}
      <Card className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Target className="size-6 text-primary shrink-0" />
              <CardTitle className="text-xl truncate">
                {useInternalAI
                  ? "AI Content Structure Generation"
                  : "Enhanced AI Structure Generation Prompt"}
              </CardTitle>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs text-muted-foreground border-border bg-background/60 dark:bg-background/30">
              <Network className="size-3" />
              <span className="truncate">
                {useInternalAI ? "Internal Model" : "Recursive System"}
              </span>
            </span>
          </div>

          {/* Process Instructions Component */}
          <ProcessInstructionsPanel mode={useInternalAI ? "internal" : "external"} />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Page Data Summary Component */}
          <PageDataSummary
            page={page}
            writingStyle={writingStyle}
            contentFormat={contentFormat}
            isReady={isReadyFlag}
            writingStyles={WRITING_STYLES}
            contentFormats={CONTENT_FORMATS}
          />

          {/* Generation Config Summary Component */}
          <GenerationConfigSummary
            config={{
              writingStyle,
              contentFormat,
              customRequirements,
              useInternalAI,
              currentStructureCount: page?.aiRecommendContentStructure?.length || 0,
            }}
            writingStyles={WRITING_STYLES}
            contentFormats={CONTENT_FORMATS}
          />

          {/* Conditional Generation Components */}
          {!useInternalAI ? (
            /* External AI Instruction Card */
            <ExternalAIInstructionCard
              systemInstruction={systemInstruction}
              isCopied={isCopied}
              isPromptUpdating={isPromptUpdating}
              onCopy={handleCopyInstruction}
            />
          ) : (
            /* Internal AI Streaming Card */
            <ContentStructureStreamCard
              systemInstruction={systemInstruction}
              pageData={pageData}
              onStreamCompleted={handleStreamCompleted}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
