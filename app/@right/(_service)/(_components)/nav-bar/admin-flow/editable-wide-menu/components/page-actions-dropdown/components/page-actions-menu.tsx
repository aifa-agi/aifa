// @/app/(_service)/components/nav-bar/admin-flow/page-actions-dropdown/components/page-actions-menu.tsx

import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageDataStatus, PageActionsHook } from "../types";
import { StatusIndicator } from "../status-indicator";
import { usePageBodyStatus } from "../hooks/use-page-body-status";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { useModal } from "@/app/@right/(_service)/(_context)/modal-context";

interface PageActionsMenuProps
  extends PageDataStatus,
  Pick<
    PageActionsHook,
    | "handleAddTitle"
    | "handleAddDescription"
    | "handleAddImages"
    | "handleAddKeywords"
    | "handleAddPageCode"
  > {
  currentPageData: PageData | null;
  hasUnsavedChanges?: boolean;
}

export function PageActionsMenu({
  hasTitleData,
  hasDescriptionData,
  hasImagesData,
  hasKeywordsData,
  handleAddTitle,
  handleAddDescription,
  handleAddImages,
  handleAddKeywords,
  handleAddPageCode,
  currentPageData,
  hasUnsavedChanges = false,
}: PageActionsMenuProps) {
  const router = useRouter();
  const { closeModal } = useModal(); // Use modal context

  const { isClickable, isBlocked, getIndicatorColorClass, getButtonMessage } =
    usePageBodyStatus({
      currentPageData,
      dataStatus: {
        hasTitleData,
        hasDescriptionData,
        hasImagesData,
        hasKeywordsData,
      },
      hasUnsavedChanges,
    });

  const handlePageBodyClick = () => {
    // If blocked by unsaved changes, show warning toast
    if (isBlocked) {
      toast.warning(
        "Please save changes before entering page body editing mode",
        {
          description:
            "You have unsaved changes in the navigation menu. Save them first to avoid data conflicts.",
          duration: 4000,
        }
      );
      return;
    }

    // If clickable and has linkName, close modal and navigate to edit page
    if (isClickable && currentPageData?.linkName) {
      // Close modal using context (this also handles body overflow reset)
      closeModal();

      const url = `/admin/pages/${currentPageData.linkName}`;
      router.push(url);
      return;
    }

    // Default fallback to original handler
    handleAddPageCode();
  };

  return (
    <>
      <DropdownMenuItem onClick={handleAddTitle} className="flex items-center">
        <StatusIndicator isActive={hasTitleData} />
        <span>{hasTitleData ? "Edit Title" : "Add Title"}</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={handleAddDescription}
        className="flex items-center"
      >
        <StatusIndicator isActive={hasDescriptionData} />
        <span>
          {hasDescriptionData ? "Edit Description" : "Add Description"}
        </span>
      </DropdownMenuItem>

      <DropdownMenuItem onClick={handleAddImages} className="flex items-center">
        <StatusIndicator isActive={hasImagesData} />
        <span>{hasImagesData ? "Edit Images" : "Add Images"}</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={handleAddKeywords}
        className="flex items-center"
      >
        <StatusIndicator isActive={hasKeywordsData} />
        <span>{hasKeywordsData ? "Edit Keywords" : "Add Keywords"}</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={handlePageBodyClick}
        className={cn(
          "flex items-center",
          isClickable ? "cursor-pointer" : "cursor-default",
          isBlocked && "text-yellow-600 dark:text-yellow-400"
        )}
      >
        <span
          className={cn(
            "inline-block w-1 h-1 mr-3 rounded-full",
            getIndicatorColorClass()
          )}
          style={{
            width: "4px",
            height: "4px",
            minWidth: "4px",
            minHeight: "4px",
          }}
        />
        <span className="flex-1">{getButtonMessage()}</span>
        {isBlocked && <AlertCircle className="w-3 h-3 ml-2 text-yellow-500" />}
      </DropdownMenuItem>
    </>
  );
}
