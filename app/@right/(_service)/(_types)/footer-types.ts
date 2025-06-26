// @/app/@right/(_service)/(_types)/footer-types.ts

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
};

export type FooterNavItem = {
  category: string;
  roles?: UserType[];
  items: NavItem[];
};

export type FooterTypes = FooterNavItem[];
