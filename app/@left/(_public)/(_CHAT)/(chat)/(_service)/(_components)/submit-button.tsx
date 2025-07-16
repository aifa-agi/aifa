"use client";

import { useFormStatus } from "react-dom";
import { LoaderIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../(_libs)/translation"; // Используем только этот путь!

export function SubmitButton({
  children,
  isSuccessful,
}: {
  children: React.ReactNode;
  isSuccessful: boolean;
}) {
  const { t } = useTranslation();
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      aria-disabled={pending || isSuccessful}
      disabled={pending || isSuccessful}
      className="relative"
    >
      {children}

      {(pending || isSuccessful) && (
        <span className="animate-spin absolute right-4">
          <LoaderIcon />
        </span>
      )}

      <output aria-live="polite" className="sr-only">
        {pending || isSuccessful ? t("Loading") : t("Submit form")}
      </output>
    </Button>
  );
}
