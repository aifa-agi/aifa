// @/app/@right/default.tsx

import RightDefault from "./(components)/right-default";
import RightNavBar from "./(components)/right-nav-bar";

export default function Default() {
  return (
    <>
      <div className="flex-1 ">
        <RightNavBar />
      </div>
      <RightDefault />
    </>
  );
}
