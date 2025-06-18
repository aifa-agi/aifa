// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/(_routing)/not-found.tsx

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "../(_service)/(_libs)/translation";
export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <Image
        src="/_static/illustrations/rocket-crashed.svg"
        alt="404"
        width={400}
        height={400}
        className="pointer-events-none mb-5 mt-6 dark:invert"
      />
      <p className="text-balance px-4 text-center text-2xl font-medium">
        {t("The page was not found. Go back to the main page.")}{" "}
        {/* Using translation function */}
        <Link
          href="/"
          className="text-muted-foreground underline underline-offset-4 hover:text-purple-500"
        >
          {t("Home page")} {/* Adding translation for "Homepage" */}
        </Link>
      </p>
    </div>
  );
}
