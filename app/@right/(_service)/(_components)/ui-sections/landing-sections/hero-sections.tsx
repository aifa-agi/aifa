"use client"; // Make this a client component

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useTheme } from "next-themes"; // Import useTheme

interface FeatureBlock {
  title: string;
  subtitle: string;
  description: string;
}

interface HeroSectionProps {
  title: string;
  description: string;
  welcomeText: string;
  featureBlocks: FeatureBlock[];
}

export default function HeroSection({
  title,
  description,
  welcomeText,
  featureBlocks,
}: HeroSectionProps) {
  const { theme } = useTheme(); // Get the current theme

  return (
    <div className="relative min-h-screen w-full overflow-hidden  text-foreground">
      {theme !== "light" ? (
        <div>
          <video
            className="absolute inset-0 size-full object-cover opacity-40 transition-all duration-500"
            src="/_static/video/ai-loop.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      ) : null}

      {/* Overlay for content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Hero Content */}
        <main className="flex flex-1 flex-col items-center justify-start px-4 text-center md:px-8 lg:px-12">
          <div className="mb-4 rounded-full border border-primary px-4 py-1 text-sm text-muted-foreground">
            {welcomeText} {/* Using the new welcomeText prop */}
          </div>
          <h1 className="mb-6 max-w-3xl font-serif text-4xl font-bold leading-tight md:text-6xl lg:text-7xl ">
            {title}
          </h1>
          <p className="mb-12 max-w-xl text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        </main>

        {/* Feature Blocks */}
        <section className="grid grid-cols-1 gap-8 px-4 pb-12 md:grid-cols-3 md:px-8 lg:px-12">
          {featureBlocks.map((block, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              <h3 className="text-2xl font-bold text-foreground line-clamp-1">
                {block.title}
              </h3>
              <p className="mb-4 text-xl text-muted-foreground ">
                {block.subtitle}
              </p>
              <div className="mb-4 h-px w-16 bg-primary" />{" "}
              {/* Changed to bg-border */}
              <p className="text-base text-muted-foreground">
                {block.description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
