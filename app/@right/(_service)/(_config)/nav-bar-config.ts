// @/app/@right/(_service)/(_config)/nav-bar-config.ts

import type { NavItem, UserType } from "../(_types)/nav-bar-types";

export const navBarPublicConfig = {
  mainNav: [
    { title: "Home", href: "/" }, // доступно всем
    { title: "Blog", href: "/blog" }, // доступно всем
    { title: "Documentation", href: "/docs", roles: ["authUser", "admin"] },
  ] as NavItem[],
};

export const navBarAdminConfig = {
  mainNav: [
    { title: "Admin Dashboard", href: "/admin", roles: ["admin"] },
    { title: "Users", href: "/admin/users", roles: ["admin"] },
  ] as NavItem[],
};

export const navBarConfigs = {
  Public: navBarPublicConfig.mainNav,
  Admin: navBarAdminConfig.mainNav,
};

export type NavBarLayout = keyof typeof navBarConfigs;
