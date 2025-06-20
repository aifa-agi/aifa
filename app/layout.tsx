// @/app/layout.tsx

import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import RightDrawerBar from "./@right/(components)/right-drawer-dar";
// Import the new provider component.
import { OnlineStatusProvider } from "@/components/shared/online-status-provider";
import { RightSidebarProvider } from "@/contexts/right-sidebar-context";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LanguageProvider } from "@/contexts/language-context";
export const metadata: Metadata = {
  metadataBase: new URL("https://aifa.dev"),
  title: "AI-First Architecture",
  description:
    "AI Agents in an Evolving and Self-Replicating Architecture for developing full-featured web applications, open source",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
const THEME_COLOR_SCRIPT = `
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

// RootLayout remains an async Server Component.
export default async function RootLayout({
  left,
  right,
}: Readonly<{
  left: React.ReactNode;
  right: React.ReactNode;
}>) {
  // We no longer call the hook here.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />

          <SessionProvider>
            {/* Wrap the entire application body with our new provider */}
            <OnlineStatusProvider>
              <LanguageProvider>
                <RightSidebarProvider>
                  <div className="hidden md:block h-screen w-screen">
                    <ResizablePanelGroup direction="horizontal">
                      <ResizablePanel defaultSize={40} minSize={35}>
                        <div className="overflow-hidden">{left}</div>
                      </ResizablePanel>
                      <ResizableHandle withHandle />
                      <ResizablePanel defaultSize={60} minSize={35}>
                        {right}
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </div>

                  <div className="w-full md:hidden relative">
                    {left}
                    <div className="border-l overflow-hidden border-secondary">
                      <RightDrawerBar>{right}</RightDrawerBar>
                    </div>
                  </div>
                </RightSidebarProvider>
              </LanguageProvider>
            </OnlineStatusProvider>
            {process.env.NODE_ENV === "production" && (
              <GoogleAnalytics
                gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!}
              />
            )}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
