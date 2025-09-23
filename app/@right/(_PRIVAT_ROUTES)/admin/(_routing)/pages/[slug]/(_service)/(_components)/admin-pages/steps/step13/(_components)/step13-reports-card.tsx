// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_components)/step13-reports-card.tsx

"use client";

/**
 * Step13ReportsCard:
 * Reports management card with available reports count and download functionality.
 * Uses consistent styling patterns and shows report statistics.
 * Handles empty state when no reports are available.
 * 
 * Understanding of the task (step-by-step):
 * 1) Display reports title and description  
 * 2) Show count of available reports from finalReport array
 * 3) Provide download dropdown (placeholder functionality)
 * 4) Handle empty state (0 reports)
 * 5) Use finalReport?: string[] field from pageData
 * 6) Maintain identical design patterns (colors, borders, fonts)
 */

import * as React from "react";
import { formatReportCount, formatReportDate } from "../(_utils)/step13-helpers";
import { STEP13_TEXTS } from "../(_constants)/step13-texts";
import { STEP13_IDS } from "../(_constants)/step13-ids";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface Step13ReportsCardProps {
    pageData: PageData | null;
}

export function Step13ReportsCard({ pageData }: Step13ReportsCardProps) {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    // Extract reports from pageData.finalReport
    const reports = React.useMemo(() => {
        if (!pageData?.finalReport || !Array.isArray(pageData.finalReport)) {
            return [];
        }

        // Convert string array to report-like objects for UI
        return pageData.finalReport.map((reportId, index) => ({
            id: reportId,
            name: `Report ${index + 1}`,
            createdAt: pageData.updatedAt || new Date().toISOString(),
            type: "final" as const,
            status: "available" as const,
        }));
    }, [pageData?.finalReport, pageData?.updatedAt]);

    // Format report count for display
    const { count, displayText, hasReports } = formatReportCount(reports);

    // Toggle dropdown
    const toggleDropdown = React.useCallback(() => {
        if (hasReports) {
            setIsDropdownOpen(prev => !prev);
        }
    }, [hasReports]);

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

    // Handle download (placeholder functionality)
    const handleDownload = React.useCallback((reportId: string, reportName: string) => {
        // Placeholder - future implementation will handle actual download
        console.log(`Download requested for report: ${reportId} (${reportName})`);

        // Show placeholder toast
        // toast.info(`Download functionality coming soon for ${reportName}`, {
        //   id: STEP13_IDS.toasts.reportDownload
        // });

        setIsDropdownOpen(false);
    }, []);

    return (
        <div
            className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40"
            id={STEP13_IDS.containers.reportsCard}
        >
            {/* Header Section */}
            <div className="flex items-start gap-3 mb-4">
                <div className="mt-0.5 text-amber-400">
                    <div
                        className="h-5 w-5 rounded-sm bg-amber-500/30"
                        aria-hidden="true"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                        {STEP13_TEXTS.reports.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{count}</span> {displayText.toLowerCase()} for this page.
                    </p>
                </div>
            </div>

            {/* Reports Status */}
            <div className="mb-4 p-3 rounded-md bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${hasReports ? 'bg-emerald-400' : 'bg-neutral-400'}`} />
                        <span className="text-sm font-medium text-foreground">
                            {displayText}
                        </span>
                    </div>

                    {hasReports && pageData?.updatedAt && (
                        <span className="text-xs text-muted-foreground">
                            Last generated: {formatReportDate(pageData.updatedAt)}
                        </span>
                    )}
                </div>

                {!hasReports && (
                    <p className="mt-2 text-xs text-muted-foreground">
                        {STEP13_TEXTS.reports.noReportsMessage}
                    </p>
                )}
            </div>

            {/* Download Section */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    disabled={!hasReports}
                    className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors ${hasReports
                            ? "border-neutral-200 bg-white text-foreground hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                            : "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-500"
                        }`}
                    id={STEP13_IDS.elements.reportsDropdown}
                >
                    <span>
                        {hasReports
                            ? STEP13_TEXTS.reports.downloadLabel
                            : STEP13_TEXTS.reports.dropdownPlaceholder
                        }
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} ${!hasReports ? 'opacity-50' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && hasReports && (
                    <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                        <div className="py-1">
                            {reports.map((report, index) => (
                                <button
                                    key={report.id}
                                    onClick={() => handleDownload(report.id, report.name)}
                                    className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {/* Download Icon */}
                                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>

                                            {/* Report Info */}
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {report.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {STEP13_TEXTS.reports.types[report.type]}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                                            {STEP13_TEXTS.reports.statusLabels[report.status]}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Empty State Message */}
            {!hasReports && (
                <div className="mt-3 p-3 rounded-md bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-blue-800 dark:text-blue-300">
                            Reports will be generated after completing the content creation process.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
