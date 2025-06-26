// @/app/@right/(_service)/(_types)/footer-types.ts

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type FooterNavItem = {
  title: string;
  items: NavItem[];
};

export type FooterTypes = FooterNavItem[];
