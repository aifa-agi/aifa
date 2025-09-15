// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_components)/repair-limitations-error.tsx

"use client";

/*
  CSS-only improvement plan (no logic changes) — Comments in English:

  1) Status card:
     - Red semantic background/border with subtle opacity and dark-mode variants.
     - Rounded + soft shadow to match shadcn/ui vibe.

  2) Icon sizing:
     - Use `h-* w-*` consistently.

  3) Lists and code tags:
     - Improve contrast and spacing for list items and inline <code>.
*/

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Timer, Server, Code, Star } from "lucide-react";

export function RepairLimitationsError() {
  return (
    <Card className="rounded-md border-red-200 bg-red-50/50 shadow-sm dark:border-red-900/40 dark:bg-red-950/30">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-red-900 dark:text-red-100 text-sm">
                JSON Repair Limitations & Timeouts
              </h4>
              <Timer className="h-4 w-4 text-red-600" />
            </div>

            <div className="text-red-800 dark:text-red-200 text-xs space-y-2">
              <div className="rounded-md border border-red-200/70 bg-red-100/70 p-2 dark:border-red-900/40 dark:bg-red-900/30">
                <p>
                  <strong>⚠️ Process:</strong> JSON repair uses{" "}
                  <code className="rounded bg-red-200 px-1 py-0.5 text-red-900 dark:bg-red-800 dark:text-red-100">
                    generateObject
                  </code>{" "}
                  with significant delays (2-5 minutes for complete response).
                </p>
              </div>

              <div className="rounded-md border border-red-200/70 bg-red-100/70 p-2 dark:border-red-900/40 dark:bg-red-900/30">
                <p>
                  <strong>🚫 Vercel Free Tier:</strong> 60-second timeout will
                  cause{" "}
                  <span className="font-semibold">Function Timeout Error</span>{" "}
                  before completion.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-red-900 dark:text-red-100">
                  Solutions:
                </p>
                <ul className="space-y-1 ml-3">
                  <li className="flex items-center gap-2">
                    <Code className="h-3 w-3" />
                    <span>Run in local development (no timeout limits)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Server className="h-3 w-3" />
                    <span>
                      Upgrade to Vercel Pro (300s timeout) or Enterprise (900s
                      timeout)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Server className="h-3 w-3" />
                    <span>Deploy to custom server infrastructure</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-md border border-yellow-300 dark:border-yellow-700 bg-yellow-100/80 dark:bg-yellow-900/20 p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-3 w-3 text-yellow-600" />
                  <span className="text-yellow-800 dark:text-yellow-200 font-medium text-xs">
                    Technical Limitation
                  </span>
                </div>
                <p className="text-yellow-800 dark:text-yellow-200">
                  <strong>streamObject</strong> cannot reliably handle recursive
                  validation of large JSON structures as of September 2025.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
