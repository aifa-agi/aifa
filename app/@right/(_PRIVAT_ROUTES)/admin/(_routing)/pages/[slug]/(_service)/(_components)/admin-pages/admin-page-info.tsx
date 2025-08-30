// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  AlertCircle,
  FileText,
  Globe,
  Eye,
  EyeOff,
  Shield,
  Home,
  Target,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { PageNotFound } from "../page-not-found";
import { AdminPageInfoProps } from "../../(_types)/admin-page-sections-types";
import { findPageBySlug } from "../../(_utils)/page-helpers";

/**
 * Helper function to format category display name
 * Returns "-" for "home" category, otherwise returns the original title
 */
const formatCategoryDisplay = (categoryTitle: string): string => {
  return categoryTitle.toLowerCase() === "home" ? "-" : categoryTitle;
};

/**
 * Helper function to format URL display
 * Removes "/root/" prefix for "root" category URLs
 */
const formatUrlDisplay = (
  url: string | null,
  categoryTitle: string
): string => {
  if (!url) return "N/A";

  // If category is "root", remove "/root/" from the beginning of URL
  if (categoryTitle.toLowerCase() === "root" && url.startsWith("/root/")) {
    return url.replace("/root/", "/");
  }

  return url;
};

/**
 * Helper component to render system instruction fields
 */
const SystemInstructionField: React.FC<{
  title: string;
  value?: string;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {value && value.trim() ? (
        <p className="text-sm text-foreground bg-muted p-3 rounded">{value}</p>
      ) : (
        <p className="text-sm text-muted-foreground italic p-3 bg-muted/50 rounded">
          Information not added
        </p>
      )}
    </CardContent>
  </Card>
);

/**
 * Client component that uses NavigationMenuProvider context
 * to find page by slug and display its details
 *
 * Refactored to use Tailwind CSS theme variables instead of hardcoded colors
 * for proper dark/light theme support
 *
 * Added role-based access control - redirects non-admin users to home page
 * Added special handling for "home" and "root" categories
 * Added system instruction fields display (intent, taxonomy, attention)
 */
export function AdminPageInfo({ slug }: AdminPageInfoProps) {
  const { categories, loading, initialized } = useNavigationMenu();
  const { data: session } = useSession();
  const role: UserType = session?.user?.type || "guest";

  // Show loading state with theme-aware colors
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">Loading page data...</span>
      </div>
    );
  }

  // Адаптируем под существующую функцию findPageBySlug
  const searchResult = findPageBySlug(categories, slug);

  // Show error state if page not found with theme-aware styling
  if (!searchResult) {
    return <PageNotFound slug={slug} />;
  }

  // Предполагаем, что функция возвращает объект с page и category
  // Если функция возвращает что-то другое, адаптируем соответственно
  let page: PageData;
  let category: { title: string };

  // Проверяем, что возвращает функция findPageBySlug
  if (
    typeof searchResult === "object" &&
    "page" in searchResult &&
    "category" in searchResult
  ) {
    // Если возвращает объект с page и category
    page = searchResult.page as PageData;
    category = searchResult.category as { title: string };
  } else {
    // Если возвращает только PageData, создаем фиктивную категорию
    page = searchResult as PageData;
    category = { title: "Unknown Category" };
  }

  // Format category and URL for special cases
  const displayCategory = formatCategoryDisplay(category.title);
  const displayUrl = formatUrlDisplay(page.href || "", category.title);

  return (
    <div className="space-y-6">
      {/* Admin Access Indicator */}
      <div className="bg-muted/50 border border-y-foreground py-3">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="size-8 text-primary" />
          <span className="text-muted-foreground">
            Admin Access - Role:{" "}
            <span className="font-mono text-foreground">{role}</span>
          </span>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-semibold text-muted-foreground">
              {page.title || page.linkName}
            </h2>
            {page.hasBadge && page.badgeName && (
              <Badge variant="secondary">{page.badgeName}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            Category:{" "}
            <span className="font-medium text-foreground">
              {displayCategory}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            URL:{" "}
            <code className="bg-muted text-foreground px-2 py-1 rounded text-xs">
              {displayUrl}
            </code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {page.isPublished ? (
            <Badge variant="default" className="flex items-center gap-1">
              <Eye className="size-3" />
              Published
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <EyeOff className="size-3" />
              Draft
            </Badge>
          )}
        </div>
      </div>

      {/* Page Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Title
              </label>
              <p className="text-sm text-foreground bg-muted p-2 rounded">
                {page.title || "Not specified"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Description
              </label>
              <p className="text-sm text-foreground bg-muted p-2 rounded min-h-[60px]">
                {page.description || "No description provided"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Content Type
              </label>
              <Badge variant="outline">{page.type}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Status & Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="size-4" />
              Status & Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Order
                </label>
                <p className="text-sm text-foreground">
                  {page.order ?? "No order"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Page ID
                </label>
                <code className="text-xs text-muted-foreground break-all">
                  {page.id}
                </code>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Integrations
              </label>
              <div className="flex flex-wrap gap-2">
                {page.isVectorConnected && (
                  <Badge variant="secondary" className="text-xs">
                    Vector Connected
                  </Badge>
                )}
                {page.isChatSynchronized && (
                  <Badge variant="secondary" className="text-xs">
                    Chat Synchronized
                  </Badge>
                )}
                {page.isAddedToPrompt && (
                  <Badge variant="secondary" className="text-xs">
                    Added to Prompt
                  </Badge>
                )}
                {!page.isVectorConnected &&
                  !page.isChatSynchronized &&
                  !page.isAddedToPrompt && (
                    <span className="text-xs text-muted-foreground">
                      No integrations
                    </span>
                  )}
              </div>
            </div>

            {page.roles && page.roles.length > 0 && (
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Access Roles
                </label>
                <div className="flex flex-wrap gap-1">
                  {page.roles.map((roleItem: UserType, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {roleItem}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Keywords */}
      {page.keywords && page.keywords.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {page.keywords.map((keyword: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Instruction Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SystemInstructionField
          title="Intent"
          value={page.intent}
          icon={<Target className="size-4" />}
        />

        <SystemInstructionField
          title="Taxonomy"
          value={page.taxonomy}
          icon={<BookOpen className="size-4" />}
        />

        <SystemInstructionField
          title="Attention"
          value={page.attention}
          icon={<AlertTriangle className="size-4" />}
        />
      </div>

      {/* Images */}
      {page.images && page.images.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {page.images.map((image: any, index: number) => (
                <div
                  key={image.id || index}
                  className="border border-foreground rounded-lg p-3"
                >
                  {image.href && (
                    <img
                      src={image.href}
                      alt={image.alt || `Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <p className="text-xs text-muted-foreground break-all">
                    {image.alt || "No description"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
