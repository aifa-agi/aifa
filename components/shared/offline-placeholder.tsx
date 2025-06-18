// @/components/shared/offline-placeholder.tsx

import React from "react";

// This is an SVG icon component for the cloud with a slash.
const CloudSlashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 mr-2 text-zinc-400"
  >
    <path d="M2 2l20 20" />
    <path d="M5.48 5.48A8.03 8.03 0 0 0 4 12a8 8 0 0 0 14.3 4.3" />
    <path d="M12 12a8 8 0 0 1 7.7-4.3" />
    <path d="M20 16.5A4.5 4.5 0 0 0 15.5 12" />
  </svg>
);

// This is the main document icon, created with divs and Tailwind CSS.
const DocumentIcon = () => (
  <div className="bg-[#4285F4] w-24 h-24 rounded-2xl flex flex-col justify-center items-center p-4 space-y-3 shadow-lg">
    <div className="bg-white h-3 w-14 rounded-sm" />
    <div className="bg-white h-3 w-14 rounded-sm" />
    <div className="bg-white h-3 w-10 rounded-sm self-start ml-3" />
  </div>
);

/**
 * A placeholder component to be displayed when the application is offline.
 * It mimics the style of the provided screenshot.
 * The text should be managed by a translation library.
 */
export function OfflinePlaceholder() {
  // TODO: Replace 'You're offline' with a call to your translation function, e.g., t('offlineMessage')
  // This is based on the ANMA TRANSLATIONS documentation principles. [2]
  const offlineMessage = "You're offline";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#333333] text-white">
      <div className="text-center">
        <div className="mb-6">
          <DocumentIcon />
        </div>
        <div className="flex items-center justify-center text-zinc-300">
          <CloudSlashIcon />
          <p>{offlineMessage}</p>
        </div>
      </div>
    </div>
  );
}
