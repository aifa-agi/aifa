import { AppConfig } from "@/types/app-config";

const site_url = "https://aifa.dev";

export const appConfig: AppConfig = {
  name: "Enterprise-Grade AI Next.js starter",
  description:
    "Free Open-Source starter kit to build, deploy, and scale intelligent AI applications. Artifacts Feature, features secure multi-provider auth, Stripe payments, vector knowledge bases, deep-research agents, and a unique fractal architecture designed for the future of AI.",
  url: site_url,
  ogImage: `${site_url}/_static/og.png`,
  manifest: "/manifest.json",

  mailSupport: "support@aifa.dev",
};
