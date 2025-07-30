"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";
import {
  MenuCategory,
  menuData,
  MenuLink,
} from "@/app/@right/(_service)/(_config)/menu-data";
function isUsableParams(obj: any): obj is { slug?: string[] } {
  return obj && Array.isArray(obj.slug);
}

function capitalizeWord(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Поиск подходящей категории и страницы по slug и роли
function findCategoryAndPage(
  slug: string[] | undefined,
  role: UserType
): { category?: MenuCategory; link?: MenuLink } {
  if (!slug || slug.length === 0) return {};
  const href = "/public/" + slug.join("-");

  for (const category of menuData.categories) {
    for (const link of category.links) {
      if (link.roles.includes(role) && link.href === href) {
        return { category, link };
      }
    }
  }
  return {};
}

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default function PublicDynamicSlugPage({ params }: Props) {
  // Используем React.use для распаковки Promise params
  const resolvedParams = React.use(params);
  const slugArr: string[] = isUsableParams(resolvedParams)
    ? (resolvedParams.slug ?? [])
    : [];

  // Получаем сессию и роль пользователя
  const { data: session } = useSession();
  const userRole: UserType = session?.user?.type || UserType.guest;

  const { category, link } = findCategoryAndPage(slugArr, userRole);

  if (!category || !link) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="p-8 rounded-lg bg-black/80 shadow-lg text-center w-full max-w-md border border-gray-800">
          <div className="text-xl text-red-400 font-semibold mb-2">
            Page not found
          </div>
          <div className="text-gray-400 text-base">
            No accessible menu entry matches this route for current role.
            <br />
            <code className="block mt-2 text-xs text-orange-400 break-words">
              params={JSON.stringify(slugArr)}
              <br />
              role={userRole}
            </code>
          </div>
        </div>
      </main>
    );
  }

  const badgeText =
    link.hasBadge && link.badgeName
      ? `type ${capitalizeWord(link.badgeName)}`
      : undefined;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <section className="bg-black/90 border border-gray-700 shadow-2xl rounded-2xl px-8 py-10 flex flex-col items-center w-full max-w-sm">
        <div className="text-2xl font-bold text-white mb-2">
          Hi, {userRole.charAt(0).toUpperCase() + userRole.slice(1)}!
        </div>
        <div className="text-gray-300 text-lg mb-3 text-center">
          You are in the{" "}
          <span className="font-semibold text-blue-400">{category.title}</span>{" "}
          category
        </div>
        <div className="text-gray-200 text-base mb-2 text-center">
          on the{" "}
          <span className="font-semibold text-yellow-300">{link.name}</span>{" "}
          page
        </div>
        {badgeText && (
          <span className="inline-block px-4 py-1 mt-2 bg-emerald-600 text-white rounded-full font-semibold text-sm shadow">
            {badgeText}
          </span>
        )}
      </section>
    </main>
  );
}
