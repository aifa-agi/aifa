// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_components)/admin-page-info.tsx

"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  FileText,
  Globe,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  Hash,
  Target,
} from "lucide-react";
import { UserType } from "@prisma/client";

import { PageNotFound } from "../../../../page-not-found";
import { AdminPageInfoProps } from "../(_types)/admin-page-types";
import { useSystemFields } from "../(_hooks)/use-system-fields";
import { useKeywordsField } from "../(_hooks)/use-keywords-field";
import {
  EDITABLE_SYSTEM_FIELDS,
  SYSTEM_FIELDS_CONFIG,
  KEYWORDS_FIELD_CONFIG,
  FIELD_GROUPS,
} from "../(_constants)/system-fields-config";
import { EditableSystemFields } from "./editable-system-fields";
import { EditableKeywordsField } from "./editable-keywords-field";
import { useAdminPageData } from "../../../../../(_hooks)/use-admin-page-data";

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

  if (categoryTitle.toLowerCase() === "root" && url.startsWith("/root/")) {
    return url.replace("/root/", "/");
  }

  return url;
};

/**
 * Main AdminPageInfo component that displays comprehensive page information
 * with inline editing capabilities for all editable fields including title, description, and keywords
 *
 * Updated to support:
 * - Editable title and description fields
 * - Keywords management with add/remove functionality (with Cyrillic support)
 * - Organized field groups for better UX
 * - Enhanced system instructions editing
 * - Full-width keywords container
 */
