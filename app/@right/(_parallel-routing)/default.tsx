// @/app/@right/default.tsx
//THIS IS ROOT PAGE, USING AS HOME PAGE, CAN NOT HAVE LAYOUT!

import { NavBar } from "./(_service)/(_components)/navbar";
import { Footer } from "./(_service)/(_components)/footer";
import HomePage from "./(components)/home-page";
import { constructMetadata } from "@/lib/construct-metadata";

export const metadata = constructMetadata();

export default function Default() {
  return (
    <>
      <div className="flex flex-col h-svh pb-6">
        <NavBar scroll={true} />
        <main className="flex-1 overflow-y-auto hide-scrollbar px-4">
          <HomePage />
          <Footer />
        </main>
      </div>
    </>
  );
}
