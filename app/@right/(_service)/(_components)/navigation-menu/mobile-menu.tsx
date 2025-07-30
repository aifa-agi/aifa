"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";
import { menuData, MenuLink } from "../../(_config)/menu-data";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../(_libs)/translation";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  topOffset: string;
}

const greenDotClass = "bg-emerald-500";

export default function MobileMenu({
  isOpen,
  setIsOpen,
  topOffset,
}: MobileMenuProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const userRole: UserType = session?.user?.type || UserType.guest;

  const getFilteredLinks = (links: MenuLink[]) =>
    links.filter((link) => link.roles.includes(userRole));

  const roleFilteredCategories = menuData.categories
    .map((category) => ({
      ...category,
      links: getFilteredLinks(category.links),
    }))
    .filter((category) => category.links.length > 0);
  const handleLinkClick =
    (href: string | undefined) => (e: React.MouseEvent) => {
      e.preventDefault();
      if (!href || href === "#") return;
      router.push(href);
      setIsOpen(false);
    };

  const renderCategoryLinks = (categoryLinks: MenuLink[]) => (
    <ul className="space-y-3 py-2">
      {categoryLinks.map((link) => (
        <li key={link.name}>
          <a
            href={link.href ?? "#"}
            onClick={handleLinkClick(link.href)}
            className="flex items-center bg-black text-white transition-colors duration-200 relative"
          >
            {link.hasBadge && link.badgeName ? (
              <div className="flex items-center justify-between gap-2 w-full">
                <span className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis flex items-center gap-2">
                  {link.name}
                </span>
                <Badge
                  className={cn(
                    "shadow-none rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  )}
                >
                  <div
                    className={cn(
                      "h-1.5 w-1.5 rounded-full mr-2",
                      greenDotClass
                    )}
                  />
                  {link.badgeName}
                </Badge>
              </div>
            ) : (
              <span className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis">
                {link.name}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-x-0 flex justify-center items-start z-50 ml-12 border-x border-primary"
          style={{ marginTop: topOffset }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div
            className="bg-black text-white p-6 mb-6 w-full max-w-full flex flex-col"
            style={{ height: `calc(100dvh - ${topOffset})` }}
          >
            <h2 className="text-2xl font-bold mb-4 text-left">
              {t("Mobile Menu")}
            </h2>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <Accordion type="single" collapsible className="w-full">
                {roleFilteredCategories.map((category, index) => (
                  <AccordionItem key={category.title} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg flex items-center gap-3">
                      {category.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      {renderCategoryLinks(category.links)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
