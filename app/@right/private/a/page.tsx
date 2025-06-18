// @/app/@right/private/a/page.tsx

"use client";

import Link from "next/link";
import { __ } from "@/lib/translation";
import { Button } from "@/components/ui/button";
import { usePrivateContext } from "@/contexts/privateContext";

export default function PrivaeAPage() {
  const { privateData, setPrivateData } = usePrivateContext();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        <p>{`Page: ${privateData.title}`} A</p>
      </h1>

      <nav className="flex flex-col mt-4 px-2 gap-1 w-full">
        <Link href="/private/b">
          <Button className="w-full">{__("Private B")}</Button>
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
