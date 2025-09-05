// app/manifest.ts
import { appConfig } from "@/config/appConfig";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appConfig.name,
    short_name: appConfig.short_name,
    description: appConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#333333",
    theme_color: "#4285F4",
    icons: [
      {
        src: "./favicons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "./favicons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
