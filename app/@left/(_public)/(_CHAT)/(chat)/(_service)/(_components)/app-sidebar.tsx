// @/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/app-sidebar.tsx
"use client";

import type { User } from "next-auth";
import { useRouter } from "next/navigation";

import { PlusIcon } from "@/components/shared/icons";
import { SidebarHistory } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/sidebar-history";
import { SidebarUserNav } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "./sidebar";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "../(_libs)/translation";

export function AppSidebar({ user }: { user: User | undefined }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0 pb-[env(safe-area-inset-bottom)]">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                {t("Chat GPT")}
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push("/");
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">{t("New Chat")}</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <SidebarUserNav user={user} />
        ) : (
          <Button
            variant="secondary"
            onClick={() =>
              signOut({
                redirectTo: "/register",
              })
            }
          >
            {t("Sign out")}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
