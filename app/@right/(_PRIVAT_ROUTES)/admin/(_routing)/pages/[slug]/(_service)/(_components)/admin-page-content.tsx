// @/app/admin/pages/[slug]/(_service)/(_components)/admin-page-content.tsx

"use client";

import { useAdminPagesNav } from "../(_context)/admin-pages-nav-context";
import { AdminPageInfo } from "./admin-pages/admin-page-info";
import { AdminPageStructure } from "./admin-pages/admin-page-structure";

export function AdminPageContent() {
  const { activeTab, slug } = useAdminPagesNav();

  switch (activeTab) {
    case "info":
      return <AdminPageInfo slug={slug} />;
    case "structure":
      return <AdminPageStructure slug={slug} />;
    // case "data":
    //   return <AdminPageData slug={slug} />;
    // case "n8n":
    //   return <AdminPageN8N slug={slug} />;
    // case "sections":
    //   return <AdminPageSections slug={slug} />;
    // case "preview":
    //   return <AdminPagePreview slug={slug} />;
    default:
      return <AdminPageInfo slug={slug} />;
  }
}
