// @/app/(_service)/components/nav-bar/admin-flow/page-actions-dropdown/components/status-indicator.tsx

import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  isActive: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StatusIndicator({
  isActive,
  size = "sm",
  className,
}: StatusIndicatorProps) {
  const sizeConfig = {
    sm: { width: 4, height: 4, minWidth: 4, minHeight: 4 },
    md: { width: 4, height: 4, minWidth: 4, minHeight: 4 },
  };

  const dimensions = sizeConfig[size];

  return (
    <span
      className={cn(
        "inline-block mr-3 align-middle rounded-full border",
        size === "sm" ? "border-black/20" : "border-black/30",
        isActive ? "bg-green-500" : "bg-orange-500",
        size === "md" && !isActive && "bg-muted-foreground",
        className
      )}
      style={dimensions}
    />
  );
}
