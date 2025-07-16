// @/app/@right/(_service)/(_config)/nav-bar-config.ts

import type { NavItem } from "../(_types)/nav-bar-types";

export const navBarPublicConfig = {
  mainNav: [
    { title: "Home", href: "/", roles: ["admin"] },
    { title: "Blog", href: "/public", roles: ["admin"] },
    { title: "Documentation", href: "/public", roles: ["authUser", "admin"] },
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
