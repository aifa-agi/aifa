// @/app/@right/admin/(_service)/(_components)/real-time-users.tsx

"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table"; // shadcn/ui Table import
import { getNextAuthUrl } from "@/lib/utils/get-next-auth-url";

type Session = Record<string, any>;

/**
 * Formats ISO date string to readable format: DD.MM.YYYY HH:mm
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Capitalizes first letter and replaces underscores with spaces
 */
function prettifyKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function RealTimeUsers() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const baseUrl = getNextAuthUrl();

  useEffect(() => {
    async function fetchSessions() {
      const res = await fetch("/admin/api/real-time-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // Flatten sessions from { [key]: value } to array of value
      const sessionObjs: Session[] = Object.values(data.activeSessions || {});
      setSessions(sessionObjs);

      // Determine all unique keys present in session objects
      const allKeys = new Set<string>();
      sessionObjs.forEach((sess) => {
        Object.keys(sess).forEach((k) => allKeys.add(k));
      });
      setColumns(Array.from(allKeys));
    }
    fetchSessions();
    // Optionally, add polling for real-time updates
    // const interval = setInterval(fetchSessions, 5000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption className="text-lg font-semibold mb-2">
          API Users in Online Sessions
        </TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{prettifyKey(col)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No online API users found.
              </TableCell>
            </TableRow>
          ) : (
            sessions.map((session, idx) => (
              <TableRow
                key={session.user_id || idx}
                className="h-[150px] max-h-[150px]"
                style={{ height: "150px", maxHeight: "150px" }}
              >
                {columns.map((col) => {
                  let value = session[col];
                  if (col === "createdAt" && value) {
                    value = formatDate(value);
                  } else if (Array.isArray(value)) {
                    // Render arrays as comma-separated or list
                    value = (
                      <div className="h-full overflow-y-auto pr-2">
                        <ul className="list-disc list-inside space-y-1">
                          {value.map((item: any, i: number) => (
                            <li key={i} className="text-sm break-words">
                              {typeof item === "object"
                                ? JSON.stringify(item)
                                : String(item)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  } else if (typeof value === "object" && value !== null) {
                    value = (
                      <div className="h-full overflow-y-auto pr-2">
                        <pre className="text-sm whitespace-pre-wrap break-words">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      </div>
                    );
                  } else if (value === undefined || value === null) {
                    value = "-";
                  } else {
                    // For string values, wrap in scrollable div if content is long
                    const stringValue = String(value);
                    if (stringValue.length > 100) {
                      value = (
                        <div className="h-full overflow-y-auto pr-2">
                          <div className="text-sm break-words whitespace-pre-wrap">
                            {stringValue}
                          </div>
                        </div>
                      );
                    } else {
                      value = stringValue;
                    }
                  }

                  return (
                    <TableCell
                      key={col}
                      className="h-[150px] max-h-[150px] p-2 align-top overflow-hidden max-w-xs"
                      style={{ height: "150px", maxHeight: "150px" }}
                    >
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
