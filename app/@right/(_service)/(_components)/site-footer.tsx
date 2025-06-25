import * as React from "react";
import Link from "next/link";

import { footerLinks } from "@/app/@right/(_service)/(_components)/footer-links";
import { cn } from "@/lib/utils";

//import { NewsletterForm } from "../forms/newsletter-form";

import { socialLinks } from "@/app/@right/(_service)/(_config)/social-links-config";
import { GitHubIcon } from "@/components/shared/icons";
import { XIcon } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";
import { ModeToggle } from "@/components/shared/mode-toggle";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t mt-6", className)}>
      <div className="container grid max-w-4xl grid-cols-2 gap-6 py-14 xl:grid-cols-5 ">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-sm font-medium text-foreground">
              {section.title}
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
          {/* <span className="text-muted-foreground text-sm">
            Copyright &copy; 2025. All rights reserved.
          </span> */}
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
            <Link
              href={socialLinks[1].url}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              <GitHubIcon className="size-5" />
            </Link>
            <Link
              href={socialLinks[0].url}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              <XIcon className="size-5" />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
