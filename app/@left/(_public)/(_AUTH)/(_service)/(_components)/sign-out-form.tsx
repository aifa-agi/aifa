import Form from "next/form";
import { signOut } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import { useTranslation } from "../(_libs)/translation";

export const SignOutForm = () => {
  const { t } = useTranslation();

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
