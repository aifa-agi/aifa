// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/(_service)/(_db-queries)/create-user.ts

import { prisma } from "@/lib/db";
import { User } from "@prisma/client";
import { generateHashedPassword } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_libs)/utils";

export async function createUser(
  email: string,
  password: string
): Promise<User> {
  // Create a user with hashed password
  const hashedPassword = generateHashedPassword(password);
  try {
    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Failed to create user in database", error);
    throw error;
  }
}
