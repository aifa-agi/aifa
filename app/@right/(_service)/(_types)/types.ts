export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type NavBarTypes = {
  mainNav: MainNavItem[];
};

export type FooterNavItem = {
  title: string;
  items: NavItem[];
};
