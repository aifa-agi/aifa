// @/app/@right/public/layout.tsx

import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import { redirect } from "next/navigation";
import { UserType } from "@prisma/client";
import React from "react";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session && session?.user.type === UserType.subscriber) {
    redirect("/subscriber");
  }

  return <>{children}</>;
}
