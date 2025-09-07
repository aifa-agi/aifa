// @/app/app/(_service)/types/page-types.ts

import { Metadata } from "next";
import { UserType } from "@prisma/client";
import { BadgeName } from "../(_config)/badge-config";

export type PageType =
  | "homePage"
  | "basePage"
  | "footerPage"
  | "blog"
  | "document"
  | "guide"
  | "shopItem";

export interface LinksData {
  linkBuilderType: "outgoing" | "incoming" | "external";
  path: string[];
}

export interface SectionInfo {
  id: string;
  summary?: SummaryData;
  linksData?: LinksData[];
}

export interface SummaryData {
  id: string;
  path: string;
  tags?: string[];
  childSummary: string;
  parentSummary: string;
  selfSummary: string;
}

export type LinkItemState = "pending" | "active";

export interface LinkConfiguration {
  outgoing: LinkItemState;
  incoming: LinkItemState;
  external: LinkItemState;
}

export interface Activities {
  likesCount: number;
  bookmarksCount: number;
}

export interface PageImages {
  id: string;
  alt?: string;
  href?: string;
}

export type ContentClassification = "semantic" | "technical" | "hybrid";

export type TechnicalTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "ul"
  | "ol"
  | "li"
  | "blockquote"
  | "pre"
  | "code"
  | "table"
  | "thead"
  | "tbody"
  | "tr"
  | "td"
  | "th"
  | "img"
  | "a"
  | "div"
  | "section"
  | "article"
  | "strong"
  | "em"
  | "hr"
  | "button"
  | "input"
  | "form"
  | "nav"
  | "header"
  | "footer"
  | "aside"
  | "main";

export type SemanticBlockType =
  | "hero"
  | "hero.cta"
  | "hero.banner"
  | "features"
  | "features.grid"
  | "features.list"
  | "features.comparison"
  | "pricing"
  | "pricing.table"
  | "pricing.cards"
  | "pricing.tiers"
  | "faq"
  | "faq.accordion"
  | "faq.list"
  | "testimonials"
  | "testimonials.carousel"
  | "testimonials.grid"
  | "testimonials.single"
  | "about"
  | "about.team"
  | "about.story"
  | "about.mission"
  | "contact"
  | "contact.form"
  | "contact.info"
  | "portfolio"
  | "portfolio.gallery"
  | "portfolio.showcase"
  | "blog.preview"
  | "blog.featured"
  | "blog.list"
  | "newsletter"
  | "newsletter.signup"
  | "social.proof"
  | "social.media"
  | "process"
  | "process.steps"
  | "process.timeline"
  | "stats"
  | "stats.counter"
  | "stats.metrics"
  | "cta"
  | "cta.banner"
  | "cta.modal"
  | "breadcrumbs"
  | "navigation"
  | "navigation.menu"
  | "navigation.sidebar"
  | "search"
  | "search.filters"
  | "footer.links"
  | "footer.legal"
  | "custom";

export type AIGeneratedBlockType = `ai.${string}`;

export type ContentTag =
  | TechnicalTag
  | SemanticBlockType
  | AIGeneratedBlockType;

export interface ContentElementAnalysis {
  qualityScore?: number;
  effectivenessRating?: "poor" | "average" | "good" | "excellent";
  intentAlignment?: number;
  keywordAnalysis?: {
    density?: number;
    relevance?: number;
    competition?: "low" | "medium" | "high";
  };
  seoMetrics?: {
    headingStructure?: "poor" | "good" | "excellent";
    readability?: number;
    wordCount?: number;
  };
  uxAnalysis?: {
    visualHierarchy?: "poor" | "good" | "excellent";
    scanability?: number;
    engagement?: "low" | "medium" | "high";
  };
  semanticAnalysis?: {
    blockPurposeClarity?: number;
    userValueProposition?: number;
    conversionOptimization?: number;
  };
}

export interface ContentStructure {
  classification: ContentClassification;
  tag?: ContentTag;
  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  attention?: string;
  audiences?: string;
  selfPrompt?: string;
  designDescription?: string;
  connectedDesignSectionId?: string;
  additionalData?: {
    actualContent?: string;
    position?: {
      order?: number;
      depth?: number;
      parentTag?: ContentTag;
    };
    styling?: {
      hasSpecialFormatting?: boolean;
      visualWeight?: "light" | "medium" | "bold";
      colorScheme?: string;
    };
    behaviorMetrics?: {
      timeOnElement?: number;
      clickThroughRate?: number;
      scrollDepth?: number;
      conversionRate?: number;
    };
    technicalImplementation?: {
      requiredComponents?: string[];
      dependencies?: string[];
      complexity?: "simple" | "moderate" | "complex";
    };
  };
  realContentStructure?: ContentStructure[];
}

export interface CompetitorContentResult {
  id: string;
  contentStructure: ContentStructure;
  researchResult: {
    analysisText: string;
    elementAnalysis?: ContentElementAnalysis;
    recommendations?: string[];
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    competitiveAdvantage?: string;
    semanticInsights?: {
      blockTypeEffectiveness?: string;
      industryStandardCompliance?: number;
      innovativeApproach?: string[];
    };
  };
  analysisMetadata?: {
    analyzedAt?: string;
    analysisDepth?: "surface" | "detailed" | "comprehensive";
    status?: "pending" | "analyzing" | "completed" | "error";
    confidence?: number;
    dataSource?: "manual" | "automated" | "hybrid";
  };
  children?: CompetitorContentResult[];
}

