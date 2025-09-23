// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_components)/step13-status-card.tsx

"use client";

/**
 * Step13StatusCard:
 * Data status card with field existence dropdown, statistics display.
 * Uses consistent styling patterns and integrates with useStep13Status hook.
 * Shows field-by-field status with Exists/Not Exists indicators.
 * 
 * Understanding of the task (step-by-step):
 * 1) Display data status title and description
 * 2) Show dropdown list with field status indicators
 * 3) Display statistics (required vs optional fields)
 * 4) Use Exists/Not Exists status labels with colors
 * 5) Integrate with useStep13Status hook for reactive updates
 * 6) Maintain identical design patterns (colors, borders, fonts)
 */

import * as React from "react";
import { useStep13Status } from "../(_hooks)/use-step13-status";
import { STEP13_TEXTS } from "../(_constants)/step13-texts";
import { STEP13_IDS } from "../(_constants)/step13-ids";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface Step13StatusCardProps {
    pageData: PageData | null;
}

export function Step13StatusCard({ pageData }: Step13StatusCardProps) {
    const {
        fieldStatuses,
        formattedStatuses,
        stats,
        hasAllRequiredFields,
        isDataComplete,
        validationResult,
    } = useStep13Status({ pageData });

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [selectedField, setSelectedField] = React.useState<string | null>(null);

    // Toggle dropdown
    const toggleDropdown = React.useCallback(() => {
        setIsDropdownOpen(prev => !prev);
    }, []);

    // Close dropdown when clicking outside
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Status summary message
    const statusMessage = React.useMemo(() => {
        if (!pageData) {
            return "No page data available";
        }

        if (hasAllRequiredFields && isDataComplete) {
            return STEP13_TEXTS.status.messages.allFieldsPresent;
        }

        if (!validationResult.isValid) {
            return STEP13_TEXTS.status.messages.missingFields;
        }

        return STEP13_TEXTS.status.messages.optionalFieldsOnly;
    }, [pageData, hasAllRequiredFields, isDataComplete, validationResult.isValid]);

    // Status indicator color
    const statusColor = React.useMemo(() => {
        if (!pageData) return "text-neutral-500";
        if (hasAllRequiredFields) return "text-emerald-600 dark:text-emerald-400";
        if (!validationResult.isValid) return "text-red-600 dark:text-red-400";
        return "text-orange-600 dark:text-orange-400";
    }, [pageData, hasAllRequiredFields, validationResult.isValid]);

    return (
        <div
            className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40"
            id={STEP13_IDS.containers.statusCard}
        >
            {/* Header Section */}
            <div className="flex items-start gap-3 mb-4">
                <div className="mt-0.5 text-green-400">
                    <div
                        className="h-5 w-5 rounded-sm bg-green-500/30"
                        aria-hidden="true"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                        {STEP13_TEXTS.status.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {STEP13_TEXTS.status.description}
                    </p>
                </div>
            </div>

            {/* Status Summary */}
            <div className="mb-4 p-3 rounded-md bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50">
                <div className="flex items-center justify-between mb-2">
                    <p className={`text-sm font-medium ${statusColor}`}>
                        {statusMessage}
                    </p>
                    <div className="text-xs text-muted-foreground">
                        {stats.existingFields}/{stats.totalFields} fields
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                        <span>Required:</span>
                        <span className="font-medium">
                            {stats.requiredExisting}/{stats.requiredFields}
                            {stats.requiredMissing > 0 && (
                                <span className="text-red-500 ml-1">
                                    (-{stats.requiredMissing})
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Optional:</span>
                        <span className="font-medium">
                            {stats.optionalExisting}/{stats.optionalFields}
                        </span>
                    </div>
                </div>
            </div>

            {/* Field Status Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="w-full flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-foreground hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    id={STEP13_IDS.elements.statusDropdown}
                >
                    <span>
                        {selectedField
                            ? `${selectedField} Status`
                            : STEP13_TEXTS.status.dropdownPlaceholder
                        }
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                        <div className="py-1" id={STEP13_IDS.elements.statusList}>
                            {formattedStatuses.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                    No field data available
                                </div>
                            ) : (
                                formattedStatuses.map((field, index) => {
                                    const fieldStatus = fieldStatuses[index];
                                    const isRequired = fieldStatus?.isRequired;

                                    return (
                                        <div
                                            key={fieldStatus?.fieldName || index}
                                            className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                                            onClick={() => {
                                                setSelectedField(field.displayName);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {/* Status Icon */}
                                                    <span className="text-lg">
                                                        {field.icon}
                                                    </span>

                                                    {/* Field Name */}
                                                    <span className="text-sm font-medium text-foreground">
                                                        {field.displayName}
                                                    </span>

                                                    {/* Required Badge */}
                                                    {isRequired && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                            Required
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Status Text */}
                                                <span className={`text-xs font-medium ${field.statusColor}`}>
                                                    {field.statusText}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Missing Required Fields Warning */}
            {!validationResult.isValid && validationResult.missingFields.length > 0 && (
                <div className="mt-3 p-2 rounded-md bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800/30">
                    <p className="text-xs font-medium text-red-800 dark:text-red-300 mb-1">
                        Missing Required Fields:
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {validationResult.missingFields.map((field, index) => (
                            <span
                                key={index}
                                className="inline-flex px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-800/50 dark:text-red-300"
                            >
                                {field}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
