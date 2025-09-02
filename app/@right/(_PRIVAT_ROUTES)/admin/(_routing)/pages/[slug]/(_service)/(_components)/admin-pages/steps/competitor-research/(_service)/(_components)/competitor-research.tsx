// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/competitor-research/(_service)/(_components)/competitor-research.tsx

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Search,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  Clock,
  Globe,
  Target,
  AlertCircle,
  Database,
} from "lucide-react";

import { useCompetitorResearch } from "../(_hooks)/use-competitor-research";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { CompetitorUrlInput } from "./competitor-url-input";
import { CompetitorItem } from "./competitor-item";
import { SaveButtons } from "./save-buttons";
import { CompetitorResearchProps } from "../(_types)/competitor-research-types";
import { COMPETITOR_UI_CONFIG } from "../(_constants)/competitor-research-config";
import { PageNotFound } from "../../../../../page-not-found";
import { useAdminPageData } from "../../../../../../(_hooks)/use-admin-page-data";

export function CompetitorResearch({ slug }: CompetitorResearchProps) {
  const { page, category, loading, initialized, error } =
    useAdminPageData(slug);

  const { dirty } = useNavigationMenu();

  const {
    competitors,
    isUpdating,
    canEdit,
    addCompetitor,
    updateCompetitor,
    removeCompetitor,
    generateInstruction,
    markInstructionCopied,
    updateAiResponse,
    saveCompetitorsLocally,
    uploadToServer,
    canSaveResults,
    hasUnsavedChanges,
    hasLocalChanges,
    pendingServerUpload,
    isServerUploading,
  } = useCompetitorResearch({
    page: page || null,
    categoryTitle: category?.title || "",
    slug,
  });

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

  if (error || !page || !category) {
    return <PageNotFound slug={slug} />;
  }

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-5 text-blue-600" />
            Competitor Analysis
            <Badge variant="outline" className="ml-2">
              Step 1
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Add competitors for analysis and get structured data about their
            content and marketing approaches.
          </p>
        </CardHeader>

        {competitors.length > 0 && (
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {progressStats.total} competitor
                    {progressStats.total !== 1 ? "s" : ""} in research
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {progressStats.completed > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700"
                    >
                      <CheckCircle2 className="size-3 mr-1" />
                      {progressStats.completed} Completed
                    </Badge>
                  )}
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
              </div>

              <div className="flex items-center gap-2">
                {dirty && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-orange-50 text-orange-800"
                  >
                    <Clock className="size-3 mr-1" />
                    Unsaved Changes
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {competitors.length < COMPETITOR_UI_CONFIG.MAX_COMPETITORS && (
        <CompetitorUrlInput
          onAddCompetitor={addCompetitor}
          canEdit={canEdit}
          isUpdating={isUpdating || isServerUploading}
          existingUrls={existingUrls}
        />
      )}

      {competitors.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Search className="size-5" />
              Competitors in Research
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

          <div className="space-y-3">
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
                isUpdating={isUpdating || isServerUploading}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="size-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start Competitor Analysis
            </h3>
            <p className="text-sm text-gray-600 text-center max-w-md mb-6">
              Add competitor URLs to create structured analysis of their content
              approaches and identify improvement opportunities.
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
                <span>AI Analysis</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                <span>Save Results</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {competitors.length > 0 && (
        <SaveButtons
          onLocalSave={saveCompetitorsLocally}
          onServerUpload={uploadToServer}
          canSaveLocally={canSaveResults && canEdit}
          canUploadToServer={pendingServerUpload && canEdit}
          hasLocalChanges={hasLocalChanges}
          pendingServerUpload={pendingServerUpload}
          isUpdating={isUpdating}
          isServerUploading={isServerUploading}
          competitorsCount={competitors.length}
          dirty={dirty}
          instructionAdded={competitors.some(
            (c) => c.isCompleted && c.aiResponseRaw
          )}
          repairAvailable={competitors.some(
            (c) => c.aiResponseRaw && !c.isCompleted
          )}
        />
      )}

      <Card className="bg-blue-50/50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-blue-800">
            <AlertCircle className="size-4" />
            How Competitor Analysis Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>1. Add URLs:</strong> Enter competitor website addresses to
            start analysis
          </p>
          <p>
            <strong>2. Generate Instructions:</strong> Get specialized prompts
            for each competitor
          </p>
          <p>
            <strong>3. Copy and Analyze:</strong> Use instructions with your
            preferred AI model
          </p>
          <p>
            <strong>4. Save Results:</strong> Paste AI responses and save
            research locally
          </p>
          <p>
            <strong>5. Upload to Server:</strong> Send completed research to
            server
          </p>
          <div className="mt-4 p-3 bg-blue-100 rounded-md">
            <p className="text-xs">
              💡 <strong>Tip:</strong> For best results use Perplexity Pro +
              Claude 4 Sonnet Thinking or similar advanced models for
              comprehensive competitive analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
