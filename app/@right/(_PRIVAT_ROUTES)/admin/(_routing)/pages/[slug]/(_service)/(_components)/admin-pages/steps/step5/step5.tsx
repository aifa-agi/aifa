// @/app/admin/pages/[slug]/(_service)/(_components)/admin-page-prompt.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  AlertCircle,
  Shield,
  Copy,
  CheckCircle,
  FileText,
  Sparkles,
  Palette,
  MessageSquare,
  Edit3,
  Lightbulb,
  Home,
  Network,
  Target,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { Badge } from "@/components/ui/badge";
import { PageNotFound } from "../../../page-not-found";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { TOC } from "./components/table_of_content/toc";
import { fileTreeDataTransformer } from "../../admin-page-info/(_service)/(_utils)/file-tree-transformer";
import { usePromptReadyFlag } from "./(_hooks)/use-prompt-ready-flag";
import { useSystemInstructionGenerator } from "./(_service)/system-instruction-generator";

interface AdminPageInfoProps {
  slug: string;
}

// Writing Style Options for Content Generation
const WRITING_STYLES = [
  {
    value: "narrative",
    label: "Narrative",
    description: "Story-driven, engaging storytelling approach",
  },
  {
    value: "artistic",
    label: "Artistic",
    description: "Creative, expressive, and imaginative tone",
  },
  {
    value: "humorous",
    label: "Humorous",
    description: "Light-hearted, entertaining, with wit and humor",
  },
  {
    value: "academic",
    label: "Academic",
    description: "Scholarly, research-based, formal approach",
  },
  {
    value: "conversational",
    label: "Conversational",
    description: "Friendly, informal, like talking to a friend",
  },
  {
    value: "inspirational",
    label: "Inspirational",
    description: "Motivating, uplifting, encouraging tone",
  },
  {
    value: "technical",
    label: "Technical",
    description: "Precise, detailed, expert-level information",
  },
  {
    value: "minimalist",
    label: "Minimalist",
    description: "Clean, concise, essential information only",
  },
  {
    value: "dramatic",
    label: "Dramatic",
    description: "Emotionally engaging, powerful storytelling",
  },
  {
    value: "educational",
    label: "Educational",
    description: "Teaching-focused, step-by-step learning approach",
  },
];

// Content Format Options for Delivery Style
const CONTENT_FORMATS = [
  {
    value: "simple",
    label: "Simple",
    description: "Easy to understand, basic language",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Business-appropriate, formal tone",
  },
  {
    value: "first-person",
    label: "First Person",
    description: "Personal perspective, 'I' and 'my' approach",
  },
  {
    value: "expert",
    label: "Expert",
    description: "Authority-based, industry expertise",
  },
  {
    value: "beginner-friendly",
    label: "Beginner Friendly",
    description: "Accessible to newcomers, explained simply",
  },
  {
    value: "data-driven",
    label: "Data Driven",
    description: "Statistics, facts, and research-focused",
  },
  {
    value: "case-study",
    label: "Case Study",
    description: "Real examples and practical applications",
  },
  {
    value: "how-to",
    label: "How-To Guide",
    description: "Step-by-step instructional format",
  },
  {
    value: "comparison",
    label: "Comparison",
    description: "Pros/cons, before/after analysis",
  },
  {
    value: "listicle",
    label: "Listicle",
    description: "Organized in numbered or bulleted lists",
  },
];

// Custom requirements example suggestions
const CUSTOM_REQUIREMENTS_EXAMPLES = [
  "Include call-to-action buttons in specific sections",
  "Focus on mobile-first design considerations",
  "Add customer testimonials or social proof",
  "Include pricing information or cost comparisons",
  "Emphasize security and privacy features",
  "Target specific demographic (e.g., small business owners)",
  "Include step-by-step tutorials or guides",
  "Add FAQ section addressing common concerns",
  "Focus on local market considerations",
  "Include competitor comparison analysis",
];

/**
 * Компонент для генерации AI системных инструкций для создания
 * расширенной структуры контента с selfPrompt полями для рекурсивной генерации
 */
