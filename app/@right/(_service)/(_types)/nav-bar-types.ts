// @/app/@right/(_service)/(_types)/nav-bar-types.ts

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type NavBarTypes = {
  mainNav: MainNavItem[];
};
