//@/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/(_service)/(_libs)/sync-role-users.ts

import { prisma } from "@/lib/db";
import { generateHashedPassword } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_libs)/utils";
import { UserType } from "@prisma/client";

// Определяем общую конфигурацию для ролей в одном месте
const rolesConfig = [
  {
    type: UserType.architect,
    emailsEnv: "ARCHITECT_EMAILS",
    passwordsEnv: "ARCHITECT_PASSWORDS",
  },
  {
    type: UserType.admin,
    emailsEnv: "ADMIN_EMAILS",
    passwordsEnv: "ADMIN_PASSWORDS",
  },
  {
    type: UserType.editor,
    emailsEnv: "EDITOR_EMAILS",
    passwordsEnv: "EDITOR_PASSWORDS",
  },
];

/**
 * Синхронизирует пользователей из .env с базой данных.
 * Создает или обновляет пользователей, хешируя их пароли.
 */
export async function syncRoleUsersWithEnv() {
  for (const config of rolesConfig) {
    const emails = (process.env[config.emailsEnv] ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const passwords = (process.env[config.passwordsEnv] ?? "")
      .split(",")
      .map((e) => e.trim());

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const password = passwords[i];

      // Пропускаем, если для email не указан пароль в .env
      if (!password) {
        console.warn(
          `Password not found for privileged user: ${email}. Skipping sync.`
        );
        continue;
      }

      const hashedPassword = await generateHashedPassword(password);

      // upsert: если пользователь есть — обновить, если нет — создать
      await prisma.user.upsert({
        where: { email }, // email уникален!
        update: { password: hashedPassword, type: config.type },
        create: {
          email,
          password: hashedPassword,
          type: config.type,
        },
      });
    }
  }
}
