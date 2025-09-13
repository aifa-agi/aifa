// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_hooks)/use-launch-eligibility.ts
import { useMemo } from "react";
import { useStep7Root } from "../(_contexts)/step7-root-context";

/**
 * Expose launch eligibility from context (derived).
 */
export function useLaunchEligibility() {
  const { ui } = useStep7Root();
  const isEligible = useMemo(() => ui.isLaunchEligible, [ui.isLaunchEligible]);
  return { isEligible };
}
