import { AppConfig } from "@/types/app-config";

// @/config/appConfig.ts
const site_url = process.env.NEXT_PUBLIC_APP_URL;
if (!site_url || !/^https?:\/\//.test(site_url)) {
  throw new Error("NEXT_PUBLIC_APP_URL is not defined or invalid");
}

export const appConfig: AppConfig = {
  name: "AIFA",
  description: "...",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  manifest: "/manifest.json",
  mailSupport: "support@aifa.dev",
};
