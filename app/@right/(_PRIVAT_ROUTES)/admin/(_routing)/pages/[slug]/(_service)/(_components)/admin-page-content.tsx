// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-page-content.tsx

"use client";

import { useAdminPagesNav } from "../(_context)/admin-pages-nav-context";
import { AdminPageInfo } from "./admin-pages/admin-page-info/(_service)/(_components)/admin-page-info";
import { CompetitorResearch } from "./admin-pages/steps/competitor-research/(_service)/(_components)/competitor-research";

import { AdminPageStep10 } from "./admin-pages/steps/step10/step10";
import { AdminPageStep11 } from "./admin-pages/steps/step11/step11";
import { AdminPageStep2 } from "./admin-pages/steps/step2/step2";
import { AdminPageStep3 } from "./admin-pages/steps/step3/step3";
import { AdminPageStep4 } from "./admin-pages/steps/step4/step4";
import { AdminPageStep5 } from "./admin-pages/steps/step5/step5";
import { AdminPageStep6 } from "./admin-pages/steps/step6/step6";
import { AdminPageStep7 } from "./admin-pages/steps/step7/step7";
import { AdminPageStep8 } from "./admin-pages/steps/step8/step8";
import { AdminPageStep9 } from "./admin-pages/steps/step9/step9";
import { AdminPageStep13 } from "./admin-pages/steps/step13";
import AdminPageStep12 from "./admin-pages/steps/step12";

export function AdminPageContent() {
  const { activeTab, slug } = useAdminPagesNav();

  switch (activeTab) {
    case "info":
      return <AdminPageInfo slug={slug} />;
    case "step1":
      return <CompetitorResearch slug={slug} />;
    case "step2":
      return <AdminPageStep2 slug={slug} />;
    case "step3":
      return <AdminPageStep3 slug={slug} />;
    case "step4":
      return <AdminPageStep4 slug={slug} />;
    case "step5":
      return <AdminPageStep5 slug={slug} />;
    case "step6":
      return <AdminPageStep6 slug={slug} />;
    case "step7":
      return <AdminPageStep7 slug={slug} />;
    case "step8":
      return <AdminPageStep8 slug={slug} />;
    case "step9":
      return <AdminPageStep9 slug={slug} />;
    case "step10":
      return <AdminPageStep10 slug={slug} />;
    case "step11":
      return <AdminPageStep11 slug={slug} />;
    case "preview":
      return <AdminPageStep12 slug={slug} />;
    case "deploy":
      return <AdminPageStep13 slug={slug} />;
    default:
      return <AdminPageInfo slug={slug} />;
  }
}
