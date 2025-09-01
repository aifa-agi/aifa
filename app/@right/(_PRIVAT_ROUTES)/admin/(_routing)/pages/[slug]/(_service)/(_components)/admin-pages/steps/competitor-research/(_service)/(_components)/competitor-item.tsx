// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/competitor-research/(_service)/(_components)/competitor-item.tsx

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  Search,
  MessageSquare,
  Clock,
  AlertCircle,
  FileJson,
  Eye,
  EyeOff,
  Wrench,
  Sparkles,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CompetitorItemProps,
  CompetitorWorkflowState,
} from "../(_types)/competitor-research-types";
import {
  COMPETITOR_UI_CONFIG,
  COMPETITOR_STATES_CLASSES,
  WORKFLOW_STATES_CONFIG,
  getWorkflowStateConfig,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  validateCompetitorAnalysisJson,
} from "../(_constants)/competitor-research-config";
import { JsonRepairTool } from "./json-repair-tool";
import { toast } from "sonner";

type TransformationState =
  | "idle"
  | "ready"
  | "transforming"
  | "validated"
  | "error";

const getCompetitorWorkflowState = (
  item: CompetitorItemProps["item"]
): CompetitorWorkflowState => {
  if (item.isCompleted && item.aiResponseRaw.trim()) {
    return "completed";
  }
  if (item.aiResponseRaw.trim() && !item.isCompleted) {
    return "analysis_provided";
  }
  if (item.instructionCopied) {
    return "instruction_copied";
  }
  if (item.instructionGenerated) {
    return "instruction_generated";
  }
  return "url_added";
};

