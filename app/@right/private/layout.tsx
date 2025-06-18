// @/app/@right/private/layout.tsx

"use client";

import React from "react";
import { PrivateProvider } from "@/contexts/privateContext";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateProvider>
      <div className="bg-green-400 ">{children}</div>
    </PrivateProvider>
  );
}
