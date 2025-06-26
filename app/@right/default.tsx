// @/app/@right/default.tsx

import { NavBar } from "./(_service)/(_components)/navbar";
import { Footer } from "./(_service)/(_components)/footer";
import RightDefault from "./(components)/right-default";

export default function Default() {
  return (
    <>
      <div className="flex flex-col h-screen pb-6">
        <NavBar scroll={true} />
        <main className="flex-1 overflow-y-auto hide-scrollbar px-4">
          <RightDefault />
          <Footer />
        </main>
      </div>
    </>
  );
}
