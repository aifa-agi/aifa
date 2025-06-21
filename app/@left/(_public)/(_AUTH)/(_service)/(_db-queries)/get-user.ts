// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/(_service)/(_db-queries)/get-user.ts

import { User } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getUser(email: string): Promise<User[]> {
  try {
    return await prisma.user.findMany({ where: { email } });
  } catch (error) {
    console.error("Failed to get user from database", error);
    throw error;
  }
}
