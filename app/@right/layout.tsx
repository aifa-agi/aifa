// @\app\@right\layout.tsx

"use client";

import React, { Children } from "react";

import { Footer } from "./(_service)/(_components)/footer";
import { NavBar } from "./(_service)/(_components)/navbar";

export default function RightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-svh pb-6">
      <NavBar scroll={true} />
      <main className="flex-1 overflow-y-auto hide-scrollbar">
        {Children.toArray(children)}
        <Footer />
      </main>
    </div>
  );
}
