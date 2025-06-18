// @/app/@right/default.tsx

import { LanguageProvider } from "./(_service)/(_contexts)/language-context";
import RightDefault from "./(components)/right-default";
import RightNavBar from "./(components)/right-nav-bar";

export default function Default() {
  return (
    <>
      <div className="flex-1 ">
        <RightNavBar />
      </div>
      <LanguageProvider>
        <RightDefault />
      </LanguageProvider>
    </>
  );
}
