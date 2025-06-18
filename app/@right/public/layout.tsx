// @/app/@right/public/layout.tsx

"use client";

import React from "react";
import { PublicProvider } from "@/contexts/publicContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicProvider>
      <div className="bg-blue-400 ">{children}</div>
    </PublicProvider>
  );
}
