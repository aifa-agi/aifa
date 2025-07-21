// @app/@right/(_service)/(_components)/page-transformer-components/header-sections-components/announcement.tsx

"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementProps {
  badgeText?: string; // Сделали необязательным
  descriptionText?: string; // Сделали необязательным
  href?: string; // Сделали необязательным
  className?: string;
}

export function Announcement({
  badgeText,
  descriptionText,
  href,
  className,
}: AnnouncementProps) {
  const router = useRouter();

  const handleOnClick = () => {
    if (href) {
      router.push(href);
    }
  };

  // Если нет текста для бейджа, описания или ссылки, возвращаем null
  if (!badgeText && !descriptionText && !href) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-full border border-primary bg-muted px-3 py-1 text-sm transition-colors hover:bg-muted/80",
        className
      )}
      onClick={handleOnClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleOnClick();
        }
      }}
    >
      {badgeText && (
        <Badge variant="secondary" className="text-xs">
          {badgeText}
        </Badge>
      )}
      {descriptionText && (
        <span className="text-muted-foreground">{descriptionText}</span>
      )}
      {href && <ArrowRight className=" h-3 w-3 text-muted-foreground" />}
    </div>
  );
}
