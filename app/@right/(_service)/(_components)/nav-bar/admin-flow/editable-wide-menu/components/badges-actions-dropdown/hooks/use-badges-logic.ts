// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/badges-actions-dropdown/hooks/use-badges-logic.ts

import { useCallback } from "react";

import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { normalizeText } from "@/app/@right/(_service)/(_libs)/normalize-text";
import { BadgeName } from "@/config/pages-config/badges/badge-config";
import { UserType } from "@/app/@right/(_service)/(_types)/footer-types";
import { transliterate } from "@/lib/utils/transliterate";
interface UseBadgesLogicProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

interface UseBadgesLogicReturn {
  handleToggleRole: (role: UserType) => void;
  handleToggleBadge: (badge: BadgeName) => void;
  handleRename: () => void;
  handleDelete: () => void;
}

/**
 * Custom hook to handle badges and roles management logic
 */
export function useBadgesLogic({
  singlePage,
  categoryTitle,
  setCategories,
}: UseBadgesLogicProps): UseBadgesLogicReturn {
  const dialogs = useDialogs();

  const handleToggleRole = useCallback(
    (role: UserType) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((l) =>
                  l.id !== singlePage.id
                    ? l
                    : {
                        ...l,
                        roles: l.roles.includes(role)
                          ? l.roles.filter((r) => r !== role)
                          : [...l.roles, role],
                      }
                ),
              }
        )
      );
    },
    [singlePage.id, categoryTitle, setCategories]
  );

  const handleToggleBadge = useCallback(
    (badge: BadgeName) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((l) =>
                  l.id !== singlePage.id
                    ? l
                    : {
                        ...l,
                        hasBadge:
                          l.hasBadge && l.badgeName === badge ? false : true,
                        badgeName:
                          l.hasBadge && l.badgeName === badge
                            ? undefined
                            : badge,
                      }
                ),
              }
        )
      );
    },
    [singlePage.id, categoryTitle, setCategories]
  );

  const handleRename = useCallback(() => {
    dialogs.show({
      type: "edit",
      inputType: "input",
      title: "Rename link name",
      description: singlePage.title ?? singlePage.linkName,
      value: singlePage.title ?? singlePage.linkName,
      placeholder: "Enter new page title...",
      confirmLabel: "Save changes",
      cancelLabel: "Cancel",
      onConfirm: (value) => {
        const newTitle = value?.trim();
        if (!newTitle) return;

        const newSlug = transliterate(newTitle);
        const categoryHrefPrefix = `/` + transliterate(categoryTitle);

        setCategories((prev) => {
          return prev.map((cat) =>
            cat.title !== categoryTitle
              ? cat
              : {
                  ...cat,
                  pages: cat.pages.map((l) =>
                    l.id === singlePage.id
                      ? {
                          ...l,
                          title: newTitle,                   // сохраняем русское название
                          linkName: newTitle,                // можно сохранить для обратной совместимости
                          href: `${categoryHrefPrefix}/${newSlug}`,   // формируем новый url
                        }
                      : l
                  ),
                }
          );
        });
      },
      onCancel: () => {},
    });
  }, [singlePage.id, singlePage.linkName, singlePage.title, categoryTitle, setCategories, dialogs]);


  const handleDelete = useCallback(() => {
    dialogs.show({
      type: "delete",
      title: "Delete page",
      description: `Are you sure you want to delete page "${singlePage.linkName}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: () => {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.title !== categoryTitle
              ? cat
              : {
                  ...cat,
                  pages: cat.pages.filter((l) => l.id !== singlePage.id),
                }
          )
        );
      },
      onCancel: () => {
        // Действие при отмене (опционально)
      },
    });
  }, [
    singlePage.id,
    singlePage.linkName,
    categoryTitle,
    setCategories,
    dialogs,
  ]);

  return {
    handleToggleRole,
    handleToggleBadge,
    handleRename,
    handleDelete,
  };
}
