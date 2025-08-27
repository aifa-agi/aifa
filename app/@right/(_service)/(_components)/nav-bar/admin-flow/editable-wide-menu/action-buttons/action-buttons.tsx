// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/action-buttons/action-buttons.tsx

"use client";

import React from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  dirty: boolean;
  loading: boolean;
  onUpdate: () => Promise<void>;
  onRetry?: () => Promise<void>;
  canRetry?: boolean;
  retryCount?: number;
  lastError?: {
    status: string;
    message: string;
    canRetry: boolean;
  } | null;
}

export function ActionButtons({
  dirty,
  loading,
  onUpdate,
  onRetry,
  canRetry = false,
  retryCount = 0,
  lastError,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <Button
        type="button"
        className="w-full"
        onClick={onUpdate}
        variant={loading ? "default" : dirty ? "default" : "secondary"}
        disabled={!dirty || loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : dirty ? (
          <>Update changes</>
        ) : (
          <>No changes</>
        )}
      </Button>

      {canRetry && lastError && !loading && onRetry && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onRetry}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Retry Update {retryCount > 0 && `(Attempt ${retryCount + 1})`}
        </Button>
      )}

      {lastError && !loading && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm font-medium">
            {lastError.message}
          </p>
          {lastError.canRetry && (
            <p className="text-red-600 text-xs mt-1">
              This error can be retried. Click the retry button above.
            </p>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 text-center">
        {dirty && "• You have unsaved changes"}
        {!dirty && "• All changes saved"}
        {retryCount > 0 && ` • ${retryCount} retry attempts`}
      </div>
    </div>
  );
}
