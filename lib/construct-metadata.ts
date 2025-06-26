import { appConfig } from "@/config/appConfig";
import { Metadata } from "next";

export function constructMetadata({
  title = appConfig.name,
  description = appConfig.description,
  image = appConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: [
      "Next.js",
      "React",
      "Prisma",
      "Neon",
      "Auth.js",
      "shadcn ui",
      "Resend",
      "React Email",
      "Stripe",
    ],
    authors: [
      {
        name: "Roman Bolshiyanov",
      },
    ],
    creator: "AIFA",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: appConfig.url,
      title,
      description,
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@aifa_agi",
    },
    icons,
    metadataBase: new URL(appConfig.url),
    manifest: `${appConfig.url}/manifest.json`,
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {
          robots: {
            index: true,
            follow: true,
          },
        }),
  };
}
