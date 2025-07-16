//@/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/login/(_service)/(_actions)/login.ts

"use server";

import { z } from "zod";
import { signIn } from "../../../(_service)/(_actions)/auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_data"
    | "architect_wrong_password"
    | "admin_wrong_password"
    | "editor_wrong_password";
}

export const privilegedLogin = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // try to signIn via credentials provider
    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }
    return { status: "failed" };
  }
};
