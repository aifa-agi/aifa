// app/menu-data.ts

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
      title: "WEBSITE",
      links: [
        {
          name: "Dashboard",
          href: "/public/dashboard",
          roles: ["guest", "admin", "editor", "architect"],
        },
        {
          name: "User Management",
          href: "/public/user-management",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "ADMIN",
        },
        {
          name: "Content Editor",
          href: "/public/content-editor",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Analytics",
          href: "/public/analytics",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Settings",
          href: "/public/settings",
          roles: ["guest", "admin", "authUser"],
        },
        {
          name: "Profile",
          href: "/public/profile",
          roles: ["guest", "authUser", "subscriber", "customer"],
        },
        {
          name: "Notifications",
          href: "/public/notifications",
          roles: ["guest", "authUser", "admin", "editor"],
        },
        {
          name: "Reports",
          href: "/public/reports",
          roles: ["guest", "admin", "architect"],
        },
        { name: "Logs", href: "/public/logs", roles: ["guest", "admin"] },
        {
          name: "System Status",
          href: "/public/system-status",
          roles: ["guest", "admin", "architect"],
          hasBadge: true,
          badgeName: "LIVE",
        },
        {
          name: "API Documentation",
          href: "/public/api-docs",
          roles: ["guest", "apiUser", "architect", "admin"],
        },
        {
          name: "API Keys",
          href: "/public/api-keys",
          roles: ["guest", "apiUser", "admin"],
        },
        {
          name: "Webhooks",
          href: "/public/webhooks",
          roles: ["guest", "apiUser", "architect"],
        },
        {
          name: "SDK Downloads",
          href: "/public/sdk-downloads",
          roles: ["guest", "apiUser", "architect"],
        },
        {
          name: "Developer Tools",
          href: "/public/dev-tools",
          roles: ["guest", "architect", "apiUser"],
        },
        {
          name: "Code Examples",
          href: "/public/code-examples",
          roles: ["guest", "apiUser", "architect"],
        },
        {
          name: "Testing Environment",
          href: "/public/testing-env",
          roles: ["guest", "architect", "apiUser"],
        },
        {
          name: "Version Control",
          href: "/public/version-control",
          roles: ["guest", "architect", "admin"],
        },
        {
          name: "Build Status",
          href: "/public/build-status",
          roles: ["guest", "architect"],
          hasBadge: true,
          badgeName: "BETA",
        },
        {
          name: "Performance Monitor",
          href: "/public/performance",
          roles: ["guest", "architect", "admin"],
        },
        {
          name: "Media Library",
          href: "/public/media-library",
          roles: ["guest", "editor", "admin", "authUser"],
        },
        {
          name: "Blog Posts",
          href: "/public/blog-posts",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Pages",
          href: "/public/pages",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Categories",
          href: "/public/categories",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Tags",
          href: "/public/tags",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Comments",
          href: "/public/comments",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "SEO Tools",
          href: "/public/seo-tools",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Site Map",
          href: "/public/sitemap",
          roles: ["guest", "editor", "admin", "architect"],
        },
        {
          name: "Content Templates",
          href: "/public/content-templates",
          roles: ["guest", "editor", "admin"],
          hasBadge: true,
          badgeName: "PRO",
        },
        {
          name: "Backup Manager",
          href: "/public/backup-manager",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "My Account",
          href: "/public/my-account",
          roles: ["guest", "authUser", "subscriber", "customer"],
        },
        {
          name: "Subscription",
          href: "/public/subscription",
          roles: ["guest", "subscriber", "customer"],
        },
        {
          name: "Billing",
          href: "/public/billing",
          roles: ["guest", "subscriber", "customer", "admin"],
        },
        {
          name: "Order History",
          href: "/public/order-history",
          roles: ["guest", "customer"],
        },
        {
          name: "Wishlist",
          href: "/public/wishlist",
          roles: ["guest", "customer", "authUser"],
        },
        {
          name: "Downloads",
          href: "/public/downloads",
          roles: ["guest", "customer", "subscriber"],
        },
        {
          name: "Support Tickets",
          href: "/public/support-tickets",
          roles: ["guest", "authUser", "customer", "subscriber"],
        },
        {
          name: "Knowledge Base",
          href: "/public/knowledge-base",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Tutorials",
          href: "/public/tutorials",
          roles: ["guest", "authUser", "customer"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Community",
          href: "/public/community",
          roles: ["guest", "authUser", "subscriber", "customer"],
        },
        {
          name: "Traffic Analytics",
          href: "/public/traffic-analytics",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "User Behavior",
          href: "/public/user-behavior",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Conversion Rates",
          href: "/public/conversion-rates",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Revenue Reports",
          href: "/public/revenue-reports",
          roles: ["guest", "admin"],
        },
        {
          name: "A/B Testing",
          href: "/public/ab-testing",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Heat Maps",
          href: "/public/heat-maps",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Error Tracking",
          href: "/public/error-tracking",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Performance Metrics",
          href: "/public/performance-metrics",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Custom Reports",
          href: "/public/custom-reports",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "CUSTOM",
        },
        {
          name: "Data Export",
          href: "/public/data-export",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Security Dashboard",
          href: "/public/security-dashboard",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Access Control",
          href: "/public/access-control",
          roles: ["guest", "admin"],
        },
        {
          name: "Audit Logs",
          href: "/public/audit-logs",
          roles: ["guest", "admin"],
        },
        {
          name: "GDPR Compliance",
          href: "/public/gdpr-compliance",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Data Privacy",
          href: "/public/data-privacy",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "SSL Certificates",
          href: "/public/ssl-certificates",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Firewall Settings",
          href: "/public/firewall-settings",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Backup Security",
          href: "/public/backup-security",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Two-Factor Auth",
          href: "/public/two-factor-auth",
          roles: ["guest", "admin", "authUser"],
          hasBadge: true,
          badgeName: "SECURE",
        },
        {
          name: "Password Policy",
          href: "/public/password-policy",
          roles: ["guest", "admin"],
        },
        {
          name: "Third-Party Apps",
          href: "/public/third-party-apps",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Payment Gateways",
          href: "/public/payment-gateways",
          roles: ["guest", "admin"],
        },
        {
          name: "Email Services",
          href: "/public/email-services",
          roles: ["guest", "admin", "editor"],
        },
        {
          name: "Social Media",
          href: "/public/social-media",
          roles: ["guest", "admin", "editor"],
        },
        {
          name: "Cloud Storage",
          href: "/public/cloud-storage",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "CDN Settings",
          href: "/public/cdn-settings",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Search Integration",
          href: "/public/search-integration",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Chat Support",
          href: "/public/chat-support",
          roles: ["guest", "admin", "customer", "subscriber"],
        },
        {
          name: "Newsletter",
          href: "/public/newsletter",
          roles: ["guest", "admin", "editor", "subscriber"],
          hasBadge: true,
          badgeName: "WEEKLY",
        },
        {
          name: "Mobile App",
          href: "/public/mobile-app",
          roles: ["guest", "admin", "authUser", "customer"],
        },
        {
          name: "Help Center",
          href: "/public/help-center",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "FAQ",
          href: "/public/faq",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Contact Us",
          href: "/public/contact-us",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "About Us",
          href: "/public/about-us",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Terms of Service",
          href: "/public/terms-of-service",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Privacy Policy",
          href: "/public/privacy-policy",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Careers",
          href: "/public/careers",
          roles: ["guest", "authUser"],
          hasBadge: true,
          badgeName: "HIRING",
        },
        {
          name: "Press Kit",
          href: "/public/press-kit",
          roles: ["guest", "authUser"],
        },
        {
          name: "Partners",
          href: "/public/partners",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Feedback",
          href: "/public/feedback",
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
          href: "/public/ecommerce",
          roles: ["guest", "customer"],
        },
        {
          name: "Ecommerce Templates",
          href: "/public/ecommerce-templates",
          roles: ["guest", "admin"],
        },
        {
          name: "Online Stores",
          href: "/public/stores",
          roles: ["guest", "customer"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        {
          name: "Services",
          href: "/public/services",
          roles: ["guest", "editor"],
        },
        {
          name: "Invoicing",
          href: "/public/invoicing",
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
          href: "/public/marketing",
          roles: ["guest", "editor"],
        },
        {
          name: "Email Campaigns",
          href: "/public/email",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "NEW",
        },
        {
          name: "SEO Tools",
          href: "/public/seo",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Free Tools",
          href: "/public/free-tools",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Recommendation",
          href: "/public/recommendation-2",
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
          href: "/public/find-domain",
          roles: ["guest", "editor"],
        },
        {
          name: "Transfer a Domain",
          href: "/public/transfer-domain",
          roles: ["guest", "admin"],
        },
        {
          name: "Domain Management",
          href: "/public/domain-management",
          roles: ["guest", "architect"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "DNS Settings",
          href: "/public/dns",
          roles: ["guest", "apiUser"],
        },
      ],
    },

    {
      title: "ANALYTICS",
      links: [
        {
          name: "Website Analytics",
          href: "/public/analytics",
          roles: ["guest", "architect"],
          hasBadge: true,
          badgeName: "NEW",
        },
        {
          name: "Traffic Reports",
          href: "/public/traffic",
          roles: ["guest", "admin"],
        },
        {
          name: "Conversion Tracking",
          href: "/public/conversion",
          roles: ["guest", "editor"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        {
          name: "User Behavior",
          href: "/public/behavior",
          roles: ["guest", "customer"],
        },
        {
          name: "Performance Metrics",
          href: "/public/performance",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Custom Dashboards",
          href: "/public/dashboards",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Real-time Data",
          href: "/public/realtime",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Export Tools",
          href: "/public/export",
          roles: ["guest", "editor"],
        },
        {
          name: "API Access",
          href: "/public/api",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Advanced Filters",
          href: "/public/filters",
          roles: ["guest", "architect"],
        },
        {
          name: "Automated Reports",
          href: "/public/reports",
          roles: ["guest", "authUser"],
          hasBadge: true,
          badgeName: "AD",
        },
        {
          name: "Goal Tracking",
          href: "/public/goals",
          roles: ["guest", "customer"],
        },
      ],
    },
    {
      title: "DESIGN",
      links: [
        {
          name: "Logo Maker",
          href: "/public/logo",
          roles: ["guest", "architect"],
        },
        {
          name: "Brand Kit",
          href: "/public/brand",
          roles: ["guest", "editor"],
          hasBadge: true,
          badgeName: "NEW",
        },
        {
          name: "Color Palette",
          href: "/public/colors",
          roles: ["guest", "admin"],
        },
        {
          name: "Font Library",
          href: "/public/fonts",
          roles: ["guest", "authUser"],
        },
        {
          name: "Image Editor",
          href: "/public/image-editor",
          roles: ["guest", "subscriber"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Icon Collection",
          href: "/public/icons",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Template Gallery",
          href: "/public/gallery",
          roles: ["guest", "customer"],
        },
        {
          name: "Recommendation",
          href: "/public/recommendation-3",
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
          href: "/public/hosting",
          roles: ["guest", "admin"],
        },
        {
          name: "Cloud Storage",
          href: "/public/storage",
          roles: ["guest", "editor"],
        },
        {
          name: "CDN Services",
          href: "/public/cdn",
          roles: ["guest", "customer"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        {
          name: "SSL Certificates",
          href: "/public/ssl",
          roles: ["guest", "architect"],
        },
        {
          name: "Backup Solutions",
          href: "/public/backup",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Server Management",
          href: "/public/server",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Database Hosting",
          href: "/public/database",
          roles: ["guest", "customer"],
        },
        {
          name: "Email Hosting",
          href: "/public/email-hosting",
          roles: ["guest", "authUser"],
        },
        { name: "FTP Access", href: "/public/ftp", roles: ["guest", "editor"] },
        {
          name: "Custom Domains",
          href: "/public/custom-domains",
          roles: ["guest", "architect"],
        },
        {
          name: "Staging Environment",
          href: "/public/staging",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "NEW",
        },
        {
          name: "Load Balancing",
          href: "/public/load-balancing",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Security Monitoring",
          href: "/public/security",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Performance Optimization",
          href: "/public/optimization",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Technical Support",
          href: "/public/support",
          roles: ["guest", "customer"],
        },
      ],
    },
    {
      title: "INTEGRATIONS",
      links: [
        {
          name: "Third-party Apps",
          href: "/public/apps",
          roles: ["guest", "authUser"],
        },
        {
          name: "API Connections",
          href: "/public/api-connections",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        {
          name: "Webhook Setup",
          href: "/public/webhooks",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Social Media",
          href: "/public/social",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Payment Gateways",
          href: "/public/payments",
          roles: ["guest", "editor"],
          hasBadge: true,
          badgeName: "AD",
        },
        {
          name: "CRM Integration",
          href: "/public/crm",
          roles: ["guest", "customer"],
        },
        {
          name: "Email Marketing",
          href: "/public/email-marketing",
          roles: ["guest", "architect"],
        },
        {
          name: "Analytics Tools",
          href: "/public/analytics-tools",
          roles: ["guest", "editor"],
        },
        {
          name: "Chat Widgets",
          href: "/public/chat",
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
