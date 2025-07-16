import Form from "next/form";
import { signOut } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import { useTranslation } from "../(_libs)/translation";
// import Cookies from "js-cookie";

export const SignOutForm = () => {
  const { t } = useTranslation();
  // Cookies.remove("next-auth.session-token");
  // Cookies.remove("next-auth.csrf-token");

  return (
    <Form
      className="w-full"
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/",
        });
      }}
    >
      <button
        type="submit"
        className="w-full text-left px-1 py-0.5 text-red-500"
      >
        {t("Sign out")}
      </button>
    </Form>
  );
};