export interface CompetitorAnalysis {
  href: string;
  competitorName: string;
  isSuitable: boolean;
  isAnalyzed: boolean;
  recommendationReason: string;
  competitorStructure: CompetitorContentResult[];
  overallAnalysis?: {
    overallScore?: number;
    summary?: string;
    keyFindings?: string[];
    actionableInsights?: string[];
    ourAdvantages?: string[];
    semanticPatterns?: {
      commonBlocks?: SemanticBlockType[];
      unusualImplementations?: string[];
      missingOpportunities?: string[];
    };
  };
}

export interface KnowledgeSettings {
  knowledgeBase: string;
  mixingRatio: number;
}

export interface DraftContentResult {
  id: string;
  contentStructure: ContentStructure;
  analysisResult: {
    analysisText: string;
    elementAnalysis?: ContentElementAnalysis;
    aiRecommendations: string[];
    acceptRecommendation: boolean;
    strengths?: string[];
    weaknesses?: string[];
    improvementAreas?: string[];
    semanticOptimization?: {
      suggestedBlockType?: SemanticBlockType;
      purposeClarity?: string;
      conversionTips?: string[];
    };
  };
  analysisMetadata?: {
    analyzedAt?: string;
    analysisDepth?: "surface" | "detailed" | "comprehensive";
    status?: "pending" | "analyzing" | "completed" | "error";
    confidence?: number;
    dataSource?: "manual" | "automated" | "hybrid";
  };
  children?: DraftContentResult[];
}

export interface FinalContentResult {
  id: string;
  contentStructure: ContentStructure;
  finalAnalysis: {
    analysisText: string;
    elementAnalysis?: ContentElementAnalysis;
    achievements?: string[];
    finalScore?: number;
    contentQuality?: "poor" | "average" | "good" | "excellent";
    semanticSuccess?: {
      blockTypeAppropriate?: boolean;
      userGoalAlignment?: number;
      industryBestPractices?: boolean;
    };
  };
  analysisMetadata?: {
    analyzedAt?: string;
    analysisDepth?: "surface" | "detailed" | "comprehensive";
    status?: "pending" | "analyzing" | "completed" | "error";
    confidence?: number;
    dataSource?: "manual" | "automated" | "hybrid";
  };
  children?: FinalContentResult[];
}

export interface DraftReport {
  reportId: string;
  pageId: string;
  draftStructure: DraftContentResult[];
  overallDraftAnalysis?: {
    overallScore?: number;
    summary?: string;
    keyIssues?: string[];
    priorityRecommendations?: string[];
    readyForRegeneration?: boolean;
    semanticOverview?: {
      detectedBlocks?: SemanticBlockType[];
      missingCriticalBlocks?: SemanticBlockType[];
      blockHierarchyHealth?: number;
    };
  };
  generatedAt: string;
}

export interface FinalReport {
  reportId: string;
  pageId: string;
  finalStructure: FinalContentResult[];
  overallFinalAnalysis?: {
    overallScore?: number;
    summary?: string;
    achievements?: string[];
    finalMetrics?: {
      wordCount?: number;
      readabilityScore?: number;
      seoScore?: number;
      engagementPotential?: number;
      semanticComplexity?: number;
    };
    semanticAccomplishments?: {
      effectiveBlockTypes?: SemanticBlockType[];
      userJourneyOptimization?: number;
      conversionPathClarity?: number;
    };
  };
  completedAt: string;
}

export interface AISemanticCapabilities {
  canGenerateCustomBlocks: boolean;
  supportedSemanticTypes: SemanticBlockType[];
  aiGeneratedTypes: AIGeneratedBlockType[];
  classificationAccuracy: number;
  lastModelUpdate: string;
}

export interface SemanticContentLibrary {
  blockTemplates: {
    [key in SemanticBlockType]?: {
      description: string;
      commonPatterns: string[];
      bestPractices: string[];
      conversionOptimization: string[];
    };
  };
  industrySpecificBlocks: {
    industry: string;
    customBlocks: SemanticBlockType[];
  }[];
}

export interface PageData {
  metadata?: Metadata;
  id: string;
  linkName: string;
  title?: string;
  description?: string;
  images?: PageImages[];
  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  attention?: string;
  audiences?: string;
  href?: string;
  roles: UserType[];
  competitorAnalysis?: CompetitorAnalysis[];
  aiRecommendContentStructure?: ContentStructure[];
  knowledgeSettings?: KnowledgeSettings;
  isReadyPromptForPerplexity?: boolean;
  userChooseContentStructure?: ContentStructure[];
  draftReport?: DraftReport;
  finalReport?: FinalReport;
  semanticCapabilities?: AISemanticCapabilities;
  semanticLibrary?: SemanticContentLibrary;
  hasBadge?: boolean;
  badgeName?: BadgeName;
  badgeLink?: string;
  order?: number;
  isPublished: boolean;
  isVectorConnected: boolean;
  isAddedToPrompt: boolean;
  isChatSynchronized: boolean;
  type: PageType;
  design?: string;
  linkConfiguration?: LinkConfiguration;
  createdAt?: string;
  updatedAt?: string;
  sections?: SectionInfo[];
}

export interface ContentTagUtils {
  isSemanticBlock: (tag: ContentTag) => boolean;
  isTechnicalTag: (tag: ContentTag) => boolean;
  isAIGenerated: (tag: ContentTag) => boolean;
  getBlockPurpose: (tag: SemanticBlockType) => string;
  suggestSemanticType: (
    content: string,
    context: string
  ) => SemanticBlockType[];
  validateBlockHierarchy: (structure: ContentStructure[]) => {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  };
}
