"use client";

/**
 * Step 5 - Streaming hook:
 * Optimized version following best practices from Step 8 streaming hook.
 * Improvements:
 * - Use relative API path.
 * - Add cleanup for side effects.
 * - Manage stream completed state.
 * - Use better error typing and handling.
 * - Clear stream completed state on new start or cancel.
 */

import * as React from "react";
import { useCompletion } from "@ai-sdk/react";
import { toast } from "sonner";

export type StartStreamingInput = {
  system: string;
  prompt: string;
  model?: string;
};

export function useStep5Stream() {
  const {
    completion,
    isLoading,
    complete,
    stop: stopStreaming,
    error,
  } = useCompletion({
    // Use relative API path as in Step 8 for consistency and correctness
    api: "/api/step5/generate-structure",
    onResponse: (response) => {
      console.log("=== Step5 Stream Response ===");
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("==============================");
    },
    onFinish: (prompt, completion) => {
      console.log("=== Step5 Stream Finished ===");
      console.log("Final prompt length:", prompt.length);
      console.log("Final completion length:", completion.length);
      console.log("Completion preview:", completion.substring(0, 200) + "...");
      console.log("==============================");
    },
    onError: (error) => {
      console.error("=== Step5 Stream Error ===");
      console.error("Stream error:", error);
      console.error("===========================");
    },
  });

  const [lastError, setLastError] = React.useState<string | null>(null);
  const [streamCompleted, setStreamCompleted] = React.useState(false);

  // Synchronize streamCompleted with completion and isLoading with cleanup
  React.useEffect(() => {
    if (!isLoading && completion && completion.trim().length > 0) {
      const timer = setTimeout(() => {
        setStreamCompleted(true);
      }, 100); // Small delay to stabilize completion
      return () => clearTimeout(timer);
    }
    if (isLoading) {
      setStreamCompleted(false);
    }
  }, [completion, isLoading]);

  const startStreaming = React.useCallback(
    async ({ system, prompt, model }: StartStreamingInput) => {
      // Validation
      if (!system || system.length < 100) {
        const errorMsg = "System instruction is missing or too short";
        console.error("❌ Validation failed:", errorMsg);
        toast.error("Generation failed", {
          id: "step5-stream-error",
          description: errorMsg,
        });
        setLastError(errorMsg);
        return;
      }

      if (!prompt || prompt.length < 10) {
        const errorMsg = "Prompt is missing or too short";
        console.error("❌ Validation failed:", errorMsg);
        toast.error("Generation failed", {
          id: "step5-stream-error",
          description: errorMsg,
        });
        setLastError(errorMsg);
        return;
      }

      setLastError(null);
      setStreamCompleted(false); // Reset completion state on start

      toast.loading("Structure generation started", {
        id: "step5-stream-start",
        description: "Generating content structure in real time...",
      });

      try {
        // Note: pass empty string as first arg to match Step 8 pattern
        await complete("", {
          body: { system, prompt, model: model || "gpt-4.1-mini" },
        });

        console.log("✅ Stream completed successfully");
        toast.success("Structure generation completed", {
          id: "step5-stream-success",
          description: "Content structure is ready for review and saving.",
        });
      } catch (e: unknown) {
        let errorMessage = "Streaming failed";
        if (e instanceof Error) {
          errorMessage = e.message;
        } else if (typeof e === "string") {
          errorMessage = e;
        } else if (e && typeof e === "object" && "message" in e) {
          errorMessage = String((e as any).message);
        }
        console.error("❌ Streaming error:", e);
        setLastError(errorMessage);
        toast.error("Structure generation failed", {
          id: "step5-stream-error",
          description:
            "Failed to generate content structure. Check console for details.",
        });
      } finally {
        toast.dismiss("step5-stream-start");
      }
    },
    [complete]
  );

  const cancel = React.useCallback(() => {
    try {
      console.log("🛑 Canceling Step5 stream");
      stopStreaming();
      setStreamCompleted(false); // Reset completion on cancel
      toast.info("Generation canceled", {
        id: "step5-stream-canceled",
        description: "Content structure generation was canceled.",
      });
    } catch (error) {
      console.error("Error canceling stream:", error);
    }
  }, [stopStreaming]);

  return {
    // Real-time streamed text
    streamText: completion,
    isStreaming: isLoading,
    streamCompleted,
    lastError: lastError ?? (error ? String(error) : null),

    // Controls
    startStreaming,
    cancel,
  };
}
