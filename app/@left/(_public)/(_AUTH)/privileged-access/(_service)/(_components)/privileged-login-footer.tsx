"use client";
import Link from "next/link";
import { useTranslation } from "../../../(_service)/(_libs)/translation";

export default function PrivilegedLoginFooter() {
  const { t } = useTranslation();

  return (
    <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
      {t("Need standard access?")}{" "}
      <Link
        href="/login"
        className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
      >
        {t("Log in")}
      </Link>
    </p>
  );
}
