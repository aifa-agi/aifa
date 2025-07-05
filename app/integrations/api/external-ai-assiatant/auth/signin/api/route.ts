// @/app/integrations/api/external-ai-assiatant/auth/signin/api/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signApiUserJwt } from "@/lib/utils/sign-jwt";

export async function POST(req: NextRequest) {
  try {
    const { user_id, name } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: user_id,
          name: name || null,
          type: "apiUser",
        },
      });
    }

    const payload = {
      sub: user.id,
      type: user.type,
      name: user.name,
    };

    // Логируем payload и secret
    console.log("JWT payload:", payload);
    console.log("JWT secret:", process.env.NEXTAUTH_SECRET);

    // Генерируем JWT
    let token: string;
    try {
      token = signApiUserJwt(payload);
    } catch (e) {
      console.error("JWT signing error:", e);
      return NextResponse.json(
        {
          error: "JWT signing error",
          details: e instanceof Error ? e.message : String(e),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error("SIGNIN API ERROR:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
