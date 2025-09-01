// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/competitor-research/(_service)/(_libs)/competitor-analysis-schema.ts

import { z } from "zod";

const ContentElementAnalysisSchema = z
  .object({
    qualityScore: z.number().min(0).max(100).optional(),
    effectivenessRating: z
      .enum(["poor", "average", "good", "excellent"])
      .optional(),
    intentAlignment: z.number().min(0).max(100).optional(),
  })
  .optional();

const SemanticMetadataSchema = z
  .object({
    purpose: z.string().optional(),
    userIntent: z
      .enum(["informational", "navigational", "transactional", "commercial"])
      .optional(),
    interactionType: z
      .enum(["passive", "interactive", "form", "media"])
      .optional(),
    visualPriority: z.enum(["primary", "secondary", "tertiary"]).optional(),
  })
  .optional();

const ContentStructureSchema = z.object({
  classification: z.enum(["semantic", "technical", "hybrid"]),
  tag: z.string().optional(),
  semanticMetadata: SemanticMetadataSchema,
  keywords: z.array(z.string()).optional(),
  intent: z.string().optional(),
  taxonomy: z.string().optional(),
  attention: z.string().optional(),
  audiences: z.string().optional(),
  additionalData: z
    .object({
      actualContent: z.string().optional(),
      position: z
        .object({
          order: z.number().optional(),
          depth: z.number().optional(),
        })
        .optional(),
      styling: z
        .object({
          hasSpecialFormatting: z.boolean().optional(),
          visualWeight: z.enum(["light", "medium", "bold"]).optional(),
        })
        .optional(),
    })
    .optional(),
});

const CompetitorContentResultSchema = z.object({
  id: z.string(),
  contentStructure: ContentStructureSchema,
  researchResult: z.object({
    analysisText: z.string(),
    elementAnalysis: ContentElementAnalysisSchema,
    recommendations: z.array(z.string()).optional(),
    strengths: z.array(z.string()).optional(),
    weaknesses: z.array(z.string()).optional(),
    opportunities: z.array(z.string()).optional(),
  }),
});

export const CompetitorAnalysisSchema = z.object({
  href: z.string().url(),
  competitorName: z.string().min(1),
  isSuitable: z.boolean(),
  isAnalyzed: z.boolean(),
  recommendationReason: z.string().min(10),
  competitorStructure: z.array(CompetitorContentResultSchema).min(1).max(10),
  overallAnalysis: z
    .object({
      overallScore: z.number().min(0).max(100).optional(),
      summary: z.string().optional(),
      keyFindings: z.array(z.string()).optional(),
      actionableInsights: z.array(z.string()).optional(),
      ourAdvantages: z.array(z.string()).optional(),
      semanticPatterns: z
        .object({
          commonBlocks: z.array(z.string()).optional(),
          unusualImplementations: z.array(z.string()).optional(),
          missingOpportunities: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
});

export type CompetitorAnalysisType = z.infer<typeof CompetitorAnalysisSchema>;
