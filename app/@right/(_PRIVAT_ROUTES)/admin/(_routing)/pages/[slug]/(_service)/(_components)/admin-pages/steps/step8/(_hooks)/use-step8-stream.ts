// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_hooks)/use-step8-stream.ts

/**
 * Step 8 - Streaming hook:
 * Wraps @ai-sdk/react/useCompletion to stream MDX deltas for the active section.
 *
 * Comments:
 * - Provides startStreaming({ system, prompt }) and stop().
 * - Integrates Sonner toasts for start/success/error/cancel.
 * - Consumers can read `streamText` in real time and then persist via use-step8-save.
 */

import * as React from "react";
import { useCompletion } from "@ai-sdk/react";
import { toast } from "sonner";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { STEP8_IDS } from "../(_constants)/step8-ids";

export type StartStreamingInput = {
  system: string;
  prompt: string;
  model?: string;
};

export function useStep8Stream() {
  // useCompletion manages an internal POST to the API route (default method).
  const {
    completion,
    isLoading,
    complete,
    stop: stopStreaming,
    error,
  } = useCompletion({
    api: "/api/step8/generate",
  });

  const [lastError, setLastError] = React.useState<string | null>(null);

  const startStreaming = React.useCallback(
    async ({ system, prompt, model }: StartStreamingInput) => {
      setLastError(null);
      toast.loading(STEP8_TEXTS.stream.startTitle, {
        id: STEP8_IDS.toasts.streamStart,
        description: STEP8_TEXTS.stream.startDescription,
      });
      try {
        await complete("", {
          body: { system, prompt, model },
        });
        toast.success(STEP8_TEXTS.stream.successTitle, {
          id: STEP8_IDS.toasts.streamSuccess,
          description: STEP8_TEXTS.stream.successDescription,
        });
      } catch (e: any) {
        const msg = e?.message ?? "Streaming failed";
        setLastError(String(msg));
        toast.error(STEP8_TEXTS.stream.errorTitle, {
          id: STEP8_IDS.toasts.streamError,
          description: STEP8_TEXTS.stream.errorDescription,
        });
      } finally {
        toast.dismiss(STEP8_IDS.toasts.streamStart);
      }
    },
    [complete]
  );

  const cancel = React.useCallback(() => {
    try {
      stopStreaming();
      toast.info(STEP8_TEXTS.stream.canceledTitle, {
        id: STEP8_IDS.toasts.streamCanceled,
        description: STEP8_TEXTS.stream.canceledDescription,
      });
    } catch {
      // silent
    }
  }, [stopStreaming]);

  return {
    // Real-time text being streamed from the model
    streamText: completion,
    isStreaming: isLoading,
    lastError: lastError ?? (error ? String(error) : null),

    // Controls
    startStreaming,
    cancel,
  };
}
