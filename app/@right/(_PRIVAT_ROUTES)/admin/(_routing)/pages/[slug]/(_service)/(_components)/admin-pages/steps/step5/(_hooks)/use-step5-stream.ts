// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/(_hooks)/use-step5-stream.ts
/**
 * Step 5 - Streaming hook
 * Wraps ai-sdk/react useCompletion to stream content structure for step 5.
 * 
 * Comments:
 * - Provides startStreaming(system, prompt) and cancel.
 * - Integrates Sonner toasts for start/success/error/cancel.
 * - Consumers can read streamText in real time and then persist via use-step5-save.
 */

import * as React from "react";
import { useCompletion } from "ai/react";
import { toast } from "sonner"; 

export type StartStreamingInput = {
  system: string;
  prompt: string;
  model?: string;
};

export function useStep5Stream() {
  // useCompletion manages an internal POST to the API route (default method)
  const { completion, isLoading, complete, stop: stopStreaming, error } = useCompletion({
    api: "/api/step5/generate-structure",
  });

  const [lastError, setLastError] = React.useState<string | null>(null);

  const startStreaming = React.useCallback(async ({ system, prompt, model }: StartStreamingInput) => {
    setLastError(null);
    
    toast.loading("Structure generation started", {
      id: "step5-stream-start",
      description: "Generating content structure in real time...",
    });

    try {
      await complete("", {
        body: { system, prompt, model },
      });
      
      toast.success("Structure generation completed", {
        id: "step5-stream-success", 
        description: "Content structure is ready for review and saving.",
      });
    } catch (e: any) {
      const msg = e?.message ?? "Streaming failed";
      setLastError(String(msg));
      
      toast.error("Structure generation failed", {
        id: "step5-stream-error",
        description: "Failed to generate content structure. Please try again.",
      });
    } finally {
      toast.dismiss("step5-stream-start");
    }
  }, [complete]);

  const cancel = React.useCallback(() => {
    try {
      stopStreaming();
      toast.info("Generation canceled", {
        id: "step5-stream-canceled",
        description: "Content structure generation was canceled.",
      });
    } catch {
      // Silent
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
