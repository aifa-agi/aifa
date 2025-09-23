"use client";

import React, { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";

import { PageActionsDropdown } from "../components/page-actions-dropdown";
import { PublishActionsDropdown } from "../components/publish-actions-dropdown/components/publish-actions-dropdown";
import { VectorStoreActionsDropdown } from "../components/vector-store-actions-dropdown";
import { ChatSynchroniseActionDropdown } from "../components/chat-synchronise-action-dropdown";
import { LinksActionsDropdown } from "../components/links-action-dropdown";
import { BadgesActionsDropdown } from "../components/badges-actions-dropdown";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { cn } from "@/lib/utils";
import { humanize } from "@/app/@right/(_service)/(_libs)/humanize";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { Badge } from "@/components/ui/badge";
import { AddToPromptActionsDropdown } from "../components/add-to-prompt-actions-dropdown";

const greenDotClass = "bg-emerald-500";

interface PageListItemProps {
  page: PageData;
  categoryTitle: string;
  categories: MenuCategory[];
  setIsOpen: (open: boolean) => void;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

export function PageListItem({
  page,
  categoryTitle,
  categories,
  setCategories,
  setIsOpen,
}: PageListItemProps) {
  const router = useRouter();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const [isAdminCategory, setAdminCategory] = useState(false);

  const fullTitle = humanize(page.title ?? page.linkName);
  const displayTitle =
    fullTitle.length > 20 ? `${fullTitle.substring(0, 20)}...` : fullTitle;

  const handlePageClick = () => {
    if (categoryTitle.toLowerCase() === "admin") {
      if (page.href) {
        router.push(page.href);
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    setAdminCategory(categoryTitle.toLowerCase() === "admin");
  }, [categoryTitle]);

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 20 : 1,
      }}
      className="group flex items-center px-2 h-10 relative"
      {...attributes}
      {...listeners}
    >
      {/* --- ИЗМЕНЕНИЕ НАЧАЛО --- */}
      {/* Добавлен инлайновый стиль minWidth для предотвращения сжатия */}
      <div
        className="flex-grow flex items-center gap-2 overflow-hidden"
        style={{ minWidth: "200px" }}
      >
        {/* --- ИЗМЕНЕНИЕ КОНЕЦ --- */}
        <span
          className={cn(
            "overflow-hidden text-ellipsis whitespace-nowrap",
            isAdminCategory &&
            "cursor-pointer hover:text-primary hover:underline"
          )}
          onClick={handlePageClick}
          title={fullTitle}
        >
          {displayTitle}
        </span>
        {page.hasBadge && page.badgeName && (
          <Badge className="shadow-none rounded-full px-2.5 py-0.5 text-xs font-semibold h-6 flex items-center">
            <div
              className={cn("h-1.5 w-1.5 rounded-full mr-2", greenDotClass)}
            />
            {page.badgeName}
          </Badge>
        )}
      </div>

      {!isAdminCategory ? (
        <div className="flex items-center gap-1">
          <BadgesActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
          <PageActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            categories={categories}
            setCategories={setCategories}
          />
          <PublishActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
          <VectorStoreActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
          <AddToPromptActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
          <ChatSynchroniseActionDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
          <LinksActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <BadgesActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
        </div>
      )}

      <span
        className="flex items-center justify-center w-8 h-8 cursor-grab rounded hover:bg-accent/60 ml-1"
        tabIndex={-1}
      >
        <GripVertical className="w-4 h-4 text-primary/80" />
      </span>

      <div className="absolute left-0 bottom-0 w-full h-px bg-border opacity-50 pointer-events-none" />
    </li>
  );
}
