// @/components/shared/online-status-provider.tsx

"use client"; // This directive is crucial. It marks the component as a Client Component.


import { useOnlineStatus } from "@/app/@right/(_service)/hooks/use-online-status";
import { OfflinePlaceholder } from "@/components/shared/offline-placeholder";
import React from "react";

/**
 * A provider component that checks the online status and renders its children
 * if online, or an offline placeholder if not.
 * @param {React.ReactNode} children - The main application content to render when online.
 */
export function OnlineStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // This hook now works correctly because it's inside a Client Component.
  const isOnline = useOnlineStatus();

  // Conditionally render the children (your app) or the offline placeholder.
  return isOnline ? <>{children}</> : <OfflinePlaceholder />;
}
