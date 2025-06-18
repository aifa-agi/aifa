// @/app/@right/public/a/page.tsx

"use client";

import Link from "next/link";
import { useContext } from "react";
import { __ } from "../../../../lib/translation";
import { Button } from "@/components/ui/button";
import { usePublicContext } from "@/contexts/publicContext";

export default function PublicBPage() {
  const { publicData } = usePublicContext();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        <p>{`Page: ${publicData.title}`} B</p>
      </h1>
      <nav className="flex flex-col mt-4 px-2 gap-1 w-full">
        <Link href="/private/a">
          <Button className="w-full">{__("Private A")}</Button>
        </Link>
        <Link href="/private/b">
          <Button className="w-full">{__("Private B")}</Button>
        </Link>
        <Link href="/public/b">
          <Button className="w-full">{__("Public B")}</Button>
        </Link>
      </nav>
    </div>
  );
}
