"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserType } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { humanize } from "../../../(_libs)/humanize";
import { PageData } from "../../../(_types)/page-types";
import { MenuCategory } from "../../../(_types)/menu-types";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  topOffset: string;
  categories: MenuCategory[];
}

const greenDotClass = "bg-emerald-500";

export default function MobileMenu({
  isOpen,
  topOffset,
  categories,
}: MobileMenuProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const userType: UserType = session?.user?.type || "guest";

  const getFilteredLinks = (pages: PageData[]) =>
    pages.filter(
      (singlePage) =>
        singlePage.roles.includes(userType) && singlePage.isPublished
    );

  const roleFilteredCategories = categories
    .map((category) => ({
      ...category,
      pages: getFilteredLinks(category.pages),
    }))
    .filter((category) => category.pages.length > 0);

  const handlePageClick = (page: PageData) => {
    if (page.href) {
      router.push(page.href);
    }
  };

  const renderCategoryLinks = (categoryLinks: PageData[]) => (
    <ul className="space-y-3 py-2">
      {categoryLinks.map((singlePage) => (
        <li key={singlePage.id}>
          <button
            type="button"
            onClick={() => handlePageClick(singlePage)}
            className="flex items-center text-white transition-colors duration-200 relative w-full text-left"
          >
            {singlePage.hasBadge && singlePage.badgeName ? (
              <div className="flex items-center justify-between gap-2 w-full">
                <span className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis flex items-center gap-2">
                  {humanize(singlePage.title ?? singlePage.linkName)}
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
                  {singlePage.badgeName}
                </Badge>
              </div>
            ) : (
              <span className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis">
                {humanize(singlePage.title ?? singlePage.linkName)}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-x-0 flex justify-center items-start z-50"
          style={{ marginTop: topOffset }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div
            className="bg-black text-white rounded-lg shadow-2xl border border-gray-700 p-6 mx-6 mb-6 w-full max-w-md flex flex-col"
            style={{ height: `calc(100vh - ${topOffset} - 100px)` }}
          >
            <h2 className="text-2xl font-bold mb-4 text-left">Mobile Menu</h2>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <Accordion type="single" collapsible className="w-full">
                {roleFilteredCategories.map((category, index) => (
                  <AccordionItem key={category.title} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg flex items-center gap-3">
                      {humanize(category.title)}
                    </AccordionTrigger>
                    <AccordionContent>
                      {renderCategoryLinks(category.pages)}
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