export function AdminPageStep5({ slug }: AdminPageInfoProps) {
  const { categories, loading, initialized } = useNavigationMenu();

  const [isCopied, setIsCopied] = useState(false);

  // Персонализация состояние
  const [writingStyle, setWritingStyle] = useState<string>("conversational");
  const [contentFormat, setContentFormat] = useState<string>("professional");
  const [customRequirements, setCustomRequirements] = useState<string>("");

  const pageData = findPageBySlug(categories, slug);

  // ✅ Хук для управления флагом готовности промпта
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

  // ✅ НОВЫЙ ХУК: Генерация системной инструкции
  const systemInstruction = useSystemInstructionGenerator({
    pageData: pageData,
    slug,
    writingStyle,
    contentFormat,
    customRequirements,
    writingStyles: WRITING_STYLES,
    contentFormats: CONTENT_FORMATS,
  });

  // ✅ Обработка копирования с обновлением флага
  const handleCopyInstruction = async () => {
    try {
      await navigator.clipboard.writeText(systemInstruction);
      setIsCopied(true);

      // Помечаем промпт как готовый для Perplexity
      const promptMarked = await markPromptAsReady();

      if (promptMarked) {
        toast.success(
          "Enhanced system instruction copied and marked as ready for Perplexity!"
        );
      } else {
        toast.success("Enhanced system instruction copied to clipboard!");
        toast.warning("Could not mark prompt as ready. Please try again.");
      }

      // Reset copied state after 3 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy instruction. Please try again.");
    }
  };

  // Show loading state
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">
          Loading enhanced prompt data...
        </span>
      </div>
    );
  }

  if (!pageData) {
    return <PageNotFound slug={slug} />;
  }

  const { page } = pageData;

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Network className="size-6 text-primary" />
            <div>
              <CardTitle className="text-xl">
                Recursive Content Generation System
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Generate enhanced content structure with selfPrompt fields for
                unlimited content generation
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              <Layers className="size-3 mr-1" />
              Recursive AI
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Personalization Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="size-5 text-primary" />
            <CardTitle className="text-lg">Content Personalization</CardTitle>
            <Badge variant="secondary">US Market</Badge>
            {isPromptReady && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="size-3 mr-1" />
                Ready for Perplexity
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Configure writing style and content format for enhanced structure
            generation
          </p>
        </CardHeader>

        <CardContent>
          {/* Prompt Status Section */}
          {isPromptReady && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">
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
              <p className="text-sm text-green-800 dark:text-green-200 mt-2">
                This enhanced prompt includes full page configuration and
                current content structure for recursive generation
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Writing Style Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                <Label htmlFor="writing-style" className="text-sm font-medium">
                  Writing Style
                </Label>
              </div>
              <Select value={writingStyle} onValueChange={setWritingStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select writing style" />
                </SelectTrigger>
                <SelectContent>
                  {WRITING_STYLES.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-left mt-2">
                          {style.label}
                        </span>
                        <span className="text-xs text-muted-foreground text-left mb-2">
                          {style.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {
                  WRITING_STYLES.find((s) => s.value === writingStyle)
                    ?.description
                }
              </p>
            </div>

            {/* Content Format Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <Label htmlFor="content-format" className="text-sm font-medium">
                  Content Format
                </Label>
              </div>
              <Select value={contentFormat} onValueChange={setContentFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content format" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-left mt-2">
                          {format.label}
                        </span>
                        <span className="text-xs text-left text-muted-foreground mb-2">
                          {format.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {
                  CONTENT_FORMATS.find((f) => f.value === contentFormat)
                    ?.description
                }
              </p>
            </div>
          </div>

          {/* Custom Requirements Section */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <Edit3 className="size-4 text-primary" />
              <Label
                htmlFor="custom-requirements"
                className="text-sm font-medium"
              >
                Custom Requirements & Specifications
              </Label>
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
            </div>

            <Textarea
              id="custom-requirements"
              placeholder="Add specific requirements for content structure generation..."
              value={customRequirements}
              onChange={(e) => setCustomRequirements(e.target.value)}
              className="min-h-[100px] resize-y"
            />

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="size-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-2">
                    Example Requirements:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-blue-800 dark:text-blue-200">
                    {CUSTOM_REQUIREMENTS_EXAMPLES.map((example, index) => (
                      <div key={index} className="flex items-start gap-1">
                        <span className="text-blue-600 dark:text-blue-400">
                          •
                        </span>
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Configuration Summary */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Enhanced Generation Configuration:
            </h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p>
                <span className="font-medium">Style:</span>{" "}
                {WRITING_STYLES.find((s) => s.value === writingStyle)?.label} -
                {
                  WRITING_STYLES.find((s) => s.value === writingStyle)
                    ?.description
                }
              </p>
              <p>
                <span className="font-medium">Format:</span>{" "}
                {CONTENT_FORMATS.find((f) => f.value === contentFormat)?.label}{" "}
                -
                {
                  CONTENT_FORMATS.find((f) => f.value === contentFormat)
                    ?.description
                }
              </p>
              <p>
                <span className="font-medium">Content Structure:</span>{" "}
                {page.aiRecommendContentStructure?.length || 0} existing
                elements
              </p>
              <p>
                <span className="font-medium">Generation Mode:</span> Recursive
                with selfPrompt fields
              </p>
              {customRequirements.trim() && (
                <p>
                  <span className="font-medium">Custom Requirements:</span>{" "}
                  {customRequirements.trim().length} characters specified
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Enhanced Instruction Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Target className="size-6 text-primary" />
              <CardTitle className="text-xl">
                Enhanced AI Structure Generation Prompt
              </CardTitle>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Network className="size-3" />
              Recursive System
            </Badge>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="leading-relaxed">
              This enhanced system instruction generates expanded content
              structure with selfPrompt fields for recursive content generation,
              enabling unlimited content creation.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 dark:bg-amber-950 dark:border-amber-800">
              <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                ⚠️ Enhanced Generation Process:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-amber-800 dark:text-amber-200 text-xs">
                <li>Copy the comprehensive system instruction below</li>
                <li>
                  Use Perplexity Pro or GPT-4 for complex structure generation
                </li>
                <li>
                  Expect larger token usage due to complete data transmission
                </li>
                <li>
                  Generated JSON will include selfPrompt for each content
                  element
                </li>
                <li>Use generated structure for recursive content creation</li>
                <li>Each content piece can be generated independently</li>
              </ol>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Enhanced Page Info Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-3 text-foreground">
              Complete Page Data Transmission
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Title:</span>
                <span className="ml-2 font-medium">
                  {page.title || page.linkName || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Slug:</span>
                <span className="ml-2 font-mono bg-background px-2 py-1 rounded">
                  {slug || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2">{page.type || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Keywords:</span>
                <span className="ml-2">
                  {page.keywords?.length
                    ? `${page.keywords.length} keywords`
                    : "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Images:</span>
                <span className="ml-2">
                  {page.images?.length ? `${page.images.length} images` : "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  Current Structure:
                </span>
                <span className="ml-2">
                  {page.aiRecommendContentStructure?.length || 0} elements
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Intent:</span>
                <span className="ml-2">{page.intent || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Taxonomy:</span>
                <span className="ml-2">{page.taxonomy || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Audiences:</span>
                <span className="ml-2">{page.audiences || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Writing Style:</span>
                <span className="ml-2">
                  {WRITING_STYLES.find((s) => s.value === writingStyle)
                    ?.label || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Content Format:</span>
                <span className="ml-2">
                  {CONTENT_FORMATS.find((f) => f.value === contentFormat)
                    ?.label || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Prompt Status:</span>
                <span className="ml-2">
                  {isPromptReady ? (
                    <Badge variant="default" className="bg-green-600 text-xs">
                      Ready for AI
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Not Ready
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Current Content Structure Preview */}
          {page.aiRecommendContentStructure &&
            page.aiRecommendContentStructure.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Current Content Structure (Will be Enhanced)
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  The AI will expand this structure with selfPrompt fields for
                  recursive generation
                </p>
                <TOC
                  toc={fileTreeDataTransformer(
                    page.aiRecommendContentStructure
                  )}
                />
              </div>
            )}

          {/* Enhanced System Instruction */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Enhanced System Instruction for Recursive Generation
              </label>
              <Button
                onClick={handleCopyInstruction}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={!systemInstruction || isPromptUpdating}
              >
                {isPromptUpdating ? (
                  <>
                    <LoadingSpinner className="size-4" />
                    Updating...
                  </>
                ) : isCopied ? (
                  <>
                    <CheckCircle className="size-4 text-green-600" />
                    Copied & Ready!
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    Copy Enhanced Instruction
                  </>
                )}
              </Button>
            </div>

            <textarea
              value={systemInstruction}
              readOnly
              className="w-full h-96 p-4 text-sm font-mono bg-white text-black border border-input rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
              }}
              placeholder="Generating comprehensive enhanced system instruction..."
            />
          </div>

          {/* Enhanced Information */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 dark:bg-green-950 dark:border-green-800">
            <h5 className="font-medium text-green-900 dark:text-green-100 mb-2 text-sm">
              🚀 Enhanced System Features:
            </h5>
            <ul className="space-y-1 text-green-800 dark:text-green-200 text-xs">
              <li>
                • Complete page configuration data transmission (all fields
                included)
              </li>
              <li>• Current content structure analysis and enhancement</li>
              <li>• selfPrompt generation for each content element</li>
              <li>• Resource and link suggestions for recursive generation</li>
              <li>• SEO optimization with keyword distribution</li>
              <li>• Quality criteria and validation rules for each element</li>
              <li>• Dependencies mapping for logical content flow</li>
              <li>
                • Unlimited content generation through recursive architecture
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
