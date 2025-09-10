// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step6/(_components)/repair-limitations-error.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Timer, Server, Code, Star } from "lucide-react";

export function RepairLimitationsError() {
  return (
    <Card className="border-red-200 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="size-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-red-900 dark:text-red-100 text-sm">
                JSON Repair Limitations & Timeouts
              </h4>
              <Timer className="size-4 text-red-600" />
            </div>

            <div className="text-red-800 dark:text-red-200 text-xs space-y-2">
              <div className="bg-red-100 dark:bg-red-900/30 rounded p-2">
                <p>
                  <strong>⚠️ Process:</strong> JSON repair uses{" "}
                  <code className="bg-red-200 dark:bg-red-800 px-1 rounded">
                    generateObject
                  </code>{" "}
                  with significant delays (2-5 minutes for complete response).
                </p>
              </div>

              <div className="bg-red-100 dark:bg-red-900/30 rounded p-2">
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
                    <Code className="size-3" />
                    <span>Run in local development (no timeout limits)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Server className="size-3" />
                    <span>
                      Upgrade to Vercel Pro (300s timeout) or Enterprise (900s
                      timeout)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Server className="size-3" />
                    <span>Deploy to custom server infrastructure</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="size-3 text-yellow-600" />
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
