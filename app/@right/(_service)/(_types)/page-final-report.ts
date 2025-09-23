import { FinalContentResult, SemanticBlockType } from "./page-types";

export interface FinalReport {
  reportId: string;
  version: number;
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