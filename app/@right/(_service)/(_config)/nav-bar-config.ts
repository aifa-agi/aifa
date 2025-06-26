import type { NavItem } from "../(_types)/nav-bar-types";

export const navBarPublicConfig = {
  mainNav: [
    { title: "Home", href: "/" },
    { title: "Blog", href: "/blog" },
    { title: "Documentation", href: "/docs" },
  ] as NavItem[],
};

export const navBarAdminConfig = {
  mainNav: [
    { title: "Admin Dashboard", href: "/admin" },
    { title: "Users", href: "/admin/users" },
  ] as NavItem[],
};

export const navBarConfigs = {
  Public: navBarPublicConfig.mainNav,
  Admin: navBarAdminConfig.mainNav,
};

export type NavBarLayout = keyof typeof navBarConfigs; // "Public" | "Admin"
