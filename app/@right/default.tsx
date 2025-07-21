// @/app/@right/default.tsx
//THIS IS ROOT PAGE, USING AS HOME PAGE, CAN NOT HAVE LAYOUT!

import { constructMetadata } from "@/lib/construct-metadata";
import { NavBar } from "./(_service)/(_components)/navbar";
import HomePage from "./(_service)/(_components)/home-page";
import { Footer } from "./(_service)/(_components)/footer";
import { PageHtmlTransformer } from "./(_service)/(_components)/page-transformer-components/page-html-transformer";
import { getHomePage } from "./(_service)/(_config)/pages-config";

const homePageConfig = getHomePage();

export const metadata = constructMetadata();

export default function Default() {
  // if (!homePageConfig) return <div>Home page not found</div>;
  return (
    <>
      <div className="flex flex-col h-svh pb-6">
        <NavBar scroll={true} />
        <main className="flex-1 overflow-y-auto hide-scrollbar ">
          <HomePage />
          {/* also you can add auto page generation */}
          {/* <PageHtmlTransformer data={homePageConfig} /> */}
          <Footer />
        </main>
      </div>
    </>
  );
}
