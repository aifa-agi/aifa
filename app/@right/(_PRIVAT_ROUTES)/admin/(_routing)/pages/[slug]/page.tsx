// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/index.tsx
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminPagesNavBarProvider } from "./(_service)/(_context)/admin-pages-nav-context";
import AdminPagesNavBar from "./(_service)/(_components)/admin-page-nav-bar";
import { AdminPageContent } from "./(_service)/(_components)/admin-page-content";
import { AdminPageDynamicHeader } from "./(_service)/(_components)/admin-page-dynamic-header";
import { SectionProvider } from "./(_service)/(_context)/section-provider";

interface AdminPageDetailsProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Server component that extracts slug from route parameters
 * Uses existing NavigationMenuProvider (available at app level) for data
 * No need for additional data providers as NavigationMenuProvider already handles menu categories
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
              <AdminPageDynamicHeader />
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
