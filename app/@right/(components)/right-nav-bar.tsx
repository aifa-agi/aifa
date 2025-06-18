// @/app/@right/(components)/rightNavBar.tsx

"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { __ } from "@/lib/translation";

const LeftNavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine button variant based on current URL path
  const isPrivateActive = pathname.includes("private");
  const isPublicActive = pathname.includes("public");

  return (
    <header className="flex fixed z-10 top-0   py-1.5 items-center px-2 md:px-2 gap-2 w-[calc(90%-50px)] ">
      <div className="flex gap-2">
        <Button
          variant={isPrivateActive ? "default" : "outline"}
          size="sm"
          className="w-1/2"
          onClick={() => router.push("/private/a")}
        >
          {__("Private route")}
        </Button>
        <Button
          variant={isPublicActive ? "default" : "outline"}
          size="sm"
          className="w-1/2"
          onClick={() => router.push("/public/a")}
        >
          {__("Public route")}
        </Button>

        <div className=" mr-4  md:mr-0" />
      </div>
    </header>
  );
};

export default LeftNavBar;
