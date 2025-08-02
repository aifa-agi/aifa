// @app/@right/(_service)/(_config)/public-pages-config.ts

import {
  PageConfig,
  SectionConfig,
} from "@/app/@right/(_service)/(_types)/page-wrapper-types";

export const PublicPagesConfig = {
  pages: [
    {
      metadata: {
        id: "public",
        title: "Enterprise-Grade AI Next.js starter",
        description: "Free Open-Source starter kit...",
        slug: ["public", "test", "man", "young"],
        type: "hero-section",
      },
      sections: [
        {
          id: "test-block",
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
          id: "test-block",
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
      ],
    },
    {
      metadata: {
        id: "interactive-ai",
        title: "Interactive AI Demo",
        description: "Demo: DoublePresentation custom case",
        slug: ["docs", "example"],
        type: "double-presentation-section",
      },

      sections: [
        {
          id: "double-presentation-demo",
          type: "double-presentation-section",
          customComponentsAnyTypeData: {
            metaData: {
              metaTitle: "Interactive AI: Where Conversation Builds the UI",
              metaDescription: "Discover what makes AIFA revolutionary...",
            },
            leftItem: {
              mediaUrl: "/_static/illustrations/ai-chat.png",
              title: "Ai Artifacts Chatbot",
              description:
                "As the AI chatbot speaks, it highlights elements...",
            },
            rightItem: {
              mediaUrl: "/_static/illustrations/ai-web.png",
              title: "Related Pages",
              description:
                "Click any UI element, and the AI provides instant context...",
            },
          },
        } as SectionConfig,
      ],
    },
  ] as PageConfig[],
};
