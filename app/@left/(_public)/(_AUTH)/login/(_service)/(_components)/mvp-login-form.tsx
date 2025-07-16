"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState, useEffect } from "react";
import { toast } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/toast";
import Form from "next/form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SubmitButton } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/submit-button";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslation } from "../../../(_service)/(_libs)/translation";
import { login, type LoginActionState } from "../(_actions)/login";

export default function MvpLoginForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const defaultEmail = "";
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    { status: "idle" }
  );
  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === "failed" || state.status === "invalid_data") {
      toast({
        type: "error",
        description:
          state.status === "failed"
            ? t("Invalid credentials!")
            : t("Form validation error!"),
      });
    } else if (state.status === "success") {
      setIsSuccessful(true);
      updateSession();
      router.push("/");
    }
  }, [state.status]);

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
  };

  return (
    <div className="relative h-dvh bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">
            {t("Enter")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {t("Use your email and password to log in")}
          </p>
        </div>

        <Form
          action={handleSubmit}
          className="flex flex-col gap-4 px-4 sm:px-16"
        >
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="email"
              className="text-zinc-600 font-normal dark:text-zinc-400"
            >
              {t("Email Address")}
            </Label>

            <Input
              id="email"
              name="email"
              className="bg-muted text-md md:text-sm"
              type="email"
              placeholder="user@acme.com"
              autoComplete="email"
              required
              autoFocus
              defaultValue={defaultEmail}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="password"
              className="text-zinc-600 font-normal dark:text-zinc-400"
            >
              {t("Password")}
            </Label>

            <Input
              id="password"
              name="password"
              className="bg-muted text-md md:text-sm"
              type="password"
              required
            />
          </div>

          <SubmitButton isSuccessful={isSuccessful}>{t("Enter")}</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {t("Don't have an account yet?")}{" "}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              {t("Sign up")}
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
