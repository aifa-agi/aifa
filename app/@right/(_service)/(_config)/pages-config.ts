// @/app/@right/(_service)/(_config)/pages-config.ts

import {
  PageConfig,
  SectionConfig,
  SlugType,
} from "../(_types)/page-wrapper-types";

const PagesConfig = {
  pages: [
    {
      metadata: {
        id: "home",
        title: "Enterprise-Grade AI Next.js starter",
        description:
          "Free Open-Source starter kit to build, deploy, and scale intelligent AI applications. Artifacts Feature, features secure multi-provider auth, Stripe payments, vector knowledge bases, deep-research agents, and a unique fractal architecture designed for the future of AI.",
        slug: [],
        type: "hero-section",
      },
      sections: [
        {
          id: "main-hero-block",
          type: "hero-section",
          headerContent: {
            announcement: {
              badgeText: "Thanks",
              descriptionText: "AI-SDK V5 & Vercel AI",
              href: "https://github.com/aifa-agi/aifa",
            },
            heading: "Enterprise-Grade AI Next.js starter",
            description:
              "Free Open-Source starter kit to build, deploy, and scale intelligent AI applications. Artifacts Feature, features secure multi-provider auth, Stripe payments, vector knowledge bases, deep-research agents, and a unique fractal architecture designed for the future of AI.",
            showBorder: false,
            headingLevel: 1,
          },
          bodyContent: {},
          footerContent: {
            actions: [
              {
                label: "Get Started",
                href: "/https://github.com/aifa-agi/aifa",
                variant: "default",
              },
              { label: "Browse Docs", href: "/docs", variant: "ghost" },
            ],
          },
          videoUrl: "/_static/video/ai-loop.mp4",
          contentWrapperClassName: "text-white",
        } as SectionConfig,
        {
          id: "main-hero-block2",
          type: "cta-section",
          headerContent: {
            announcement: {
              badgeText: "Thanks",
              descriptionText: "AI-SDK V5 & Vercel AI",
              href: "https://github.com/aifa-agi/aifa",
            },
            heading: "Enterprise-Grade AI Next.js starter",
            description:
              "Free Open-Source starter kit to build, deploy, and scale intelligent AI applications. Artifacts Feature, features secure multi-provider auth, Stripe payments, vector knowledge bases, deep-research agents, and a unique fractal architecture designed for the future of AI.",
            showBorder: false,
            headingLevel: 2,
          },
          bodyContent: {},
          footerContent: {
            actions: [
              {
                label: "Get Started",
                href: "/https://github.com/aifa-agi/aifa",
                variant: "default",
              },
              { label: "Browse Docs", href: "/docs", variant: "ghost" },
            ],
          },
          contentWrapperClassName: "text-white",
        } as SectionConfig,

        {
          id: "main-hero-block3",
          type: "cta-section",
          headerContent: {
            announcement: {
              badgeText: "Thanks",
              descriptionText: "AI-SDK V5 & Vercel AI",
              href: "https://github.com/aifa-agi/aifa",
            },
            heading: "Enterprise-Grade AI Next.js starter",
            description:
              "Free Open-Source starter kit to build, deploy, and scale intelligent AI applications. Artifacts Feature, features secure multi-provider auth, Stripe payments, vector knowledge bases, deep-research agents, and a unique fractal architecture designed for the future of AI.",
            showBorder: false,
            headingLevel: 2,
          },
          bodyContent: {},
          footerContent: {
            actions: [
              {
                label: "Get Started",
                href: "/https://github.com/aifa-agi/aifa",
                variant: "default",
              },
              { label: "Browse Docs", href: "/docs", variant: "ghost" },
            ],
          },
          contentWrapperClassName: "text-white",
        } as SectionConfig,
      ],
    },

    // Add more pages here
  ] as PageConfig[], // Explicitly type the array
};

// User-provided getPageBySlug function
export function getPageBySlug(slug: SlugType): PageConfig | undefined {
  return PagesConfig.pages.find(
    (page) =>
      JSON.stringify(page.metadata.slug?.map((s) => s.toLowerCase())) ===
      JSON.stringify(slug.map((s) => s.toLowerCase()))
  );
}

// User-provided getHomePage function
export function getHomePage(): PageConfig | undefined {
  return PagesConfig.pages.find(
    (page) => !page.metadata.slug || page.metadata.slug.length === 0
  );
}
