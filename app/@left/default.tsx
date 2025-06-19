"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "../@right/(_service)/(_libs)/translation";
import cx from "classnames";
import { DefaultLeftWellcome } from "./(_public)/(_CHAT)/(chat)/(_service)/(_components)/default-left-welcome";

/**
 * Main default component.
 * Layout:
 * 1. DefaultLeftWellcome (top, fixed height)
 * 2. Illustration (center, flexible, shrinks if needed)
 * 3. Input-like button (bottom, fixed height)
 *
 * The illustration always stays centered and shrinks if there is not enough space,
 * but never pushes Input or Welcome out.
 */
export default function Default() {
  const { t } = useTranslation();
  const router = useRouter();

  // Handler for click event: redirects to root
  const handleClick = () => {
    router.replace("/");
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background overflow-x-hidden py-3">
      <div className="flex flex-col items-center justify-between flex-1 px-4 max-w-full h-full">
        <div className="w-full shrink-0 mx-auto mt-20 flex justify-center ">
          <DefaultLeftWellcome />
        </div>

        {/* Center: Illustration (shrinks if needed, always centered) */}
        <div className="flex-1 flex items-center justify-center w-full min-h-0 py-4">
          <div className="relative w-full max-w-[400px] h-auto aspect-square flex items-center justify-center">
            <Image
              src="/_static/illustrations/call-waiting.svg"
              alt={t("call waitingd illustration")}
              fill
              style={{ objectFit: "contain" }}
              className="mb-5 mt-6 dark:invert"
              sizes="(max-width: 600px) 80vw, 400px"
              priority
            />
          </div>
        </div>

        {/* Bottom: Input-like button (fixed height, does not shrink) */}
        <div className="w-full shrink-0">
          <button
            type="button"
            aria-label={t("Send a message")}
            onClick={handleClick}
            className={cx(
              "w-full h-[98px] overflow-hidden resize-none rounded-2xl text-base bg-muted pb-14 dark:border-zinc-700 text-left px-3 pt-0 outline-none border border-input transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-text"
            )}
            style={{
              fontFamily: "inherit",
              fontSize: "1rem",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
            }}
          >
            <span className="text-muted-foreground select-none pointer-events-none">
              {t("Send a message...")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
