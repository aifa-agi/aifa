// @/app/@right/default.tsx

import { SiteFooter } from "./(_service)/(_components)/site-footer";
import RightDefault from "./(components)/right-default";

export default function Default() {
  return (
    <>
      <div className="flex flex-col h-screen pb-6">
        <main className="flex-1 overflow-y-auto hide-scrollbar px-4">
          <RightDefault />
          <SiteFooter />
        </main>
      </div>
    </>
  );
}
