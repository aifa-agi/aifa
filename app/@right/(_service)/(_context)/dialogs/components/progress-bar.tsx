// @/app/(_service)/contexts/dialogs/components/progress-bar.tsx

import React from "react";

interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="relative pt-1">
      {/* Progress bar container with 1px height */}
      <div className="flex h-px mb-2 overflow-hidden bg-muted rounded">
        <div
          style={{ width: `${value}%` }}
          className="flex flex-col justify-center text-center bg-primary shadow-none whitespace-nowrap transition-all duration-500 ease-in-out"
        />
      </div>
      {/* Percentage text with 8px font size */}
      <div className="text-center text-muted-foreground" style={{ fontSize: '8px' }}>
        {Math.round(value)}%
      </div>
    </div>
  );
}
