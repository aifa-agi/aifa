// @/app/@right/private/loading.tsx

import { __ } from "../../../lib/translation";

export default function LeftLoading() {
  return (
    <div className="p-4 flex justify-center items-center h-full">
      <span className="text-gray-500">{__("Loading...")}</span>
    </div>
  );
}
