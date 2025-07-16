import type { ComponentProps } from "react";

import { type SidebarTrigger, useSidebar } from "./sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SidebarLeftIcon, UserIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../(_libs)/translation";

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { t } = useTranslation();
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-testid="sidebar-toggle-button"
          onClick={toggleSidebar}
          variant="outline"
          className="md:px-2 h-[34px]"
        >
          <UserIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start">{t("Toggle Sidebar")}</TooltipContent>
    </Tooltip>
  );
}
