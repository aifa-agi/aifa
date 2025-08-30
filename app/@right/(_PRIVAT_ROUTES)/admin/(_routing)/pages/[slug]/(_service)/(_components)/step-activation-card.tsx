// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/step-activation-card.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Lock } from "lucide-react";
import { useAdminPagesNav } from "../(_context)/admin-pages-nav-context";
import {
  ADMIN_PAGES_TABS,
  AdminPageTabConfig,
} from "../(_config)/admin-pages-config";

interface StepActivationCardProps {
  stepKey: string;
}

export function StepActivationCard({ stepKey }: StepActivationCardProps) {
  const {
    getIndicatorStatus,
    markStepAsCompleted,
    canActivateStep,
    isStepCompleted,
  } = useAdminPagesNav();

  // Find current step configuration
  const stepConfig = ADMIN_PAGES_TABS.find(
    (tab) => tab.key === stepKey
  ) as AdminPageTabConfig;

  if (!stepConfig) {
    return <div>Step configuration not found</div>;
  }

  const indicatorStatus = getIndicatorStatus(stepConfig.key);
  const canActivate = canActivateStep(stepConfig.key);
  const isCompleted = isStepCompleted(stepConfig.key);

  const handleActivation = () => {
    if (canActivate && !isCompleted) {
      markStepAsCompleted(stepConfig.key);
    }
  };

  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="size-5 text-green-500" />;
    }
    if (canActivate) {
      return <Circle className="size-5 text-orange-500" />;
    }
    return <Lock className="size-5 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isCompleted) return "Completed";
    if (canActivate) return "Ready to execute";
    return "Unavailable";
  };

  const getActivationButtonText = () => {
    if (isCompleted) return "Step completed";
    if (canActivate) return "Activate step";
    return "Complete dependencies first";
  };

  const getDependenciesText = () => {
    if (!stepConfig.dependencies || stepConfig.dependencies.length === 0) {
      return "No dependencies";
    }

    const depNames = stepConfig.dependencies.map((dep) => {
      const depConfig = ADMIN_PAGES_TABS.find((tab) => tab.key === dep);
      return depConfig?.label || dep;
    });

    return `Depends on: ${depNames.join(", ")}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="flex items-center gap-2">
                {stepConfig.title}
                {stepConfig.etapNumber && (
                  <Badge variant="outline">Step {stepConfig.etapNumber}</Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {stepConfig.description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {getDependenciesText()}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleActivation}
            disabled={!canActivate || isCompleted}
            variant={isCompleted ? "outline" : "default"}
            size="lg"
            className="min-w-48"
          >
            {getActivationButtonText()}
          </Button>
        </div>

        {/* Current status indicator */}
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span className="text-muted-foreground">Indicator status:</span>
          <div
            className={`size-3 rounded-full ${
              indicatorStatus === "green"
                ? "bg-green-500"
                : indicatorStatus === "orange"
                  ? "bg-orange-500"
                  : "bg-gray-400"
            }`}
          />
          <span className="capitalize font-medium">
            {indicatorStatus === "green"
              ? "Completed"
              : indicatorStatus === "orange"
                ? "Ready"
                : "Unavailable"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
