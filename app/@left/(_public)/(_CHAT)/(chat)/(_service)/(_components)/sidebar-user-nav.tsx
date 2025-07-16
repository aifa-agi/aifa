// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_components)/sidebar-user-nav.tsx

"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";
import type { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./sidebar";
import { useRouter } from "next/navigation";
import { toast } from "./toast";
import { LoaderIcon } from "../../../../../../../components/shared/icons";
import { useTranslation } from "../(_libs)/translation";

export function SidebarUserNav({ user }: { user: User }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data, status } = useSession();
  const { setTheme, theme } = useTheme();

  //const isGuest = guestRegex.test(data?.user?.email ?? "");
  const isGuest = data?.user.type === "guest";
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {status === "loading" ? (
              <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10 justify-between">
                <div className="flex flex-row gap-2">
                  <div className="size-6 bg-zinc-500/30 rounded-full animate-pulse" />
                  <span className="bg-zinc-500/30 text-transparent rounded-md animate-pulse">
                    {t("Loading auth status...")}
                  </span>
                </div>
                <div className="animate-spin text-zinc-500">
                  <LoaderIcon />
                </div>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                data-testid="user-nav-button"
                className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10"
              >
                <Image
                  src={`https://avatar.vercel.sh/${user.email}`}
                  alt={user.email ?? "User Avatar"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span data-testid="user-email" className="truncate">
                  {isGuest ? t("Guest") : user?.email}
                </span>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-testid="user-nav-menu"
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem asChild data-testid="user-nav-item-auth">
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={() => {
                  if (status === "loading") {
                    toast({
                      type: "error",
                      description: t(
                        "Checking authentication status, please try again!"
                      ),
                    });

                    return;
                  }

                  if (isGuest) {
                    signOut({
                      redirectTo: "/login",
                    });
                  } else {
                    signOut({
                      redirectTo: "/register",
                    });
                  }
                }}
              >
                {isGuest ? t("Login to your account") : t("Sign out")}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
