// @/app/@right/(_service)/(_config)/footer-config.ts

import { FooterTypes } from "../(_types)/footer-types";

export const footerPublicConfig: FooterTypes = [
  {
    category: "Company",
    roles: ["guest", "authUser", "admin"],
    items: [
      { title: "About", href: "#" },
      { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/terms-of-service" },
      { title: "Privacy", href: "/privacy-policy" },
    ],
  },
  {
    category: "Product",
    items: [
      { title: "Security", href: "#" },
      { title: "Customization", href: "#" },
      { title: "Customers", href: "#" },
      { title: "Changelog", href: "#" },
    ],
  },
  {
    category: "Docs",
    roles: ["authUser", "admin"],
    items: [
      { title: "Introduction", href: "#" },
      { title: "Installation", href: "#" },
      { title: "Components", href: "#" },
      { title: "Code Blocks", href: "#" },
    ],
  },
];

export const footerAdminConfig: FooterTypes = [
  {
    category: "Admin Panel",
    roles: ["admin"],
    items: [
      { title: "Dashboard", href: "/admin" },
      { title: "Users", href: "/admin/users" },
      { title: "Settings", href: "/admin/settings" },
    ],
  },
  {
    category: "Support",
    roles: ["admin"],
    items: [
      { title: "Help Center", href: "/admin/help" },
      { title: "Contact Support", href: "/admin/contact" },
    ],
  },
];

export const footerConfigs = {
  Public: footerPublicConfig,
  Admin: footerAdminConfig,
};

export type FooterLayout = keyof typeof footerConfigs;
