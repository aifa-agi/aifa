// @/app/@right/(_service)/(_types)/nav-bar-types.ts

export type UserType =
  | "guest"
  | "architect"
  | "admin"
  | "editor"
  | "authUser"
  | "subscriber"
  | "customer";

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
