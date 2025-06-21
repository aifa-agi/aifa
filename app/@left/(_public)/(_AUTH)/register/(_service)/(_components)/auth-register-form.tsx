// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/register/(_service)/(_components)/auth-register-form.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SubmitButton } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/submit-button";
import { toast } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/toast";
import { useSession } from "next-auth/react";

import { useTranslation } from "../../../(_service)/(_libs)/translation";
import { register, type RegisterActionState } from "../(_actions)/register";

export default function AuthRegisterForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    }
  );
  const defaultEmail = "";
  const { update: updateSession, data: session } = useSession();

  useEffect(() => {
    if (state.status === "user_exists") {
      toast({ type: "error", description: t("The account already exists!") });
    } else if (state.status === t("failed")) {
      toast({ type: "error", description: t("Failed to create an account!") });
    } else if (state.status === t("forbidden_email")) {
      toast({
        type: "error",
        description: t("Registration with such an email is prohibited."),
      });
      router.push("/login");
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: t("Data validation error!"),
      });
    } else if (state.status === "success") {
      toast({
        type: "success",
        description: t("Account has been successfully created!"),
      });

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">
            {t("Registration")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {t("Create an account using email and password")}
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
              placeholder={t("user@aifa.com")}
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

          <SubmitButton isSuccessful={isSuccessful}>
            {t("Registration")}
          </SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {t("Do you already have an account?")}{" "}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              {t("Log in")}
            </Link>{" "}
            {t("instead of that.")}
          </p>
        </Form>
      </div>
    </div>
  );
}
