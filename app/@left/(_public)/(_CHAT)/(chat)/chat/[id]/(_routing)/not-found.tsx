// @/app/@left/(_public)/(_CHAT)/(chat)/(_routing)/not-found.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "../../../(_service)/(_libs)/translation";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <Image
        src="/_static/illustrations/rocket-crashed.svg"
        alt={t("Rocket crashed illustration")}
        width={400}
        height={400}
        className="pointer-events-none mb-5 mt-6 dark:invert"
      />
      <p className="text-balance px-4 text-center text-2xl font-medium">
        {t("Check the connection keys to your database")}{" "}
        <Link
          href="/"
          className="text-muted-foreground underline underline-offset-4 hover:text-purple-500"
        >
          {t("Home page")}
        </Link>
      </p>
    </div>
  );
}
