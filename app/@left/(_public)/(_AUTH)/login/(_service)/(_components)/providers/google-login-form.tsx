"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { GoogleIcon, LoaderIcon } from "@/components/shared/icons";
import { useState, useTransition } from "react";

export default function GoogleLoginForm() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setLoading] = useState(false);
  const handleGoogleSignIn = () => {
    startTransition(() => {
      signIn("google", { callbackUrl: "/" });
    });
    setLoading(true);
  };
  return (
    <Button
      type="button"
      disabled={isLoading}
      onClick={handleGoogleSignIn}
      className="w-full"
    >
      {isLoading ? (
        <div className="animate-spin text-zinc-500">
          <LoaderIcon />
        </div>
      ) : (
        <GoogleIcon />
      )}{" "}
      Google
    </Button>
  );
}
