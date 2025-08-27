// @/app/(_service)/contexts/nav-bar-provider.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  persistMenuCategories,
  isPersistSuccess,
  isGitHubError,
  isNetworkError,
  shouldRetry,
  getUserFriendlyMessage,
  type PersistMenuResult,
} from "../(_libs)/persist-menu";
import { toast } from "sonner";
import { OperationStatus } from "../(_types)/api-response-types";
import { fetchMenuCategories } from "../(_libs)/fetch-menu";
import { MenuCategory } from "../(_types)/menu-types";

/**
 * Extended error information for better error handling
 */
export interface OperationError {
  status: OperationStatus;
  message: string;
  canRetry: boolean;
  isNetworkError: boolean;
  isGitHubError: boolean;
  userMessage: string;
  environment?: "development" | "production";
}

interface NavigationMenuContextProps {
  categories: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  resetCategories: () => void;
  serverCategoriesRef: React.MutableRefObject<MenuCategory[]>;
  loading: boolean;
  dirty: boolean;
  updateCategories: () => Promise<OperationError | null>;
  refreshCategories: () => Promise<void>;
  initialized: boolean;
  lastOperationResult: PersistMenuResult | null;
  retryCount: number;
}

const NavigationMenuContext = createContext<
  NavigationMenuContextProps | undefined
>(undefined);

function isCategoriesEqual(a: MenuCategory[], b: MenuCategory[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function NavigationMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const serverCategoriesRef = useRef<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [lastOperationResult, setLastOperationResult] =
    useState<PersistMenuResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const dirty = !isCategoriesEqual(categories, serverCategoriesRef.current);

  const refreshCategories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchMenuCategories();
      if (result.status === "ok" && result.categories) {
        setCategories(result.categories);
        serverCategoriesRef.current = JSON.parse(
          JSON.stringify(result.categories)
        );
        setLastOperationResult(null); // Clear any previous operation results
        setRetryCount(0); // Reset retry count on successful refresh
      }
    } catch (error) {
      console.error("Failed to refresh categories:", error);
      toast.error("Failed to load menu categories");
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  const updateCategories =
    useCallback(async (): Promise<OperationError | null> => {
      setLoading(true);

      try {
        const result = await persistMenuCategories(categories);
        setLastOperationResult(result);

        if (isPersistSuccess(result)) {
          // Success - update server reference and reset retry count
          serverCategoriesRef.current = JSON.parse(JSON.stringify(categories));
          setRetryCount(0);

          // Show success message
          const userMessage = getUserFriendlyMessage(result);
          toast.success(userMessage);

          return null; // No error
        } else {
          // Operation failed - create detailed error information
          const operationError: OperationError = {
            status: result.status,
            message: result.message,
            canRetry: shouldRetry(result),
            isNetworkError: isNetworkError(result),
            isGitHubError: isGitHubError(result),
            userMessage: getUserFriendlyMessage(result),
            environment: result.environment,
          };

          // Increment retry count for failed operations
          setRetryCount((prev) => prev + 1);

          console.error("Failed to update categories:", {
            error: operationError,
            result: result,
            retryAttempt: retryCount + 1,
          });

          return operationError;
        }
      } catch (unexpectedError: any) {
        // This should not happen as persistMenuCategories handles all errors
        console.error("Unexpected error in updateCategories:", unexpectedError);

        const operationError: OperationError = {
          status: OperationStatus.UNKNOWN_ERROR,
          message: "Unexpected client-side error",
          canRetry: true,
          isNetworkError: true,
          isGitHubError: false,
          userMessage: "An unexpected error occurred. Please try again.",
          environment: "production",
        };

        setRetryCount((prev) => prev + 1);
        return operationError;
      } finally {
        setLoading(false);
      }
    }, [categories, retryCount]);

  const resetCategories = useCallback(async () => {
    await refreshCategories();
  }, [refreshCategories]);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  return (
    <NavigationMenuContext.Provider
      value={{
        categories,
        setCategories,
        resetCategories,
        serverCategoriesRef,
        loading,
        dirty,
        updateCategories,
        refreshCategories,
        initialized,
        lastOperationResult,
        retryCount,
      }}
    >
      {children}
    </NavigationMenuContext.Provider>
  );
}

export function useNavigationMenu() {
  const context = useContext(NavigationMenuContext);
  if (!context) {
    throw new Error(
      "useNavigationMenu must be used within a NavigationMenuProvider"
    );
  }
  return context;
}

/**
 * Custom hook for handling menu operations with automatic error handling
 */
export function useMenuOperations() {
  const {
    updateCategories,
    refreshCategories,
    loading,
    dirty,
    lastOperationResult,
    retryCount,
  } = useNavigationMenu();

  const handleUpdate = useCallback(async () => {
    const error = await updateCategories();

    if (error) {
      // Show appropriate error message
      if (error.isGitHubError) {
        toast.error(error.userMessage);
      } else if (error.isNetworkError) {
        toast.error(
          `${error.userMessage}${error.canRetry ? " You can try again." : ""}`
        );
      } else {
        toast.error(error.userMessage);
      }

      // Log detailed error information for debugging
      console.warn("Menu update failed:", {
        status: error.status,
        canRetry: error.canRetry,
        retryAttempt: retryCount,
        environment: error.environment,
      });

      return false; // Indicate failure
    }

    return true; // Indicate success
  }, [updateCategories, retryCount]);

  const handleRetry = useCallback(async () => {
    if (lastOperationResult && shouldRetry(lastOperationResult)) {
      return await handleUpdate();
    }
    return false;
  }, [handleUpdate, lastOperationResult]);

  const canRetry = lastOperationResult
    ? shouldRetry(lastOperationResult)
    : false;

  return {
    handleUpdate,
    handleRetry,
    canRetry,
    loading,
    dirty,
    retryCount,
    lastError:
      lastOperationResult && !isPersistSuccess(lastOperationResult)
        ? {
            status: lastOperationResult.status,
            message: getUserFriendlyMessage(lastOperationResult),
            canRetry: shouldRetry(lastOperationResult),
          }
        : null,
  };
}
