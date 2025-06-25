// @\app\@right\layout.tsx

"use client";

import React, { Children } from "react";

import { SiteFooter } from "./(_service)/(_components)/site-footer";

export default function RightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen pb-6">
      {/* <NavMobile />
      <NavBar scroll={true} /> */}
      <main className="flex-1 overflow-y-auto hide-scrollbar px-4">
        {Children.toArray(children)}
        <SiteFooter />
      </main>
    </div>
  );
}
