//@/app/api/auth/guest/route.ts

import { signIn } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import { isDevelopmentEnvironment } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_constants)/constants";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    //secureCookie: !isDevelopmentEnvironment,
  });
  if (token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return signIn("guest", { redirect: true, redirectTo: redirectUrl });
}
