"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslation } from "../../../(_service)/(_libs)/translation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  privilegedLogin,
  LoginActionState,
} from "../(_actions)/privileged-login";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "@/components/shared/icons";

type PrivilegedEmails = {
  architects: string[];
  admins: string[];
  editors: string[];
};

type PrivilegedLoginProps = {
  privilegedEmails: PrivilegedEmails;
};

export default function PrivilegedLogin({
  privilegedEmails,
}: PrivilegedLoginProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [privilegedRole, setPrivilegedRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    privilegedLogin,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    if (state.status === "failed" || state.status === "invalid_data") {
      toast({
        type: "error",
        description:
          state.status === "failed"
            ? privilegedRole + " " + t("Invalid credentials!")
            : privilegedRole + " " + t("Form validation error!"),
      });
    } else if (state.status === "success") {
      toast({ type: "success", description: t("Login successful!") });
      updateSession();
      router.push("/");
    }
  }, [state, privilegedRole]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentEmail = e.target.value.toLowerCase();
    setEmail(currentEmail);

    if (privilegedEmails.architects.includes(currentEmail)) {
      setPrivilegedRole(t("Architect"));
    } else if (privilegedEmails.admins.includes(currentEmail)) {
      setPrivilegedRole(t("Administrator"));
    } else if (privilegedEmails.editors.includes(currentEmail)) {
      setPrivilegedRole(t("Editor"));
    } else setPrivilegedRole(null);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
      <h3 className="text-xl font-semibold dark:text-zinc-50">
        {t("Privileged Access")}
      </h3>
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        {t("Access for architects, administrators, and editors")}
      </p>

      <form action={formAction} className="w-full">
        <div className="grid gap-2 text-left ">
          <Label htmlFor="email">{t("Email")}</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="grid gap-2 mt-4 text-left ">
          <Label htmlFor="password">{`${privilegedRole ? t("Input password for") + " " + privilegedRole : t("Password")}`}</Label>
          <Input id="password" type="password" name="password" required />
          <Button disabled={!privilegedRole || isLoading} className="mt-2">
            {isLoading && (
              <div className="animate-spin text-zinc-500">
                <LoaderIcon />
              </div>
            )}
            {t("Enter")}
          </Button>
        </div>
      </form>
    </div>
  );
}