export function CompetitorItem({
  item,
  onUpdate,
  onRemove,
  onGenerateInstruction,
  onMarkInstructionCopied,
  onUpdateAiResponse,
  canEdit,
  isUpdating,
}: CompetitorItemProps) {
  const [showInstruction, setShowInstruction] = useState(false);
  const [editingResponse, setEditingResponse] = useState(false);
  const [responseValue, setResponseValue] = useState(item.aiResponseRaw || "");
  const [isCopying, setIsCopying] = useState(false);
  const [isGeneratingInstruction, setIsGeneratingInstruction] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [showJsonRepairTool, setShowJsonRepairTool] = useState(false);
  const [transformationState, setTransformationState] =
    useState<TransformationState>("idle");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    error?: string;
    parsedData?: any;
    structuredData?: any;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const instructionRef = useRef<HTMLDivElement>(null);

  const currentState = getCompetitorWorkflowState(item);
  const stateConfig = getWorkflowStateConfig(currentState);

  useEffect(() => {
    if (responseValue.trim()) {
      const validation = validateCompetitorAnalysisJson(responseValue.trim());
      setValidationResult(validation);

      if (validation.isValid) {
        setTransformationState("validated");
      } else {
        setTransformationState("ready");
      }
    } else {
      setValidationResult(null);
      setTransformationState("idle");
    }
  }, [responseValue, item.id]);

  useEffect(() => {
    if (editingResponse && textareaRef.current) {
      textareaRef.current.focus();
      const length = responseValue.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [editingResponse, responseValue]);

  const handleGenerateInstruction = useCallback(() => {
    if (
      !canEdit ||
      isUpdating ||
      isGeneratingInstruction ||
      item.instructionGenerated ||
      currentState !== "url_added"
    ) {
      return;
    }

    setIsGeneratingInstruction(true);

    try {
      const instruction = onGenerateInstruction(item.id);
      if (instruction) {
        setShowInstruction(true);
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setTimeout(() => {
        setIsGeneratingInstruction(false);
      }, 1000);
    }
  }, [
    canEdit,
    isUpdating,
    isGeneratingInstruction,
    currentState,
    item.instructionGenerated,
    item.id,
    onGenerateInstruction,
  ]);

  const handleCopyInstruction = useCallback(async () => {
    if (!canEdit || isCopying) {
      return;
    }

    setIsCopying(true);

    try {
      const instruction = onGenerateInstruction(item.id);
      if (!instruction) {
        throw new Error("No instruction to copy");
      }

      await navigator.clipboard.writeText(instruction);
      onMarkInstructionCopied(item.id);

      setTimeout(() => {
        setIsCopying(false);
      }, COMPETITOR_UI_CONFIG.COPY_FEEDBACK_DURATION);
    } catch (error) {
      setIsCopying(false);
    }
  }, [
    canEdit,
    isCopying,
    item.id,
    onGenerateInstruction,
    onMarkInstructionCopied,
  ]);

  const handleStartEditingResponse = useCallback(() => {
    if (!canEdit || isUpdating) {
      return;
    }

    setEditingResponse(true);
    setResponseValue(item.aiResponseRaw || "");
  }, [canEdit, isUpdating, item.aiResponseRaw, item.id]);

  const handleStartTransformation = useCallback(async () => {
    if (transformationState !== "ready" || !responseValue.trim()) {
      return;
    }

    setTransformationState("transforming");
    setShowJsonRepairTool(true);

    try {
      toast.info("Starting object transformation through AI...", {
        duration: 3000,
      });
    } catch (error) {
      setTransformationState("error");
      toast.error("Error starting transformation");
    }
  }, [transformationState, responseValue, item.id]);

  const handleRepairSuccess = useCallback(
    (repairedJsonString: string) => {
      const validation = validateCompetitorAnalysisJson(repairedJsonString);

      if (validation.isValid && validation.parsedData) {
        const processedData = JSON.stringify(validation.parsedData, null, 2);
        setResponseValue(processedData);
        setShowJsonRepairTool(false);
        setTransformationState("validated");

        toast.success("Object successfully verified and transformed!", {
          duration: 4000,
        });
      } else {
        setTransformationState("error");
        toast.error("Transformed data is still incorrect");
      }
    },
    [item.id]
  );

  const handleRepairCancel = useCallback(() => {
    setShowJsonRepairTool(false);
    setTransformationState("ready");
  }, []);

  const handleSaveCompetitorResearch = useCallback(() => {
    if (transformationState === "validated" && validationResult?.parsedData) {
      onUpdateAiResponse(item.id, responseValue);
      setEditingResponse(false);

      toast.success("Competitor research saved!", {
        duration: 3000,
      });
    }
  }, [
    item.id,
    item.competitorName,
    responseValue,
    transformationState,
    validationResult,
    onUpdateAiResponse,
  ]);

  const handleCancelResponse = useCallback(() => {
    setResponseValue(item.aiResponseRaw || "");
    setEditingResponse(false);
    setShowJsonRepairTool(false);
    setTransformationState("idle");
  }, [item.aiResponseRaw, item.id]);

  const handleResponseKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!editingResponse) return;

      if (e.key === "Escape") {
        e.preventDefault();
        handleCancelResponse();
      }
    },
    [editingResponse, handleCancelResponse]
  );

  const handleRemove = useCallback(() => {
    if (!canEdit || isUpdating) {
      return;
    }

    onRemove(item.id);
  }, [canEdit, isUpdating, item.id, onRemove]);

  const handleToggleJsonPreview = useCallback(() => {
    setShowJsonPreview(!showJsonPreview);
  }, [showJsonPreview]);

  const getCardStateClass = () => {
    if (isUpdating) return COMPETITOR_STATES_CLASSES.loading;
    if (currentState === "completed")
      return COMPETITOR_STATES_CLASSES.competitor_completed;
    if (editingResponse) return COMPETITOR_STATES_CLASSES.competitor_active;
    return COMPETITOR_STATES_CLASSES.competitor_idle;
  };

  const canGenerateInstruction =
    canEdit &&
    !isUpdating &&
    !isGeneratingInstruction &&
    currentState === "url_added" &&
    !item.instructionGenerated;
  const canCopyInstruction =
    canEdit &&
    !isCopying &&
    item.instructionGenerated &&
    !item.instructionCopied;
  const canEditResponse =
    canEdit &&
    !isUpdating &&
    (item.instructionCopied || currentState === "analysis_provided");
  const canStartTransformation =
    transformationState === "ready" &&
    responseValue.trim() &&
    canEdit &&
    !isUpdating;
  const canSaveResearch =
    transformationState === "validated" && canEdit && !isUpdating;

  return (
    <Card className={cn("transition-all duration-200", getCardStateClass())}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-full", stateConfig.bgColor)}>
              <stateConfig.icon className={cn("size-4", stateConfig.color)} />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="font-medium text-gray-900 truncate"
                title={item.competitorName}
              >
                {item.competitorName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    stateConfig.color,
                    stateConfig.bgColor
                  )}
                >
                  {stateConfig.label}
                </Badge>
                {responseValue.trim() && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs flex items-center gap-1",
                      transformationState === "validated"
                        ? "text-green-800 border-green-200 bg-green-50"
                        : transformationState === "transforming"
                          ? "text-blue-800 border-blue-200 bg-blue-50"
                          : transformationState === "ready"
                            ? "text-orange-800 border-orange-200 bg-orange-50"
                            : "text-gray-800 border-gray-200"
                    )}
                  >
                    {transformationState === "validated" && (
                      <CheckCircle2 className="size-3" />
                    )}
                    {transformationState === "transforming" && (
                      <Sparkles className="size-3" />
                    )}
                    {transformationState === "ready" && (
                      <Wrench className="size-3" />
                    )}
                    <FileJson className="size-3" />
                    {transformationState === "validated"
                      ? "Object Verified"
                      : transformationState === "transforming"
                        ? "Processing..."
                        : transformationState === "ready"
                          ? "Ready for Transformation"
                          : "Loaded"}
                  </Badge>
                )}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-800 hover:text-gray-900 transition-colors flex items-center gap-1"
                  title="Open competitor website"
                >
                  <ExternalLink className="size-3" />
                  <span className="max-w-[200px] truncate">{item.url}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {item.aiResponseRaw && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleJsonPreview}
                className="size-8 p-0 text-gray-800 hover:text-gray-900"
                title={
                  showJsonPreview ? "Hide JSON preview" : "Show JSON preview"
                }
              >
                {showJsonPreview ? (
                  <EyeOff className="size-3" />
                ) : (
                  <Eye className="size-3" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={!canEdit || isUpdating}
              className="size-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              title="Remove competitor"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        </CardTitle>

        <p className="text-xs text-gray-700">{stateConfig.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Step 1: Generate Instruction */}
          {currentState === "url_added" && (
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-2">
                <Search className="size-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-200">
                  Step 1: Generate Analysis Instruction
                </span>
              </div>
              <Button
                onClick={handleGenerateInstruction}
                disabled={!canGenerateInstruction}
                size="sm"
                className={COMPETITOR_STATES_CLASSES.button_primary}
              >
                {isGeneratingInstruction ? (
                  <>
                    <LoadingSpinner className="size-3 mr-1" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Copy Instruction */}
          {item.instructionGenerated && !item.instructionCopied && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <div className="flex items-center gap-2">
                  <Copy className="size-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    Step 2: Copy Instruction for Perplexity AI
                  </span>
                </div>
                <Button
                  onClick={handleCopyInstruction}
                  disabled={!canCopyInstruction}
                  size="sm"
                  className="bg-orange-600 text-white hover:bg-orange-700"
                >
                  {isCopying ? (
                    <>
                      <LoadingSpinner className="size-3 mr-1" />
                      Copying...
                    </>
                  ) : (
                    <>
                      <Copy className="size-3 mr-1" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>

              {showInstruction && (
                <div className="bg-secondary p-3 rounded text-sm font-mono text-gray-700 max-h-60 overflow-y-auto">
                  <div className="whitespace-pre-wrap break-words">
                    {onGenerateInstruction(item.id)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Add AI Response */}
          {canEditResponse && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    Step 3: Add Perplexity AI Response
                  </span>
                </div>
                {!editingResponse && !item.aiResponseRaw && (
                  <Button
                    onClick={handleStartEditingResponse}
                    size="sm"
                    className="bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Add Response
                  </Button>
                )}
              </div>

              {editingResponse ? (
                <div className="space-y-2" onKeyDown={handleResponseKeyDown}>
                  <Textarea
                    ref={textareaRef}
                    value={responseValue}
                    onChange={(e) => setResponseValue(e.target.value)}
                    placeholder="Paste the Perplexity AI JSON response here..."
                    className="min-h-[200px] resize-y font-mono text-sm"
                    rows={COMPETITOR_UI_CONFIG.TEXTAREA_MIN_ROWS}
                    disabled={
                      isUpdating || transformationState === "transforming"
                    }
                  />

                  {responseValue.trim() && (
                    <div className="space-y-3">
                      {transformationState === "ready" && (
                        <div className="flex items-start gap-2 text-sm p-3 rounded border bg-orange-50 border-orange-200">
                          <Wrench className="size-4 mt-0.5 shrink-0 text-orange-600" />
                          <div className="text-orange-800 flex-1">
                            <span className="font-medium">
                              Object Ready for Transformation
                            </span>
                            <div className="text-xs mt-1">
                              Data loaded and ready for AI processing
                            </div>
                          </div>
                          <Button
                            onClick={handleStartTransformation}
                            disabled={!canStartTransformation}
                            size="sm"
                            className="ml-2 bg-orange-600 text-white hover:bg-orange-700"
                          >
                            <Sparkles className="size-3 mr-1" />
                            Start Transformation
                          </Button>
                        </div>
                      )}

                      {transformationState === "transforming" && (
                        <div className="flex items-start gap-2 text-sm p-3 rounded border bg-blue-50 border-blue-200">
                          <LoadingSpinner className="size-4 mt-0.5 shrink-0" />
                          <div className="text-blue-800 flex-1">
                            <span className="font-medium">
                              Please wait while the object is being processed
                            </span>
                            <div className="text-xs mt-1">
                              OpenAI is analyzing and transforming the data...
                            </div>
                          </div>
                        </div>
                      )}

                      {transformationState === "validated" && (
                        <div className="flex items-start gap-2 text-sm p-3 rounded border bg-green-50 border-green-200">
                          <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-green-600" />
                          <div className="text-green-800 flex-1">
                            <span className="font-medium">
                              Object Successfully Verified
                            </span>
                            <div className="text-xs mt-1">
                              Data transformed and ready to save
                            </div>
                          </div>
                          <Button
                            onClick={handleSaveCompetitorResearch}
                            disabled={!canSaveResearch}
                            size="sm"
                            className="ml-2 bg-green-600 text-white hover:bg-green-700"
                          >
                            <Save className="size-3 mr-1" />
                            Save This Competitor&apos;s Research
                          </Button>
                        </div>
                      )}

                      {transformationState === "error" && (
                        <div className="flex items-start gap-2 text-sm p-3 rounded border bg-red-50 border-red-200">
                          <AlertCircle className="size-4 mt-0.5 shrink-0 text-red-600" />
                          <div className="text-red-800 flex-1">
                            <span className="font-medium">
                              Transformation Error
                            </span>
                            <div className="text-xs mt-1">
                              Failed to process data. Check format or try again
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {showJsonRepairTool &&
                    transformationState === "transforming" && (
                      <JsonRepairTool
                        invalidJsonString={responseValue}
                        competitorUrl={item.url}
                        competitorName={item.competitorName}
                        onRepairSuccess={handleRepairSuccess}
                        onCancel={handleRepairCancel}
                        canEdit={canEdit}
                      />
                    )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">
                      {responseValue.length > 0 &&
                        `${responseValue.length} characters`}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelResponse}
                        disabled={
                          isUpdating || transformationState === "transforming"
                        }
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700">Esc to cancel</p>
                </div>
              ) : (
                item.aiResponseRaw && (
                  <div className="space-y-2">
                    <div
                      className="bg-secondary p-3 rounded text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleStartEditingResponse}
                      role="button"
                      tabIndex={canEdit ? 0 : -1}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
                          <FileJson className="size-3" />
                          Competitor Analysis Data ({
                            item.aiResponseRaw.length
                          }{" "}
                          characters)
                          {validationResult?.isValid ? (
                            <Badge
                              variant="outline"
                              className="text-xs text-green-800 border-green-200"
                            >
                              Processed
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs text-orange-800 border-orange-200"
                            >
                              Raw Data
                            </Badge>
                          )}
                        </span>
                        {canEdit && (
                          <span className="text-xs text-gray-700">
                            Click to edit
                          </span>
                        )}
                      </div>
                      <div className="whitespace-pre-wrap break-words max-h-32 overflow-hidden font-mono text-xs">
                        {showJsonPreview ? (
                          item.aiResponseRaw
                        ) : (
                          <>
                            {item.aiResponseRaw.substring(0, 200)}
                            {item.aiResponseRaw.length > 200 && (
                              <span className="text-gray-600"> ...</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Completion indicator */}
          {currentState === "completed" && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <CheckCircle2 className="size-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Competitor Analysis Successfully Processed & Completed
              </span>
              <Badge
                variant="secondary"
                className="ml-auto text-xs text-gray-100"
              >
                {item.aiResponseRaw?.length || 0} characters
              </Badge>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-800 pt-2 border-t">
          <span>Added: {new Date(item.createdAt).toLocaleDateString()}</span>
          <span>ID: {item.id.slice(0, 8)}...</span>
        </div>
      </CardContent>
    </Card>
  );
}
