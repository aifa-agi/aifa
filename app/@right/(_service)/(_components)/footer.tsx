"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

import { socialLinks } from "@/app/@right/(_service)/(_config)/social-links-config";
import { NewsletterForm } from "./newsletter-form";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { footerConfig } from "../(_config)/footer-config";
import type { UserType } from "../(_types)/footer-types";
import { useNavigationMenu } from "../(_context)/nav-bar-provider";
import { MenuCategory } from "../(_types)/menu-types";
import { PageData } from "../(_types)/page-types";

interface FilteredSection {
  category: string;
  items: {
    title: string;
    href: string;
  }[];
}

const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const { categories } = useNavigationMenu();
  const { data: session } = useSession();
  const userType: UserType = session?.user?.type || "guest";
  const router = useRouter();

  const getFilteredSections = React.useMemo((): FilteredSection[] => {
    const allowedCategories = categories.filter((category: MenuCategory) =>
      footerConfig.some(
        (configCategory) =>
          configCategory.toLowerCase() === category.title.toLowerCase()
      )
    );

    const sectionsWithFilteredPages = allowedCategories
      .map((category: MenuCategory): FilteredSection | null => {
        const accessiblePages =
          category.pages?.filter((page: PageData) => {
            return (
              page.isPublished && page.roles.includes(userType) && page.href
            );
          }) || [];

        if (accessiblePages.length === 0) {
          return null;
        }

        return {
          category: category.title,
          items: accessiblePages
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((page: PageData) => ({
              title: page.title || page.linkName || "Untitled",
              href: page.href || "#",
            })),
        };
      })
      .filter((section): section is FilteredSection => section !== null);

    return sectionsWithFilteredPages.sort((a, b) => {
      const indexA = footerConfig.findIndex(
        (configCategory) =>
          configCategory.toLowerCase() === a.category.toLowerCase()
      );
      const indexB = footerConfig.findIndex(
        (configCategory) =>
          configCategory.toLowerCase() === b.category.toLowerCase()
      );
      return indexA - indexB;
    });
  }, [categories, userType]);

  const filteredSections = getFilteredSections;

  // Хендлер для мягкой навигации внутренних ссылок
  const handleInternalLinkClick = (href: string) => {
    router.push(href);
  };

  // Проверка, является ли ссылка внешней
  const isExternalLink = (href: string) => {
    return /^https?:\/\//.test(href);
  };

  return (
    <>
      <footer className={cn("border-t mt-6 px-4", className)}>
        <div className="container grid w-full grid-cols-2 gap-6 py-14 xl:grid-cols-5">
          {filteredSections.map((section: FilteredSection) => (
            <div key={section.category}>
              <span className="text-base font-medium text-foreground">
                {capitalize(section.category)}
              </span>
              <ul className="mt-4 list-inside space-y-3">
                {section.items.map((link) => (
                  <li key={`${section.category}-${link.href}`}>
                    {isExternalLink(link.href) ? (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {capitalize(link.title)}
                      </Link>
                    ) : (
                      // Мягкая маршрутизация внутренней ссылки через router.push
                      <button
                        type="button"
                        onClick={() => handleInternalLinkClick(link.href)}
                        className="text-left text-sm text-muted-foreground hover:text-primary"
                      >
                        {capitalize(link.title)}
                      </button>
                    )}
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
          <div className="flex items-center justify-between w-full">
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
    </>
  );
}
