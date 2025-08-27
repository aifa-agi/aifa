// @/app/right/(_server)/api/menu/route.ts

import { contentData } from "@/config/content/content-data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      status: "ok",
      categories: contentData.categories,
    });
  } catch (e: any) {
    console.error("Error fetching menu categories:", e);
    return NextResponse.json(
      { error: "Failed to fetch menu categories" },
      { status: 500 }
    );
  }
}
