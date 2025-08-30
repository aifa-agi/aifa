// @/app/(_service)/components/nav-bar/admin-flow/page-actions-dropdown/components/page-actions-menu.tsx
// Comments: Updated component to handle default values properly.
// Shows green dot for defaults, yellow warning only when explicitly needed.

import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageDataStatus, PageActionsHook } from "../types";
import { StatusIndicator } from "../status-indicator";
import { usePageBodyStatus } from "../hooks/use-page-body-status";
import { useEffect, useState } from "react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { useModal } from "@/app/@right/(_service)/(_context)/modal-context";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

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

// Comments: Small helper to render the 4px dot with dynamic color.
function TinyDot({ colorClass }: { colorClass: string }) {
  return (
    <span
      className={cn("inline-block rounded-full mr-3", colorClass)}
      style={{ width: "4px", height: "4px", minWidth: "4px", minHeight: "4px" }}
    />
  );
}

// Comments: Updated hook for env status fetch with default value handling.
function useEnvStatus() {
  const [siteNamePresent, setSiteNamePresent] = useState<boolean | null>(null);
  const [logoPresent, setLogoPresent] = useState<boolean | null>(null);
  const [siteNameFromEnv, setSiteNameFromEnv] = useState<boolean>(false);
  const [logoFromEnv, setLogoFromEnv] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/env-check", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Env check failed: ${res.status}`);
        }
        const data: {
          siteName: string;
          logoUrl: string;
          siteNameFromEnv: boolean;
          logoUrlFromEnv: boolean;
        } = await res.json();

        if (!cancelled) {
          // Values are always present (either from env or defaults)
          setSiteNamePresent(true);
          setLogoPresent(true);
          // Track if they come from environment or are defaults
          setSiteNameFromEnv(data.siteNameFromEnv);
          setLogoFromEnv(data.logoUrlFromEnv);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          // In case of error, treat as missing
          setSiteNamePresent(false);
          setLogoPresent(false);
          setSiteNameFromEnv(false);
          setLogoFromEnv(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    siteNamePresent,
    logoPresent,
    siteNameFromEnv,
    logoFromEnv,
    loading,
  };
}

// Comments: Updated UI item for env check with default value info.
function EnvCheckItem({
  label,
  isPresent,
  isFromEnv,
  onInfoClick,
}: {
  label: string;
  isPresent: boolean | null;
  isFromEnv: boolean;
  onInfoClick: () => void;
}) {
  // Loading state: keep neutral styling to avoid flicker.
  if (isPresent === null) {
    return (
      <DropdownMenuItem className="flex items-center cursor-default opacity-70">
        <TinyDot colorClass="bg-muted-foreground/40" />
        <span className="flex-1">{label}</span>
      </DropdownMenuItem>
    );
  }

  // Not present (error state): red warning
  if (!isPresent) {
    return (
      <DropdownMenuItem
        onClick={onInfoClick}
        className={cn("flex items-center", "text-red-700 dark:text-red-400")}
      >
        <TinyDot colorClass="bg-red-500" />
        <span className="flex-1">{label}</span>
        <AlertCircle className="w-3 h-3 ml-2 text-red-500" />
      </DropdownMenuItem>
    );
  }

  // Present: different styling based on source
  if (isFromEnv) {
    // From environment variable: bright green dot
    return (
      <DropdownMenuItem className="flex items-center">
        <TinyDot colorClass="bg-green-600" />
        <span className="flex-1">{label}</span>
      </DropdownMenuItem>
    );
  } else {
    // Using default value: orange dot with info click
    return (
      <DropdownMenuItem
        onClick={onInfoClick}
        className="flex items-center cursor-pointer"
      >
        <TinyDot colorClass="bg-orange-500" />
        <span className="flex-1">{label} (default)</span>
      </DropdownMenuItem>
    );
  }
}

