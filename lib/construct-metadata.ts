import { appConfig } from "@/config/appConfig";
import { Metadata } from "next";

export function constructMetadata({
  title = appConfig.name,
  description = appConfig.description,
  image = appConfig.ogImage,

  icons = "/logo.png",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  generator?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: [
      "Build Enterprise-Grade AI",
      "Artifacts",
      "Chat bot starter",
      "AI Agents",
      "Autonomous Agents",
      "Self-Replicating AI",
      "Evolving AI",
      "Blockchain",
      "Decentralized AI",
      "Open Source AI",
      "Generative AI",
      "Full-Stack Development",
      "AI for Programming",
      "Web3",
      "Smart Contracts",
      "Vercel",
      "TypeScript",
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
        name: "Roma Armstrong",
        url: "https://github.com/aifa-agi/aifa",
      },
    ],
    creator: "AIFA Open-Source Community",
    publisher: "AIFA",
    openGraph: {
      title,
      description,
      url: appConfig.url,
      siteName: appConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "AIFA - Build Enterprise-Grade AI nextjs strater",
        },
      ],

      type: "website",
      locale: "en_US",
    },
    generator: "aifa.dev",
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
