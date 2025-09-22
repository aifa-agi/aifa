// File: app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/components/content-metadata-selector.tsx
"use client";

/**
 * ContentMetadataSelector:
 * - Handles authors selection for content pages
 * - Multi-select functionality for authors with avatar display
 * - Uses first image from author's images array with placeholder fallback
 * - Follows the exact styling patterns from the personalization panel
 * - Integrated removal functionality with visual indicators
 * - Simplified: Removed tags functionality - authors only
 */

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    X,
    Plus
} from "lucide-react";

// Import types
import type { PageAuthors } from "@/app/@right/(_service)/(_types)/page-types";

interface MetadataConfig {
    selectedAuthors: string[];
}

interface ContentMetadataSelectorProps {
    /** Currently selected authors */
    selectedAuthors: string[];
    /** Available authors list */
    availableAuthors: PageAuthors[];
    /** Callback when metadata changes */
    onMetadataChange: (config: MetadataConfig) => void;
    /** Additional CSS classes */
    className?: string;
}

export function ContentMetadataSelector({
    selectedAuthors,
    availableAuthors,
    onMetadataChange,
    className = ""
}: ContentMetadataSelectorProps) {

    // Helper function to get author image with fallback
    const getAuthorImageSrc = (author: PageAuthors): string => {
        return author.image?.[0]?.href || "/placeholder.svg";
    };

    // Handle author selection
    const handleAuthorSelect = (authorId: string) => {
        if (authorId === "placeholder") return;

        if (!selectedAuthors.includes(authorId)) {
            const updatedAuthors = [...selectedAuthors, authorId];
            onMetadataChange({
                selectedAuthors: updatedAuthors
            });
        }
    };

    // Handle author removal
    const handleAuthorRemove = (authorToRemove: string) => {
        const updatedAuthors = selectedAuthors.filter(authorId => authorId !== authorToRemove);
        onMetadataChange({
            selectedAuthors: updatedAuthors
        });
    };

    // Get available authors for selection (exclude already selected)
    const availableAuthorsForSelection = availableAuthors.filter(author => !selectedAuthors.includes(author.id));

    // Get selected author objects
    const selectedAuthorObjects = selectedAuthors.map(id =>
        availableAuthors.find(author => author.id === id)
    ).filter(Boolean) as PageAuthors[];

    return (
        <Card className={`w-full rounded-md border border-orange-200 bg-orange-50/60 shadow-sm dark:border-orange-800/60 dark:bg-orange-900/40 ${className}`}>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <User className="size-5 text-orange-600 dark:text-orange-400" />
                    <CardTitle className="text-lg truncate">Content Authors</CardTitle>
                    <div className="ml-auto flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            {selectedAuthors.length} authors
                        </Badge>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                    Select authors for content attribution and management
                </p>
            </CardHeader>
            <CardContent>
                {/* Authors Selection Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="size-4 text-orange-600 dark:text-orange-400" />
                        <Label className="text-sm font-medium truncate">
                            Content Authors
                        </Label>
                    </div>

                    {/* Authors Selector */}
                    <Select onValueChange={handleAuthorSelect} value="placeholder">
                        <SelectTrigger className="truncate">
                            <SelectValue placeholder="Add authors..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="placeholder" disabled className="truncate">
                                Select an author to add
                            </SelectItem>
                            {availableAuthorsForSelection.map((author) => (
                                <SelectItem key={author.id} value={author.id} className="truncate">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="size-6">
                                            <AvatarImage
                                                src={getAuthorImageSrc(author)}
                                                alt={author.image?.[0]?.alt || author.name}
                                            />
                                            <AvatarFallback className="text-xs">
                                                {author.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Plus className="size-3" />
                                        <span className="font-medium truncate">{author.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Selected Authors Display */}
                    <div className="space-y-2">
                        {selectedAuthorObjects.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {selectedAuthorObjects.map((author) => (
                                    <div
                                        key={author.id}
                                        className="flex items-center gap-2 p-2 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900"
                                    >
                                        <Avatar className="size-8">
                                            <AvatarImage
                                                src={getAuthorImageSrc(author)}
                                                alt={author.image?.[0]?.alt || author.name}
                                            />
                                            <AvatarFallback className="text-xs">
                                                {author.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="flex-1 text-sm font-medium truncate">
                                            {author.name}
                                        </span>
                                        <Button
                                            onClick={() => handleAuthorRemove(author.id)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 hover:bg-orange-200 dark:hover:bg-orange-800"
                                        >
                                            <X className="size-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground italic truncate">
                                No authors selected yet
                            </p>
                        )}
                    </div>
                </div>

                {/* Authors Summary */}
                {selectedAuthors.length > 0 && (
                    <div className="mt-6 p-4 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950">
                        <h4 className="font-medium mb-3 text-foreground truncate">
                            Selected Authors Summary
                        </h4>
                        <div className="text-sm text-foreground/80">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Authors:</span>
                                <div className="flex items-center gap-2">
                                    {selectedAuthorObjects.map((author) => (
                                        <div key={author.id} className="flex items-center gap-1">
                                            <Avatar className="size-4">
                                                <AvatarImage
                                                    src={getAuthorImageSrc(author)}
                                                    alt={author.image?.[0]?.alt || author.name}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {author.name.substring(0, 1).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs truncate">{author.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
