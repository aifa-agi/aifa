import { AppConfig } from "@/types/app-config";

const site_url = process.env.NEXT_PUBLIC_APP_URL || "https://aifa.dev";

export const appConfig: AppConfig = {
  name: "AIFA",
  description:
    "AI Agents in an Evolving and Self-Replicating Architecture for developing full-featured web applications, open source",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  manifest: "/manifest.json",

  mailSupport: "support@aifa.dev",
};
