// @/lib/hooks/use-online-status.ts

"use client";

import { useState, useEffect } from "react";

/**
 * A custom hook to track the online status of the browser.
 * It listens to the 'online' and 'offline' events of the window.
 * @returns {boolean} - true if online, false if offline.
 */
export function useOnlineStatus() {
  // Initialize state from navigator.onLine for the initial render.
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state based on the browser's property.
    // This is necessary because the component might mount after the initial event has fired.
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined"
    ) {
      setIsOnline(window.navigator.onLine);
    }

    // Handler to update state to true.
    const handleOnline = () => setIsOnline(true);
    // Handler to update state to false.
    const handleOffline = () => setIsOnline(false);

    // Add event listeners when the component mounts.
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup function to remove event listeners when the component unmounts.
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleanup on unmount.

  return isOnline;
}
