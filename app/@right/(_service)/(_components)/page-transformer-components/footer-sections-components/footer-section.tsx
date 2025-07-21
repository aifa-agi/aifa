// @app/@right/(_service)/(_components)/page-transformer-components/footer-sections-components/footer-section.tsx

"use client";

import { useRouter } from "next/navigation";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageActions } from "../header-sections-components/page-header-elements";

interface FooterAction {
  label: string;
  href: string;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
}

interface FooterSectionProps extends HTMLAttributes<HTMLDivElement> {
  actions?: FooterAction[];
}

export function FooterSection({
  actions,
  className,
  ...props
}: FooterSectionProps) {
  const router = useRouter();

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-4 md:py-6 lg:py-8", className)} {...props}>
      <div className="container mx-auto px-4">
        <PageActions>
          {actions.map((action) => (
            <Button
              key={action.href} // href должен быть уникальным!
              size="sm"
              variant={action.variant || "default"}
              onClick={() => router.push(action.href)}
            >
              {action.label}
            </Button>
          ))}
        </PageActions>
      </div>
    </section>
  );
}
