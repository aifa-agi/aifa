// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/competitor-research/(_service)/(_components)/competitor-research.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Search,
  Save,
  AlertCircle,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  Clock,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useCompetitorResearch } from "../(_hooks)/use-competitor-research";
import { CompetitorUrlInput } from "./competitor-url-input";
import { CompetitorItem } from "./competitor-item";
import { CompetitorResearchProps } from "../(_types)/competitor-research-types";
import {
  COMPETITOR_UI_CONFIG,
  COMPETITOR_STATES_CLASSES,
  getWorkflowStateConfig,
} from "../(_constants)/competitor-research-config";
import { PageNotFound } from "../../../../../page-not-found";
import { useAdminPageData } from "../../../../../../(_hooks)/use-admin-page-data";

/**
 * Main Competitor Research component that orchestrates the entire workflow
 * Provides complete competitor analysis functionality with step-by-step guidance
 *
 * Key features:
 * - Complete workflow management from URL input to analysis completion
 * - Integration with existing admin page data management
 * - Real-time progress tracking and state visualization
 * - Bulk operations and result saving
 * - Responsive design with proper error handling
 * - Accessibility support and keyboard navigation
 */
export function CompetitorResearch({ slug }: CompetitorResearchProps) {
  // Get page data using centralized hook (same as admin-page-info)
  const { page, category, loading, initialized, error, userRole } =
    useAdminPageData(slug);

  // Initialize competitor research hook
  const competitorHook = useCompetitorResearch({
    page: page || null,
    categoryTitle: category?.title || "",
    slug,
  });

  const {
    competitors,
    isUpdating,
    canEdit,
    addCompetitor,
    updateCompetitor,
    removeCompetitor,
    saveCompetitors,
    generateInstruction,
    markInstructionCopied,
    updateAiResponse,
    canSaveResults,
  } = competitorHook;

  // Show loading state
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">
          Loading competitor research...
        </span>
      </div>
    );
  }

  // Show error state if page not found
  if (error || !page || !category) {
    console.error("CompetitorResearch error:", {
      error,
      hasPage: !!page,
      hasCategory: !!category,
    });
    return <PageNotFound slug={slug} />;
  }

  /**
   * Handle save all results
   */
  const handleSaveResults = async () => {
    const success = await saveCompetitors();
    console.log(
      "Save all competitors operation:",
      success ? "SUCCESS" : "FAILED"
    );
  };

  /**
   * Get research progress statistics
   */
  const getProgressStats = () => {
    const total = competitors.length;
    const completed = competitors.filter((c) => c.isCompleted).length;
    const inProgress = competitors.filter(
      (c) => c.aiResponseRaw && !c.isCompleted
    ).length;
    const pending = total - completed - inProgress;

    return { total, completed, inProgress, pending };
  };

  const progressStats = getProgressStats();
  const existingUrls = competitors.map((c) => c.url);

  console.log("CompetitorResearch rendering:", {
    pageId: page.id,
    categoryTitle: category.title,
    userRole,
    competitorsCount: competitors.length,
    canEdit,
    canSaveResults,
  });

  return (
    <div className="space-y-6">
      {/* Header with progress overview */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="size-6 text-primary shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Competitor Research
                </h3>
                <p className="text-sm text-muted-foreground">
                  Analyze competitor websites to improve your content strategy
                </p>
              </div>
            </div>

            {/* Progress indicators */}
            {competitors.length > 0 && (
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-50 text-green-700"
                  >
                    <CheckCircle2 className="size-3 mr-1" />
                    {progressStats.completed} Completed
                  </Badge>
                  {progressStats.inProgress > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700"
                    >
                      <Clock className="size-3 mr-1" />
                      {progressStats.inProgress} In Progress
                    </Badge>
                  )}
                  {progressStats.pending > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {progressStats.pending} Pending
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total: {progressStats.total} competitor
                  {progressStats.total !== 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>

          {/* Save results button */}
          {canSaveResults && (
            <Button
              onClick={handleSaveResults}
              disabled={!canEdit || isUpdating}
              className={cn(
                "shrink-0",
                COMPETITOR_STATES_CLASSES.button_success
              )}
            >
              {isUpdating ? (
                <>
                  <LoadingSpinner className="size-4 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Save All Results
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* URL Input section */}
      {competitors.length < COMPETITOR_UI_CONFIG.MAX_COMPETITORS && (
        <CompetitorUrlInput
          onAddCompetitor={addCompetitor}
          canEdit={canEdit}
          isUpdating={isUpdating}
          existingUrls={existingUrls}
        />
      )}

      {/* Competitors list */}
      {competitors.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Search className="size-5" />
              Research in Progress
              <Badge variant="secondary" className="text-xs">
                {competitors.length}
              </Badge>
            </h4>

            {!canEdit && (
              <Badge variant="outline" className="text-xs">
                <AlertCircle className="size-3 mr-1" />
                Read Only
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {competitors.map((competitor) => (
              <CompetitorItem
                key={competitor.id}
                item={competitor}
                onUpdate={updateCompetitor}
                onRemove={removeCompetitor}
                onGenerateInstruction={generateInstruction}
                onMarkInstructionCopied={markInstructionCopied}
                onUpdateAiResponse={updateAiResponse}
                canEdit={canEdit}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty state */
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Start Competitor Research
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              Add competitor website URLs to analyze their content strategy,
              user experience, and competitive advantages.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="size-3" />
                <span>Add URLs</span>
              </div>
              <div className="flex items-center gap-1">
                <Search className="size-3" />
                <span>Generate Instructions</span>
              </div>
              <div className="flex items-center gap-1">
                <ExternalLink className="size-3" />
                <span>Analyze with AI</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                <span>Save Results</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help section */}
      <Card className="bg-blue-50/50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-blue-800">
            <AlertCircle className="size-4" />
            How Competitor Research Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>1. Add URLs:</strong> Enter competitor website URLs to start
            analysis
          </p>
          <p>
            <strong>2. Generate Instructions:</strong> Get tailored AI prompts
            for each competitor
          </p>
          <p>
            <strong>3. Copy & Analyze:</strong> Use instructions with your
            preferred AI model
          </p>
          <p>
            <strong>4. Save Results:</strong> Paste AI responses and save your
            research
          </p>
          <div className="mt-4 p-3 bg-blue-100 rounded-md">
            <p className="text-xs">
              💡 <strong>Tip:</strong> For best results, use GPT-4, Claude, or
              similar advanced models for comprehensive competitive analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
