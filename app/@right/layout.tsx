// @\app\@right\layout.tsx

"use client";

import React from "react";
import RightNavBar from "./(components)/right-nav-bar";

export default function LeftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col  h-screen">
      <div className="flex-1 ">
        <RightNavBar />
      </div>
      <div className=" w-full h-[calc(100%-64px)] overflow-y-auto  p-8 my-4 mt-12 ">
        {children}
      </div>
    </div>
  );
}
