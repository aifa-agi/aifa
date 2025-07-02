// @/app/@right/(_service)/(_types)/nav-bar-types.ts

import { UserType } from "@prisma/client";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  roles?: UserType[];
};

export type MainNavItem = NavItem;

export type NavBarTypes = {
  mainNav: MainNavItem[];
};
