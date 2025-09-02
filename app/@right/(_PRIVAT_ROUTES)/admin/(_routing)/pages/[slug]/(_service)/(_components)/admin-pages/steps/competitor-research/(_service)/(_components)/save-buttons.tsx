"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Save,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SAVE_BUTTON_CLASSES,
  LOCAL_SAVE_MESSAGES,
} from "../(_constants)/competitor-research-config";

interface SaveButtonsProps {
  onLocalSave: () => Promise<boolean>;
  onServerUpload: () => Promise<boolean>;
  canSaveLocally: boolean;
  canUploadToServer: boolean;
  hasLocalChanges: boolean;
  pendingServerUpload: boolean;
  isUpdating: boolean;
  isServerUploading: boolean;
  competitorsCount: number;
  dirty: boolean;
  instructionAdded: boolean;
  repairAvailable: boolean;
}

export function SaveButtons({
  onLocalSave,
  onServerUpload,
  canSaveLocally,
  canUploadToServer,
  hasLocalChanges,
  pendingServerUpload,
  isUpdating,
  isServerUploading,
  competitorsCount,
  dirty,
  instructionAdded,
  repairAvailable,
}: SaveButtonsProps) {
  const handleLocalSave = async () => {
    if (!canSaveLocally || isUpdating || isServerUploading) return;
    await onLocalSave();
  };

  const handleServerUpload = async () => {
    if (!canUploadToServer || isUpdating || isServerUploading) return;
    await onServerUpload();
  };

  const shouldShowSaveButtons = dirty || instructionAdded || repairAvailable;
  const showLocalSaveButton =
    shouldShowSaveButtons &&
    canSaveLocally &&
    (hasLocalChanges || !pendingServerUpload);
  const showServerUploadButton =
    shouldShowSaveButtons && pendingServerUpload && canUploadToServer;

  if (!shouldShowSaveButtons && !pendingServerUpload) {
    return (
      <div className="flex flex-col gap-4 p-4 border-t bg-gray-50/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-gray-600" />
            <span className="text-gray-700">
              {competitorsCount} competitor{competitorsCount !== 1 ? "s" : ""}{" "}
              in research
            </span>
          </div>
        </div>

        <div className="w-full p-4 text-center text-gray-600 bg-gray-100 rounded-lg">
          <CheckCircle2 className="size-5 mx-auto mb-2 text-green-600" />
          <p className="text-sm">All changes saved</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 border-t bg-gray-50/50">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Database className="size-4 text-gray-600" />
          <span className="text-gray-700">
            {competitorsCount} competitor{competitorsCount !== 1 ? "s" : ""} in
            research
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasLocalChanges && (
            <Badge
              variant="outline"
              className={SAVE_BUTTON_CLASSES.has_changes}
            >
              <Clock className="size-3 mr-1" />
              Has Changes
            </Badge>
          )}

          {pendingServerUpload && (
            <Badge
              variant="outline"
              className={SAVE_BUTTON_CLASSES.pending_upload}
            >
              <Upload className="size-3 mr-1" />
              Pending Upload
            </Badge>
          )}

          {instructionAdded && (
            <Badge
              variant="outline"
              className="text-xs bg-green-50 text-green-800 border-green-200"
            >
              <CheckCircle2 className="size-3 mr-1" />
              New Instruction
            </Badge>
          )}

          {repairAvailable && (
            <Badge
              variant="outline"
              className="text-xs bg-orange-50 text-orange-800 border-orange-200"
            >
              <AlertCircle className="size-3 mr-1" />
              Repair Available
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showLocalSaveButton && (
          <Button
            onClick={handleLocalSave}
            disabled={!canSaveLocally || isUpdating || isServerUploading}
            className={cn("flex-1", SAVE_BUTTON_CLASSES.local_save)}
            size="lg"
          >
            {isUpdating ? (
              <>
                <LoadingSpinner className="size-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                Save Research
              </>
            )}
          </Button>
        )}

        {showServerUploadButton && (
          <Button
            onClick={handleServerUpload}
            disabled={!canUploadToServer || isUpdating || isServerUploading}
            className={cn(
              showLocalSaveButton ? "flex-1" : "w-full",
              SAVE_BUTTON_CLASSES.server_upload
            )}
            size="lg"
          >
            {isServerUploading ? (
              <>
                <LoadingSpinner className="size-4 mr-2" />
                Uploading to Server...
              </>
            ) : (
              <>
                <Upload className="size-4 mr-2" />
                Upload to Server
              </>
            )}
          </Button>
        )}
      </div>

      {pendingServerUpload && (
        <div className="text-xs text-orange-700 bg-orange-50 p-3 rounded border border-orange-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4" />
            <span className="font-medium">Ready for Upload:</span>
          </div>
          <p className="mt-1">
            Research saved locally and ready for server upload. Click Upload to
            Server to complete the process.
          </p>
        </div>
      )}
    </div>
  );
}
