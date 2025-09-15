// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_hooks)/use-step8-generate.ts

"use client";

/**
 * Step 8 - Generate hook:
 * Runs MDX generation for the active or specific H2 section via a server action,
 * manages per-section generation statuses, supports cancellation, and shows Sonner toasts.
 *
 * Understanding of the task (step-by-step):
 * 1) Build prompt using useStep8Prompt (system+user with previous sections' MDX).
 * 2) Enforce strict sequence via useStep8Guard (only unlockedIndex is allowed).
 * 3) Call the server action `generateSectionMDX` (gpt-4.1-mini) to produce MDX.
 * 4) Manage per-section statuses: 'idle' | 'generating' | 'ready' | 'error'.
 * 5) Support cancel via AbortController (best-effort; server action cannot truly abort,
 *    but we ignore late results after local abort).
 * 6) Do NOT persist here. Saving is handled by use-step8-save.ts.
 *
 * Notes:
 * - Comments and UI strings are in English (US). Chat remains in Russian.
 * - The single source of truth is PageData; no tree duplication here.
 */

import * as React from "react";
import { toast } from "sonner";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import { useStep8Prompt } from "./use-step8-prompt";
import { useStep8Guard } from "./use-step8-guard";
import type {
  GenerationStatus,
  GenerationStatusBySectionMap,
} from "../(_types)/step8-types";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { STEP8_IDS } from "../(_constants)/step8-ids";

// Server Action: must be implemented under step8/_actions
import { generateSectionMDX } from "../(_actions)/generate-section-mdx";

/** Helper to set status for a specific section id. */
function setStatusFor(
  setMap: React.Dispatch<React.SetStateAction<GenerationStatusBySectionMap>>,
  sectionId: string,
  status: GenerationStatus
) {
  setMap((prev) => ({ ...prev, [sectionId]: status }));
}

