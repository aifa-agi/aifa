// @/app/admin/pages/[slug]/page.tsx

import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminPagesNavBarProvider } from "./(_service)/(_context)/admin-pages-nav-context";
import { SectionProvider } from "./(_service)/(_context)/section-provider";
import AdminPagesNavBar from "./(_service)/(_components)/admin-page-nav-bar";
import { AdminPageContent } from "./(_service)/(_components)/admin-page-content";
import { AdminPageDynamicDescription } from "./(_service)/(_components)/admin-page-dynamic-description";
import { ADMIN_PAGES_CONFIG } from "./(_service)/(_config)/admin-pages-config";

interface AdminPageDetailsProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Server component that extracts slug from route parameters
 * and passes it to the client component for data processing
 */
export default async function AdminPageDetails({
  params,
}: AdminPageDetailsProps) {
  // Await params before accessing its properties (Next.js 15 requirement)
  const { slug } = await params;

  return (
    <AdminPagesNavBarProvider slug={slug}>
      <SectionProvider>
        <div className="p-6 w-full">
          <div className="bg-secondary rounded-lg shadow-sm border p-6">
            <div className="flex flex-row justify-between items-start gap-3">
              <div className="mb-6 pb-4 border-b">
                <h1 className="text-2xl font-bold mb-2">
                  {ADMIN_PAGES_CONFIG.pageTitle}
                </h1>
                <AdminPageDynamicDescription />
              </div>

              <AdminPagesNavBar />
            </div>

            <Suspense fallback={<LoadingSpinner />}>
              <AdminPageContent />
            </Suspense>
          </div>
        </div>
      </SectionProvider>
    </AdminPagesNavBarProvider>
  );
}

/**
 * Generate metadata for the page based on slug
 */
export async function generateMetadata({ params }: AdminPageDetailsProps) {
  // Also await params in generateMetadata
  const { slug } = await params;

  return {
    title: `Admin: ${slug}`,
    description: `Administrating page ${slug}`,
  };
}
