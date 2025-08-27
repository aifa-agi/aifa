// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/link-actions-dropdown/hooks/use-link-logic.ts

import { useCallback } from "react";
import { LinkState, LinkConfiguration, LinkType } from "../types";
import {
  getLinkState,
  getLinkConfiguration,
  isDropdownInteractive,
  toggleLinkItemState,
  updateLinkConfiguration,
} from "../link-utils";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

interface UseLinkLogicProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

interface UseLinkLogicReturn {
  linkState: LinkState;
  linkConfiguration: LinkConfiguration;
  isInteractive: boolean;
  handleLinkToggle: (linkType: LinkType) => void;
}

/**
 * Custom hook to handle link management logic and state management
 */
export function useLinkLogic({
  singlePage,
  categoryTitle,
  setCategories,
}: UseLinkLogicProps): UseLinkLogicReturn {
  const linkState = getLinkState(singlePage);
  const linkConfiguration = getLinkConfiguration(singlePage);
  const isInteractive = isDropdownInteractive(linkState);

  const handleLinkToggle = useCallback(
    (linkType: LinkType) => {
      // Only allow toggle if dropdown is interactive
      if (!isInteractive) {
        console.warn("Cannot toggle link: content not ready");
        return;
      }

      const currentState = linkConfiguration[linkType];
      const newState = toggleLinkItemState(currentState);
      const newConfiguration = updateLinkConfiguration(
        linkConfiguration,
        linkType,
        newState
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((page) =>
                  page.id !== singlePage.id
                    ? page
                    : ({
                        ...page,
                        linkConfiguration: newConfiguration,
                      } as any)
                ),
              }
        )
      );

      console.log(
        "LINK TOGGLED",
        singlePage.id,
        linkType,
        `${currentState} -> ${newState}`
      );
    },
    [
      singlePage.id,
      categoryTitle,
      setCategories,
      isInteractive,
      linkConfiguration,
    ]
  );

  return {
    linkState,
    linkConfiguration,
    isInteractive,
    handleLinkToggle,
  };
}
