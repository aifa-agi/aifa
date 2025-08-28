// @/app/admin/pages/[slug]/(_service)/(_components)/admin-page-prompt.tsx
//

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { PageNotFound } from "../page-not-found";
import { AdminPageInfoProps } from "../../(_types)/admin-page-sections-types";
import { findPageBySlug } from "../../(_utils)/page-helpers";

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

export function AdminPageStructure({ slug }: AdminPageInfoProps) {
  const { categories, loading, initialized } = useNavigationMenu();
  const { data: session } = useSession();
  const role: UserType = session?.user?.type || "guest";

  const [isCopied, setIsCopied] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState<string>("");

  // Personalization state
  const [writingStyle, setWritingStyle] = useState<string>("conversational");
  const [contentFormat, setContentFormat] = useState<string>("professional");
  const [customRequirements, setCustomRequirements] = useState<string>("");

  const pageData = findPageBySlug(categories, slug);

  // Generate system instruction combining base config with page data and personalization
  const generateSystemInstruction = useMemo(() => {
    if (!pageData) return "";

    const { page } = pageData;

    // Extract page-specific data
    const pageTitle = page.title || page.linkName || "Untitled Page";
    const pageDescription = page.description || "No description available";
    const pageImages = page.images || [];
    const pageKeywords = page.keyWords || [];

    // Get selected style and format details
    const selectedStyle = WRITING_STYLES.find(
      (style) => style.value === writingStyle
    );
    const selectedFormat = CONTENT_FORMATS.find(
      (format) => format.value === contentFormat
    );

    // Enhanced system definition section (NEW - placed first)
    const systemDefinitionSection = `
/**
 * =============================================================================
 * SECTION 1: ENHANCED AI BLOG CONTENT GENERATION SYSTEM
 * Core System Definition and Objectives
 * =============================================================================
 * 
 * OBJECTIVE: Generate high-quality, SEO-optimized blog content capable of 
 * ranking in top search positions through comprehensive, structured content.
 * 
 * PRIORITY HIERARCHY (in order of precedence):
 * 1. TypeScript schema compliance (pageConfig structure)
 * 2. Content structure requirements (H1→H2→H3→H4 hierarchy)
 * 3. Contextual content requirements (mandatory intro paragraphs)
 * 4. Markdown formatting for Typography components only
 * 5. SEO optimization requirements
 * 
 * CORE PRINCIPLES:
 * - Maintain strict TypeScript schema compliance for all generated content
 * - Create comprehensive, well-structured content with logical flow
 * - Optimize for search engines while maintaining readability
 * - Follow semantic HTML structure through proper heading hierarchy
 * - Generate contextually relevant and engaging content
 * 
 * GENERATION APPROACH:
 * - Start with clear content strategy based on page type and requirements
 * - Apply selected writing style and content format consistently
 * - Integrate custom requirements without breaking core structure
 * - Ensure all content aligns with brand voice and target audience
 */

/**
 * =============================================================================
 * SECTION 2: ENHANCED CONTENT STRUCTURE REQUIREMENTS
 * Mandatory Content Hierarchy with Contextual Content Rules
 * =============================================================================
 */

interface EnhancedContentStructureRequirements {
  // MANDATORY CONTENT HIERARCHY WITH CONTEXTUAL CONTENT
  hierarchy: {
    H1: {
      count: 1;
      content: "Main page topic";
      followedBy: ["Introduction: 200-300 words", "Lead paragraph with hook"];
      noContextualContentRequired: true;
    };
    H2: {
      maxCount: 4;
      minWordsPerSection: 400;
      mandatoryContextualContent: {
        placement: "Immediately after H2, before any H3 or structural elements";
        wordCount: "200-250 words";
        purpose: "Explains value and scope of entire H2 section";
        structure: "3-4 paragraphs introducing the section topic";
      };
      mandatoryElements: {
        introductionParagraph: "100-150 words (contextual content)";
        mainContent: "400-550 words";
        practicalExample: "100-150 words";
      };
      requiredSubsections: 2; // Exactly 2 H3 subsections
      imageRequired: true;
      internalLinks: "minimum 2 per H2";
    };
    H3: {
      minWordsPerSection: 400;
      mandatoryContextualContent: {
        placement: "Immediately after H3, before any H4 or structural elements";
        wordCount: "80-120 words";
        purpose: "Context and significance of H3 subsection";
        structure: "1-2 paragraphs explaining subsection relevance";
      };
      requiredSubsections: 2; // Exactly 2 H4 subsections
      contentElements: {
        contextualIntroduction: "80-120 words (contextual content)";
        detailedExplanation: "120-150 words";
        practicalTips: "50-80 words";
      };
    };
    H4: {
      minWordsPerSection: 100;
      contextualContentOptional: true;
      contentElements: {
        specificInformation: "70-90 words";
        miniConclusion: "30-50 words";
      };
    };
  };

  // CONTEXTUAL CONTENT RULES FOR STRUCTURAL ELEMENTS
  structuralElementsRules: {
    beforeLists: {
      rule: "3-4 paragraphs before any list (ordered or unordered)";
      minimumWords: "60-100 words";
      purpose: "Explanation of list relevance and context";
    };
    beforeTables: {
      rule: "3-4 paragraphs before any table";
      minimumWords: "60-100 words";
      purpose: "Introduction to table content and significance";
    };
    beforeImages: {
      rule: "1 paragraph before complex images or infographics";
      minimumWords: "40-80 words";
      purpose: "Context for visual content";
    };
  };

  // REVISED REALISTIC VOLUME CALCULATION
  revisedVolumeTargets: {
    H1Section: "200-300 words";
    H2ContextualContent: "400-600 words (4 × 100-150)"; // NEW
    H2MainContent: "1600 words (4 × 400)";
    H3ContextualContent: "640-960 words (8 × 80-120)"; // NEW
    H3MainContent: "1600 words (8 × 200)";
    H4Content: "1600 words (16 × 100)";
    structuralElementsIntros: "200-400 words"; // NEW
    totalEstimate: "6240-6860 words"; // UPDATED
    readingTime: "16-19 minutes"; // UPDATED
  };
}

/**
 * =============================================================================
 * SECTION 3: MARKDOWN FORMATTING RULES
 * Typography Components Only – react-markdown/MDX Standard
 * =============================================================================
 *
 * CRITICAL RULE: Markdown formatting is ONLY allowed within Typography components,
 * rendered using react-markdown (or @mdx-js/react for MDX), with remark-gfm and
 * rehype-raw if needed. All other component types (Simple, Custom, Standard sections)
 * must receive plain text only—NO markdown, NO HTML, and NO inline styles.
 *
 * Style (colors, font size, emphasis, etc.) must be applied EXCLUSIVELY through
 * CSS classes on the Typography components—not via content, HTML tags, or inline props.
 *
 * Implementation instructions:
 * - Typography sections (e.g. TypographyH1, TypographyH2, TypographyP, TypographyBlockquote, TypographyTable, etc.)
 *   must receive the content as a markdown string—not as React elements, HTML, or styled text.
 * - Allowed formatting in Typography content:
 *     - Markdown bold (**text**)
 *     - Markdown italics (_text_)
 *     - Blockquotes (> block)
 *     - Lists
 *     - Code spans and blocks
 *     - Tables (pipe syntax, GFM, etc.)
 *     - No raw HTML or inline styles allowed in content
 * - Render Typography content using react-markdown with remark-gfm (and rehype-raw ONLY for very limited, trusted HTML if absolutely needed).
 * - Any design (color, font size, weight, etc.) must be applied through the Typography component's CSS classes.
 * - All non-Typography (Simple, Custom, Standard) sections must receive only plain strings—NO markdown, NO HTML, no formatting.
 *
 * EXAMPLES (ALLOWED):
 * // In Typography section:
 *   "children": "# Ferries in **Tenerife**: The Complete 2025 Guide"
 *   "children": "| Operator | Routes | Features |\n|---|---|---|\n| Olsen | ... | ... |"
 *
 * // In Simple or Custom sections:
 *   "bodyContent": { "type": "SimpleSectionFullScreenSizeImage", "props": { "alt": "Ferry in Tenerife 2025" } }
 *
 * EXAMPLES (PROHIBITED):
 * - "children": "<span style=\"color:blue\">Tenerife</span>"
 * - "children": "<b>Tenerife</b>"
 * - "children": "**Tenerife**", if not passed to a component that parses markdown (must not be treated as React child)
 * - "children": "<b style='font-size:48px'>Tenerife</b>"
 *
 * =============================================================================
 */

/**
 * =============================================================================
 * SECTION 4: SEO CONTENT OPTIMIZATION
 * Keyword Strategy and Internal Linking
 * =============================================================================
 */

interface SEOOptimization {
  keywordStrategy: {
    primaryKeywords: "1-2 main terms";
    secondaryKeywords: "5-8 supporting terms";
    lsiKeywords: "10-15 semantic variations";
    keywordDensity: "1-2% of total content";
    contextualKeywordPlacement: "Natural integration in contextual paragraphs";
  };

  internalLinking: {
    minimumPerH2: 2;
    relatedArticles: "Links to related blog posts";
    crossReferences: "Between different sections";
    contextualLinking: "Links naturally integrated in contextual paragraphs";
  };

  readabilityFactors: {
    paragraphLength: "3-5 sentences maximum";
    sentenceComplexity: "Mix of simple and complex structures";
    transitionWords: "Use between paragraphs for flow";
    contextualTransitions: "Smooth flow from contextual to detailed content";
    targetReadingTime: "16-19 minutes"; // UPDATED
  };
}



`;

    // Create personalization section
    const personalizationConfig = `
/**
 * =============================================================================
 * SECTION 5: CONTENT PERSONALIZATION SETTINGS
 * Style and Format Customization for Content Generation
 * =============================================================================
 */

interface ContentPersonalization {
  writingStyle: {
    type: "${selectedStyle?.value}";
    label: "${selectedStyle?.label}";
    description: "${selectedStyle?.description}";
    instructions: "Apply ${selectedStyle?.label.toLowerCase()} writing style throughout the content. ${
      selectedStyle?.description
    }";
  };
  contentFormat: {
    type: "${selectedFormat?.value}";
    label: "${selectedFormat?.label}";
    description: "${selectedFormat?.description}";
    instructions: "Structure content using ${selectedFormat?.label.toLowerCase()} format. ${
      selectedFormat?.description
    }";
  };
}

/**
 * PERSONALIZATION REQUIREMENTS:
 * - Writing Style: Use ${selectedStyle?.label.toLowerCase()} approach - ${
   selectedStyle?.description
 }
 * - Content Format: Structure as ${selectedFormat?.label.toLowerCase()} - ${
   selectedFormat?.description
 }
 * - Maintain consistency in tone and style throughout all generated content
 * - Adapt language complexity and terminology to match the selected format
 * - Ensure the writing style complements the content format choice
 */

`;

    // Add custom requirements section if provided
    const customRequirementsSection = customRequirements.trim()
      ? `
/**
 * =============================================================================
 * SECTION 6: CUSTOM REQUIREMENTS & SPECIFICATIONS
 * Additional User-Defined Requirements for Content Generation
 * =============================================================================
 */

CUSTOM REQUIREMENTS FROM USER:
${customRequirements.trim()}

IMPLEMENTATION INSTRUCTIONS:
- Incorporate all custom requirements into the generated content
- Ensure custom requirements align with the selected writing style and format
- Prioritize custom requirements while maintaining overall content quality
- If custom requirements conflict with other settings, prioritize custom requirements
- Adapt the content structure to accommodate specific user needs

`
      : "";

    // Create page-specific configuration section
    const pageSpecificConfig = `
/**
 * =============================================================================
 * SECTION 7: PAGE-SPECIFIC CONFIGURATION
 * Unique Data for Current Page Generation
 * =============================================================================
 */

interface PageSpecificDataInfo {
  title: "${pageTitle}";
  description: "${pageDescription}";
  slug: "${slug}";
  href: "${page.href || `/${slug}`}";
  images: ${JSON.stringify(pageImages, null, 2)};
  keywords: ${JSON.stringify(pageKeywords, null, 2)};
  isPublished: ${page.isPublished};
  pageType: "${page.type}";
  category: "${pageData.category.title}";
}

/**
 * =============================================================================
 * SECTION 8: GENERATION INSTRUCTIONS
 * =============================================================================
 */

TASK: Use the system definition, personalization settings, custom requirements, 
page data, and configuration system instructions below to generate a page 
according to the technical requirements and return a JSON data file.

SPECIFIC REQUIREMENTS FOR THIS PAGE:
1. Generate content for page titled: "${pageTitle}"
2. Focus on the description: "${pageDescription}"
3. Target keywords: ${
      pageKeywords.length > 0
        ? pageKeywords.join(", ")
        : "Generate appropriate keywords"
    }
4. Apply writing style: ${selectedStyle?.label} (${selectedStyle?.description})
5. Use content format: ${selectedFormat?.label} (${selectedFormat?.description})
6. Include relevant images from provided list or suggest placeholder images
7. Ensure content matches the page type: "${page.type}"
8. Generate appropriate metadata for SEO optimization
9. Target audience: American market, US English
${
  customRequirements.trim()
    ? `10. Custom Requirements: ${customRequirements.trim()}`
    : ""
}

CONTENT CREATION GUIDELINES:
- Writing Style: ${selectedStyle?.description}
- Content Format: ${selectedFormat?.description}
- Tone: Professional yet engaging for American audience
- Language: US English with American terminology and cultural references
- SEO Focus: Optimize for US search engines and user behavior
${
  customRequirements.trim()
    ? `- Custom Specifications: Follow all user-defined requirements listed above`
    : ""
}

/**
 * =============================================================================
 * SECTION 9: TYPESCRIPT SCHEMA COMPLIANCE
 * pageConfig and Dependent Types (UNCHANGED)
 * =============================================================================
 */

// CRITICAL: These types must remain unchanged as they form working project schema


interface SimpleSectionFullScreenSizeImageProps
  extends Omit<ImageProps, "src" | "width" | "height" | "alt"> {
  src: string;
  alt?: string; 
  width?: number;
  height?: number;
  hasBackdrop?: boolean;
  hasBorder?: boolean;
  hasRounded?: boolean;
  borderRadius?: string;
  aspectRatio?: "video" | "square" | "auto" | number | string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  className?: string;
  style?: React.CSSProperties;
}

export type SimpleSectionTypes = {
  SimpleSectionFullScreenSizeImage: SimpleSectionFullScreenSizeImageProps;
};

export type SimpleSectionTypeName = keyof SimpleSectionTypes;

export type TypographySectionTypes = {
  TypographyH1: React.HTMLAttributes<HTMLHeadingElement>;
  TypographyH2: React.HTMLAttributes<HTMLHeadingElement>;
  TypographyH3: React.HTMLAttributes<HTMLHeadingElement>;
  TypographyH4: React.HTMLAttributes<HTMLHeadingElement>;
  TypographyP: React.HTMLAttributes<HTMLParagraphElement>;
  TypographyBlockquote: React.HTMLAttributes<HTMLElement>;
  TypographyTable: { data: React.ReactNode[][] };
  TypographyList: { items: React.ReactNode[] };
  TypographyOrderedList: { items: React.ReactNode[] };
  TypographyLead: React.HTMLAttributes<HTMLParagraphElement>;
  TypographyLarge: React.HTMLAttributes<HTMLDivElement>;
  TypographySmall: React.HTMLAttributes<HTMLElement>;
  TypographyMuted: React.HTMLAttributes<HTMLParagraphElement>;
};

export type TypographySectionTypeName = keyof TypographySectionTypes;

export interface SimpleSection {
  id: string;
  order?: string;
  bodyContent: {
    sectionType: "Simple";
    type: SimpleSectionTypeName;
    props: SimpleSectionTypes[SimpleSectionTypeName];
  };
}

export interface TypographySection {
  id: string;
  order?: string;
  linkConfiguration?: LinkConfiguration;
  bodyContent: {
    sectionType: "Typography";
    type: TypographySectionTypeName;
    props: TypographySectionTypes[TypographySectionTypeName];
  };
}

export interface StepSection {
  id: string;
  order?: string;
  linkConfiguration?: LinkConfiguration;
  bodyContent: (
    | {
        sectionType: "Simple Steps";
        type: SimpleSectionTypeName;
        props: SimpleSectionTypes[SimpleSectionTypeName];
      }
    | {
        sectionType: "Typography Steps";
        type: TypographySectionTypeName;
        props: TypographySectionTypes[TypographySectionTypeName];
      }
  )[];
}

export type ExtendedSection =
  | SimpleSection
  | StepSection
  | TypographySection;


export interface PageSections {
  sections: ExtendedSection[];
}

/**
 * =============================================================================
 *  SECTION 10:MOST IMPORTANT-MANDATORY OUTPUT FORMAT
 * =============================================================================
 */

// CRITICAL REQUIREMENT: Response MUST be valid JSON in the following format:
{
  "sections": ExtendedSection[],
}

`;

    // Combine all configurations with the new system definition first
    return (
      systemDefinitionSection +
      personalizationConfig +
      customRequirementsSection +
      pageSpecificConfig
    );
  }, [pageData, slug, writingStyle, contentFormat, customRequirements]);

  useEffect(() => {
    setSystemInstruction(generateSystemInstruction);
  }, [generateSystemInstruction]);

  // Handle copy to clipboard functionality
  const handleCopyInstruction = async () => {
    try {
      await navigator.clipboard.writeText(systemInstruction);
      setIsCopied(true);
      toast.success("System instruction copied to clipboard!");

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
          Loading prompt data...
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
      {/* Personalization Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="size-5 text-primary" />
            <CardTitle className="text-lg">Content Personalization</CardTitle>
            <Badge variant="secondary">US Market</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Customize the writing style and content format for AI-generated
            content targeting the American audience.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Writing Style Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
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
                      <div className="flex flex-col">
                        <span className="font-medium">{style.label}</span>
                        <span className="text-xs text-muted-foreground">
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
                <FileText className="h-4 w-4 text-primary" />
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
                      <div className="flex flex-col">
                        <span className="font-medium">{format.label}</span>
                        <span className="text-xs text-muted-foreground">
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
              <Edit3 className="h-4 w-4 text-primary" />
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
              placeholder="Add specific requirements, features, or preferences for the generated content..."
              value={customRequirements}
              onChange={(e) => setCustomRequirements(e.target.value)}
              className="min-h-[100px] resize-y"
            />

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
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

          {/* Current Selection Summary */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Selected Personalization:
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

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">
                AI Content Generation Prompt
              </CardTitle>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              System Instructions
            </Badge>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="leading-relaxed">
              Copy this system instruction and set it in your AI model (e.g.,
              ChatGPT). Wait for the JSON file generation to complete, copy it,
              and then install it on the &quot;Data&quot; tab.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-950 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Usage Instructions:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200 text-xs">
                <li>
                  Configure personalization settings above (writing style,
                  content format, and custom requirements)
                </li>
                <li>Copy the system instruction using the button below</li>
                <li>Open ChatGPT or another AI model</li>
                <li>Paste the instruction into the system prompt</li>
                <li>Wait for the JSON file generation for the page</li>
                <li>Copy the generated JSON</li>
                <li>
                  Go to the &quot;Data&quot; tab and install the JSON file
                </li>
              </ol>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Page Info Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-3 text-foreground">
              Page Configuration Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Title:</span>
                <span className="ml-2 font-medium">
                  {page.title || page.linkName}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Slug:</span>
                <span className="ml-2 font-mono bg-background px-2 py-1 rounded">
                  {slug}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2">{page.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Keywords:</span>
                <span className="ml-2">
                  {page.keyWords?.length || 0} defined
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Writing Style:</span>
                <span className="ml-2">
                  {WRITING_STYLES.find((s) => s.value === writingStyle)?.label}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Content Format:</span>
                <span className="ml-2">
                  {
                    CONTENT_FORMATS.find((f) => f.value === contentFormat)
                      ?.label
                  }
                </span>
              </div>
              {customRequirements.trim() && (
                <>
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground">
                      Custom Requirements:
                    </span>
                    <span className="ml-2">
                      Added ({customRequirements.trim().length} characters)
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* System Instruction Textarea */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                System Instruction for AI Model
              </label>
              <Button
                onClick={handleCopyInstruction}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={!systemInstruction}
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Instruction
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
              placeholder="Generating personalized system instruction..."
            />
          </div>

          {/* Additional Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 dark:bg-amber-950 dark:border-amber-800">
            <h5 className="font-medium text-amber-900 dark:text-amber-100 mb-2 text-sm">
              Important Notes:
            </h5>
            <ul className="space-y-1 text-amber-800 dark:text-amber-200 text-xs">
              <li>
                • The instruction includes page-specific data, personalization
                settings, and custom requirements
              </li>
              <li>
                • Content will be optimized for American audience with US
                English
              </li>
              <li>
                • Make sure to use a capable AI model (GPT-4 or similar) for
                best results
              </li>
              <li>
                • The generated JSON should match the TypeScript PageData schema
              </li>
              <li>
                • Review the generated content before applying it to the live
                page
              </li>
              <li>
                • Custom requirements will be prioritized during content
                generation
              </li>
              <li>
                • Personalization settings affect tone, style, and content
                structure
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
