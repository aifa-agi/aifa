// @/app/@left/(_public)/(_AUTH)/(auth)/login/(_service)/(_components)/public-login-footer.tsx

"use client";
import Link from "next/link";
import { useTranslation } from "../../../(_service)/(_libs)/translation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useRightSidebar } from "@/contexts/right-sidebar-context";

export default function PublicLoginFooter() {
  const { t } = useTranslation();
  const router = useRouter();
  const { openDrawer } = useRightSidebar();

  const termsOfServiceOnClick = () => {
    router.push("/terms-of-service");
    openDrawer();
  };
  const privacyPolicyOnClick = () => {
    router.push("/privacy-policy");
    openDrawer();
  };
  return (
    <>
      <div className="text-muted-foreground  text-center text-xs text-balance ">
        {t("ByClickingContinueYouAgreeToOur")}{" "}
        <Button
          variant="link"
          size="sm"
          className="text-xs px-0"
          onClick={privacyPolicyOnClick}
        >
          {t("Privacy Policy")}
        </Button>{" "}
        {t("and")}{" "}
        <Button
          variant="link"
          size="sm"
          className="text-xs px-0"
          onClick={termsOfServiceOnClick}
        >
          {t("Terms of Service")}
        </Button>
        .
      </div>
      <p className="text-center text-sm text-gray-600  dark:text-zinc-400">
        {t("Need privileged access?")}{" "}
        <Link
          href="/privileged-access"
          className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
        >
          {t("Log in")}
        </Link>
      </p>
    </>
  );
}
