// @/app/(_service)/lib/fetch-menu.ts

import { MenuCategory } from "../(_types)/menu-types";

export async function fetchMenuCategories(): Promise<{
  status: string;
  categories?: MenuCategory[];
  error?: string;
}> {
  try {
    const res = await fetch("/api/menu", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch menu`);
    }

    const data = await res.json();
    return {
      status: "ok",
      categories: data.categories,
    };
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
