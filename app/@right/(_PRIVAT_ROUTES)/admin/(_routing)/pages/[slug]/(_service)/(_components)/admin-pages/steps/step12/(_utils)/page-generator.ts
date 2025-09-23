// Page generation service for creating Next.js page.tsx files
// Critical template generator - preserve exact formatting and structure

import type { PageUploadPayload, ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";
import { generateMetadataFromSection } from "@/app/@right/(_service)/(_components)/content-renderer/utils";

/**
 * Generates complete page.tsx content with embedded sections data and metadata
 * Production-critical function - preserve exact template structure and formatting
 * 
 * @param firstPartHref - First part of the URL path (category)
 * @param secondPartHref - Second part of the URL path (subcategory)
 * @param payload - Complete page data including pageMetadata and sections
 * @returns string - Complete TypeScript/React page component code
 */
/**
 * Generates complete page.tsx content with embedded sections data and metadata
 * Production-critical function - preserve exact template structure and formatting
 * 
 * @param firstPartHref - First part of the URL path (category)
 * @param secondPartHref - Second part of the URL path (subcategory)
 * @param payload - Complete page data including pageMetadata and sections
 * @returns string - Complete TypeScript/React page component code
 */
export function generatePageTsxContent(
  firstPartHref: string,
  secondPartHref: string,
  payload: PageUploadPayload
): string {
  const { pageMetadata, sections } = payload;
  
  // Use metadata from payload or fallback from first section
  const finalMetadata = {
    title: pageMetadata.title || "Страница без заголовка",
    description: pageMetadata.description || "Описание отсутствует", 
    keywords: pageMetadata.keywords || [],
    images: pageMetadata.images || []
  };

  // Properly escape strings for template literals (not JSX)
  const escapedTitle = finalMetadata.title.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  const escapedDescription = finalMetadata.description.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  
  // Create JSON string for sections with proper formatting
  const sectionsJson = JSON.stringify(sections, null, 2);
  
  // Prepare hero image data
  const heroImageData = finalMetadata.images.length > 0 ? {
    href: finalMetadata.images[0].href,
    alt: finalMetadata.images[0].alt || ""
  } : null;

  // Generate the page content using template literal
  return `// Auto-generated page - do not edit manually
// Generated on: ${new Date().toISOString()}
// Source href: /${firstPartHref}/${secondPartHref}
// Page metadata: ${pageMetadata.title || 'No title'} | ${sections.length} sections

import { Metadata } from "next";
import ContentRenderer from "@/app/@right/(_service)/(_components)/content-renderer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Встроенные данные секций
const sections = ${sectionsJson};

// Данные героического изображения
const heroImage = ${heroImageData ? JSON.stringify(heroImageData, null, 2) : 'null'};

// ИСПРАВЛЕННАЯ генерация метаданных для SEO из pageMetadata
export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.SITE_URL || 'https://example.com';
  
  // КРИТИЧЕСКИ ВАЖНО: правильная сборка canonical URL
  const canonicalUrl = \`\${siteUrl}/${firstPartHref}/${secondPartHref}\`;
  
  return {
    title: "${escapedTitle}",
    description: "${escapedDescription}",
    keywords: ${JSON.stringify(finalMetadata.keywords)},
    
    // ИСПРАВЛЕНИЕ: добавляем metadataBase для правильных URL
    metadataBase: new URL(siteUrl),
    
    // Open Graph метатеги
    openGraph: {
      title: "${escapedTitle}",
      description: "${escapedDescription}",
      type: "article",
      url: canonicalUrl,${finalMetadata.images.length > 0 ? `
      images: [
        {
          url: "${finalMetadata.images[0].href}",
          alt: "${finalMetadata.images[0].alt?.replace(/`/g, '\\`').replace(/\$/g, '\\$') || ''}",
        }
      ],` : ''}
    },
    
    // Twitter метатеги
    twitter: {
      card: "summary_large_image",
      title: "${escapedTitle}",
      description: "${escapedDescription}",${finalMetadata.images.length > 0 ? `
      images: ["${finalMetadata.images[0].href}"],` : ''}
    },
    
    // ИСПРАВЛЕНИЕ: правильный canonical URL - главное изменение
    alternates: {
      canonical: canonicalUrl,
    },
    
    
    
    // Автор и издатель
    authors: [{ name: process.env.SITE_AUTHOR || "Site Author" }],
  };
}

// Основной компонент страницы
export default function Page() {
  return (
    <article className="page-content">
      {/* Заголовок страницы */}
      <div className="container max-w-screen-2xl pt-6 px-4 md:pt-10">
        <div className="flex flex-col space-y-4">
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
            ${escapedTitle}
          </h1>
        
          {/* Описание страницы */}
          <p className="text-base text-muted-foreground md:text-lg">
            ${escapedDescription}
          </p>

          <div className="flex items-center space-x-4">
            <Badge className="shadow-none rounded-md px-2.5 py-0.5 text-xs font-semibold h-6 flex items-center">
              Blog
            </Badge>
          </div>
        </div>
      </div>

      {/* Контент секций с героическим изображением */}
      <div className="relative">
        <div className="absolute top-52 w-full border-t" />
        <ContentRenderer sections={sections} heroImage={heroImage} />
      </div>
    </article>
  );
}`;
}

