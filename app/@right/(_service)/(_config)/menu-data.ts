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
          href: "/dashboard",
          roles: ["guest", "admin", "editor", "architect"],
        },
        {
          name: "User Management",
          href: "/user-management",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "ADMIN",
        },
        {
          name: "Content Editor",
          href: "/content-editor",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Analytics",
          href: "/analytics",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Settings",
          href: "/settings",
          roles: ["guest", "admin", "authUser"],
        },
        {
          name: "Profile",
          href: "/profile",
          roles: ["guest", "authUser", "subscriber", "customer"],
        },
        {
          name: "Notifications",
          href: "/notifications",
          roles: ["guest", "authUser", "admin", "editor"],
        },
        {
          name: "Reports",
          href: "/reports",
          roles: ["guest", "admin", "architect"],
        },
        { name: "Logs", href: "/logs", roles: ["guest", "admin"] },
        {
          name: "System Status",
          href: "/system-status",
          roles: ["guest", "admin", "architect"],
          hasBadge: true,
          badgeName: "LIVE",
        },
        {
          name: "API Documentation",
          href: "/api-docs",
          roles: ["guest", "apiUser", "architect", "admin"],
        },
        {
          name: "API Keys",
          href: "/api-keys",
          roles: ["guest", "apiUser", "admin"],
        },
        {
          name: "Webhooks",
          href: "/webhooks",
          roles: ["guest", "apiUser", "architect"],
        },
        {
          name: "SDK Downloads",
          href: "/sdk-downloads",
          roles: ["guest", "apiUser", "architect"],
        },
        {
          name: "Developer Tools",
          href: "/dev-tools",
          roles: ["guest", "architect", "apiUser"],
        },
        {
          name: "Code Examples",
          href: "/code-examples",
          roles: ["guest", "apiUser", "architect"],
        },
        {
          name: "Testing Environment",
          href: "/testing-env",
          roles: ["guest", "architect", "apiUser"],
        },
        {
          name: "Version Control",
          href: "/version-control",
          roles: ["guest", "architect", "admin"],
        },
        {
          name: "Build Status",
          href: "/build-status",
          roles: ["guest", "architect"],
          hasBadge: true,
          badgeName: "BETA",
        },
        {
          name: "Performance Monitor",
          href: "/performance",
          roles: ["guest", "architect", "admin"],
        },
        {
          name: "Media Library",
          href: "/media-library",
          roles: ["guest", "editor", "admin", "authUser"],
        },
        {
          name: "Blog Posts",
          href: "/blog-posts",
          roles: ["guest", "editor", "admin"],
        },
        { name: "Pages", href: "/pages", roles: ["guest", "editor", "admin"] },
        {
          name: "Categories",
          href: "/categories",
          roles: ["guest", "editor", "admin"],
        },
        { name: "Tags", href: "/tags", roles: ["guest", "editor", "admin"] },
        {
          name: "Comments",
          href: "/comments",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "SEO Tools",
          href: "/seo-tools",
          roles: ["guest", "editor", "admin"],
        },
        {
          name: "Site Map",
          href: "/sitemap",
          roles: ["guest", "editor", "admin", "architect"],
        },
        {
          name: "Content Templates",
          href: "/content-templates",
          roles: ["guest", "editor", "admin"],
          hasBadge: true,
          badgeName: "PRO",
        },
        {
          name: "Backup Manager",
          href: "/backup-manager",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "My Account",
          href: "/my-account",
          roles: ["guest", "authUser", "subscriber", "customer"],
        },
        {
          name: "Subscription",
          href: "/subscription",
          roles: ["guest", "subscriber", "customer"],
        },
        {
          name: "Billing",
          href: "/billing",
          roles: ["guest", "subscriber", "customer", "admin"],
        },
        {
          name: "Order History",
          href: "/order-history",
          roles: ["guest", "customer"],
        },
        {
          name: "Wishlist",
          href: "/wishlist",
          roles: ["guest", "customer", "authUser"],
        },
        {
          name: "Downloads",
          href: "/downloads",
          roles: ["guest", "customer", "subscriber"],
        },
        {
          name: "Support Tickets",
          href: "/support-tickets",
          roles: ["guest", "authUser", "customer", "subscriber"],
        },
        {
          name: "Knowledge Base",
          href: "/knowledge-base",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Tutorials",
          href: "/tutorials",
          roles: ["guest", "authUser", "customer"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Community",
          href: "/community",
          roles: ["guest", "authUser", "subscriber", "customer"],
        },
        {
          name: "Traffic Analytics",
          href: "/traffic-analytics",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "User Behavior",
          href: "/user-behavior",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Conversion Rates",
          href: "/conversion-rates",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Revenue Reports",
          href: "/revenue-reports",
          roles: ["guest", "admin"],
        },
        {
          name: "A/B Testing",
          href: "/ab-testing",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Heat Maps",
          href: "/heat-maps",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Error Tracking",
          href: "/error-tracking",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Performance Metrics",
          href: "/performance-metrics",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Custom Reports",
          href: "/custom-reports",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "CUSTOM",
        },
        {
          name: "Data Export",
          href: "/data-export",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Security Dashboard",
          href: "/security-dashboard",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Access Control",
          href: "/access-control",
          roles: ["guest", "admin"],
        },
        { name: "Audit Logs", href: "/audit-logs", roles: ["guest", "admin"] },
        {
          name: "GDPR Compliance",
          href: "/gdpr-compliance",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Data Privacy",
          href: "/data-privacy",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "SSL Certificates",
          href: "/ssl-certificates",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Firewall Settings",
          href: "/firewall-settings",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Backup Security",
          href: "/backup-security",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Two-Factor Auth",
          href: "/two-factor-auth",
          roles: ["guest", "admin", "authUser"],
          hasBadge: true,
          badgeName: "SECURE",
        },
        {
          name: "Password Policy",
          href: "/password-policy",
          roles: ["guest", "admin"],
        },
        {
          name: "Third-Party Apps",
          href: "/third-party-apps",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Payment Gateways",
          href: "/payment-gateways",
          roles: ["guest", "admin"],
        },
        {
          name: "Email Services",
          href: "/email-services",
          roles: ["guest", "admin", "editor"],
        },
        {
          name: "Social Media",
          href: "/social-media",
          roles: ["guest", "admin", "editor"],
        },
        {
          name: "Cloud Storage",
          href: "/cloud-storage",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "CDN Settings",
          href: "/cdn-settings",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Search Integration",
          href: "/search-integration",
          roles: ["guest", "admin", "architect"],
        },
        {
          name: "Chat Support",
          href: "/chat-support",
          roles: ["guest", "admin", "customer", "subscriber"],
        },
        {
          name: "Newsletter",
          href: "/newsletter",
          roles: ["guest", "admin", "editor", "subscriber"],
          hasBadge: true,
          badgeName: "WEEKLY",
        },
        {
          name: "Mobile App",
          href: "/mobile-app",
          roles: ["guest", "admin", "authUser", "customer"],
        },
        {
          name: "Help Center",
          href: "/help-center",
          roles: ["guest", "authUser", "customer"],
        },
        { name: "FAQ", href: "/faq", roles: ["guest", "authUser", "customer"] },
        {
          name: "Contact Us",
          href: "/contact-us",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "About Us",
          href: "/about-us",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Terms of Service",
          href: "/terms-of-service",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Privacy Policy",
          href: "/privacy-policy",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Careers",
          href: "/careers",
          roles: ["guest", "authUser"],
          hasBadge: true,
          badgeName: "HIRING",
        },
        { name: "Press Kit", href: "/press-kit", roles: ["guest", "authUser"] },
        {
          name: "Partners",
          href: "/partners",
          roles: ["guest", "authUser", "customer"],
        },
        {
          name: "Feedback",
          href: "/feedback",
          roles: ["guest", "authUser", "customer", "subscriber"],
          hasBadge: true,
          badgeName: "VALUED",
        },
      ],
    },
    {
      title: "COMMERCE",
      links: [
        { name: "Ecommerce", href: "/ecommerce", roles: ["guest", "customer"] },
        {
          name: "Ecommerce Templates",
          href: "/ecommerce-templates",
          roles: ["guest", "admin"],
        },
        {
          name: "Online Stores",
          href: "/stores",
          roles: ["guest", "customer"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        { name: "Services", href: "/services", roles: ["guest", "editor"] },
        {
          name: "Invoicing",
          href: "/invoicing",
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
          href: "/marketing",
          roles: ["guest", "editor"],
        },
        {
          name: "Email Campaigns",
          href: "/email",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "NEW",
        },
        { name: "SEO Tools", href: "/seo", roles: ["guest", "subscriber"] },
        {
          name: "Free Tools",
          href: "/free-tools",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Recommendation",
          href: "/recommendation-2",
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
          href: "/find-domain",
          roles: ["guest", "editor"],
        },
        {
          name: "Transfer a Domain",
          href: "/transfer-domain",
          roles: ["guest", "admin"],
        },
        {
          name: "Domain Management",
          href: "/domain-management",
          roles: ["guest", "architect"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        { name: "DNS Settings", href: "/dns", roles: ["guest", "apiUser"] },
      ],
    },

    {
      title: "ANALYTICS",
      links: [
        {
          name: "Website Analytics",
          href: "/analytics",
          roles: ["guest", "architect"],
          hasBadge: true,
          badgeName: "NEW",
        },
        {
          name: "Traffic Reports",
          href: "/traffic",
          roles: ["guest", "admin"],
        },
        {
          name: "Conversion Tracking",
          href: "/conversion",
          roles: ["guest", "editor"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        {
          name: "User Behavior",
          href: "/behavior",
          roles: ["guest", "customer"],
        },
        {
          name: "Performance Metrics",
          href: "/performance",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Custom Dashboards",
          href: "/dashboards",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Real-time Data",
          href: "/realtime",
          roles: ["guest", "apiUser"],
        },
        { name: "Export Tools", href: "/export", roles: ["guest", "editor"] },
        { name: "API Access", href: "/api", roles: ["guest", "apiUser"] },
        {
          name: "Advanced Filters",
          href: "/filters",
          roles: ["guest", "architect"],
        },
        {
          name: "Automated Reports",
          href: "/reports",
          roles: ["guest", "authUser"],
          hasBadge: true,
          badgeName: "AD",
        },
        { name: "Goal Tracking", href: "/goals", roles: ["guest", "customer"] },
      ],
    },
    {
      title: "DESIGN",
      links: [
        { name: "Logo Maker", href: "/logo", roles: ["guest", "architect"] },
        {
          name: "Brand Kit",
          href: "/brand",
          roles: ["guest", "editor"],
          hasBadge: true,
          badgeName: "NEW",
        },
        { name: "Color Palette", href: "/colors", roles: ["guest", "admin"] },
        { name: "Font Library", href: "/fonts", roles: ["guest", "authUser"] },
        {
          name: "Image Editor",
          href: "/image-editor",
          roles: ["guest", "subscriber"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Icon Collection",
          href: "/icons",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Template Gallery",
          href: "/gallery",
          roles: ["guest", "customer"],
        },
        {
          name: "Recommendation",
          href: "/recommendation-3",
          roles: ["guest", "editor"],
          hasBadge: true,
          badgeName: "RECOMMENDATION",
        },
      ],
    },
    {
      title: "HOSTING",
      links: [
        { name: "Web Hosting", href: "/hosting", roles: ["guest", "admin"] },
        { name: "Cloud Storage", href: "/storage", roles: ["guest", "editor"] },
        {
          name: "CDN Services",
          href: "/cdn",
          roles: ["guest", "customer"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        {
          name: "SSL Certificates",
          href: "/ssl",
          roles: ["guest", "architect"],
        },
        {
          name: "Backup Solutions",
          href: "/backup",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Server Management",
          href: "/server",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Database Hosting",
          href: "/database",
          roles: ["guest", "customer"],
        },
        {
          name: "Email Hosting",
          href: "/email-hosting",
          roles: ["guest", "authUser"],
        },
        { name: "FTP Access", href: "/ftp", roles: ["guest", "editor"] },
        {
          name: "Custom Domains",
          href: "/custom-domains",
          roles: ["guest", "architect"],
        },
        {
          name: "Staging Environment",
          href: "/staging",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "NEW",
        },
        {
          name: "Load Balancing",
          href: "/load-balancing",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Security Monitoring",
          href: "/security",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "UPDATED",
        },
        {
          name: "Performance Optimization",
          href: "/optimization",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Technical Support",
          href: "/support",
          roles: ["guest", "customer"],
        },
      ],
    },
    {
      title: "INTEGRATIONS",
      links: [
        {
          name: "Third-party Apps",
          href: "/apps",
          roles: ["guest", "authUser"],
        },
        {
          name: "API Connections",
          href: "/api-connections",
          roles: ["guest", "admin"],
          hasBadge: true,
          badgeName: "IMPORTANT",
        },
        {
          name: "Webhook Setup",
          href: "/webhooks",
          roles: ["guest", "apiUser"],
        },
        {
          name: "Social Media",
          href: "/social",
          roles: ["guest", "subscriber"],
        },
        {
          name: "Payment Gateways",
          href: "/payments",
          roles: ["guest", "editor"],
          hasBadge: true,
          badgeName: "AD",
        },
        { name: "CRM Integration", href: "/crm", roles: ["guest", "customer"] },
        {
          name: "Email Marketing",
          href: "/email-marketing",
          roles: ["guest", "architect"],
        },
        {
          name: "Analytics Tools",
          href: "/analytics-tools",
          roles: ["guest", "editor"],
        },
        {
          name: "Chat Widgets",
          href: "/chat",
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
