// @/app/@left/(_public)/(_AUTH-FRACTAL)/(auth)/(_service)/(_db-queries)/create-guest-user.ts

import { prisma } from "@/lib/db";
import { deleteUserWithFiles } from "./delete-user-with-blob";
import { syncRoleUsersWithEnv } from "../(_libs)/sync-role-users";
import { ALLOWED_GUEST_IDS } from "../(_constants)/constants";

/**
 * Create all guest users initially if they don't exist.
 * If all guests exist, recycle oldest guest user and полностью удаляет все связанные данные.
 */
export async function createGuestUser() {
  await syncRoleUsersWithEnv();

  // Step 1: Найти всех гостевых пользователей, которые уже есть в БД
  const existingGuests = await prisma.user.findMany({
    where: {
      id: { in: ALLOWED_GUEST_IDS },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Step 2: Если не все guest ID заняты — создать недостающих гостей
  if (existingGuests.length < ALLOWED_GUEST_IDS.length) {
    const existingIds = existingGuests.map((g) => g.id);
    const missingIds = ALLOWED_GUEST_IDS.filter(
      (id) => !existingIds.includes(id)
    );

    // Создать гостя с первым свободным ID
    for (const id of missingIds) {
      const newGuest = await prisma.user.create({
        data: {
          id,
          type: "guest",
          createdAt: new Date(),
        },
      });
      return newGuest;
    }
  }

  // Step 3: Все гости существуют — рециклим самого старого
  const recycleId = existingGuests[0].id; // oldest guest

  // Step 4: Проверить валидность recycleId
  if (!ALLOWED_GUEST_IDS.includes(recycleId)) {
    throw new Error(`Guest ID ${recycleId} is not in allowed guest IDs list.`);
  }

  // Step 5: Удалить все связанные с этим пользователем данные, включая файлы из Blob

  await deleteUserWithFiles(recycleId);

  // Step 6: Создать нового гостя с этим же ID

  const newGuest = await prisma.user.create({
    data: {
      id: recycleId,
      type: "guest",
      createdAt: new Date(),
    },
  });

  return newGuest;
}