export function AdminPageInfo({ slug }: AdminPageInfoProps) {
  // Get page data using centralized hook
  const { page, category, loading, initialized, error, userRole } =
    useAdminPageData(slug);

  // ALWAYS call hooks in the same order - pass potentially null values safely
  const systemFieldsHook = useSystemFields({
    page: page || null,
    categoryTitle: category?.title || "",
    slug,
  });

  // Initialize keywords field hook for keywords management
  const keywordsFieldHook = useKeywordsField({
    page: page || null,
    categoryTitle: category?.title || "",
    slug,
  });

  // Show loading state with theme-aware colors
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">Loading page data...</span>
      </div>
    );
  }

  // Show error state if page not found or error occurred
  if (error || !page || !category) {
    console.error("AdminPageInfo error:", {
      error,
      hasPage: !!page,
      hasCategory: !!category,
    });
    return <PageNotFound slug={slug} />;
  }

  // Format category and URL for special cases
  const displayCategory = formatCategoryDisplay(category.title);
  const displayUrl = formatUrlDisplay(page.href || "", category.title);

  console.log("AdminPageInfo rendering:", {
    pageId: page.id,
    categoryTitle: category.title,
    userRole,
    systemFieldsCanEdit: systemFieldsHook.canEdit,
    keywordsFieldCanEdit: keywordsFieldHook.canEdit,
  });

  return (
    <div className="space-y-6">
      {/* Admin Access Indicator */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="size-6 text-primary shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground">
              Administrative Access
            </h3>
            <p className="text-xs text-muted-foreground">
              Current role:{" "}
              <span className="font-mono text-foreground bg-muted px-2 py-1 rounded">
                {userRole}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Page Header - Shows current title with edit capabilities */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl font-bold text-foreground truncate">
              {page.title || page.linkName}
            </h1>
            {page.hasBadge && page.badgeName && (
              <Badge variant="secondary" className="shrink-0">
                {page.badgeName}
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
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
        </div>

        <div className="flex items-center gap-2 shrink-0">
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

      {/* Basic Information - Now with editable fields */}
      {page && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="size-5" />
            <h2 className="text-lg font-semibold text-foreground">
              {FIELD_GROUPS.BASIC_INFO.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {FIELD_GROUPS.BASIC_INFO.description}
            </p>
            {!systemFieldsHook.canEdit && (
              <Badge variant="outline" className="text-xs">
                <AlertCircle className="size-3 mr-1" />
                Read Only
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Render editable basic information fields */}
            {FIELD_GROUPS.BASIC_INFO.fields.map((fieldKey) => {
              const config = SYSTEM_FIELDS_CONFIG[fieldKey];
              const currentValue = page[
                fieldKey as keyof typeof page
              ] as string;

              return (
                <EditableSystemFields
                  key={fieldKey}
                  config={config}
                  currentValue={currentValue}
                  isEditing={systemFieldsHook.editingField === fieldKey}
                  editingValue={systemFieldsHook.editingValue}
                  isUpdating={systemFieldsHook.isUpdating}
                  canEdit={systemFieldsHook.canEdit}
                  onStartEdit={systemFieldsHook.startEditing}
                  onCancel={systemFieldsHook.cancelEditing}
                  onSave={systemFieldsHook.saveField}
                  onValueChange={systemFieldsHook.updateValue}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Keywords Section - Editable - FIXED: Full width container */}
      {page && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="size-5" />
            <h2 className="text-lg font-semibold text-foreground">
              {FIELD_GROUPS.METADATA.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {FIELD_GROUPS.METADATA.description}
            </p>
            {!keywordsFieldHook.canEdit && (
              <Badge variant="outline" className="text-xs">
                <AlertCircle className="size-3 mr-1" />
                Read Only
              </Badge>
            )}
          </div>

          {/* FIXED: Removed max-w-2xl to allow full width usage */}
          <div className="w-full">
            <EditableKeywordsField
              config={KEYWORDS_FIELD_CONFIG.keywords}
              currentKeywords={page.keywords || []}
              keywordsHook={keywordsFieldHook}
            />
          </div>
        </div>
      )}

      {/* Page Details Grid - Status & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Type & Basic Info */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Content Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Content Type
                </label>
                <Badge variant="outline" className="text-sm">
                  {page.type}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Display Order
                  </label>
                  <div className="text-sm text-foreground">
                    {page.order ?? "No order set"}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Keywords Count
                  </label>
                  <div className="text-sm text-foreground">
                    {page.keywords?.length || 0} keywords
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Page ID
                </label>
                <code className="text-xs text-muted-foreground break-all block bg-muted p-2 rounded">
                  {page.id}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Settings */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              Status & Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">
                System Integrations
              </label>
              <div className="flex flex-wrap gap-2">
                {page.isVectorConnected && (
                  <Badge variant="secondary" className="text-xs">
                    Vector Store
                  </Badge>
                )}
                {page.isChatSynchronized && (
                  <Badge variant="secondary" className="text-xs">
                    Chat System
                  </Badge>
                )}
                {page.isAddedToPrompt && (
                  <Badge variant="secondary" className="text-xs">
                    AI Prompt
                  </Badge>
                )}
                {!page.isVectorConnected &&
                  !page.isChatSynchronized &&
                  !page.isAddedToPrompt && (
                    <span className="text-xs text-muted-foreground italic">
                      No active integrations
                    </span>
                  )}
              </div>
            </div>

            {page.roles && page.roles.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">
                  Access Permissions
                </label>
                <div className="flex flex-wrap gap-2">
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

      {/* System Instructions - Only AI guidance fields */}
      {page && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="size-5" />
            <h2 className="text-lg font-semibold text-foreground">
              {FIELD_GROUPS.SYSTEM_INSTRUCTIONS.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {FIELD_GROUPS.SYSTEM_INSTRUCTIONS.description}
            </p>
            {!systemFieldsHook.canEdit && (
              <Badge variant="outline" className="text-xs">
                <AlertCircle className="size-3 mr-1" />
                Read Only
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Render system instruction fields (excluding title/description) */}
            {FIELD_GROUPS.SYSTEM_INSTRUCTIONS.fields.map((fieldKey) => {
              const config = SYSTEM_FIELDS_CONFIG[fieldKey];
              const currentValue = page[
                fieldKey as keyof typeof page
              ] as string;

              return (
                <EditableSystemFields
                  key={fieldKey}
                  config={config}
                  currentValue={currentValue}
                  isEditing={systemFieldsHook.editingField === fieldKey}
                  editingValue={systemFieldsHook.editingValue}
                  isUpdating={systemFieldsHook.isUpdating}
                  canEdit={systemFieldsHook.canEdit}
                  onStartEdit={systemFieldsHook.startEditing}
                  onCancel={systemFieldsHook.cancelEditing}
                  onSave={systemFieldsHook.saveField}
                  onValueChange={systemFieldsHook.updateValue}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Images Section */}
      {page.images && page.images.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Associated Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {page.images.map((image: any, index: number) => (
                <div
                  key={image.id || index}
                  className="border border-border rounded-lg p-3 bg-card"
                >
                  {image.href ? (
                    <img
                      src={image.href}
                      alt={image.alt || `Page image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md mb-3"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                      <FileText className="size-8 text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground break-words">
                    {image.alt || `Image ${index + 1} - No description`}
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
