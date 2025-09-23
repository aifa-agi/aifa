// @/app/(_service)/types/page-types.ts

import { Metadata } from "next";
import { UserType } from "@prisma/client";
import { BadgeName } from "../../../../config/pages-config/badges/badge-config";

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
  tempMDXContent: string;
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
export interface PageAuthors {
  id: string;
  name: string;
  image?: PageImages[];
}

export type TechnicalTag =
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "ul"
  | "ol"
  | "li"
  | "blockquote"
  | "code"
  | "table"
  | "thead"
  | "tbody"
  | "tr"
  | "td"
  | "th"
  | "img";

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

export type ContentTag = TechnicalTag;

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

export type ContentClassification = "semantic" | "technical" | "hybrid";

// Валидационные утилиты для проверки структуры
export interface StructureValidationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  invalidElements?: {
    index: number;
    tag: string;
    expectedTag: string;
  }[];
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

export interface RootContentStructure extends Omit<ContentStructure, "tag"> {
  tag: "h2";
  writingStyle?: string;
  contentFormat?: string;
}
export interface ContentStructure {
  id?: string;
  order?: number;
  classification?: ContentClassification;
  tag: ContentTag;
  description?: string;
  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  attention?: string;
  audiences?: string;
  selfPrompt?: string;
  designDescription?: string;
  connectedDesignSectionId?: string;
  linksToSource?: string[];
  additionalData: {
    minWords: number;
    maxWords: number;
    actualContent: string;
  };
  status?: "draft" | "checked";
  realContentStructure?: ContentStructure[];
}

export interface DraftContentResult {
  id: string;
  contentStructure: RootContentStructure;
  analysisResult?: {
    analysisText?: string;
    elementAnalysis?: ContentElementAnalysis;
    aiRecommendations?: string[];
    acceptRecommendation?: boolean;
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
  contentStructure: RootContentStructure;
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
  tags?: string[];
  authors?: PageAuthors[];
  summary?: string;
  keywords?: string[];
  intent?: string;
  taxonomy?: string;
  attention?: string;
  audiences?: string;
  href?: string;
  roles: UserType[];

  semanticCapabilities?: AISemanticCapabilities;
  semanticLibrary?: SemanticContentLibrary;

  // step 1, 2
  competitorAnalysis?: CompetitorAnalysis[];

  // step 3 - ОБНОВЛЕНО: Использует RootContentStructure для жёсткого контроля H2
  /**
   * КРИТИЧЕСКОЕ ИЗМЕНЕНИЕ: aiRecommendContentStructure теперь использует
   * RootContentStructure[], который требует 'h2' тег для всех корневых элементов.
   * Это обеспечивает правильную семантическую иерархию:
   * PageData.title (H1) → aiRecommendContentStructure[].tag (H2) → realContentStructure (H3+)
   */
  aiRecommendContentStructure?: RootContentStructure[];

  // step 4
  knowledgeSettings?: KnowledgeSettings;

  //step 5
  isReadyPromptForPerplexity?: boolean;

  //step 6
  draftContentStructure?: RootContentStructure[];

  //step 7
  isReadyDraftForPerplexity?: boolean;

  //step 8 draftContentResult + steps + section info
  draftContentResult?: DraftContentResult[];

  //step 9
  draftReport?: DraftReport;

  // step 10
  finalContentStructure?: RootContentStructure[];

  // step 11
  finalContentResult?: FinalContentResult;

  // step 12
  isPreviewComplited?: boolean;

   // step 13
  finalReport?: string[];

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

// РАСШИРЕННЫЕ УТИЛИТЫ с валидацией H2
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

  // НОВЫЕ МЕТОДЫ для валидации корневой структуры
  /**
   * Валидирует, что все корневые элементы имеют тег 'h2'
   */
  validateRootStructure: (
    structure: ContentStructure[] | RootContentStructure[]
  ) => StructureValidationResult;

  /**
   * Принудительно преобразует ContentStructure[] в RootContentStructure[]
   * устанавливая тег 'h2' для всех корневых элементов
   */
  enforceH2Root: (structure: ContentStructure[]) => RootContentStructure[];

  /**
   * Проверяет, является ли элемент корневым H2
   */
  isValidRootElement: (
    element: ContentStructure
  ) => element is RootContentStructure;

  /**
   * Создает корневой элемент с валидным H2 тегом
   */
  createRootElement: (
    baseElement: Omit<ContentStructure, "tag">
  ) => RootContentStructure;
}

// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ для типизационной безопасности
export type ValidatedRootStructure = RootContentStructure[];
export type RootElementValidationError = {
  elementIndex: number;
  currentTag: string;
  expectedTag: "h2";
  message: string;
};

// КОНСТАНТЫ для валидации
export const ROOT_ELEMENT_TAG = "h2" as const;
export const VALIDATION_MESSAGES = {
  INVALID_ROOT_TAG:
    'Корневые элементы aiRecommendContentStructure должны иметь тег "h2"',
  MISSING_ROOT_TAG: "Отсутствует обязательный тег в корневом элементе",
  SEMANTIC_HIERARCHY_VIOLATION:
    "Нарушение семантической иерархии: PageData содержит H1, корневые элементы должны быть H2",
} as const;
