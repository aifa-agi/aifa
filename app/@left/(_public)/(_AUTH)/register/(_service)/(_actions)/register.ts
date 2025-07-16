// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/register/(_service)/(_actions)/register.ts

"use server";

import { z } from "zod";

import { getUser } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_db-queries)/get-user";
import { createUser } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_db-queries)/create-user";
import { signIn } from "../../../(_service)/(_actions)/auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Регистрируем обычных пользователей только
export interface RegisterActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data"
    | "forbidden_email";
}

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: "user_exists" } as RegisterActionState;
    }
    await createUser(validatedData.email, validatedData.password);

    await signIn("credentials", {
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
