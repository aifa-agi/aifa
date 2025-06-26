// @/app/@right/(_service)/(_config)/footer-config.ts

import { FooterTypes } from "../(_types)/footer-types";

// Public footer config
export const footerPublicConfig: FooterTypes = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/public/terms-of-service" },
      { title: "Privacy", href: "/public/privacy-policy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Security", href: "#" },
      { title: "Customization", href: "#" },
      { title: "Customers", href: "#" },
      { title: "Changelog", href: "#" },
    ],
  },
  {
    title: "Docs",
    items: [
      { title: "Introduction", href: "#" },
      { title: "Installation", href: "#" },
      { title: "Components", href: "#" },
      { title: "Code Blocks", href: "#" },
    ],
  },
];

// Admin footer config
export const footerAdminConfig: FooterTypes = [
  {
    title: "Admin Panel",
    items: [
      { title: "Dashboard", href: "/admin" },
      { title: "Users", href: "/admin/users" },
      { title: "Settings", href: "/admin/settings" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Help Center", href: "/admin/help" },
      { title: "Contact Support", href: "/admin/contact" },
    ],
  },
];

// Universal footer configs object
export const footerConfigs = {
  Public: footerPublicConfig,
  Admin: footerAdminConfig,
  // Add more layouts as needed
};

export type FooterLayout = keyof typeof footerConfigs; // "Public" | "Admin"
