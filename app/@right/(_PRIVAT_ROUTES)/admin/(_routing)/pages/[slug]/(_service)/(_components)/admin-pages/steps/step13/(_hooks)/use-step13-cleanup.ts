// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_hooks)/use-step13-cleanup.ts

/**
 * Step 13 Cleanup Hook:
 * Manages animated data cleanup process with state management,
 * error handling, rollback capabilities, and toast notifications.
 * 
 * Understanding of the task (step-by-step):
 * 1) Manage cleanup process state (idle/active/completed)
 * 2) Execute animated field removal sequence (500ms → 250ms → 200ms)
 * 3) Handle errors with automatic rollback to previous state
 * 4) Integrate with NavigationMenuProvider for data persistence
 * 5) Show toast notifications for user feedback
 * 6) Provide start/stop/reset functionality
 * 7) Track individual field cleanup progress
 */

import * as React from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import type { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import type { 
  CleanupProcessState, 
  FieldCleanupState,
  CleanupAnimationPhase 
} from "../(_types)/step13-types";
import { 
  cleanupPageData,
  validateRequiredFields,
  createDataBackup,
  restoreFromBackup,
  getCleanupFieldsCount,
  getCleanupSummary
} from "../(_utils)/data-cleanup-utils";
import { 
  calculateAnimationDelay,
  createFieldAnimationList,
  generateProgressMessage,
  generateSuccessMessage,
  estimateCleanupDuration
} from "../(_utils)/step13-helpers";
import { STEP13_TEXTS } from "../(_constants)/step13-texts";
import { STEP13_IDS } from "../(_constants)/step13-ids";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface UseStep13CleanupProps {
  pageData: PageData | null;
  slug: string;
}

interface UseStep13CleanupReturn {
  // State
  cleanupProcess: CleanupProcessState;
  isCleanupActive: boolean;
  isCleanupCompleted: boolean;
  canStartCleanup: boolean;
  
  // Actions
  startCleanup: () => Promise<boolean>;
  stopCleanup: () => void;
  resetCleanup: () => void;
  
  // Info
  estimatedDuration: string;
  fieldsToClean: number;
  currentProgress: number;
}

/**
 * Deep clone utility for categories backup
 */
function deepCloneCategories(categories: MenuCategory[]): MenuCategory[] {
  return JSON.parse(JSON.stringify(categories)) as MenuCategory[];
}

/**
 * Replace page in categories by id
 */
function replacePageInCategories(
  categories: MenuCategory[],
  updatedPage: PageData
): MenuCategory[] {
  return categories.map(category => ({
    ...category,
    pages: category.pages.map(page =>
      page?.id === updatedPage.id 
        ? { ...updatedPage, updatedAt: new Date().toISOString() }
        : page
    )
  }));
}

export function useStep13Cleanup({ pageData, slug }: UseStep13CleanupProps): UseStep13CleanupReturn {
  const { categories, setCategories, updateCategories } = useNavigationMenu();
  
  // Cleanup process state
  const [cleanupProcess, setCleanupProcess] = React.useState<CleanupProcessState>({
    isActive: false,
    currentFieldIndex: 0,
    fields: [],
    totalFields: 0,
    completedFields: 0
  });

  // Animation timeout refs for cleanup
  const timeoutsRef = React.useRef<NodeJS.Timeout[]>([]);
  const backupRef = React.useRef<MenuCategory[] | null>(null);

  // Initialize field list when pageData changes
  React.useEffect(() => {
    if (!pageData) return;
    
    const fieldsToAnimate = createFieldAnimationList(pageData);
    const fieldStates: FieldCleanupState[] = fieldsToAnimate.map(field => ({
      fieldName: field.fieldName,
      phase: "idle",
      isCompleted: false
    }));
    
    setCleanupProcess(prev => ({
      ...prev,
      fields: fieldStates,
      totalFields: fieldStates.length,
      completedFields: 0
    }));
  }, [pageData]);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Computed values - FIXED: Ensure boolean return types
  const isCleanupActive = cleanupProcess.isActive;
  const isCleanupCompleted = cleanupProcess.completedFields === cleanupProcess.totalFields && cleanupProcess.totalFields > 0;
  const canStartCleanup = Boolean(pageData && !isCleanupActive && !isCleanupCompleted); // FIXED: Explicit boolean conversion
  const fieldsToClean = pageData ? getCleanupFieldsCount(pageData) : 0;
  const currentProgress = cleanupProcess.totalFields > 0 
    ? Math.round((cleanupProcess.completedFields / cleanupProcess.totalFields) * 100)
    : 0;

  const { displayText: estimatedDuration } = estimateCleanupDuration(fieldsToClean);

  /**
   * Animates individual field cleanup with proper timing
   */
  const animateFieldCleanup = React.useCallback((fieldIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      const field = cleanupProcess.fields[fieldIndex];
      if (!field) {
        resolve();
        return;
      }

      // Phase 1: Appearing (immediate)
      setCleanupProcess(prev => ({
        ...prev,
        currentFieldIndex: fieldIndex,
        fields: prev.fields.map((f, i) => 
          i === fieldIndex ? { ...f, phase: "appearing" } : f
        )
      }));

      // Phase 2: Deleting (after 500ms delay)
      const deleteTimeout = setTimeout(() => {
        setCleanupProcess(prev => ({
          ...prev,
          fields: prev.fields.map((f, i) => 
            i === fieldIndex ? { ...f, phase: "deleting" } : f
          )
        }));

        // Phase 3: Deleted (after 250ms)
        const deletedTimeout = setTimeout(() => {
          setCleanupProcess(prev => ({
            ...prev,
            fields: prev.fields.map((f, i) => 
              i === fieldIndex ? { ...f, phase: "deleted", isCompleted: true } : f
            ),
            completedFields: prev.completedFields + 1
          }));

          // Complete after 200ms
          const completeTimeout = setTimeout(() => {
            resolve();
          }, 200);
          
          timeoutsRef.current.push(completeTimeout);
        }, 250);
        
        timeoutsRef.current.push(deletedTimeout);
      }, 500);
      
      timeoutsRef.current.push(deleteTimeout);
    });
  }, [cleanupProcess.fields]);

  /**
   * Executes the complete cleanup sequence
   */
  const executeCleanupSequence = React.useCallback(async (): Promise<boolean> => {
    if (!pageData) return false;

    try {
      // Validate required fields before cleanup
      const validation = validateRequiredFields(pageData);
      if (!validation.isValid) {
        toast.error(STEP13_TEXTS.errors.missingPageData, {
          id: STEP13_IDS.toasts.cleanupError,
          description: `Missing fields: ${validation.missingFields.join(', ')}`
        });
        return false;
      }

      // Create backup for rollback
      backupRef.current = deepCloneCategories(categories);

      // Show start toast
      toast.loading(STEP13_TEXTS.cleanup.states.active, {
        id: STEP13_IDS.toasts.cleanupStart,
      });

      // Execute field animations sequentially
      for (let i = 0; i < cleanupProcess.fields.length; i++) {
        await animateFieldCleanup(i);
      }

      // Perform actual data cleanup
      const cleanedData = cleanupPageData(pageData);
      const updatedCategories = replacePageInCategories(categories, cleanedData as PageData);
      
      // Optimistically update UI
      setCategories(updatedCategories);
      
      // Persist changes
      const error = await updateCategories();
      
      if (error) {
        throw new Error("Failed to save cleaned data");
      }

      // Generate success message
      const summary = getCleanupSummary(pageData);
      const successMessage = generateSuccessMessage(summary.totalPreserved, summary.totalRemoved);

      // Show success toast
      toast.success(STEP13_TEXTS.success.cleanupCompleted, {
        id: STEP13_IDS.toasts.cleanupSuccess,
        description: successMessage
      });

      return true;

    } catch (error) {
      console.error("Cleanup error:", error);
      
      // Rollback on error
      if (backupRef.current) {
        setCategories(backupRef.current);
        toast.warning(STEP13_TEXTS.cleanup.states.error, {
          id: STEP13_IDS.toasts.cleanupRollback,
          description: "Changes have been rolled back"
        });
      }

      // Show error toast
      toast.error(STEP13_TEXTS.errors.cleanupFailed, {
        id: STEP13_IDS.toasts.cleanupError,
        description: STEP13_TEXTS.errors.descriptions.cleanupFailed
      });

      return false;
    } finally {
      // Clear start loading toast
      toast.dismiss(STEP13_IDS.toasts.cleanupStart);
    }
  }, [pageData, categories, setCategories, updateCategories, cleanupProcess.fields, animateFieldCleanup]);

  /**
   * Starts the cleanup process
   */
  const startCleanup = React.useCallback(async (): Promise<boolean> => {
    if (!canStartCleanup) return false;

    setCleanupProcess(prev => ({
      ...prev,
      isActive: true,
      currentFieldIndex: 0,
      completedFields: 0,
      fields: prev.fields.map(f => ({ ...f, phase: "idle", isCompleted: false }))
    }));

    const success = await executeCleanupSequence();
    
    setCleanupProcess(prev => ({
      ...prev,
      isActive: false
    }));

    return success;
  }, [canStartCleanup, executeCleanupSequence]);

  /**
   * Stops the cleanup process
   */
  const stopCleanup = React.useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];

    // Rollback if needed
    if (backupRef.current && cleanupProcess.isActive) {
      setCategories(backupRef.current);
    }

    setCleanupProcess(prev => ({
      ...prev,
      isActive: false,
      currentFieldIndex: 0,
      fields: prev.fields.map(f => ({ ...f, phase: "idle", isCompleted: false }))
    }));

    toast.info("Cleanup process stopped", {
      id: STEP13_IDS.toasts.cleanupError
    });
  }, [cleanupProcess.isActive, setCategories]);

  /**
   * Resets cleanup state
   */
  const resetCleanup = React.useCallback(() => {
    if (cleanupProcess.isActive) {
      stopCleanup();
      return;
    }

    setCleanupProcess(prev => ({
      ...prev,
      currentFieldIndex: 0,
      completedFields: 0,
      fields: prev.fields.map(f => ({ ...f, phase: "idle", isCompleted: false }))
    }));
  }, [cleanupProcess.isActive, stopCleanup]);

  return {
    // State
    cleanupProcess,
    isCleanupActive,
    isCleanupCompleted,
    canStartCleanup, // Now guaranteed to be boolean
    
    // Actions
    startCleanup,
    stopCleanup,
    resetCleanup,
    
    // Info
    estimatedDuration,
    fieldsToClean,
    currentProgress,
  };
}
