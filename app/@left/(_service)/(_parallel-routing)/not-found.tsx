import Image from "next/image";
import Link from "next/link";
import { __ } from "@/lib/translation"; // Importing translation function

export default function NotFound() {
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
        {__( "Страница не найдена. Вернуться на главную страницу." )} {/* Using translation function */}
    
        <Link href="/" className="text-muted-foreground underline underline-offset-4 hover:text-purple-500">
          {__("Homepage")} {/* Adding translation for "Homepage" */}
        </Link>
      </p>
    </div>
  );
}