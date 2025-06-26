// @/app/@right/subscriber/layout.tsx

import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";
import { redirect } from "next/navigation";
import { UserType } from "@prisma/client";
import React from "react";

export default async function SubscriberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const allowed: UserType[] = [UserType.subscriber];

  if (!session || !allowed.includes(session.user.type)) {
    redirect("/public");
  }

  return <>{children}</>;
}
