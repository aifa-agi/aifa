// @/app/@right/(_service)/(_config)/menu-data.ts

export type UserRole =
  | "guest"
  | "architect"
  | "admin"
  | "editor"
  | "authUser"
  | "subscriber"
  | "customer"
  | "apiUser";

export type BadgeName =
  | "NEW"
  | "AD"
  | "UPDATED"
  | "IMPORTANT"
  | "RECOMMENDATION";

export interface MenuLink {
  name: string;
  href?: string;
  roles: UserRole[]; // Now always two roles: ['guest', one more]
  hasBadge?: boolean;
  badgeName?: BadgeName;
}

export interface MenuCategory {
  title: string;
  links: MenuLink[];
}

/**
 * Utility: Returns a random non-guest role from availableRoles list
 */
function getRandomNonGuestRole(index: number): UserRole {
  const roles: UserRole[] = [
    "architect",
    "admin",
    "editor",
    "authUser",
    "subscriber",
    "customer",
    "apiUser",
  ];
  // To evenly distribute roles, use modulo by index
  return roles[index % roles.length];
}

export const menuData = {
  categories: [
    {
      title: "Test",
      links: [
        {
          name: "Test",
          href: "/public/test/man",
          roles: ["guest", "customer"],
        },
        {
          name: "Test2",
          href: "/public/test/",
          roles: ["guest", "customer"],
        },
        {
          name: "Test3",
          href: "/public/test/man/young",
          roles: ["guest", "customer"],
        },
        {
          name: "Privacy policy 1",
          href: "/privacy-policy?scroll-to=your-rights",
          roles: ["guest", "customer"],
        },
        {
          name: "Privacy policy 2",
          href: "/privacy-policy?scroll-to=info-collect",
          roles: ["guest", "customer"],
        },
        {
          name: "Privacy policy 3",
          href: "/privacy-policy?scroll-to=info-use",
          roles: ["guest", "customer"],
        },
      ],
    },
    {
      title: "WEBSITE",
      links: [
        {
          name: "Dashboard",
          href: "/docs/dashboard",
          roles: ["guest", "admin", "editor", "architect"],
        },
        {
          name: "User Management",
          href: "/docs/user-management",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "ADMIN",
        },
        {
          name: "Content Editor",
          href: "/docs/content-editor",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Analytics",
          href: "/docs/analytics",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Settings",
          href: "/docs/settings",
          roles: ["guest", "admin", "authUser"],
        },
        {
          name: "Profile",
          href: "/docs/profile",
          roles: ["guest", "authUser", "subscriber", "customer"],
        },
        {
          name: "Notifications",
          href: "/docs/notifications",
          roles: ["guest", "authUser", "admin", "editor"],
        },
        {
          name: "Reports",
          href: "/docs/reports",
          roles: ["guest", "admin", "architect"],
        },
        { name: "Logs", href: "/docs/logs", roles: ["guest", "admin"] },
        {
          name: "System Status",
          href: "/docs/system-status",
          roles: ["guest", "admin", "architect"],
          hasBadge: true,
          badgeName: "LIVE",
        },
        {
          name: "API Documentation",
          href: "/docs/api-docs",
          roles: ["guest", "apiUser", "architect", "admin"],
        },
        {
          name: "API Keys",
          href: "/docs/api-keys",
          roles: ["guest", "apiUser", "admin"],
        },
        {
          name: "Webhooks",
          href: "/docs/webhooks",
          roles: ["guest", "apiUser", "architect"],
        },
        {
          name: "SDK Downloads",
          href: "/docs/sdk-downloads",
          roles: ["guest", "apiUser", "architect"],
        },
        {
          name: "Developer Tools",
          href: "/docs/dev-tools",
          roles: ["guest", "architect", "apiUser"],
        },
        {
          name: "Code Examples",
          href: "/docs/code-examples",
          roles: ["guest", "apiUser", "architect"],
        },
        {
          name: "Testing Environment",
          href: "/docs/testing-env",
          roles: ["guest", "architect", "apiUser"],
        },
        {
          name: "Version Control",
          href: "/docs/version-control",
          roles: ["guest", "architect", "admin"],
        },
        {
          name: "Build Status",
          href: "/docs/build-status",
          roles: ["guest", "architect"],
          hasBadge: true,
          badgeName: "BETA",
        },
        {
          name: "Performance Monitor",
          href: "/docs/performance",
          roles: ["guest", "architect", "admin"],
        },
        {
          name: "Media Library",
          href: "/docs/media-library",
          roles: ["guest", "editor", "admin", "authUser"],
        },
        {
          name: "Blog Posts",
          href: "/docs/blog-posts",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Pages",
          href: "/docs/pages",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Categories",
          href: "/docs/categories",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Tags",
          href: "/docs/tags",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Comments",
          href: "/docs/comments",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "SEO Tools",
          href: "/docs/seo-tools",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Site Map",
          href: "/docs/sitemap",
          roles: ["guest", "editor", "admin", "architect"],
        },
        {
          name: "Content Templates",
          href: "/docs/content-templates",
          roles: ["guest", "editor", "admin"],
          hasBadge: true,
          badgeName: "PRO",
        },
        {
          name: "Backup Manager",
          href: "/docs/backup-manager",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "My Account",
          href: "/docs/my-account",
          roles: ["guest", "authUser", "subscriber", "customer"],
        },
        {
          name: "Subscription",
          href: "/docs/subscription",
          roles: ["guest", "subscriber", "customer"],
        },
        {
          name: "Billing",
          href: "/docs/billing",
          roles: ["guest", "subscriber", "customer", "admin"],
        },
        {
          name: "Order History",
          href: "/docs/order-history",
          roles: ["guest", "customer"],
        },
        {
          name: "Wishlist",
          href: "/docs/wishlist",
          roles: ["guest", "customer", "authUser"],
        },
        {
          name: "Downloads",
          href: "/docs/downloads",
          roles: ["guest", "customer", "subscriber"],
        },
        {
          name: "Support Tickets",
          href: "/docs/support-tickets",
          roles: ["guest", "authUser", "customer", "subscriber"],
        },
        {
          name: "Knowledge Base",
          href: "/docs/knowledge-base",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Tutorials",
          href: "/docs/tutorials",
          roles: ["guest", "authUser", "customer"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Community",
          href: "/docs/community",
          roles: ["guest", "authUser", "subscriber", "customer"],
        },
        {
          name: "Traffic Analytics",
          href: "/docs/traffic-analytics",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "User Behavior",
          href: "/docs/user-behavior",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Conversion Rates",
          href: "/docs/conversion-rates",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Revenue Reports",
          href: "/docs/revenue-reports",
          roles: ["guest", "admin"],
        },
        {
          name: "A/B Testing",
          href: "/docs/ab-testing",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Heat Maps",
          href: "/docs/heat-maps",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Error Tracking",
          href: "/docs/error-tracking",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Performance Metrics",
          href: "/docs/performance-metrics",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Custom Reports",
          href: "/docs/custom-reports",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "CUSTOM",
        },
        {
          name: "Data Export",
          href: "/docs/data-export",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Security Dashboard",
          href: "/docs/security-dashboard",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Access Control",
          href: "/docs/access-control",
          roles: ["guest", "admin"],
        },
        {
          name: "Audit Logs",
          href: "/docs/audit-logs",
          roles: ["guest", "admin"],
        },
        {
          name: "GDPR Compliance",
          href: "/docs/gdpr-compliance",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Data Privacy",
          href: "/docs/data-privacy",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "SSL Certificates",
          href: "/docs/ssl-certificates",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Firewall Settings",
          href: "/docs/firewall-settings",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Backup Security",
          href: "/docs/backup-security",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Two-Factor Auth",
          href: "/docs/two-factor-auth",
          roles: ["guest", "admin", "authUser"],
          hasBadge: true,
          badgeName: "SECURE",
        },
        {
          name: "Password Policy",
          href: "/docs/password-policy",
          roles: ["guest", "admin"],
        },
        {
          name: "Third-Party Apps",
          href: "/docs/third-party-apps",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Payment Gateways",
          href: "/docs/payment-gateways",
          roles: ["guest", "admin"],
        },
        {
          name: "Email Services",
          href: "/docs/email-services",
          roles: ["guest", "admin", "editor"],
        },
        {
          name: "Social Media",
          href: "/docs/social-media",
          roles: ["guest", "admin", "editor"],
        },
        {
          name: "Cloud Storage",
          href: "/docs/cloud-storage",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "CDN Settings",
          href: "/docs/cdn-settings",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Search Integration",
          href: "/docs/search-integration",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Chat Support",
          href: "/docs/chat-support",
          roles: ["guest", "admin", "customer", "subscriber"],
        },
        {
          name: "Newsletter",
          href: "/docs/newsletter",
          roles: ["guest", "admin", "editor", "subscriber"],
          hasBadge: true,
          badgeName: "WEEKLY",
        },
        {
          name: "Mobile App",
          href: "/docs/mobile-app",
          roles: ["guest", "admin", "authUser", "customer"],
        },
        {
          name: "Help Center",
          href: "/docs/help-center",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "FAQ",
          href: "/docs/faq",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Contact Us",
          href: "/docs/contact-us",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "About Us",
          href: "/docs/about-us",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Terms of Service",
          href: "/docs/terms-of-service",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Privacy Policy",
          href: "/docs/privacy-policy",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Careers",
          href: "/docs/careers",
          roles: ["guest", "authUser"],
          hasBadge: true,
          badgeName: "HIRING",
        },
        {
          name: "Press Kit",
          href: "/docs/press-kit",
          roles: ["guest", "authUser"],
        },
        {
          name: "Partners",
          href: "/docs/partners",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Feedback",
          href: "/docs/feedback",
          roles: ["guest", "authUser", "customer", "subscriber"],
          hasBadge: true,
          badgeName: "VALUED",
        },
      ],
    },
    {
      title: "COMMERCE",
      links: [
        {
          name: "Ecommerce",
          href: "/docs/ecommerce",
          roles: ["guest", "customer"],
        },
        {
          name: "Ecommerce Templates",
          href: "/docs/ecommerce-templates",
          roles: ["guest", "admin"],
        },
        {
          name: "Online Stores",
          href: "/docs/stores",
          roles: ["guest", "customer"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        {
          name: "Services",
          href: "/docs/services",
          roles: ["guest", "editor"],
        },
        {
          name: "Invoicing",
          href: "/docs/invoicing",
          roles: ["guest", "authUser"],
          hasBadge: true,
          badgeName: "AD",
        },
      ],
    },
    {
      title: "MARKETING",
      links: [
        {
          name: "Marketing Tools",
          href: "/docs/marketing",
          roles: ["guest", "editor"],
        },
        {
          name: "Email Campaigns",
          href: "/docs/email",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "NEW",
        },
        {
          name: "SEO Tools",
          href: "/docs/seo",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Free Tools",
          href: "/docs/free-tools",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Recommendation",
          href: "/docs/recommendation-2",
          roles: ["guest", "authUser"],
          hasBadge: true,
          badgeName: "RECOMMENDATION",
        },
      ],
    },
    {
      title: "DOMAINS",
      links: [
        {
          name: "Find a Domain",
          href: "/docs/find-domain",
          roles: ["guest", "editor"],
        },
        {
          name: "Transfer a Domain",
          href: "/docs/transfer-domain",
          roles: ["guest", "admin"],
        },
        {
          name: "Domain Management",
          href: "/docs/domain-management",
          roles: ["guest", "architect"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "DNS Settings",
          href: "/docs/dns",
          roles: ["guest", "apiUser"],
        },
      ],
    },

    {
      title: "ANALYTICS",
      links: [
        {
          name: "Website Analytics",
          href: "/docs/analytics",
          roles: ["guest", "architect"],
          hasBadge: true,
          badgeName: "NEW",
        },
        {
          name: "Traffic Reports",
          href: "/docs/traffic",
          roles: ["guest", "admin"],
        },
        {
          name: "Conversion Tracking",
          href: "/docs/conversion",
          roles: ["guest", "editor"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        {
          name: "User Behavior",
          href: "/docs/behavior",
          roles: ["guest", "customer"],
        },
        {
          name: "Performance Metrics",
          href: "/docs/performance",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Custom Dashboards",
          href: "/docs/dashboards",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Real-time Data",
          href: "/docs/realtime",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Export Tools",
          href: "/docs/export",
          roles: ["guest", "editor"],
        },
        {
          name: "API Access",
          href: "/docs/api",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Advanced Filters",
          href: "/docs/filters",
          roles: ["guest", "architect"],
        },
        {
          name: "Automated Reports",
          href: "/docs/reports",
          roles: ["guest", "authUser"],
          hasBadge: true,
          badgeName: "AD",
        },
        {
          name: "Goal Tracking",
          href: "/docs/goals",
          roles: ["guest", "customer"],
        },
      ],
    },
    {
      title: "DESIGN",
      links: [
        {
          name: "Logo Maker",
          href: "/docs/logo",
          roles: ["guest", "architect"],
        },
        {
          name: "Brand Kit",
          href: "/docs/brand",
          roles: ["guest", "editor"],
          hasBadge: true,
          badgeName: "NEW",
        },
        {
          name: "Color Palette",
          href: "/docs/colors",
          roles: ["guest", "admin"],
        },
        {
          name: "Font Library",
          href: "/docs/fonts",
          roles: ["guest", "authUser"],
        },
        {
          name: "Image Editor",
          href: "/docs/image-editor",
          roles: ["guest", "subscriber"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Icon Collection",
          href: "/docs/icons",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Template Gallery",
          href: "/docs/gallery",
          roles: ["guest", "customer"],
        },
        {
          name: "Recommendation",
          href: "/docs/recommendation-3",
          roles: ["guest", "editor"],
          hasBadge: true,
          badgeName: "RECOMMENDATION",
        },
      ],
    },
    {
      title: "HOSTING",
      links: [
        {
          name: "Web Hosting",
          href: "/docs/hosting",
          roles: ["guest", "admin"],
        },
        {
          name: "Cloud Storage",
          href: "/docs/storage",
          roles: ["guest", "editor"],
        },
        {
          name: "CDN Services",
          href: "/docs/cdn",
          roles: ["guest", "customer"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        {
          name: "SSL Certificates",
          href: "/docs/ssl",
          roles: ["guest", "architect"],
        },
        {
          name: "Backup Solutions",
          href: "/docs/backup",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Server Management",
          href: "/docs/server",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Database Hosting",
          href: "/docs/database",
          roles: ["guest", "customer"],
        },
        {
          name: "Email Hosting",
          href: "/docs/email-hosting",
          roles: ["guest", "authUser"],
        },
        { name: "FTP Access", href: "/docs/ftp", roles: ["guest", "editor"] },
        {
          name: "Custom Domains",
          href: "/docs/custom-domains",
          roles: ["guest", "architect"],
        },
        {
          name: "Staging Environment",
          href: "/docs/staging",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "NEW",
        },
        {
          name: "Load Balancing",
          href: "/docs/load-balancing",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Security Monitoring",
          href: "/docs/security",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Performance Optimization",
          href: "/docs/optimization",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Technical Support",
          href: "/docs/support",
          roles: ["guest", "customer"],
        },
      ],
    },
    {
      title: "INTEGRATIONS",
      links: [
        {
          name: "Third-party Apps",
          href: "/docs/apps",
          roles: ["guest", "authUser"],
        },
        {
          name: "API Connections",
          href: "/docs/api-connections",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        {
          name: "Webhook Setup",
          href: "/docs/webhooks",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Social Media",
          href: "/docs/social",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Payment Gateways",
          href: "/docs/payments",
          roles: ["guest", "editor"],
          hasBadge: true,
          badgeName: "AD",
        },
        {
          name: "CRM Integration",
          href: "/docs/crm",
          roles: ["guest", "customer"],
        },
        {
          name: "Email Marketing",
          href: "/docs/email-marketing",
          roles: ["guest", "architect"],
        },
        {
          name: "Analytics Tools",
          href: "/docs/analytics-tools",
          roles: ["guest", "editor"],
        },
        {
          name: "Chat Widgets",
          href: "/docs/chat",
          roles: ["guest", "authUser"],
          hasBadge: true,
          badgeName: "NEW",
        },
      ],
    },
  ] as MenuCategory[],
};

// Type for consumers
export type MenuData = typeof menuData;
