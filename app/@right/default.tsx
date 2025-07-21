// @/app/@right/default.tsx
//THIS IS ROOT PAGE, USING AS HOME PAGE, CAN NOT HAVE LAYOUT!
import { NavBar } from "./(_service)/(_components)/navbar";
import HomePage from "./(_service)/(_components)/home-page";
import { Footer } from "./(_service)/(_components)/footer";

export default function Default() {
  return (
    <>
      <div className="flex flex-col h-svh pb-6">
        <NavBar scroll={true} />
        <main className="flex-1 overflow-y-auto hide-scrollbar ">
          <HomePage />
          <Footer />
        </main>
      </div>
    </>
  );
}
