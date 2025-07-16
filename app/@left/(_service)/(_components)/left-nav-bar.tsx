// @/app/@left/(chat)/(components)/leftNavBar.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { __ } from "@/lib/translation";

const LeftNavBar: React.FC = () => {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.push("/")}
      >
        {__("Chat bot")}
      </Button>
    </div>
  );
};

export default LeftNavBar;
