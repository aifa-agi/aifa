"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signIn, useSession } from "next-auth/react";
import { toast } from "@/components/shared/toast";

import { EnvelopIcon, LoaderIcon } from "@/components/shared/icons";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "../../../../(_service)/(_libs)/translation";
import { useRouter } from "next/navigation";

// Название канала для синхронизации вкладок
const AUTH_CHANNEL = "auth-channel";

export default function ResendLoginForm() {
  const { t } = useTranslation();
  const { update: updateSession } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [isSuccessResponse, setSuccessResponse] = useState(false);

  useEffect(() => {
    if (!isSuccessResponse) return;

    const channel = new BroadcastChannel(AUTH_CHANNEL);

    const handleMessage = (event: MessageEvent) => {
      if (event.data === "login-success") {
        toast({ type: "success", description: t("Вход выполнен успешно!") });

        updateSession();
        router.push("/");
      }
    };

    channel.addEventListener("message", handleMessage);

    // Очистка при размонтировании компонента
    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [isSuccessResponse, router, t, updateSession]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentEmail = e.target.value.toLowerCase();
    setEmail(currentEmail);
  };

  const handleResendSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    startTransition(() => {
      signIn("resend", {
        email: email,
        redirect: false,
        callbackUrl: "/",
      }).then((result) => {
        if (result?.ok && !result.error) {
          toast({
            type: "success",
            description: `${t("Sign-in link sent to")} ${email}`,
          });
          setSuccessResponse(true);
          setLoading(false);
        } else {
          toast({
            type: "error",
            description: t("Failed to send the link. Please try again later."),
          });
          setLoading(false);
        }
      });
    });
  };

  return (
    <>
      <div className="relative mt-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("Or continue with")}
          </span>
        </div>
      </div>
      {!isSuccessResponse ? (
        <form onSubmit={handleResendSignIn}>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-primary ">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={handleEmailChange}
            />

            <Button
              variant="outline"
              disabled={isLoading || isPending}
              type="submit"
              className="w-full"
            >
              {isLoading || isPending ? (
                <div className="animate-spin text-zinc-500">
                  <LoaderIcon />
                </div>
              ) : (
                <EnvelopIcon />
              )}{" "}
              Magic Link Resend
            </Button>
          </div>
        </form>
      ) : (
        <blockquote className="mt-6 border-l-2 pl-6 italic">
          {t("Sign-in link sent to")}
          &quot;{email}&quot;. {t("Please check your email,")}{" "}
          {t("also check your SPAM folder.")}
        </blockquote>
      )}
    </>
  );
}