export function HomeActionsMenu({
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
  const { closeModal } = useModal();

  // Comments: Load environment presence states once when menu mounts.
  const { siteNamePresent, logoPresent, siteNameFromEnv, logoFromEnv } =
    useEnvStatus();

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
    if (isBlocked) {
      toast.warning(
        "Please save changes before entering page body editing mode",
        {
          description:
            "You have unsaved changes in the navigation menu. Save them first to avoid data conflicts.",
        }
      );
      return;
    }

    if (isClickable && currentPageData?.linkName) {
      closeModal();
      const url = `/admin/pages/${currentPageData.linkName}`;
      router.push(url);
      return;
    }

    handleAddPageCode();
  };

  // Comments: Info handlers for default values and warnings.
  const handleSiteNameInfo = () => {
    if (!siteNamePresent) {
      toast.error("Failed to load site name configuration.", {
        description:
          "Check your environment setup and try refreshing the page.",
      });
    } else if (!siteNameFromEnv) {
      toast.info("Using default site name.", {
        description:
          "Set SITE_NAME environment variable to customize: 'Aifa Blog Starter for GitHub and AI'",
      });
    }
  };

  const handleLogoInfo = () => {
    if (!logoPresent) {
      toast.error("Failed to load logo configuration.", {
        description:
          "Check your environment setup and try refreshing the page.",
      });
    } else if (!logoFromEnv) {
      toast.info("Using default logo.", {
        description:
          "Set SITE_LOGO_URL environment variable to customize. **Use only the link you get when uploading the image. The image must be saved with the name Logo.** Use minimum image size, no more than 20kB.",
      });
    }
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

      {/* Updated: Site Name check with default handling */}
      <EnvCheckItem
        label="Site Name"
        isPresent={siteNamePresent}
        isFromEnv={siteNameFromEnv}
        onInfoClick={handleSiteNameInfo}
      />

      {/* Updated: Logo check with default handling */}
      <EnvCheckItem
        label="Logo"
        isPresent={logoPresent}
        isFromEnv={logoFromEnv}
        onInfoClick={handleLogoInfo}
      />

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
  const { closeModal } = useModal();

  // Comments: Load environment presence states once when menu mounts.
  const { siteNamePresent, logoPresent, siteNameFromEnv, logoFromEnv } =
    useEnvStatus();

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
    if (isBlocked) {
      toast.warning(
        "Please save changes before entering page body editing mode",
        {
          description:
            "You have unsaved changes in the navigation menu. Save them first to avoid data conflicts.",
        }
      );
      return;
    }

    if (isClickable && currentPageData?.linkName) {
      closeModal();
      const url = `/admin/pages/${currentPageData.linkName}`;
      router.push(url);
      return;
    }

    handleAddPageCode();
  };

  const handleSiteNameInfo = () => {
    if (!siteNamePresent) {
      toast.error("Failed to load site name configuration.", {
        description:
          "Check your environment setup and try refreshing the page.",
      });
    } else if (!siteNameFromEnv) {
      toast.info("Using default site name.", {
        description:
          "Set SITE_NAME environment variable to customize: 'Aifa Blog Starter for GitHub and AI'",
      });
    }
  };

  const handleLogoInfo = () => {
    if (!logoPresent) {
      toast.error("Failed to load logo configuration.", {
        description:
          "Check your environment setup and try refreshing the page.",
      });
    } else if (!logoFromEnv) {
      toast.info("Using default logo.", {
        description:
          "Set SITE_LOGO_URL environment variable to customize. **Use only the link you get when uploading the image. The image must be saved with the name Logo.** Use minimum image size, no more than 20kB.",
      });
    }
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

      {/* Updated: Site Name check with default handling */}
      <EnvCheckItem
        label="Site Name"
        isPresent={siteNamePresent}
        isFromEnv={siteNameFromEnv}
        onInfoClick={handleSiteNameInfo}
      />

      {/* Updated: Logo check with default handling */}
      <EnvCheckItem
        label="Logo"
        isPresent={logoPresent}
        isFromEnv={logoFromEnv}
        onInfoClick={handleLogoInfo}
      />

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
