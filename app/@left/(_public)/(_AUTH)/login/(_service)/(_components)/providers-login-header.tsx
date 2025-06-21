"use client";

import { useTranslation } from "../../../(_service)/(_libs)/translation";

export default function ProvidersLoginHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
      <h3 className="text-xl font-semibold dark:text-zinc-50">
        {t("Authorization")}
      </h3>
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        {t("Sign in with one of the providers")}
      </p>
    </div>
  );
}
