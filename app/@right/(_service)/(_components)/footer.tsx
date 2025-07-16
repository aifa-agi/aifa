// @/app/@right/(_service)/(_components)/footer.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

import { socialLinks } from "@/app/@right/(_service)/(_config)/social-links-config";
import { NewsletterForm } from "./newsletter-form";
import { ModeToggle } from "@/components/shared/mode-toggle";
import {
  footerConfigs,
  FooterLayout,
  footerPublicConfig,
} from "../(_config)/footer-config";
import type { UserType } from "../(_types)/footer-types";

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const selectedLayout = useSelectedLayoutSegment();

  // Получаем роль пользователя из сессии
  const { data: session } = useSession();
  const userType: UserType = session?.user?.type || "guest";

  // Выбираем нужный конфиг
  const sections =
    selectedLayout &&
    Object.prototype.hasOwnProperty.call(footerConfigs, selectedLayout)
      ? footerConfigs[selectedLayout as FooterLayout]
      : footerPublicConfig;

  // Фильтруем категории по ролям
  const filteredSections = sections.filter(
    (section) => !section.roles || section.roles.includes(userType)
  );

  return (
    <footer className={cn("border-t mt-6  px-4", className)}>
      <div className="container grid max-w-4xl grid-cols-2 gap-6 py-14 xl:grid-cols-5 ">
        {filteredSections.map((section) => (
          <div key={section.category}>
            <span className="text-sm font-medium text-foreground">
              {section.category}
            </span>
            <ul className="mt-4 list-inside space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-full flex flex-col items-end sm:col-span-1 md:col-span-2">
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t py-4">
        <div className="container flex max-w-6xl items-center justify-between">
          <p className="text-left text-sm text-muted-foreground">
            Built by{" "}
            <Link
              href={socialLinks[0].url}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              AIFA Open Source
            </Link>
            . Hosted on{" "}
            <Link
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Vercel
            </Link>
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.title}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
                  aria-label={social.title}
                >
                  <Icon className="size-5" />
                </Link>
              );
            })}
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
