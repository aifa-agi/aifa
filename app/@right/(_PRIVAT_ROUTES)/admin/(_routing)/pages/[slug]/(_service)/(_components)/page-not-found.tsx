// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/page-not-found.tsx
import React from "react";
import { AlertCircle } from "lucide-react";

export interface PageNotFoundProps {
  slug: string;
}

export const PageNotFound: React.FC<PageNotFoundProps> = ({ slug }) => {
  return (
    <div className="flex bg-background items-center justify-center py-12">
      <div className="text-center">
        <AlertCircle className="mx-auto size-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Page Not Found
        </h3>
        <p className="text-muted-foreground mb-4">
          The page with slug{" "}
          <code className="bg-muted px-2 py-1 rounded text-foreground">
            {slug}
          </code>{" "}
          does not exist
        </p>
        <p className="text-sm text-muted-foreground">
          Please check the URL or select an existing page from the menu
        </p>
      </div>
    </div>
  );
};
