// @/app/@right/default.tsx
//THIS IS ROOT PAGE, USING AS HOME PAGE, CAN NOT HAVE LAYOUT!
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/construct-metadata";
import HomePage from "./(_service)/(_components)/home-page/home-page";
import { Footer } from "./(_service)/(_components)/footer";
import { NavBar } from "./(_service)/(_components)/nav-bar/nav-bar";
import { NavigationMenuProvider } from "./(_service)/(_context)/nav-bar-provider";

export const metadata: Metadata = constructMetadata();

export default function Default() {
  return (
    <>
      <NavigationMenuProvider>
        <div className=" flex flex-col h-svh pb-6">
          <NavBar />
          <main className="flex-1 overflow-y-auto hide-scrollbar ">
            <HomePage />
            <Footer />
          </main>
        </div>
      </NavigationMenuProvider>
    </>
  );
}
