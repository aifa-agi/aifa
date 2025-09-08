// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_components)/content-repair-tool.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import {
  Wrench,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  FileCode,
  Layers,
  Activity,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useContentRepair } from "../(_hooks)/use-content-repair";
import { ContentRepairRequest } from "../(_types)/content-repair-types";
import { CONTENT_REPAIR_CONFIG } from "../(_constants)/content-repair-config";

interface ContentRepairToolProps {
  invalidJsonString: string;
  pageName: string;
  pageSlug: string;
  onRepairSuccess: (repairedJsonString: string) => void;
  onCancel: () => void;
  canEdit: boolean;
}

export function ContentRepairTool({
  invalidJsonString,
  pageName,
  pageSlug,
  onRepairSuccess,
  onCancel,
  canEdit,
}: ContentRepairToolProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [showRepaired, setShowRepaired] = useState(true);

  // ✅ Progress state
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState(0);

  const {
    repairState,
    repairInvalidContentStructure,
    resetRepairState,
    isRepairing,
    canRepair,
  } = useContentRepair();

  // ✅ ИСПРАВЛЕННЫЙ useEffect - без проблемных зависимостей
  useEffect(() => {
    console.log(
      "🔄 ContentRepairTool: useEffect triggered, isRepairing:",
      isRepairing
    );

    let progressTimer: NodeJS.Timeout | undefined = undefined;
    let timeTimer: NodeJS.Timeout | undefined = undefined;
    let startTime: number | undefined = undefined;

    if (isRepairing) {
      console.log("🔧 Starting progress simulation...");

      startTime = Date.now();
      setProgress(0);
      setProgressStage("Инициализация восстановления...");
      setElapsedTime(0);

      // Этапы восстановления с реалистичными временными интервалами
      const stages = [
        { stage: "Анализ невалидных данных...", progress: 15, delay: 800 },
        {
          stage: "Подключение к OpenAI generateObject...",
          progress: 30,
          delay: 1200,
        },
        { stage: "Генерация структуры контента...", progress: 60, delay: 3000 },
        {
          stage: "Валидация восстановленной структуры...",
          progress: 85,
          delay: 1000,
        },
        { stage: "Финализация результата...", progress: 95, delay: 500 },
        { stage: "Завершено", progress: 100, delay: 300 },
      ];

      let currentStageIndex = 0;
      let currentProgress = 0;

      // ✅ Прогресс-таймер
      progressTimer = setInterval(() => {
        if (currentStageIndex < stages.length) {
          const currentStage = stages[currentStageIndex];

          // Обновляем стадию
          if (currentProgress <= currentStage.progress - 10) {
            setProgressStage(currentStage.stage);
          }

          // Плавное увеличение прогресса
          if (currentProgress < currentStage.progress) {
            const increment = Math.random() * 2 + 0.5; // 0.5-2.5% за раз
            currentProgress = Math.min(
              currentProgress + increment,
              currentStage.progress
            );
            setProgress(currentProgress);

            console.log(
              `📊 Progress: ${currentProgress.toFixed(1)}% - ${currentStage.stage}`
            );
          } else {
            // Переходим к следующему этапу
            currentStageIndex++;
            if (currentStageIndex < stages.length) {
              setTimeout(() => {
                console.log(
                  `🔄 Moving to stage ${currentStageIndex + 1}/${stages.length}`
                );
              }, 100);
            }
          }
        }
      }, 200); // Обновляем каждые 200мс для плавности

      // ✅ Таймер времени выполнения
      timeTimer = setInterval(() => {
        if (startTime) {
          const elapsed = Date.now() - startTime;
          setElapsedTime(elapsed);
          console.log(`⏱️ Elapsed time: ${(elapsed / 1000).toFixed(1)}s`);
        }
      }, 100);
    } else {
      // Сбрасываем прогресс когда не восстанавливаем
      console.log("🔄 Resetting progress state");
      setProgress(0);
      setProgressStage("");
      setElapsedTime(0);
    }

    // ✅ Cleanup функция
    return () => {
      console.log("🧹 Cleaning up progress timers");
      if (progressTimer !== undefined) {
        clearInterval(progressTimer);
      }
      if (timeTimer !== undefined) {
        clearInterval(timeTimer);
      }
    };
  }, [isRepairing]); // ✅ ТОЛЬКО isRepairing в зависимостях

  const handleRepairAttempt = async () => {
    if (!canEdit || isRepairing || !canRepair) return;

    console.log("🔧 Starting ContentStructure repair attempt");

    const request: ContentRepairRequest = {
      invalidJsonString,
      pageName,
      pageSlug,
    };

    const result = await repairInvalidContentStructure(request);

    if (result.success && result.repairedData) {
      console.log("✅ Repair successful, finalizing progress");

      // Завершаем прогресс
      setProgress(100);
      setProgressStage("Успешно завершено!");

      // Небольшая задержка для показа завершения
      setTimeout(() => {
        const repairedJsonString = JSON.stringify(result.repairedData, null, 2);
        console.log(
          "✅ ContentStructure repair successful, calling onRepairSuccess"
        );
        onRepairSuccess(repairedJsonString);
      }, 500);
    } else {
      console.error("❌ Repair failed:", result.error);
      setProgressStage("Ошибка восстановления");
    }
  };

  const handleCopyRepairedJson = async () => {
    if (!repairState.repairResult?.repairedData) return;

    try {
      const jsonString = JSON.stringify(
        repairState.repairResult.repairedData,
        null,
        2
      );
      await navigator.clipboard.writeText(jsonString);
      toast.success("Repaired ContentStructure copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy ContentStructure JSON");
    }
  };

  const handleResetAndRetry = () => {
    console.log("🔄 Resetting repair state and progress");
    resetRepairState();
    setProgress(0);
    setProgressStage("");
    setElapsedTime(0);
  };

  const formatElapsedTime = (ms: number) => {
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const hasRepairResult = repairState.repairResult !== null;
  const repairSuccessful = repairState.repairResult?.success === true;
  const elementsCount = Array.isArray(repairState.repairResult?.repairedData)
    ? repairState.repairResult.repairedData.length
    : 0;

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-800">
            <Wrench className="size-4" />
            ContentStructure Repair Tool
            <Badge
              variant="outline"
              className="text-xs bg-orange-100 text-orange-700"
            >
              <Sparkles className="size-3 mr-1" />
              AI-Powered
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            Close
          </Button>
        </CardTitle>

        <p className="text-sm text-orange-700">
          The AI response contains invalid ContentStructure JSON format. Use our
          automated repair tool to fix it.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ✅ Progress Section - показываем только во время восстановления */}
        {isRepairing && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-blue-700">
                  <Activity className="size-4 animate-pulse" />
                  <span className="font-medium">Восстановление в процессе</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Timer className="size-3" />
                  <span className="text-xs">
                    {formatElapsedTime(elapsedTime)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {progress.toFixed(0)}%
                  </Badge>
                </div>
              </div>

              <Progress value={progress} className="h-2 bg-blue-100" />

              <p className="text-xs text-blue-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                {progressStage}
              </p>
            </div>
          </div>
        )}

        {/* Repair Status */}
        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-2 rounded-full",
                hasRepairResult
                  ? repairSuccessful
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-orange-500"
              )}
            />
            <span className="text-sm font-medium">
              {hasRepairResult
                ? repairSuccessful
                  ? "Repair Successful"
                  : "Repair Failed"
                : "Ready to Repair"}
            </span>
            {hasRepairResult && (
              <Badge variant="outline" className="text-xs">
                Attempt {repairState.repairAttempts}/
                {CONTENT_REPAIR_CONFIG.MAX_REPAIR_ATTEMPTS}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasRepairResult && repairSuccessful && (
              <>
                <Badge variant="outline" className="text-xs text-green-700">
                  {Math.round(
                    (repairState.repairResult?.confidence || 0) * 100
                  )}
                  % Confidence
                </Badge>
                {elementsCount > 0 && (
                  <Badge variant="outline" className="text-xs text-blue-700">
                    <Layers className="size-3 mr-1" />
                    {elementsCount} Elements
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>

        {/* Page Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <FileCode className="size-4 text-blue-600" />
            <h4 className="text-sm font-medium text-blue-800">
              Page Information
            </h4>
          </div>
          <div className="text-xs text-blue-700 space-y-1">
            <p>
              <span className="font-medium">Page:</span> {pageName}
            </p>
            <p>
              <span className="font-medium">Slug:</span> {pageSlug}
            </p>
            <p>
              <span className="font-medium">Target:</span> draftContentStructure
              field
            </p>
          </div>
        </div>

        {/* Original JSON Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <XCircle className="size-4 text-red-600" />
              Invalid ContentStructure JSON ({invalidJsonString.length} chars)
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-xs"
            >
              {showOriginal ? (
                <EyeOff className="size-3 mr-1" />
              ) : (
                <Eye className="size-3 mr-1" />
              )}
              {showOriginal ? "Hide" : "Show"}
            </Button>
          </div>

          {showOriginal && (
            <div className="bg-red-50 border border-red-200 rounded p-3 max-h-40 overflow-y-auto">
              <pre className="text-xs text-red-800 whitespace-pre-wrap break-words font-mono">
                {invalidJsonString.substring(0, 1000)}
                {invalidJsonString.length > 1000 && "..."}
              </pre>
            </div>
          )}
        </div>

        {/* Repair Action */}
        {!hasRepairResult ? (
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="size-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    AI ContentStructure Repair Process
                  </h4>
                  <p className="text-xs text-blue-700 mb-3">
                    Our AI will analyze the invalid response and convert it into
                    a properly structured ContentStructure array using OpenAI
                    GPT-4o with specialized validation.
                  </p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Extract and preserve meaningful content data</li>
                    <li>
                      • Ensure additionalData fields are properly structured
                    </li>
                    <li>• Validate minWords, maxWords, and actualContent</li>
                    <li>• Generate proper HTML tag hierarchy</li>
                    <li>• Create selfPrompt fields for recursive generation</li>
                    <li>• Maintain semantic relationships between elements</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={handleRepairAttempt}
              disabled={!canEdit || isRepairing || !canRepair}
              className="w-full bg-orange-600 text-white hover:bg-orange-700"
            >
              {isRepairing ? (
                <>
                  <LoadingSpinner className="size-4 mr-2" />
                  Repairing ContentStructure with AI...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  Repair ContentStructure with AI
                </>
              )}
            </Button>

            {!canRepair && (
              <div className="text-center p-3 bg-red-50 border border-red-200 rounded">
                <AlertTriangle className="size-4 text-red-600 mx-auto mb-1" />
                <p className="text-xs text-red-700">
                  Maximum repair attempts reached. Please check the original
                  response or try again later.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Repair Results */
          <div className="space-y-3">
            {repairSuccessful ? (
              <>
                {/* Success Result */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      ContentStructure Successfully Repaired
                    </span>
                  </div>
                  <div className="text-xs text-green-700 space-y-1">
                    <p>
                      • Original: {repairState.repairResult?.originalLength}{" "}
                      characters
                    </p>
                    <p>
                      • Repaired: {repairState.repairResult?.repairedLength}{" "}
                      characters
                    </p>
                    <p>
                      • Elements: {elementsCount} content structure elements
                    </p>
                    <p>
                      • Confidence:{" "}
                      {Math.round(
                        (repairState.repairResult?.confidence || 0) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>

                {/* Repaired JSON Preview */}
                {showRepaired && repairState.repairResult?.repairedData && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-green-800 flex items-center gap-2">
                        <Layers className="size-4" />
                        Repaired ContentStructure ({elementsCount} elements)
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyRepairedJson}
                        className="text-xs"
                      >
                        <Copy className="size-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3 max-h-60 overflow-y-auto">
                      <pre className="text-xs text-green-800 whitespace-pre-wrap break-words font-mono">
                        {JSON.stringify(
                          repairState.repairResult.repairedData,
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      const jsonString = JSON.stringify(
                        repairState.repairResult?.repairedData,
                        null,
                        2
                      );
                      onRepairSuccess(jsonString);
                    }}
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  >
                    <CheckCircle2 className="size-4 mr-2" />
                    Use Repaired ContentStructure
                  </Button>

                  {canRepair && (
                    <Button
                      variant="outline"
                      onClick={handleResetAndRetry}
                      size="sm"
                    >
                      <RefreshCw className="size-3 mr-1" />
                      Try Again
                    </Button>
                  )}
                </div>
              </>
            ) : (
              /* Failure Result */
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="size-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      ContentStructure Repair Failed
                    </span>
                  </div>
                  <p className="text-xs text-red-700">
                    {repairState.repairResult?.error}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {canRepair ? (
                    <Button
                      onClick={handleResetAndRetry}
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className="size-4 mr-2" />
                      Try Again ({repairState.repairAttempts}/
                      {CONTENT_REPAIR_CONFIG.MAX_REPAIR_ATTEMPTS})
                    </Button>
                  ) : (
                    <div className="flex-1 text-center p-3 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-xs text-gray-600">
                        All ContentStructure repair attempts exhausted. Please
                        check the original response.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
