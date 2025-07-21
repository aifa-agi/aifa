// @/app/@right/default.tsx
"use client";

import { useTranslation } from "../(_libs)/translation";
import AifaPromo from "./aifa-promo";
import { FaqAccordion } from "./ui-sections/pages-sections/faq-accordion";
import { AifaHelps } from "./ui-sections/pages-sections/aifa-helps";
import DoublePresentation from "./ui-sections/pages-sections/double-prsentation";
import { FeaturesGrid } from "./ui-sections/pages-sections/features-grid";
import HeroSection from "./ui-sections/pages-sections/hero-sections";
import {
  HorizontalStepData,
  HorizontalSteps,
} from "./ui-sections/pages-sections/horizontal-steps";
import Impacts from "./ui-sections/pages-sections/impacts";
import { Testimonial } from "./ui-sections/pages-sections/testimonial";
import VideoContainerTypeOne from "./ui-sections/pages-sections/video-container-type-one";

export default function HomePage() {
  const HeroFeatureBlocks = [
    {
      title: "AI SDK V5",
      subtitle: "AI Toolkit for TypeScript",
      description:
        "From the creators of Next.js, the AI SDK is a free open-source library that gives you the tools you need to build AI-powered products.",
    },
    {
      title: "Next.js AI Chatbot",
      subtitle: "Chat SDK",
      description:
        "Chat SDK is a free, open-source template that helps you dive right into building powerful chatbot applications.",
    },
    {
      title: "Vercel Platform",
      subtitle: "Global Edge",
      description:
        "Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.",
    },
  ];
  // data/doublePresentation.ts
  const doublePresentationMetaData = {
    metaTitle: "Interactive AI: Where Conversation Builds the UI",
    metaDescription:
      "Discover what makes AIFA revolutionary: by leveraging Next.js Parallel Routes, we seamlessly render a context-aware AI alongside your application's interface. This is more than a chatbot—it's a generative UI engine that brings conversations to life. Our AI doesn't just talk; it shows. It renders interactive artifacts, highlights on-screen elements, and guides users through complex workflows, creating a deeply intuitive and powerful conversational experience.",
  };
  const doublePresentationleftData = {
    mediaUrl: "/_static/illustrations/ai-chat.png",
    title: "Ai Artifacts Chatbot ",
    description:
      "As the AI chatbot speaks, it highlights elements, opens relevant pages, and keeps users focused without losing context.",
  };

  const doublePresentationRightData = {
    mediaUrl: "/_static/illustrations/ai-web.png",
    title: "Related Pages",
    description:
      "Click any UI element, and the AI provides instant context, explains what you see, and suggests next steps.",
  };

  const aifaHelpsData = [
    {
      id: "artifact-generation",
      title: "Artifact Generation",
      problem:
        "Traditional web pages display static content with fixed formatting, forcing users to scroll through lengthy documents or navigate multiple pages to access comprehensive information.",
      solution:
        "AIFA uses artifact tools to generate extensive multi-page responses, complete code implementations, and detailed documentation outside the chat interface, providing unlimited depth when needed.",
    },
    {
      id: "site-structure-navigation",
      title: "Site Structure Navigation",
      problem:
        "Users struggle to find specific information buried deep in website structures, often getting lost in complex menu systems and missing relevant content across multiple pages.",
      solution:
        "AIFA has complete understanding of site architecture and can directly navigate to specific pages, scroll to relevant sections, and guide users to exact locations.",
    },
    {
      id: "enterprise-knowledge-access",
      title: "Enterprise Knowledge Access",
      problem:
        "Critical business information is scattered across multiple web pages, documentation sites, and internal portals, requiring users to manually search through various interfaces.",
      solution:
        "AIFA integrates with enterprise knowledge bases, accessing internal documentation, databases, and proprietary information to provide complete business context.",
    },
    {
      id: "internet-search-integration",
      title: "Internet Search Integration",
      problem:
        "Website content becomes outdated quickly, and static web pages cannot provide access to current information, market trends, or real-time data beyond their fixed content.",
      solution:
        "AIFA performs real-time internet searches, combining site content with current web information to provide comprehensive, up-to-date responses.",
    },
  ];

  const horizontalStepsData: HorizontalStepData[] = [
    {
      id: "step-1",
      title: "Revolutionary Interface",
      description:
        "Users want answers, not endless menus. Aifa empowers you to build truly intelligent experiences that bypass confusing navigation.",
      imageSrc: "/_static/illustrations/ai-1-3.png",
    },
    {
      id: "step-2",
      title: "Enterprise-Grade",
      description:
        "Our open-source starter is truly free and ready to scale. Build on a powerful foundation designed for enterprise-level demands.",
      imageSrc: "/_static/illustrations/ai-2-3.png",
    },
    {
      id: "step-3",
      title: "Powerful API",
      description:
        "Enhance your business with AI and a dedicated knowledge base. Connect your mobile apps to Aifa to monitor and optimize chats.",
      imageSrc: "/_static/illustrations/ai-3-3.png",
    },
  ];

  const impactHeaderData = {
    subtitle: "Discover how our solutions have made a real-world impact.",
    linkText: "Explore all case studies",
    linkHref: "#", // Замените на реальную ссылку
  };

  const impactCardsData = [
    {
      id: "card-1",
      title: "React 19",
      subtitle: "Core of all frontend logic & UI protection.",
      company: "React",
      href: "https://react.dev/",
      hoverGradientClass:
        "bg-[radial-gradient(71.93%_100%_at_100%_100%,hsl(263.4,70%,50.4%)_0%,rgba(15,23,42,0.01)_100%)]",
      hoverGradientTransform: "",
    },
    {
      id: "card-2",
      title: "NEXT 15",
      subtitle: "Parallel & app routes for high-performance SSR.",
      company: "Next.js",
      href: "https://nextjs.org/",
      hoverGradientClass:
        "bg-[linear-gradient(0deg,hsl(263.4,70%,50.4%)_0%,rgba(15,23,42,0.01)_74.1%)]",
      hoverGradientTransform: "",
    },
    {
      id: "card-3",
      title: "AI SDK 5",
      subtitle: "VectorStore & web search out-of-the-box.",
      company: "AI SDK",
      href: "https://sdk.vercel.ai/",
      hoverGradientClass:
        "bg-[radial-gradient(86.07%_100.77%_at_0_100%,hsl(263.4,70%,50.4%)_0%,rgba(15,23,42,0.01)_100%)]",
      hoverGradientTransform: "",
    },
    {
      id: "card-4",
      title: "Auth Stack",
      subtitle: "apiAuth, Google OAuth & Resend for email verification.",
      company: "Auth",
      href: "https://next-auth.js.org/",
      hoverGradientClass:
        "bg-[radial-gradient(71.93%_100%_at_0%_100%,hsl(263.4,70%,50.4%)_0%,rgba(15,23,42,0.01)_100%)]",
      hoverGradientTransform: "rotate-180",
    },
    {
      id: "card-5",
      title: "Postgres DB",
      subtitle: "Prisma as ORM. Neon cloud-native + Redis cache.",
      company: "Prisma",
      href: "https://www.prisma.io/",
      hoverGradientClass:
        "bg-[linear-gradient(360deg,hsl(263.4,70%,50.4%)_0%,rgba(15,23,42,0.01)_74.1%)]",
      hoverGradientTransform: "scale-y-[-1]",
    },
    {
      id: "card-6",
      title: "Vercel",
      subtitle: "Zero-config hosting. Blob storage included.",
      company: "Vercel",
      href: "https://vercel.com/",
      hoverGradientClass:
        "bg-[radial-gradient(71.93%_100%_at_0%_100%,hsl(263.4,70%,50.4%)_0%,rgba(15,23,42,0.01)_100%)]",
      hoverGradientTransform: "scale-y-[-1]",
    },
  ];

  const featuresData = [
    {
      iconSvg:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjMDBFNTk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTkuNDM1IDkuMTQ2aC02LjQyTTkuNDM1IDE0Ljg1M2gtNi40Mk0xNi41NjcgMjAuNTZIMy4wMTZNMTYuNTY3IDMuNDM4SDMuMDE2TTE2LjU2IDE2LjI3NGE0LjI4IDQuMjggMCAxIDAgMC04LjU2IDQuMjggNC4yOCAwIDAgMCAwIDguNTZaTTIyLjk4NyAxOC40MTRsLTMuMzkzLTMuMzkzIi8+PC9zdmc+",
      title: "AI Chat vs Website",
      description:
        "Revolutionary dual-screen experience powered by Next.js parallel routing. Users interact with AI chat and website simultaneously — even more intuitive on mobile.",
      linkHref: "#",
      linkText: "Learn more",
    },
    {
      iconSvg:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjMDBFNTk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik05LjU1IDE5LjIySDIuNzh2LTYuNzdNMTkuMjIgOS41NDl2LTYuNzdoLTYuNzdNMy4xOTcgMTguODA5IDE4LjgxIDMuMTk3Ii8+PC9zdmc+",
      title: "Bidirectional Sync",
      description:
        "AI and website create perfect synergy. Users can replace traditional navigation with commands like 'show me the page where...' — redefining UX interaction.",
      linkHref: "#",
      linkText: "Learn more",
    },
    {
      iconSvg:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjMDBFNTk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNS4yIDQuOTMzSDIwTTEwLjQgMi41MzNoNC44djQuOGgtNC44YTIuNCAyLjQgMCAwIDEgMC00LjgiLz48cGF0aCBzdHJva2U9IiMwMEU1OTkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTYuOCAxOS4zMzNoOS42YTMuNiAzLjYgMCAxIDAgMC03LjJINS42YTMuNiAzLjYgMCAxIDEgMC03LjIiLz48L3N2Zz4=",
      title: "AI Chat API",
      description:
        "Connect your existing business to AI through Aifa's API. Your mobile apps, websites, and platforms get unified access to your enterprise knowledge base.",
      linkHref: "#",
      linkText: "Learn more",
    },
    {
      iconSvg:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjMDBFNTk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0yMC4yNSAxMS4xMjVBOS4xMjUgOS4xMjUgMCAwIDAgMy4xMjcgNi43MzFsLjAzNC0uMDYiLz48cGF0aCBzdHJva2U9IiMwMEU1OTkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTIuNjc2IDJ2NC43MzFoNC43MzFNMiAxMS4xMjVhOS4xMjUgOS4xMjUgMCAwIDAgMTcuMTI1IDQuMzkzbC0uMDM1LjA2MiIvPjxwYXRoIHN0cm9rZT0iIzAwRTU5OSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMTkuNTc0IDIwLjI1di00LjczMWgtNC43MzEiLz48L3N2Zz4=",
      title: "Vector Store",
      description:
        "Powered by OpenAI's latest Response API and AI SDK v5, enterprise knowledge search operates at maximum efficiency. Often completely free.",
      linkHref: "#",
      linkText: "Learn more",
    },
    {
      iconSvg:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjMDBFNTk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xOS41IDExLjcwOGMwIDYuMzc1LTguNSA5LjIwOS04LjUgOS4yMDlzLTguNS0yLjgzNC04LjUtOS4yMDl2LTguNUwxMSAxLjA4M2w4LjUgMi4xMjV6Ii8+PHBhdGggc3Ryb2tlPSIjMDBFNTk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Im02Ljc1IDExLjcwOCAyLjQ4IDIuNDggNi4wMi02LjczIi8+PC9zdmc+",
      title: "Auth Pro",
      description:
        "Enterprise-grade Auth v5 with privileged admin access and guest capabilities. API auth gateway, Google, and Resend included by default.",
      linkHref: "#",
      linkText: "Learn more",
    },
    {
      iconSvg:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjMDBFNTk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0yMi4zMSAxNi44MmgtOC4yNjN2NS41MWg4LjI2M3oiLz48cGF0aCBzdHJva2U9IiMwMEU1OTkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE1LjQyMiAxNi44MjF2LTIuNzU0YTIuNzU0IDIuNzU0IDAgMSAxIDUuNTA5IDB2Mi43NTRNMTAuNjAxIDEwLjYyNGE0LjQ3NiA0LjQ3NiAwIDEgMCAwLTguOTUyIDQuNDc2IDQuNDc2IDAgMCAwIDAgOC45NTJNMTEuOTgyIDE0LjE3NmE5IDkgMCAwIDAtMS4zNzctLjEwNmMtNC43MTEgMC04LjU2NSAzLjY0My04LjkxNyA4LjI2NGg4LjIyOCIvPjwvc3ZnPg==",
      title: "8 Protected Routes",
      description:
        "Role-based architecture: architects, admins, editors, users, subscribers, customers, and managers each get dedicated layouts with personalized data flows.",
      linkHref: "#",
      linkText: "Learn more",
    },
    {
      iconSvg:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjMDBFNTk5IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik0yLjQ1MyAzLjM5OHYxNS4yMWMwIDEuNTY4IDMuODUgMi44NTEgOC41NTUgMi44NTEgNC43MDYgMCA4LjU1Ni0xLjI4MyA4LjU1Ni0yLjg1MVYzLjM5OCIvPjxwYXRoIHN0cm9rZT0iIzAwRTU5OSIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMTEuMDA4IDYuMjQzYzQuNzI1IDAgOC41NTYtMS4yNzcgOC41NTYtMi44NTJTMTUuNzM0LjUzOSAxMS4wMDguNTM5IDIuNDUzIDEuODE2IDIuNDUzIDMuMzkxczMuODMgMi44NTIgOC41NTUgMi44NTJaTTE5LjU2NCAxMWMwIDEuNTY5LTMuODUgMi44NTItOC41NTYgMi44NTJTMi40NTMgMTIuNTY5IDIuNDUzIDExIi8+PC9zdmc+",
      title: "Prisma Postgres",
      description:
        "The most elegant way to orchestrate database models, transforming ordinary websites into enterprise-grade projects with seamless data management.",
      linkHref: "#",
      linkText: "Learn more",
    },
    {
      iconSvg:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjMDBFNTk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNS4yNzUgNi43MjVhMi42MTIgMi42MTIgMCAxIDAgMC01LjIyNSAyLjYxMiAyLjYxMiAwIDAgMCAwIDUuMjI1TTE0LjM3NiAxNS4yNzVoNi4xcS4wMjQtLjIzNS4wMjUtLjQ3NWE1LjIyNSA1LjIyNSAwIDAgMC01LjIyNS01LjIyNWMtLjc4NCAwLTEuNTI0LjE3OC0yLjE5MS40ODZNNi43MjUgMTEuOTVhMi42MTMgMi42MTMgMCAxIDAgMC01LjIyNSAyLjYxMyAyLjYxMyAwIDAgMCAwIDUuMjI1TTExLjkyNiAyMC41cS4wMjItLjIzNS4wMjQtLjQ3NWE1LjIyNCA1LjIyNCAwIDEgMC0xMC40MjYuNDc1eiIvPjwvc3ZnPg==",
      title: "Multi-Model AI",
      description:
        "Customizable AI model selection for each user type: specialized models for text generation, coding assistance, and media content creation.",
      linkHref: "#",
      linkText: "Learn more",
    },
    {
      iconSvg:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjMDBFNTk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNS4yIDQuOTMzSDIwTTEwLjQgMi41MzNoNC44djQuOGgtNC44YTIuNCAyLjQgMCAwIDEgMC00LjgiLz48cGF0aCBzdHJva2U9IiMwMEU1OTkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTYuOCAxOS4zMzNoOS42YTMuNiAzLjYgMCAxIDAgMC03LjJINS42YTMuNiAzLjYgMCAxIDEgMC03LjIiLz48L3N2Zz4=",
      title: "AI Database Agent",
      description:
        "Grant AI autonomous publishing rights for content, code, and data. Direct GitHub integration triggers production builds automatically in the background.",
      linkHref: "#",
      linkText: "Learn more",
    },
  ];

  const faqItems = [
    {
      id: "faq-1",
      question: "What is Aifa?",
      answer:
        "Aifa is a free, open-source project and ready-to-use starter kit for businesses and developers. It enables you to launch an AI chatbot and enterprise application on Vercel hosting within minutes.",
    },
    {
      id: "faq-2",
      question: "How does Aifa scale?",
      answer:
        "Aifa is highly optimized for cost-efficiency and performance. It connects directly to AI services without intermediaries for minimal token costs, uses Redis for server resource optimization, and implements static generation to reduce database queries. Services like Neon Database, Vercel Blob storage, and Vercel hosting offer generous free tiers perfect for MVP launches. OpenAI Vector Store provides 1GB of free data storage. When you reach enterprise scale, you can always migrate from cloud to dedicated servers.",
    },
    {
      id: "faq-3",
      question: "What are the real costs to launch this project?",
      answer:
        "$5 is the minimum payment required to acquire an OpenAI API key. There are no hidden fees or subscriptions in this project. You get 100% source code access to the entire project. Unlike similar projects that offer limited access while keeping features behind proprietary APIs, Aifa provides complete transparency. Every component is documented and the AI model is trained to explain how each component works and how to modify it for your specific needs. Your total launch cost is just $5 - nothing more.",
    },
    {
      id: "faq-7",
      question: "Is this current project built on the Aifa engine?",
      answer:
        "Absolutely yes! This project serves as a live demonstration of Aifa capabilities. Currently, this presentation runs on AI SDK v4, and I'm actively adding new tutorial pages where I'm building this project from scratch using v5. The tutorial will be completed soon, and the entire project will be fully upgraded to the fifth version.",
    },
    {
      id: "faq-8",
      question: "Is this project an attempt to create another V0?",
      answer:
        "Not exactly. This project has a specific design philosophy from the start - the Aifa standard with chatbot on the left and application on the right, plus built-in powerful authentication, API gateway, and many other pre-built components. While this adds some constraints, it provides a ready-made architecture that's much easier to complete by creating just a few components. If you're asking whether you can write code and create components directly in this chat - some things are already possible, but I'm working to enable much more. My ultimate goal is to allow every developer to create AI agents during development that can not only help them write code, but also be useful to other programmers using the same technology stack and similar package.json configurations.",
    },
    {
      id: "faq-4",
      question: "Can you customize this project for my business needs?",
      answer:
        "I'm very interested in reviewing your requirements to include them in the development roadmap. Please reach out via Telegram @bolshiyanov to discuss your specific business needs.",
    },
    {
      id: "faq-5",
      question: "Who maintains this project?",
      answer:
        "I'm currently developing this project independently. If you're interested in joining, supporting, or funding the project, I'm grateful to discuss any opportunity. Please contact me via Telegram @bolshiyanov.",
    },
    {
      id: "faq-6",
      question: "What's the main goal of this project?",
      answer:
        "My goal is to launch autonomous AI agents within this project by the end of 2025. Any developer can train these agents to match their coding style for solving specific tasks. AI agent knowledge will accumulate on the platform, eventually enabling something similar to AGI. This part is in early prototyping stages, but I'm confident this approach will create a v0 analog with a significant difference: while v0 relies solely on its model's knowledge for programming solutions, Aifa AGI will orchestrate AI agents that already have successful development experience with similar technology stacks.",
    },
  ];

  const { t } = useTranslation();
  return (
    <>
      <div className=" w-full   ">
        <HeroSection
          title="Enterprise-Grade AI Next.js starter"
          description="Free Open-Source starter kit to build, deploy, and scale intelligent AI applications. Artifacts Feature, features secure multi-provider auth, Stripe payments, vector knowledge bases, deep-research agents, and a unique fractal architecture designed for the future of AI."
          welcomeText="Thanks for the AI-SDK V5 & Vercel AI"
          featureBlocks={HeroFeatureBlocks}
        />

        <VideoContainerTypeOne />

        <DoublePresentation
          metaData={doublePresentationMetaData}
          leftItem={doublePresentationleftData}
          rightItem={doublePresentationRightData}
        />

        <AifaHelps
          title="Why is AI Chat needed in an application?"
          discriptions=" In the modern world, the amount of information grows daily, making it harder to find answers. Traditional websites are overloaded, and their navigation is confusing. A chatbot's interface, in contrast, is simple and intuitive, creating a new trend: users prefer to ask a chat a question rather than get lost in endless menus and pages"
          items={aifaHelpsData}
        />

        <HorizontalSteps
          steps={horizontalStepsData}
          title="Instantly Connect Your Business to AI"
          description="Access numerous out-of-the-box AI scenarios, and create new ones simply by asking ChatGPT directly within the project. Our goal is to provide comprehensive documentation for the practical use of all AI SDK features, enabling you to implement them through voice commands and our AI agents."
        />

        <Impacts
          title="Tools to Create the Best Open Source Ai Chatbot"
          discriptions="We live in a wonderful time when the best development tools remain free. It's an amazing gift for business, isn't it? Accept this as a fact!"
          cards={impactCardsData}
        />

        <FeaturesGrid
          title="What Modern AI Chat with Artifacts Can Do"
          discriptions="Modern AI chat is the ultimate tool for architects, administrators, and users. With Aifa, users instantly find content, editors effortlessly create and publish, while architects build new features in real-time."
          features={featuresData}
        />

        <AifaPromo />

        <FaqAccordion
          title={
            <>
              Your questions, <br className="lg:hidden" />
              answered
            </>
          }
          items={faqItems}
        />

        <Testimonial
          quote="Be so involved they can’t tell if you’re crazy or a genius. To do AIFA-AGI"
          authorName="Roman Bolshiyanov"
          authorTitle="Founder "
          authorCompany="aifa.dev"
          authorImage="/_static/images/bolshiyanov.jpg"
        />

        {/* <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
          {t("evolvingAIAgentArchitecture")}
        </h1>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("heroTagline")}</strong>
        </p>

        <blockquote className="mt-6 border-l-2 pl-6 italic">
          &quot;{t("welcomeGPL")} &quot; {t("useChatbotForInfo")} &quot;
          {t("joinTheAction")}&quot; 🔥🔥🔥
        </blockquote>

        <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0 underline text-blue-600 my-4 ">
          <a
            href="https://github.com/aifa-agi/aifa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            GitHub https://github.com/aifa-agi/aifa
          </a>
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("heroDescription")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("paradigmShiftTitle")}
        </h2>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("modernWebProblemTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("traditionalWebProblemPart1")}
          <strong>{t("askAndReceive")}</strong>
          {t("traditionalWebProblemPart2")}
          <strong>{t("expressNeeds")}</strong>
          {t("traditionalWebProblemPart3")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("toolsCritique")}
        </p>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("aifaRevolutionTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("aifaParadigmFlip")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("leftSideTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("leftSidePoint1")}</li>
          <li>{t("leftSidePoint2")}</li>
          <li>{t("leftSidePoint3")}</li>
          <li>{t("leftSidePoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("rightSideTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("rightSidePoint1")}</li>
          <li>{t("rightSidePoint2")}</li>
          <li>{t("rightSidePoint3")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("rethinkingInteraction")}
        </p>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("syncTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("syncDescription")}
          <strong>{t("perfectSync")}</strong>
          {"."}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("whenChatbotActsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("chatbotActsPoint1")}</li>
          <li>{t("chatbotActsPoint2")}</li>
          <li>{t("chatbotActsPoint3")}</li>
          <li>{t("chatbotActsPoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("whenUserClicksTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("userClicksPoint1")}</li>
          <li>{t("userClicksPoint2")}</li>
          <li>{t("userClicksPoint3")}</li>
          <li>{t("userClicksPoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("smartInterfaceExperience")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("twoAppsEcosystemTitle")}
        </h2>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("app1ArchitectWorkshopTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forCreatorsVisionaries")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("app1Description")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("interfaceStructureTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>{t("leftPanelDevAssistant")}</strong>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("understandsBusinessGoals")}</li>
              <li>{t("suggestsOptimalArchitecture")}</li>
              <li>{t("generatesAppModules")}</li>
              <li>{t("managesVisualStructure")}</li>
              <li>{t("explainsComponentConnections")}</li>
              <li>{t("reactsInRealTime")}</li>
            </ul>
          </li>
          <li>
            <strong>{t("rightPanelThreeTabs")}</strong>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("projectVisualization")}</li>
              <li>{t("adminPanelPreview")}</li>
              <li>{t("publicSitePreview")}</li>
            </ul>
          </li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("app2LivePlatformTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forEndUsersCommunity")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("app2Description")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("multiLevelRoleExperience")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forAdminsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("adminPoint1")}</li>
          <li>{t("adminPoint2")}</li>
          <li>{t("adminPoint3")}</li>
          <li>{t("adminPoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forEditorsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("editorPoint1")}</li>
          <li>{t("editorPoint2")}</li>
          <li>{t("editorPoint3")}</li>
          <li>{t("editorPoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forRegisteredUsersTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("registeredPoint1")}</li>
          <li>{t("registeredPoint2")}</li>
          <li>{t("registeredPoint3")}</li>
          <li>{t("registeredPoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forVisitorsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("visitorPoint1")}</li>
          <li>{t("visitorPoint2")}</li>
          <li>{t("visitorPoint3")}</li>
          <li>{t("visitorPoint4")}</li>
        </ul>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("aifaFeaturesTitle")}
        </h2>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("feature1ZeroDevOpsTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("oneClickProdReady")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("zeroDevOpsDescription")}
        </p>

        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>{t("zeroDevOpsStep1")}</li>
          <li>{t("zeroDevOpsStep2")}</li>
          <li>{t("zeroDevOpsStep3")}</li>
        </ol>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("whatHappensOnClickTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("onClickStep1")}</li>
          <li>
            {t("onClickStep2")}
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("appBuilderDeploy")}</li>
              <li>{t("saasDeploy")}</li>
            </ul>
          </li>
          <li>
            {t("onClickStep3")}
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("secretOpenAI")}</li>
              <li>{t("secretStripe")}</li>
              <li>{t("secretResend")}</li>
              <li>{t("secretVercelBlob")}</li>
              <li>{t("secretRedis")}</li>
              <li>{t("secretPostgres")}</li>
            </ul>
          </li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("requirementsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("requirementGithub")}</li>
          <li>{t("requirementVercel")}</li>
          <li>{t("requirementNeon")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("noTechKnowledgeNeeded")}
        </p>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("feature2AIContentTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("intelligentContentEcosystem")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("aifaContentCreationDescription")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("howItWorksTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("describeContentGoal")}</li>
          <li>{t("aiGeneratesStructures")}</li>
          <li>{t("seoOptimizationIncluded")}</li>
          <li>{t("autoInternalNav")}</li>
          <li>{t("contentAdaptsToBrand")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("examplesTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("exampleTestimonials")}</li>
          <li>{t("exampleProductCatalog")}</li>
          <li>{t("exampleQuizSystem")}</li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("feature3QuizGenerationTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("ideaToLearningInMinutes")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6 italic">
          {t("quizExamplePrompt")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("howAIWorksQuizTitle")}</strong>
        </p>

        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>{t("quizAIstep1")}</li>
          <li>{t("quizAIstep2")}</li>
          <li>{t("quizAIstep3")}</li>
          <li>{t("quizAIstep4")}</li>
          <li>{t("quizAIstep5")}</li>
          <li>{t("quizAIstep6")}</li>
        </ol>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("monetizationReadyTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("freeBasicQuizzes")}</li>
          <li>{t("paidDetailedExplanations")}</li>
          <li>{t("premiumSeries")}</li>
          <li>{t("certificationPrograms")}</li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("feature4MonetizationTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("startEarningImmediately")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("builtInMonetizationInfra")}
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>{t("stripeIntegrationTitle")}</strong>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("oneTimePayments")}</li>
              <li>{t("subscriptions")}</li>
              <li>{t("freeTrials")}</li>
              <li>{t("autoAccessManagement")}</li>
              <li>{t("directPayouts")}</li>
            </ul>
          </li>
          <li>
            <strong>{t("threeLevelAccessControl")}</strong>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("publicLevel")}</li>
              <li>{t("registeredLevel")}</li>
              <li>{t("premiumLevel")}</li>
            </ul>
          </li>
          <li>
            <strong>{t("revenueStreamsTitle")}</strong> {t("revenueStreams")}
          </li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("feature5MarketingAnalyticsTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("builtInGrowthEngine")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("abTesting")}</li>
          <li>{t("seoOptimization")}</li>
          <li>{t("loadSpeedTracking")}</li>
          <li>{t("userBehaviorAnalytics")}</li>
        </ul>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("technicalExcellenceTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("technologiesTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("techStack1")}</li>
          <li>{t("techStack2")}</li>
          <li>{t("techStack3")}</li>
          <li>{t("techStack4")}</li>
          <li>{t("techStack5")}</li>
          <li>{t("techStack6")}</li>
          <li>{t("techStack7")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("optimizationsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("optimization1")}</li>
          <li>{t("optimization2")}</li>
          <li>{t("optimization3")}</li>
          <li>{t("optimization4")}</li>
        </ul>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("whyAifaIsBetterTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forV0Users")}</strong> {t("forV0UsersBenefit")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forBeginners")}</strong> {t("forBeginnersBenefit")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("vsClassicBuilders")}</strong>{" "}
          {t("vsClassicBuildersBenefit")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("vsCustomDev")}</strong> {t("vsCustomDevBenefit")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("vsSaaS")}</strong> {t("vsSaaSBenefit")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("idealForAllProductsTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("useCaseContent")}</strong> {t("useCaseContentDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("useCaseECommerce")}</strong> {t("useCaseECommerceDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("useCaseCommunities")}</strong>{" "}
          {t("useCaseCommunitiesDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("useCaseBusiness")}</strong> {t("useCaseBusinessDesc")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("aifaAdvantageTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("dataTitle")}</strong> {t("dataDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("financesTitle")}</strong> {t("financesDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("technologyTitle")}</strong> {t("technologyDesc")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("howToStartTitle")}
        </h2>

        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>{t("startStep1")}</li>
          <li>{t("startStep2")}</li>
          <li>{t("startStep3")}</li>
          <li>{t("startStep4")}</li>
        </ol>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("costTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("aifaSubscription")}</strong> {t("aifaSubscriptionDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("traditionalDev")}</strong> {t("traditionalDevDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("aifaRoi")}</strong> {t("aifaRoiDesc")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("futureIsDialogsTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("futureIsDialogsDesc")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("transformationLeaderQuestion")}</strong>
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("readyToBuildTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("readyToBuildDesc")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("joinCommunity")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("smartExperiencesWin")}</strong>
        </p>

        <hr className="my-8" />

        <p className="leading-7 italic [&:not(:first-child)]:mt-6">
          {t("finalTagline")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("startYourJourney")}</strong>
        </p>*/}
      </div>
    </>
  );
}
