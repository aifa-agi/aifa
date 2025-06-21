// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/register/(_routing)/page.tsx

import { redirect } from "next/navigation";
import AuthRegisterForm from "../(_service)/(_components)/auth-register-form";

// Утилита для определения режима работы на сервере
const isProductionMode = !!(
  (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) ||
  (process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
);

export default async function RegisterPage() {
  if (isProductionMode) {
    redirect("/login");
  }

  return <AuthRegisterForm />;
}
