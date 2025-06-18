// @/app/@right/private/b/page.tsx

"use client";

import Link from "next/link";
import { __ } from "@/lib/translation";
import { Button } from "@/components/ui/button";
import { usePrivateContext } from "@/contexts/privateContext";

export default function Privae() {
  const { privateData, setPrivateData } = usePrivateContext();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        <p>{`Page: ${privateData.title}`} B</p>
      </h1>

      <nav className="flex flex-col mt-4 px-2 gap-1 w-full">
        <Link href="/private/a">
          <Button className="w-full">{__("Private A")}</Button>
        </Link>
        <Link href="/public/a">
          <Button className="w-full">{__("Public A")}</Button>
        </Link>
        <Link href="/public/b">
          <Button className="w-full">{__("Public B")}</Button>
        </Link>
      </nav>
    </div>
  );
}