/** Public API of the generate hook. */
export function useStep8Generate() {
  const { page, getSections, getActiveSection } = useStep8Root();
  const { buildForSectionId } = useStep8Prompt();
  const { canActivateId } = useStep8Guard();

  // Per-section generation statuses
  const [statusBySection, setStatusBySection] =
    React.useState<GenerationStatusBySectionMap>({});
  const [lastError, setLastError] = React.useState<string | null>(null);

  // Local abort controllers by section id
  const controllersRef = React.useRef<Map<string, AbortController>>(new Map());

  /** Returns current status for a section id. */
  const getStatus = React.useCallback(
    (sectionId: string | null | undefined): GenerationStatus => {
      if (!sectionId) return "idle";
      return statusBySection[sectionId] ?? "idle";
    },
    [statusBySection]
  );

  /** Check if a section is currently generating. */
  const isGenerating = React.useCallback(
    (sectionId: string | null | undefined): boolean =>
      getStatus(sectionId) === "generating",
    [getStatus]
  );

  /** Cancel generation for a specific section (or all if no id provided). */
  const cancel = React.useCallback((sectionId?: string | null) => {
    if (!sectionId) {
      // Cancel all
      controllersRef.current.forEach((ctrl, id) => {
        try {
          ctrl.abort();
          setStatusFor(setStatusBySection, id, "idle");
        } catch {
          // no-op
        }
      });
      controllersRef.current.clear();
      toast.info(STEP8_TEXTS.generate.canceledTitle, {
        id: STEP8_IDS.toasts.generateCanceled,
        description: STEP8_TEXTS.generate.canceledDescription,
      });
      return;
    }
    const ctrl = controllersRef.current.get(sectionId);
    if (ctrl) {
      try {
        ctrl.abort();
        controllersRef.current.delete(sectionId);
        setStatusFor(setStatusBySection, sectionId, "idle");
        toast.info(STEP8_TEXTS.generate.canceledTitle, {
          id: STEP8_IDS.toasts.generateCanceled,
          description: STEP8_TEXTS.generate.canceledDescription,
        });
      } catch {
        // silent
      }
    }
  }, []);

  /** Generate MDX for a given section id (returns MDX string or null on error). */
  const generateForSectionId = React.useCallback(
    async (sectionId: string | null | undefined): Promise<string | null> => {
      setLastError(null);
      if (!page?.id || !sectionId) {
        toast.error(STEP8_TEXTS.errors.missingActive, {
          id: STEP8_IDS.toasts.generateError,
          description: STEP8_TEXTS.selector.selectPrompt,
        });
        return null;
      }

      // Enforce sequence: only unlocked section is allowed
      if (!canActivateId(sectionId)) {
        toast.error(STEP8_TEXTS.guard.lockedTitle, {
          id: STEP8_IDS.toasts.guardLocked,
          description: STEP8_TEXTS.guard.lockedDescription,
        });
        return null;
      }

      // Prepare prompt parts
      const prompt = buildForSectionId(sectionId);
      if (!prompt) return null;

      // If already generating, cancel previous run
      if (isGenerating(sectionId)) {
        cancel(sectionId);
      }

      // Local abort controller (best-effort)
      const ctrl = new AbortController();
      controllersRef.current.set(sectionId, ctrl);

      // UI feedback: start
      setStatusFor(setStatusBySection, sectionId, "generating");
      toast.loading(STEP8_TEXTS.generate.startTitle, {
        id: STEP8_IDS.toasts.generateStart,
        description: STEP8_TEXTS.generate.startDescription,
      });

      try {
        // Call server action to generate MDX (model defaults to gpt-4.1-mini on server)
        const result = await generateSectionMDX({
          pageId: page.id,
          sectionId,
          system: prompt.system,
          user: prompt.user,
          model: "gpt-4.1-mini",
        });

        // If user canceled while awaiting: ignore late result
        if (ctrl.signal?.aborted) {
          toast.info(STEP8_TEXTS.generate.canceledTitle, {
            id: STEP8_IDS.toasts.generateCanceled,
            description: STEP8_TEXTS.generate.canceledDescription,
          });
          setStatusFor(setStatusBySection, sectionId, "idle");
          controllersRef.current.delete(sectionId);
          return null;
        }

        const mdx = String(result?.mdx ?? "").trim();

        if (!mdx) {
          // Treat empty as error
          setStatusFor(setStatusBySection, sectionId, "error");
          setLastError("Empty MDX result");
          toast.error(STEP8_TEXTS.generate.errorTitle, {
            id: STEP8_IDS.toasts.generateError,
            description: STEP8_TEXTS.generate.errorDescription,
          });
          controllersRef.current.delete(sectionId);
          return null;
        }

        setStatusFor(setStatusBySection, sectionId, "ready");
        toast.success(STEP8_TEXTS.generate.successTitle, {
          id: STEP8_IDS.toasts.generateSuccess,
          description: STEP8_TEXTS.generate.successDescription,
        });

        controllersRef.current.delete(sectionId);
        return mdx;
      } catch (err: unknown) {
        setStatusFor(setStatusBySection, sectionId, "error");
        const message =
          (err as any)?.message ??
          (typeof err === "string" ? err : "Generation failed");
        setLastError(String(message));
        toast.error(STEP8_TEXTS.generate.errorTitle, {
          id: STEP8_IDS.toasts.generateError,
          description: STEP8_TEXTS.generate.errorDescription,
        });
        controllersRef.current.delete(sectionId);
        return null;
      } finally {
        // Clear loading toast if still present
        toast.dismiss(STEP8_IDS.toasts.generateStart);
      }
    },
    [page?.id, canActivateId, buildForSectionId, isGenerating, cancel]
  );

  /** Generate MDX for the currently active section. */
  const generateForActiveSection = React.useCallback(async (): Promise<
    string | null
  > => {
    const active = getActiveSection();
    if (!active?.id) {
      toast.error(STEP8_TEXTS.errors.missingActive, {
        id: STEP8_IDS.toasts.generateError,
        description: STEP8_TEXTS.selector.selectPrompt,
      });
      return null;
    }
    return generateForSectionId(active.id);
  }, [getActiveSection, generateForSectionId]);

  return {
    // Status map and last error
    statusBySection,
    getStatus,
    isGenerating,
    lastError,

    // Actions
    generateForSectionId,
    generateForActiveSection,
    cancel,
  };
}
